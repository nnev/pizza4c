package de.noname.pizza4c.datamodel.pizza4c;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.noname.pizza4c.datamodel.lieferando.ProductInfo;
import de.noname.pizza4c.datamodel.lieferando.Restaurant;
import de.noname.pizza4c.webpage.RestaurantService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;
import java.net.URL;

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
        restaurant.setRestaurantSlug(restaurantSlug);
        knownRestaurant.setLieferandoData(serializeRestaurantFromData(restaurant));
        knownRestaurantRepository.save(knownRestaurant);
        return true;
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
        Restaurant restaurant = client
                .get()
                .uri("https://cw-api.takeaway.com/api/v33/restaurant?slug=" + restaurantName)
                .header("X-Country-Code", "de")
                .retrieve()
                .bodyToMono(Restaurant.class)
                .block();

        restaurant.getMenu().getProducts().forEach((productId, product) -> {
            ProductInfo productInfo = client.get()
                    .uri("https://cw-api.takeaway.com/api/v33/restaurant/addon_info?restaurantId=" +
                            restaurant.getRestaurantId() + "&addonId=" + productId)
                    .header("X-Country-Code", "de")
                    .retrieve()
                    .bodyToMono(ProductInfo.class)
                    .block();
            product.setProductInfo(productInfo);
        });

        return restaurant;
    }

    private Restaurant loadRestaurantDataFromDisk(String restaurantName) {
        try {
            ObjectMapper mapper = new ObjectMapper();

            String fileName = "/static/" + restaurantName + ".json";
            URL resource = RestaurantService.class.getResource(fileName);
            if (resource == null) {
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
