package de.noname.pizza4c.datamodel.pizza4c;

import de.noname.pizza4c.webpage.ValidatedAddToCartDto;
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

    public Cart addToCart(Cart cart, ValidatedAddToCartDto validData) {
        cart.getEntries().add(createEntry(validData));
        return cartRepository.save(cart);
    }

    private CartEntry createEntry(ValidatedAddToCartDto validData) {
        CartEntry cartEntry = new CartEntry();
        cartEntry.setUuid(UUID.randomUUID().toString());
        cartEntry.setProduct(validData.getProductId());
        cartEntry.setVariant(validData.getVariantId());
        cartEntry.setOptions(validData.getOptions());
        cartEntry.setComment(validData.getComment());
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
