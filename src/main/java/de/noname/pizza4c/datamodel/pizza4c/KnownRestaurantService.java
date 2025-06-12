package de.noname.pizza4c.datamodel.pizza4c;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.noname.pizza4c.datamodel.lieferando.Category;
import de.noname.pizza4c.datamodel.lieferando.Option;
import de.noname.pizza4c.datamodel.lieferando.Product;
import de.noname.pizza4c.datamodel.lieferando.Restaurant;
import de.noname.pizza4c.datamodel.lieferando2025.*;
import de.noname.pizza4c.webpage.RestaurantService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class KnownRestaurantService {
    private static final Logger LOG = LoggerFactory.getLogger(KnownRestaurantService.class);

    @Autowired
    private KnownRestaurantRepository knownRestaurantRepository;

    @Value("${pizza4c.staticRestaurantData:true}")
    private boolean staticRestaurantData;

    public Restaurant getByRestaurantSlug(String restaurantSlug) {
        var knownRestaurant = knownRestaurantRepository.getByLieferandoName(restaurantSlug);
        if (knownRestaurant == null) {
            return null;
        }

        var restaurant = loadRestaurantFromData(knownRestaurant.getLieferandoData());
        if (restaurant == null) {
            return null;
        }
        restaurant.setRestaurantSlug(restaurantSlug);
        return restaurant;
    }

    @Transactional
    public boolean refreshRestaurantData(String restaurantSlug) {
        var knownRestaurant = knownRestaurantRepository.getByLieferandoName(restaurantSlug);
        if (knownRestaurant == null) {
            return false;
        }

        Restaurant restaurant;
        if (staticRestaurantData) {
            restaurant = loadRestaurantDataFromDisk(restaurantSlug);
        } else {
            restaurant = loadRestaurantData(restaurantSlug);
        }

        if (restaurant == null) {
            return false;
        }

        cleanupOptionNames(restaurant);
        vegetarianHeuristic(restaurant);
        restaurant.setRestaurantSlug(restaurantSlug);
        knownRestaurant.setLieferandoData(serializeRestaurantFromData(restaurant));
        knownRestaurantRepository.saveAndFlush(knownRestaurant);
        return true;
    }

    private void vegetarianHeuristic(Restaurant restaurant) {
        for (Category category : restaurant.getMenu().getCategories()) {
            String informationText = category.getName() + category.getDescription().stream().reduce(String::concat).orElse("");

            category.setVegetarian(isVegetarian(informationText));
            category.setVegan(isVegan(informationText));
        }

        for (Product product : restaurant.getMenu().getProducts().values()) {
            String informationText = product.getName() + product.getDescription().stream().reduce(String::concat).orElse("");

            product.setVegetarian(isVegetarian(informationText));
            product.setVegan(isVegan(informationText));
        }

        for (Option option : restaurant.getMenu().getOptions().values()) {
            option.setVegetarian(isVegetarian(option.getName()));
            option.setVegan(isVegan(option.getName()));
        }
    }

    private static final List<String> NOT_VEGETARIAN_NAMES = List.of(
            "Fleisch",
            "Schinken",
            "Hähnchen",
            "Chicken",
            "Schnitzel",
            "Salami",
            "Fisch",
            "Sardellen",
            "Sardella",
            "Sucuk",
            "Meeresfr",
            "Bolognese",
            "Nugget",
            "Puten",
            "Bacon",
            "Rind",
            "Maare",
            "Salmon",
            "Tonno",
            "Hamburger",
            "krabbe",
            "ente",
            "Ente",
            "Hühner",
            "Hummer"
    );
    private static final List<String> NOT_VEGAN_NAMES = List.of(
            "Käse",
            " Ei ",
            " Ei,",
            ", Ei ",
            "Eier",
            "Mozzarella",
            "Parmesan",
            "Gorgonzola",
            "Cheddar",
            "Mayonnaise",
            "Sahne",
            "Sour Cream",
            "Cheese",
            "Feta",
            "Formaggi",
            "Fudge",
            "Joghurt",
            "Rahm",
            "mit Ei"
    );

    private boolean isVegetarian(String name) {
        if (name.isBlank()) {
            return true;
        }
        return NOT_VEGETARIAN_NAMES.stream().noneMatch(s -> name.toUpperCase().contains(s.toUpperCase()));
    }

    private boolean isVegan(String name) {
        if (name.isBlank()) {
            return true;
        }

        return isVegetarian(name) && NOT_VEGAN_NAMES.stream().noneMatch(s -> name.toUpperCase().contains(s.toUpperCase()));
    }

    private void cleanupOptionNames(Restaurant restaurant) {
        restaurant.getMenu().getOptions().forEach((optionId, option) -> {
            if (option.getName().startsWith("mit ")) {
                option.setName(option.getName().substring(4));
            }

            if (option.getName().endsWith(",")) {
                option.setName(option.getName().substring(0, option.getName().length() - 1));
            }
        });
    }

    private Restaurant loadRestaurantData(String restaurantName) {
        WebClient client = WebClient.builder()
                .codecs(configurer -> configurer.defaultCodecs()
                        .maxInMemorySize(16 * 1024 * 1024)
                ).build();

        Mono<String> restaurantItem = client
                .get()
                .uri("https://globalmenucdn.eu-central-1.production.jet-external.com/" + restaurantName + "_de_items.json")
                .retrieve()
                .bodyToMono(String.class);
        Mono<String> restaurantItemDetails = client
                .get()
                .uri("https://globalmenucdn.eu-central-1.production.jet-external.com/" + restaurantName + "_de_itemDetails.json")
                .retrieve()
                .bodyToMono(String.class);

        return parseRestaurantData(restaurantItem.block(), restaurantItemDetails.block());
    }


    private Restaurant parseRestaurantData(String restaurantItem, String restaurantItemDetails) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode itemJsonNode = mapper.readTree(restaurantItem);
            JsonNode itemDetailsJsonNode = mapper.readTree(restaurantItemDetails);

            Map<String, Modifier> modifiers = new HashMap<>();
            Map<String, ModifierGroup> modifierGroups = new HashMap<>();

            for (JsonNode modifierSets : itemDetailsJsonNode.get("ModifierSets")) {
                String _id = modifierSets.get("Id").asText();

                Modifier modifier = new Modifier();
                modifier.setId(modifierSets.get("Modifier").get("Id").asText());
                modifier.setName(modifierSets.get("Modifier").get("Name").asText());
                modifier.setPrice(modifierSets.get("Modifier").get("AdditionPrice").decimalValue().scaleByPowerOfTen(2).intValue());
                modifier.setMinAmount(modifierSets.get("Modifier").get("MinChoices").intValue());
                modifier.setMaxAmount(modifierSets.get("Modifier").get("MaxChoices").intValue());
                modifier.setDefaultChoices(modifierSets.get("Modifier").get("DefaultChoices").intValue());

                modifiers.put(_id, modifier);
            }

            for (JsonNode modifierGroup : itemDetailsJsonNode.get("ModifierGroups")) {
                ModifierGroup group = new ModifierGroup();
                group.setId(modifierGroup.get("Id").asText());
                group.setName(modifierGroup.get("Name").asText());
                group.setMinAmount(modifierGroup.get("MinChoices").intValue());
                group.setMaxAmount(modifierGroup.get("MaxChoices").intValue());
                group.setModifiers(new ArrayList<>());
                for (JsonNode jsonNode : modifierGroup.get("Modifiers")) {
                    group.getModifiers().add(modifiers.get(jsonNode.asText()));
                }

                modifierGroups.put(group.getId(), group);
            }


            Menu menu = new Menu();

            for (JsonNode itemNode : itemJsonNode.get("Items")) {
                MenuItem menuItem = new MenuItem();
                menu.add(menuItem);

                menuItem.setId(itemNode.get("Id").asText());
                menuItem.setName(itemNode.get("Name").asText());
                menuItem.setDescription(itemNode.get("Description").asText());
                menuItem.setVariations(new ArrayList<>());

                for (JsonNode variationNode : itemNode.get("Variations")) {
                    Variation variation = new Variation();
                    variation.setId(variationNode.get("Id").asText());
                    variation.setName(variationNode.get("Name").asText());
                    variation.setPrice(variationNode.get("BasePrice").decimalValue().scaleByPowerOfTen(2).intValue());
                    variation.setModifierGroups(new ArrayList<>());

                    for (JsonNode modifierGroupsIdsNode : variationNode.get("ModifierGroupsIds")) {
                        variation.getModifierGroups().add(modifierGroups.get(modifierGroupsIdsNode.asText()));
                    }
                }
            }
        } catch (IOException e) {
            LOG.error("Failed to parse restaurant data", e);
        }
        return null;
    }

    private Restaurant loadRestaurantDataFromDisk(String restaurantName) {
        try {
            ObjectMapper mapper = new ObjectMapper();

            String fileName = "/static/" + restaurantName + ".json";
            URL resource = RestaurantService.class.getResource(fileName);
            if (resource == null) {
                LOG.error("Failed to retrieve static restaurant data for {}. No such file", restaurantName);
                return null;
            }

            return mapper.readValue(resource, Restaurant.class);
        } catch (IOException e) {
            LOG.error("Failed to retrieve new restaurant data for {}", restaurantName, e);
        }
        return null;
    }

    private Restaurant loadRestaurantFromData(String data) {
        if (data == null) {
            return null;
        }
        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(data, Restaurant.class);
        } catch (IOException e) {
            LOG.error("Failed to load restaurant data", e);
        }
        return null;
    }

    private String serializeRestaurantFromData(Restaurant restaurant) {
        if (restaurant == null) {
            return null;
        }
        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.writeValueAsString(restaurant);
        } catch (IOException e) {
            LOG.error("Failed to load restaurant data", e);
        }
        return null;
    }

}
