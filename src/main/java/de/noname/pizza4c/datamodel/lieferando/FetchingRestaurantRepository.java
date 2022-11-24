package de.noname.pizza4c.datamodel.lieferando;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.noname.pizza4c.webpage.RestaurantService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;

@Component
public class FetchingRestaurantRepository
        implements RestaurantRepository {

    @Value("${pizza4c.staticRestaurantData:true}")
    private boolean staticRestaurantData;

    private static final Logger LOG = LoggerFactory.getLogger(FetchingRestaurantRepository.class);

    @Override
    @Cacheable("restaurants")
    public Restaurant getByRestaurantId(String restaurantId) {
        Restaurant restaurant;
        if (staticRestaurantData) {
            restaurant = loadRestaurantDataFromDisk(restaurantId);
        } else {
            restaurant = loadRestaurantData(restaurantId);
        }
        if (restaurant != null) {
            cleanupOptionNames(restaurant);
        }
        return restaurant;
    }

    private void cleanupOptionNames(Restaurant restaurant) {
        restaurant.getMenu().getOptions().forEach((optionId, option) -> {
            if (option.getName().startsWith("mit ")) {
                option.setName(option.getName().substring(4));
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
                .uri("https://cw-api.takeaway.com/api/v32/restaurant?slug=" + restaurantName)
                .header("X-Country-Code", "de")
                .retrieve()
                .bodyToMono(Restaurant.class)
                .block();

        restaurant.getMenu().getProducts().forEach((productId, product) -> {
            ProductInfo productInfo = client.get()
                    .uri("https://cw-api.takeaway.com/api/v32/restaurant/product_info?restaurantId=" +
                            restaurant.getRestaurantId() + "&productId=" + productId)
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
            return mapper.readValue(RestaurantService.class.getResource("/static/testdata.json"), Restaurant.class);
        } catch (IOException e) {
            LOG.error("Failed to retrieve new restaurant data for {}", restaurantName, e);
        }
        return null;
    }
}
