package de.noname.pizza4c.datamodel.pizza4c;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

@Service
public class CartService {
    private final CartRepository cartRepository;
    private final CartEntryRepository cartEntryRepository;

    public CartService(CartRepository cartRepository, CartEntryRepository cartEntryRepository) {
        this.cartRepository = cartRepository;
        this.cartEntryRepository = cartEntryRepository;
    }

    public void markAsPaid(String cartId) {
        Cart cart = getCartById(cartId);
        if (cart != null) {
            cart.setPayed(true);
            cartRepository.save(cart);
        }
    }

    public void markAsUnpaid(String cartId) {
        Cart cart = getCartById(cartId);
        if (cart != null) {
            cart.setPayed(false);
            cartRepository.save(cart);
        }
    }

    public Cart getCartById(String cartId) {
        return cartRepository.findCartByUuid(cartId);
    }

    public Cart addToCart(Cart cart, String productId, String variantId, Map<String, Set<String>> optionIds) {
        cart.getEntries().add(createEntry(productId, variantId, optionIds));
        return cartRepository.save(cart);
    }

    private CartEntry createEntry(String product, String variant, Map<String, Set<String>> selectedOptions) {
        CartEntry cartEntry = new CartEntry();
        cartEntry.setUuid(UUID.randomUUID().toString());
        cartEntry.setProduct(product);
        cartEntry.setVariant(variant);
        cartEntry.setOptions(selectedOptions);
        return cartEntryRepository.save(cartEntry);
    }

    public void removeCartEntry(String entryId) {
        var cart = cartRepository.findCartByEntries_uuid(entryId);
        if (cart == null) {
            return;
        }

        cart.getEntries().removeIf(cartEntry -> Objects.equals(cartEntry.getUuid(), entryId));
        cartRepository.save(cart);
    }
}
