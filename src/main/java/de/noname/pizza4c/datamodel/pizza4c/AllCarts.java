package de.noname.pizza4c.datamodel.pizza4c;

import com.fasterxml.jackson.annotation.JsonIgnore;
import de.noname.pizza4c.datamodel.lieferando.Menu;
import de.noname.pizza4c.webpage.error.AlreadySubmittedException;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
public class AllCarts extends VersionedEntity {
    @Column(unique = true)
    private String uuid;

    private String selectedRestaurant;

    @OneToMany
    private List<Cart> carts = new ArrayList<>();

    private long submittedAt;
    private long createdAt;

    public void ensureNotSubmitted() {
        if (submittedAt > 0) {
            throw new AlreadySubmittedException();
        }
    }

    @JsonIgnore
    public BigDecimal getPrice(Menu menu) {
        return carts.stream().map(cart -> cart.getPrice(menu)).reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
