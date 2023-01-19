package de.noname.pizza4c.webpage;

import de.noname.pizza4c.datamodel.lieferando.*;
import de.noname.pizza4c.utils.Name;
import lombok.Data;

import java.util.Map;
import java.util.Objects;
import java.util.Set;

@Data
public class AddToCartDto {
    String product;
    String variant;
    Map<String, Set<String>> options;

    Name name;

    String comment;

    public ValidatedAddToCartDto ensureValid(Menu menu) {
        Name.ensureValid(name);
        if (getProduct() == null) {
            throw new NoSuchProductException(null);
        }

        ValidatedAddToCartDto result = new ValidatedAddToCartDto();
        result.productId = getProduct();
        result.product = menu.getProducts().get(getProduct());
        if (result.product == null) {
            throw new NoSuchProductException(getProduct());
        }
        var variant = getSelectedVariant(getProduct() + "-" + getVariant(), getProduct(), result.product);
        if (variant == null) {
            throw new NoSuchVariantException(getProduct(), getVariant());
        }
        result.variantId = getVariant();

        ensureValidOptions(menu, result);
        result.options = getOptions();

        Name.ensureValid(getName());
        result.name = getName();

        ensureValidComment();
        result.comment = getComment();

        return result;
    }

    private void ensureValidComment() {
        if (getComment() == null || getComment().isBlank()) {
            comment = comment.trim();
        }
        if(comment.length() > 2_000) {
            comment = comment.replaceAll("([\\W]+)", "INVALID");
        }
    }

    private Variant getSelectedVariant(String variantId, String productId, Product product) {
        return product.getVariants()
                .stream()
                .filter(variant -> Objects.equals(variantId, productId + "-" + variant.getId()))
                .findFirst()
                .orElse(null);
    }

    private void ensureValidOptions(Menu menu, ValidatedAddToCartDto validated) {
        if (getOptions() == null) {
            throw new NoSuchOptionGroupException(validated.getProductId(), validated.getVariantId(), null);
        }

        var variant = getSelectedVariant(getProduct() + "-" + getVariant(), getProduct(), validated.product);
        for (String optionGroundId : getOptions().keySet()) {
            if (!variant.getOptionGroupIds().contains(optionGroundId)) {
                throw new NoSuchOptionGroupException(validated.getProductId(), validated.getVariantId(), optionGroundId);
            }
            OptionGroup optionGroup = menu.getOptionGroups().get(optionGroundId);
            if (optionGroup == null) {
                throw new NoSuchOptionGroupException(validated.getProductId(), validated.getVariantId(), optionGroundId);
            }

            for (String optionId : getOptions().get(optionGroundId)) {
                if (!optionGroup.getOptionIds().contains(optionId)) {
                    throw new NoSuchOptionException(validated.getProductId(), validated.getVariantId(), optionGroundId, optionId);
                }
                Option option = menu.getOptions().get(optionId);
                if (option == null) {
                    throw new NoSuchOptionException(validated.getProductId(), validated.getVariantId(), optionGroundId, optionId);
                }
            }
        }
    }
}