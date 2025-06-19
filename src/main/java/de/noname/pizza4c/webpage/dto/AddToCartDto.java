package de.noname.pizza4c.webpage.dto;

import de.noname.pizza4c.datamodel.lieferando2025.*;
import de.noname.pizza4c.utils.Name;
import de.noname.pizza4c.webpage.error.NoSuchOptionException;
import de.noname.pizza4c.webpage.error.NoSuchOptionGroupException;
import de.noname.pizza4c.webpage.error.NoSuchProductException;
import de.noname.pizza4c.webpage.error.NoSuchVariantException;
import lombok.Data;

import java.util.Map;
import java.util.Set;

@Data
public class AddToCartDto {
    String menuItem;
    String variation;
    Map<String, Set<String>> modifiers;

    Name name;

    String comment;

    public ValidatedAddToCartDto ensureValid(Menu menu) {
        Name.ensureValid(name);
        if (getMenuItem() == null) {
            throw new NoSuchProductException(null);
        }

        ValidatedAddToCartDto result = new ValidatedAddToCartDto();
        result.menuItemId = getMenuItem();
        result.menuItem = menu.getMenuItems().get(getMenuItem());
        if (result.menuItem == null) {
            throw new NoSuchProductException(getMenuItem());
        }
        var variant = getSelectedVariant(result.menuItem, getVariation());
        if (variant == null) {
            throw new NoSuchVariantException(getMenuItem(), getVariation());
        }
        result.variantId = getVariation();

        ensureValidModifiers(result.menuItem, result);
        result.modifiers = getModifiers();

        Name.ensureValid(getName());
        result.name = getName();

        ensureValidComment();
        result.comment = getComment();

        return result;
    }

    private void ensureValidComment() {
        if (getComment() != null) {
            comment = comment.trim();
            if (comment.length() > 2_000) {
                comment = comment.replaceAll("([\\W]+)", "INVALID");
            }
        }
    }

    private Variation getSelectedVariant(MenuItem menuItem, String variantId) {
        return menuItem.getVariations().get(variantId);
    }

    private void ensureValidModifiers(MenuItem menuItem, ValidatedAddToCartDto validated) {
        if (getModifiers() == null) {
            throw new NoSuchOptionGroupException(validated.getMenuItemId(), validated.getVariantId(), null);
        }

        var variant = getSelectedVariant(menuItem, getVariation());
        for (String optionGroundId : getModifiers().keySet()) {
            ModifierGroup modifierGroup = variant.getModifierGroups().get(optionGroundId);
            if (modifierGroup == null) {
                throw new NoSuchOptionGroupException(validated.getMenuItemId(), validated.getVariantId(),
                        optionGroundId);
            }

            for (String optionId : getModifiers().get(optionGroundId)) {
                Modifier modifier = modifierGroup.getModifiers().get(optionId);
                if (modifier == null) {
                    throw new NoSuchOptionException(validated.getMenuItemId(), validated.getVariantId(), optionGroundId,
                            optionId);
                }
            }
        }
    }
}