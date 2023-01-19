package de.noname.pizza4c.datamodel.pizza4c;

import com.fasterxml.jackson.annotation.JsonProperty;
import de.noname.pizza4c.datamodel.lieferando.Menu;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Type;

import javax.persistence.Column;
import javax.persistence.Entity;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collection;
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
    private String product;

    private String variant;

    @Type(type = "json")
    @Column(columnDefinition = "json")
    private Map<String, Set<String>> options;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @JsonProperty
    public BigDecimal getPrice(Menu menu) {
        return new BigDecimal(menu.getVariant(product, variant).getPrices().getDeliveryEuro()).add(
                options
                        .values()
                        .stream()
                        .flatMap(Collection::stream)
                        .map(s -> new BigDecimal(menu.getOptions().get(s).getPrices().getDeliveryEuro()))
                        .reduce(BigDecimal.ZERO, BigDecimal::add)
        );
    }

    public List<String> getOptionList(Menu menu) {
        var result = new ArrayList<String>();
        result.add(menu.getProducts().get(product).getName());

        options
                .values()
                .stream()
                .flatMap(Collection::stream)
                .map(s -> menu.getOptions().get(s).getName())
                .forEach(result::add);

        if (comment != null && !comment.isBlank()) {
            result.add(comment);
        }

        return result;
    }
}
