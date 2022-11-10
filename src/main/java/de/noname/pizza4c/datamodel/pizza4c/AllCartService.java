package de.noname.pizza4c.datamodel.pizza4c;

import de.noname.pizza4c.utils.Name;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class AllCartService {
    private final AllCartRepository allCartRepository;
    private final CartRepository cartRepository;

    @Value("${pizza4c.defaultRestaurant:3Q3N1P1}") // Default to pizza rapido
    private String defaultRestaurantId;

    public AllCartService(AllCartRepository allCartRepository, CartRepository cartRepository) {
        this.allCartRepository = allCartRepository;
        this.cartRepository = cartRepository;
    }

    public AllCarts getCurrentAllCarts() {
        return allCartRepository.findById(1L).orElseGet(this::createDefaultAllCarts);
    }

    private AllCarts createDefaultAllCarts(){
        AllCarts allCarts = new AllCarts();
        allCarts.setId(1L);
        allCarts.setUuid(UUID.randomUUID().toString());
        allCarts.setSelectedRestaurant(defaultRestaurantId);
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

    public void selectRestaurant(String restaurantId) {
        String newRestaurantId;
        if (restaurantId == null) {
            newRestaurantId = defaultRestaurantId;
        } else {
            newRestaurantId = restaurantId;
        }

        AllCarts allCarts = getCurrentAllCarts();

        if (allCarts.getSelectedRestaurant().equals(newRestaurantId)) {
            return;
        }

        allCarts.ensureNotSubmitted();
        allCarts.setSelectedRestaurant(newRestaurantId);
        allCarts.setCarts(List.of());
        allCartRepository.save(allCarts);
    }

    public void setSubmitted(AllCarts allCarts) {
        allCarts.setSubmittedAt(System.currentTimeMillis());
        allCartRepository.save(allCarts);
    }
}
