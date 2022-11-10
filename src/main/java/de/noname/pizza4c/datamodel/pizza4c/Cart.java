package de.noname.pizza4c.datamodel.pizza4c;

import com.fasterxml.jackson.annotation.JsonProperty;
import de.noname.pizza4c.datamodel.lieferando.Menu;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
public class Cart extends VersionedEntity{
    @Column(unique = true)
    @JsonProperty("id")
    private String uuid;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String shortName;

    @OneToMany
    private List<CartEntry> entries = new ArrayList<>();

    private boolean isPayed = false;

    @JsonProperty
    public BigDecimal getPrice(Menu menu) {
        return entries.stream().map(cartEntry -> cartEntry.getPrice(menu)).reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
