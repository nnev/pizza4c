package de.noname.pizza4c.datamodel.pizza4c;

import de.noname.pizza4c.webpage.dto.ValidatedAddToCartDto;
import org.springframework.stereotype.Service;

import java.util.Objects;
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
            cartRepository.saveAndFlush(cart);
        }
    }

    public void markAsUnpaid(String cartId) {
        Cart cart = getCartById(cartId);
        if (cart != null) {
            cart.setPayed(false);
            cartRepository.saveAndFlush(cart);
        }
    }

    public Cart getCartById(String cartId) {
        return cartRepository.findCartByUuid(cartId);
    }

    public Cart addToCart(Cart cart, ValidatedAddToCartDto validData) {
        cart.getEntries().add(createEntry(validData));
        return cartRepository.saveAndFlush(cart);
    }

    private CartEntry createEntry(ValidatedAddToCartDto validData) {
        CartEntry cartEntry = new CartEntry();
        cartEntry.setUuid(UUID.randomUUID().toString());
        cartEntry.setMenuItem(validData.getMenuItemId());
        cartEntry.setVariation(validData.getVariantId());
        cartEntry.setModifiers(validData.getModifiers());
        cartEntry.setComment(validData.getComment());
        return cartEntryRepository.saveAndFlush(cartEntry);
    }

    public void removeCartEntry(String entryId) {
        var cart = cartRepository.findCartByEntries_uuid(entryId);
        if (cart == null) {
            return;
        }

        cart.getEntries().removeIf(cartEntry -> Objects.equals(cartEntry.getUuid(), entryId));
        cartRepository.saveAndFlush(cart);
    }
}
