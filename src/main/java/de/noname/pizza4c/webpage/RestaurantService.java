package de.noname.pizza4c.webpage;

import de.noname.pizza4c.datamodel.lieferando.Restaurant;
import de.noname.pizza4c.datamodel.pizza4c.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RestaurantService {

    private static final Logger LOG = LoggerFactory.getLogger(RestaurantService.class);
    @Autowired
    public AllCartService allCartService;

    @Autowired
    private KnownRestaurantService knownRestaurantService;

    @Autowired
    private KnownRestaurantRepository knownRestaurantRepository;

    @Transactional
    public Restaurant getSelectedRestaurant() {
        var allCarts = allCartService.getCurrentAllCarts();
        return knownRestaurantService.getByRestaurantSlug(allCarts.getSelectedRestaurant());
    }

    @Transactional
    public void forceRefreshRestaurantData() {
        var allCarts = allCartService.getCurrentAllCarts();
        forceRefreshRestaurantData(allCarts.getSelectedRestaurant());
    }

    @Transactional
    public void forceRefreshRestaurantData(String restaurantSlug) {
        knownRestaurantService.refreshRestaurantData(restaurantSlug);
    }

    public List<KnownRestaurant> listAllKnownRestaurants() {
        return knownRestaurantRepository.findAll();
    }

    @Transactional
    public void addRestaurant(String humanReadableName, String lieferandoName) {
        long maxId = listAllKnownRestaurants().stream().mapToLong(VersionedEntity::getId).max().orElse(1);
        var restaurant = new KnownRestaurant();
        restaurant.setId(maxId + 1);
        restaurant.setLieferandoName(lieferandoName);
        restaurant.setHumanReadableName(humanReadableName);
        knownRestaurantRepository.saveAndFlush(restaurant);
    }
}
