package de.noname.pizza4c.datamodel.pizza4c;

import com.fasterxml.jackson.annotation.JsonProperty;
import de.noname.pizza4c.datamodel.lieferando.Menu;
import lombok.Data;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Data
public class Cart {
    private String id;
    private String name;
    private List<CartEntry> entries = new ArrayList<>();

    private boolean isPayed = false;

    @JsonProperty
    public BigDecimal getPrice(Menu menu) {
        return entries.stream().map(cartEntry -> cartEntry.getPrice(menu)).reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public void addEntry(String product, String variant, Map<String, Set<String>> selectedOptions) {
        CartEntry cartEntry = new CartEntry();
        cartEntry.setId(UUID.randomUUID().toString());
        cartEntry.setProduct(product);
        cartEntry.setVariant(variant);
        cartEntry.setOptions(selectedOptions);
        entries.add(cartEntry);
    }

    @JsonProperty
    public String getShortName() {
        if (name == null) {
            return null;
        }
        return name.substring(0, Math.min(name.length(), 3)).toUpperCase();
    }
}
