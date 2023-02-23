package de.noname.pizza4c.webpage;

import de.noname.pizza4c.datamodel.lieferando.Restaurant;
import de.noname.pizza4c.datamodel.lieferando.RestaurantRepository;
import de.noname.pizza4c.datamodel.pizza4c.AllCartService;
import de.noname.pizza4c.datamodel.pizza4c.KnownRestaurant;
import de.noname.pizza4c.datamodel.pizza4c.KnownRestaurantRepository;
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
    private RestaurantRepository restaurantRepository;

    @Autowired
    private KnownRestaurantRepository knownRestaurantRepository;

    public Restaurant getSelectedRestaurant() {
        var allCarts = allCartService.getCurrentAllCarts();
        return restaurantRepository.getByRestaurantSlug(allCarts.getSelectedRestaurant());
    }

    public void forceRefreshRestaurantData(){
        restaurantRepository.evictAllCacheValues();
    }

    public List<KnownRestaurant> listAllKnownRestaurants(){
        return knownRestaurantRepository.findAll();
    }
}
