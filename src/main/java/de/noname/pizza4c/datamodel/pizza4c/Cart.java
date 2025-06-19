package de.noname.pizza4c.datamodel.pizza4c;

import com.fasterxml.jackson.annotation.JsonProperty;
import de.noname.pizza4c.datamodel.lieferando2025.Menu;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
public class Cart extends VersionedEntity {
    @Column(unique = true)
    @JsonProperty("id")
    private String uuid;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String shortName;

    @OneToMany(fetch = FetchType.LAZY)
    private List<CartEntry> entries = new ArrayList<>();

    private boolean isPayed = false;

    @JsonProperty
    public long getPriceCents(Menu menu) {
        return entries.stream().mapToLong(cartEntry -> cartEntry.getPriceCents(menu)).sum();
    }
}
