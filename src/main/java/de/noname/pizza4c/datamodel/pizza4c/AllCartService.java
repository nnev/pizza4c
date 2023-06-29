package de.noname.pizza4c.datamodel.pizza4c;

import de.noname.pizza4c.utils.Name;
import de.noname.pizza4c.webpage.error.AlreadyDeliveredException;
import de.noname.pizza4c.webpage.error.CartFreshlyCreatedException;
import de.noname.pizza4c.webpage.error.CartFreshlySubmittedException;
import de.noname.pizza4c.webpage.error.InvalidDeliveryTimeException;
import de.noname.pizza4c.webpage.error.NotSubmittedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAmount;
import java.util.ArrayList;
import java.util.Collections;
import java.util.UUID;

import static de.noname.pizza4c.datamodel.pizza4c.DeliveryTimeEstimationService.MAX_VALID_DURATION;
import static de.noname.pizza4c.datamodel.pizza4c.DeliveryTimeEstimationService.MIN_VALID_DURATION;

@Service
public class AllCartService {
    public static final TemporalAmount MIN_TIME_AFTER_CREATION = Duration.ofHours(6);
    public static final TemporalAmount MIN_TIME_AFTER_SUBMISSION = Duration.ofHours(6);
    private final AllCartRepository allCartRepository;
    private final CartRepository cartRepository;

    private static final Logger LOG = LoggerFactory.getLogger(AllCartService.class);

    @Autowired
    private KnownRestaurantService knownRestaurantService;

    @Autowired
    private KnownRestaurantRepository knownRestaurantRepository;

    @Autowired
    private HistoricAllCartDeliveryStatisticRepository historicAllCartDeliveryStatisticRepository;

    @Autowired
    private DeliveryTimeEstimationService deliveryTimeEstimationService;

    @Value("${pizza4c.defaultRestaurant:pizza-rapido-eppelheim}") // Default to pizza rapido
    private String defaultRestaurantId;

    public AllCartService(AllCartRepository allCartRepository, CartRepository cartRepository) {
        this.allCartRepository = allCartRepository;
        this.cartRepository = cartRepository;
    }

    @Transactional
    public AllCarts newAllCarts() {
        var allCarts = getCurrentAllCarts();
        LocalDateTime now = LocalDateTime.now();
        if (allCarts.getCreatedAt().plus(MIN_TIME_AFTER_CREATION).isAfter(now)) {
            throw new CartFreshlyCreatedException(allCarts.getCreatedAt());
        }

        if (allCarts.getSubmittedAt() != null &&
                allCarts.getSubmittedAt().plus(MIN_TIME_AFTER_SUBMISSION).isAfter(now)) {
            throw new CartFreshlySubmittedException(allCarts.getSubmittedAt());
        }

        if (allCarts.getDeliveredAt() != null) {
            storeHistoricDeliveryStatistic(allCarts);
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

    private AllCarts createDefaultAllCarts() {
        AllCarts allCarts = new AllCarts();
        allCarts.setId(1L);
        allCarts.setUuid(UUID.randomUUID().toString());
        allCarts.setSelectedRestaurant(defaultRestaurantId);
        allCarts.setCreatedAt(LocalDateTime.now());
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

    public AllCarts setSubmitted(AllCarts allCarts) {
        allCarts.setSubmittedAt(LocalDateTime.now());
        return allCartRepository.save(allCarts);
    }

    public AllCarts setDelivered(AllCarts allCarts, LocalDateTime deliveredAt) {
        if (allCarts.getDeliveredAt() != null) {
            throw new AlreadyDeliveredException();
        }

        if (allCarts.getSubmittedAt() == null) {
            throw new NotSubmittedException();
        }

        if (allCarts.getSubmittedAt().plusSeconds(MIN_VALID_DURATION).isAfter(deliveredAt) ||
                allCarts.getSubmittedAt().plusSeconds(MAX_VALID_DURATION).isBefore(deliveredAt)) {
            throw new CartFreshlySubmittedException(allCarts.getSubmittedAt());
        }


        if (deliveredAt.isBefore(HistoricAllCartDeliveryStatistic.MIN_VALID_DATE) ||
                deliveredAt.isAfter(HistoricAllCartDeliveryStatistic.MAX_VALID_DATE)) {
            throw new InvalidDeliveryTimeException();
        }

        allCarts.setDeliveredAt(deliveredAt);
        allCarts = allCartRepository.save(allCarts);
        storeHistoricDeliveryStatistic(allCarts);
        return allCarts;
    }

    public AllCarts setDeliveryEstimation(AllCarts allCarts) {
        allCarts.setDeliveryTimeEstimation(
                deliveryTimeEstimationService.estimateDeliveryTime(
                        allCarts,
                        knownRestaurantService.getByRestaurantSlug(allCarts.getSelectedRestaurant()).getMenu()
                )
        );

        return allCartRepository.save(allCarts);
    }

    public void storeHistoricDeliveryStatistic(AllCarts allCarts) {
        var statistic = new HistoricAllCartDeliveryStatistic();
        statistic.setNumEntries(allCarts.numEntriesInCart());
        var restaurant = knownRestaurantService.getByRestaurantSlug(allCarts.getSelectedRestaurant());
        statistic.setPriceEuro(allCarts.getPrice(restaurant.getMenu()).doubleValue());
        statistic.setSubmitted(allCarts.getSubmittedAt());
        statistic.setDelivered(allCarts.getDeliveredAt());
        historicAllCartDeliveryStatisticRepository.save(statistic);
    }
}
