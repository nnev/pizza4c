package de.noname.pizza4c.datamodel.pizza4c;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.vladmihalcea.hibernate.type.json.JsonType;
import de.noname.pizza4c.datamodel.lieferando2025.Menu;
import de.noname.pizza4c.datamodel.lieferando2025.ModifierGroup;
import de.noname.pizza4c.datamodel.lieferando2025.Variation;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Type;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
public class CartEntry extends VersionedEntity {
    @Column(unique = true)
    @JsonProperty("id")
    private String uuid;
    private String menuItem;

    private String variation;

    @Type(JsonType.class)
    @Column(columnDefinition = "json")
    private Map<String, Set<String>> modifiers;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @JsonProperty
    public long getPriceCents(Menu menu) {
        Variation variation = menu.getMenuItems().get(menuItem).getVariations().get(this.variation);
        long basePriceCents = variation.getPriceCents();
        for (Map.Entry<String, Set<String>> entry : modifiers.entrySet()) {
            String modifierGroupId = entry.getKey();
            Set<String> modifiers = entry.getValue();
            ModifierGroup modifierGroup = variation.getModifierGroups().get(modifierGroupId);
            for (String modifier : modifiers) {
                basePriceCents += modifierGroup.getModifiers().get(modifier).getPriceCents();
            }
        }
        return basePriceCents;
    }

    public BigDecimal getPriceEuro(Menu menu) {
        return new BigDecimal(getPriceCents(menu)).scaleByPowerOfTen(-2);
    }

    public List<String> getOptionList(Menu menu) {
        var result = new ArrayList<String>();
        result.add(menu.getMenuItems().get(menuItem).getName());

        Variation variation = menu.getMenuItems().get(menuItem).getVariations().get(this.variation);

        for (Map.Entry<String, Set<String>> entry : modifiers.entrySet()) {
            String modifierGroupId = entry.getKey();
            Set<String> modifiers = entry.getValue();
            ModifierGroup modifierGroup = variation.getModifierGroups().get(modifierGroupId);
            for (String modifier : modifiers) {
                result.add(modifierGroup.getModifiers().get(modifier).getName());
            }
        }

        if (comment != null && !comment.isBlank()) {
            result.add(comment);
        }

        return result;
    }
}
