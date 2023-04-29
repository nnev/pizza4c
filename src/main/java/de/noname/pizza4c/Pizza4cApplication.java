package de.noname.pizza4c;

import de.noname.pizza4c.datamodel.pizza4c.KnownRestaurantRepository;
import de.noname.pizza4c.webpage.RestaurantService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

@SpringBootApplication
public class Pizza4cApplication {
    public static final Logger LOG = LoggerFactory.getLogger(Pizza4cApplication.class);

    @Autowired
    private RestaurantService restaurantService;
    @Autowired
    private KnownRestaurantRepository knownRestaurantRepository;

    @EventListener(ApplicationReadyEvent.class)
    public void initializeRestaurantDataOnFirstStart() {
        if (knownRestaurantRepository.count() == 0) {
            restaurantService.forceRefreshRestaurantData();
        }
    }

    public static void main(String[] args) {
        SpringApplication.run(Pizza4cApplication.class, args);
    }

}
