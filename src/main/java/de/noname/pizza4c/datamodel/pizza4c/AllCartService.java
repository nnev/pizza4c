package de.noname.pizza4c.datamodel.pizza4c;

import de.noname.pizza4c.datamodel.lieferando.RestaurantRepository;
import de.noname.pizza4c.utils.Name;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.UUID;

@Service
public class AllCartService {
    private final AllCartRepository allCartRepository;
    private final CartRepository cartRepository;

    private static final Logger LOG = LoggerFactory.getLogger(AllCartService.class);

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private KnownRestaurantRepository knownRestaurantRepository;

    @Value("${pizza4c.defaultRestaurant:pizza-rapido-eppelheim}") // Default to pizza rapido
    private String defaultRestaurantId;

    public AllCartService(AllCartRepository allCartRepository, CartRepository cartRepository) {
        this.allCartRepository = allCartRepository;
        this.cartRepository = cartRepository;
    }

    public AllCarts getCurrentAllCarts() {
        var allCarts = allCartRepository.findById(1L).orElseGet(this::createDefaultAllCarts);
        LOG.info("++++++"+allCarts);
        if (!knownRestaurantRepository.existsByLieferandoName(allCarts.getSelectedRestaurant())) {
            allCarts.setSelectedRestaurant(defaultRestaurantId);
            LOG.info("-----"+allCarts);
            allCarts = allCartRepository.save(allCarts);
        }

        return allCarts;
    }

    private AllCarts createDefaultAllCarts() {
        AllCarts allCarts = new AllCarts();
        allCarts.setId(1L);
        allCarts.setUuid(UUID.randomUUID().toString());
        allCarts.setSelectedRestaurant(defaultRestaurantId);
        LOG.info("########" + defaultRestaurantId);
        return allCartRepository.save(allCarts);
    }

    public Cart getOrCreateCartByName(Name name) {
        AllCarts allCarts = getCurrentAllCarts();

        var optionalCart = allCarts
                .getCarts()
                .stream()
                .filter(c -> c.getName().equals(name.getLongName()))
                .findFirst();


        if (optionalCart.isEmpty()) {
            var cart = new Cart();
            cart.setUuid(UUID.randomUUID().toString());
            cart.setName(name.getLongName());
            cart.setShortName(name.getShortName());
            cart = cartRepository.save(cart);
            allCarts.getCarts().add(cart);
            allCartRepository.save(allCarts);
            return cart;
        }
        return optionalCart.get();
    }

    public boolean selectRestaurant(String restaurantId) {
        String newRestaurantId;
        if (restaurantId == null) {
            newRestaurantId = defaultRestaurantId;
        } else {
            newRestaurantId = restaurantId;
        }

        AllCarts allCarts = getCurrentAllCarts();

        if (allCarts.getSelectedRestaurant().equals(newRestaurantId)) {
            return true;
        }

        var restaurant = restaurantRepository.getByRestaurantSlug(newRestaurantId);
        if (restaurant == null) {
            return false;
        }

        allCarts.ensureNotSubmitted();
        allCarts.setSelectedRestaurant(newRestaurantId);
        allCarts.setCarts(new ArrayList<>());
        allCartRepository.save(allCarts);
        return true;
    }

    public void setSubmitted(AllCarts allCarts) {
        allCarts.setSubmittedAt(System.currentTimeMillis());
        allCartRepository.save(allCarts);
    }
}
