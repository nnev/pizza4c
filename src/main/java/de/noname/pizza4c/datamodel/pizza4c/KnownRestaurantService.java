package de.noname.pizza4c.datamodel.pizza4c;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.noname.pizza4c.datamodel.lieferando2025.*;
import de.noname.pizza4c.webpage.RestaurantService;
import io.netty.handler.logging.LogLevel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.ExchangeFilterFunction;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.netty.http.HttpProtocol;
import reactor.netty.http.client.HttpClient;
import reactor.netty.transport.logging.AdvancedByteBufFormat;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class KnownRestaurantService {
    private static final Logger LOG = LoggerFactory.getLogger(KnownRestaurantService.class);
    public static final String BEGIN_OF_JSON_BLOB_MARKER = "<script id=\"__NEXT_DATA__\" type=\"application/json\">";
    public static final String END_OF_JSON_BLOB_MARKER = "</script>";

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
        restaurant.getMenu().getMenuItems().forEach((s, menuItem) -> {
            StringBuilder sb = new StringBuilder();
            sb.append(menuItem.getName());
            sb.append(menuItem.getDescription());

            menuItem.getVariations().forEach((s1, variation) -> {
                sb.append(variation.getName());
                variation.getModifierGroups().forEach((s2, modifierGroup) -> {
                    sb.append(modifierGroup.getName());
                    modifierGroup.getModifiers().forEach((s3, modifier) -> {
                        sb.append(modifier.getName());
                    });
                });
            });

            menuItem.setVegetarian(isVegetarian(s));
            menuItem.setVegan(isVegan(s));
        });
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
        restaurant.getMenu().getMenuItems().forEach((s, menuItem) -> {
            menuItem.getVariations().forEach((s1, variation) -> {
                if (variation.getName().startsWith("mit ")) {
                    variation.setName(variation.getName().substring(4));
                }

                if (variation.getName().endsWith(",")) {
                    variation.setName(variation.getName().substring(0, variation.getName().length() - 1));
                }
            });
        });
    }

    ExchangeFilterFunction logRequest() {
        return ExchangeFilterFunction.ofRequestProcessor(clientRequest -> {
            StringBuilder sb = new StringBuilder("Request: \n");
            //append clientRequest method and url
            clientRequest
                    .headers()
                    .forEach((name, values) -> values.forEach(value -> sb.append(name).append("=").append(value).append("\r\n")));
            LOG.info(sb.toString());
            return Mono.just(clientRequest);
        });
    }

    ExchangeFilterFunction logResponse() {
        return ExchangeFilterFunction.ofResponseProcessor(clientResponse -> {
            StringBuilder sb = new StringBuilder("Request: \n");
            //append clientResponse method and url
            clientResponse
                    .headers()
                    .asHttpHeaders()
                    .forEach((name, values) -> values.forEach(value -> sb.append(name).append("=").append(value).append("\r\n")));
            LOG.info(sb.toString());
            return Mono.just(clientResponse);
        });
    }

    private Restaurant loadRestaurantData(String restaurantName) {
        var httpClient = HttpClient.create()
                .protocol(HttpProtocol.H2)
                .compress(true)
                .wiretap("reactor.client.ProductWebClient", LogLevel.DEBUG, AdvancedByteBufFormat.TEXTUAL); // 2

        var client = WebClient.builder()
                .baseUrl("http://product-service:8080/")
                .clientConnector(
                        new ReactorClientHttpConnector(httpClient) // 3
                )
                .codecs(configurer -> configurer.defaultCodecs()
                        .maxInMemorySize(16 * 1024 * 1024)
                )
                .filters(exchangeFilterFunctions -> {
                    exchangeFilterFunctions.add(logRequest());
                    exchangeFilterFunctions.add(logResponse());
                })
                .build();

        Mono<String> homepage = client
                .get()
                .uri("https://www.lieferando.de/speisekarte/" + restaurantName + "?pemid=mini")
                .header("User-Agent", "Mozilla/5.0 (X11; Linux x86_64; rv:138.0) Gecko/20100101 Firefox/138.0")
                .header("Accept-Encoding", "deflate, gzip, br, zstd")
                .header("Accept", "*/*")
                .retrieve()
                .bodyToMono(String.class);
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

        return parseRestaurantData(homepage.block(), restaurantItem.block(), restaurantItemDetails.block());
    }


    private Restaurant parseRestaurantData(String homepage, String restaurantItem, String restaurantItemDetails) {
        Restaurant restaurant = new Restaurant();

        try {
            int beginOfJsonBlob = homepage.indexOf(BEGIN_OF_JSON_BLOB_MARKER);
            if (beginOfJsonBlob == -1) {
                LOG.error("Failed to find begin of embedded JSON BLOB");
                return null;
            }
            int endOfJsonBlob = homepage.indexOf(END_OF_JSON_BLOB_MARKER, beginOfJsonBlob);
            if (endOfJsonBlob == -1) {
                LOG.error("Failed to find end of embedded JSON BLOB");
                return null;
            }

            String embeddedJsonBlob = homepage.substring(beginOfJsonBlob + BEGIN_OF_JSON_BLOB_MARKER.length(), endOfJsonBlob);

            ObjectMapper mapper = new ObjectMapper();
            Menu menu = new Menu();
            menu.setMenuItems(new HashMap<>());
            menu.setCategories(new HashMap<>());

            JsonNode embeddedJsonBlobNode = mapper.readTree(embeddedJsonBlob);
            JsonNode categoryNode = embeddedJsonBlobNode.get("props").get("appProps").get("preloadedState").get("menu").get("restaurant").get("cdn").get("restaurant").get("menus").get(0).get("categories");
            for (JsonNode categoryEntryNode : categoryNode) {
                String name = categoryEntryNode.get("name").textValue();
                List<String> itemIds = new ArrayList<>();
                for (JsonNode itemId : categoryEntryNode.get("itemIds")) {
                    itemIds.add(itemId.textValue());
                }

                menu.getCategories().computeIfAbsent(name, ignored -> new ArrayList<>()).addAll(itemIds);
            }

            JsonNode itemJsonNode = mapper.readTree(restaurantItem);
            JsonNode itemDetailsJsonNode = mapper.readTree(restaurantItemDetails);

            Map<String, Modifier> modifiers = new HashMap<>();
            Map<String, ModifierGroup> modifierGroups = new HashMap<>();

            for (JsonNode modifierSets : itemDetailsJsonNode.get("ModifierSets")) {
                String _id = modifierSets.get("Id").asText();

                Modifier modifier = new Modifier();
                modifiers.put(_id, modifier);

                modifier.setName(modifierSets.get("Modifier").get("Name").asText());
                modifier.setPriceCents(modifierSets.get("Modifier").get("AdditionPrice").decimalValue().scaleByPowerOfTen(2).intValue());
                modifier.setMinAmount(modifierSets.get("Modifier").get("MinChoices").intValue());
                modifier.setMaxAmount(modifierSets.get("Modifier").get("MaxChoices").intValue());
                modifier.setDefaultChoices(modifierSets.get("Modifier").get("DefaultChoices").intValue());
            }

            for (JsonNode modifierGroup : itemDetailsJsonNode.get("ModifierGroups")) {
                ModifierGroup group = new ModifierGroup();
                String id = modifierGroup.get("Id").asText();
                group.setName(modifierGroup.get("Name").asText());
                group.setMinAmount(modifierGroup.get("MinChoices").intValue());
                group.setMaxAmount(modifierGroup.get("MaxChoices").intValue());
                group.setModifiers(new HashMap<>());
                for (JsonNode jsonNode : modifierGroup.get("Modifiers")) {
                    group.getModifiers().put(jsonNode.asText(), modifiers.get(jsonNode.asText()));
                }

                modifierGroups.put(id, group);
            }


            for (JsonNode itemNode : itemJsonNode.get("Items")) {
                MenuItem menuItem = new MenuItem();
                String id = itemNode.get("Id").asText();
                menu.getMenuItems().put(id, menuItem);

                menuItem.setName(itemNode.get("Name").asText());
                menuItem.setDescription(itemNode.get("Description").asText());
                menuItem.setVariations(new HashMap<>());

                for (JsonNode variationNode : itemNode.get("Variations")) {
                    Variation variation = new Variation();
                    String id1 = variationNode.get("Id").asText();
                    menuItem.getVariations().put(id1, variation);

                    variation.setName(variationNode.get("Name").asText());
                    variation.setPriceCents(variationNode.get("BasePrice").decimalValue().scaleByPowerOfTen(2).intValue());
                    variation.setModifierGroups(new HashMap<>());

                    for (JsonNode modifierGroupsIdsNode : variationNode.get("ModifierGroupsIds")) {
                        String id2 = modifierGroupsIdsNode.asText();
                        variation.getModifierGroups().put(id2, modifierGroups.get(id2));
                    }
                }
            }
            restaurant.setMenu(menu);
        } catch (IOException e) {
            LOG.error("Failed to parse restaurant data", e);
        }

        return restaurant;
    }

    private Restaurant loadRestaurantDataFromDisk(String restaurantName) {
        try {
            String homepage = new String(RestaurantService.class.getResourceAsStream("/static/" + restaurantName + "-homepage.html").readAllBytes());
            String items = new String(RestaurantService.class.getResourceAsStream("/static/" + restaurantName + "-items.json").readAllBytes());
            String itemDetails = new String(RestaurantService.class.getResourceAsStream("/static/" + restaurantName + "-itemDetails.json").readAllBytes());

            return parseRestaurantData(homepage, items, itemDetails);
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
