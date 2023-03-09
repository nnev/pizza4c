package de.noname.pizza4c.webpage;

import de.noname.pizza4c.datamodel.lieferando.Restaurant;
import de.noname.pizza4c.datamodel.pizza4c.AllCartService;
import de.noname.pizza4c.datamodel.pizza4c.KnownRestaurant;
import de.noname.pizza4c.datamodel.pizza4c.KnownRestaurantRepository;
import de.noname.pizza4c.datamodel.pizza4c.KnownRestaurantService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    public Restaurant getSelectedRestaurant() {
        var allCarts = allCartService.getCurrentAllCarts();
        return knownRestaurantService.getByRestaurantSlug(allCarts.getSelectedRestaurant());
    }

    public void forceRefreshRestaurantData() {
        var allCarts = allCartService.getCurrentAllCarts();
        knownRestaurantService.refreshRestaurantData(allCarts.getSelectedRestaurant());
    }

    public List<KnownRestaurant> listAllKnownRestaurants() {
        return knownRestaurantRepository.findAll();
    }
}
