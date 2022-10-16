package de.noname.pizza4c.datamodel.pizza4c;

import de.noname.pizza4c.datamodel.lieferando.Menu;
import de.noname.pizza4c.datamodel.lieferando.Restaurant;
import lombok.Data;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Data
@Component
public class AllCarts {
    private Restaurant restaurant;
    private List<Cart> carts = new ArrayList<>();

    public BigDecimal getPrice(Menu menu) {
        return carts.stream().map(cartEntry -> cartEntry.getPrice(menu)).reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public Cart getOrCreateCart(String userName) {
        return carts.stream().filter(c -> Objects.equals(c.getName(), userName)).findFirst().orElseGet(() -> {
            Cart cart = new Cart();
            cart.setId(UUID.randomUUID().toString());
            cart.setName(userName);
            carts.add(cart);
            return cart;
        });
    }

    public Cart getCartById(String cartId) {
        return carts.stream().filter(c -> Objects.equals(c.getId(), cartId)).findFirst().orElse(null);
    }

    @Bean
    @Scope("singular")
    public static AllCarts getInstance() {
        return new AllCarts();
    }

    public List<Cart> getPayedCarts(){
        return carts.stream().filter(Cart::isPayed).toList();
    }

    public List<Cart> getUnpayedCarts(){
        return carts.stream().filter(cart -> !cart.isPayed()).toList();
    }
}
