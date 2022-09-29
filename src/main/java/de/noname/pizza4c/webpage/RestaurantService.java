package de.noname.pizza4c.webpage;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.noname.pizza4c.datamodel.lieferando.ProductInfo;
import de.noname.pizza4c.datamodel.lieferando.Restaurant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;

@Service
public class RestaurantService {
    private static final Logger LOG = LoggerFactory.getLogger(RestaurantService.class);
    private Restaurant cachedRestaurant;

    private void retrieveData1(String restaurantName) {
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

        cachedRestaurant = restaurant;
    }

    private void retrieveData2(String restaurantName) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            cachedRestaurant =
                    mapper.readValue(RestaurantService.class.getResource("/static/testdata.json"), Restaurant.class);
        } catch (IOException e) {
            LOG.error("Failed to retrieve new restaurant data for {}", restaurantName, e);
        }
    }

    public Restaurant getCachedRestaurant(String restaurantName) {
        if (cachedRestaurant == null) {
            retrieveData2(restaurantName);
        }
        return cachedRestaurant;
    }
}
