package de.noname.pizza4c.datamodel.pizza4c;

import de.noname.pizza4c.datamodel.lieferando.Menu;
import lombok.Data;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Data
public class Cart {
    private String id;
    private String name;
    private List<CartEntry> entries = new ArrayList<>();

    private boolean isPayed = false;

    public BigDecimal getPrice(Menu menu) {
        return entries.stream().map(cartEntry -> cartEntry.getPrice(menu)).reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public void addEntry(String product, String variant, Map<String, Set<String>> selectedOptions) {
        CartEntry cartEntry = new CartEntry();
        cartEntry.setProduct(product);
        cartEntry.setVariant(variant);
        cartEntry.setOptions(selectedOptions);
        entries.add(cartEntry);
    }

    public String getShortName(){
        return name.substring(0, Math.min(name.length(), 3)).toUpperCase();
    }
}
