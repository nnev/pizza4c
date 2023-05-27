package de.noname.pizza4c.datamodel.pizza4c;

import de.noname.pizza4c.utils.Name;
import de.noname.pizza4c.webpage.error.CartFreshlyCreatedException;
import de.noname.pizza4c.webpage.error.CartFreshlySubmittedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.UUID;

@Service
public class AllCartService {
    public static final int MIN_TIME_AFTER_CREATION = 6 * 60 * 60 * 1000;
    public static final int MIN_TIME_AFTER_SUBMISSION = 6 * 60 * 60 * 1000;
    private final AllCartRepository allCartRepository;
    private final CartRepository cartRepository;

    private static final Logger LOG = LoggerFactory.getLogger(AllCartService.class);

    @Autowired
    private KnownRestaurantService knownRestaurantService;

    @Autowired
    private KnownRestaurantRepository knownRestaurantRepository;

    @Value("${pizza4c.defaultRestaurant:pizza-rapido-eppelheim}") // Default to pizza rapido
    private String defaultRestaurantId;

    public AllCartService(AllCartRepository allCartRepository, CartRepository cartRepository) {
        this.allCartRepository = allCartRepository;
        this.cartRepository = cartRepository;
    }

    @Transactional
    public AllCarts newAllCarts() {
        var allCarts = getCurrentAllCarts();
        long now = System.currentTimeMillis();
        if (allCarts.getCreatedAt() + MIN_TIME_AFTER_CREATION > now) {
            throw new CartFreshlyCreatedException(allCarts.getCreatedAt());
        }

        if (allCarts.getSubmittedAt() > 0 && allCarts.getSubmittedAt() + MIN_TIME_AFTER_SUBMISSION > now) {
            throw new CartFreshlySubmittedException(allCarts.getSubmittedAt());
        }

        allCartRepository.delete(allCarts);
        return getCurrentAllCarts();
    }

    @Transactional
    public AllCarts getCurrentAllCarts() {
        var allCarts = allCartRepository.getLatest();
        if (allCarts == null) {
            allCarts = createDefaultAllCarts();
        }
        if (knownRestaurantRepository.getByLieferandoName(allCarts.getSelectedRestaurant()) != null) {
            allCarts.setSelectedRestaurant(defaultRestaurantId);
            allCarts = allCartRepository.save(allCarts);
        }

        return allCarts;
    }

    @Scheduled(cron = "0 0 6 * * *")
    public void dailyCartReset() {
        newAllCarts();
    }

    private AllCarts createDefaultAllCarts() {
        AllCarts allCarts = new AllCarts();
        allCarts.setId(1L);
        allCarts.setUuid(UUID.randomUUID().toString());
        allCarts.setSelectedRestaurant(defaultRestaurantId);
        allCarts.setCreatedAt(System.currentTimeMillis());
        allCarts.setCarts(Collections.emptyList());
        return allCartRepository.save(allCarts);
    }

    @Transactional
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

    @Transactional
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

        var restaurant = knownRestaurantService.getByRestaurantSlug(newRestaurantId);
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
