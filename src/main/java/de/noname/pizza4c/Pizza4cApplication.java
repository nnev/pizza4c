package de.noname.pizza4c;

import de.noname.pizza4c.webpage.RestaurantService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
public class Pizza4cApplication {
    public static final Logger LOG = LoggerFactory.getLogger(Pizza4cApplication.class);

    @Autowired
    private RestaurantService restaurantService;

    @EventListener(ApplicationReadyEvent.class)
    public void initializeRestaurantDataOnFirstStart() {
        if (restaurantService.getSelectedRestaurant() == null) {
            LOG.info("No restaurant data selected. Refreshing all data");
            restaurantService.forceRefreshRestaurantData();
        }
    }

    public static void main(String[] args) {
        SpringApplication.run(Pizza4cApplication.class, args);
    }

}
