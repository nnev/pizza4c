package de.noname.pizza4c.datamodel.pizza4c;

import com.fasterxml.jackson.annotation.JsonIgnore;
import de.noname.pizza4c.datamodel.lieferando.Menu;
import de.noname.pizza4c.webpage.error.AlreadySubmittedException;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;
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

    private LocalDateTime submittedAt;
    private LocalDateTime deliveredAt;
    private LocalDateTime createdAt;

    @Embedded
    private DeliveryTimeEstimation deliveryTimeEstimation;

    public void ensureNotSubmitted() {
        if (submittedAt != null) {
            throw new AlreadySubmittedException();
        }
    }

    @JsonIgnore
    public BigDecimal getPrice(Menu menu) {
        return carts.stream().map(cart -> cart.getPrice(menu)).reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @JsonIgnore
    public int numEntriesInCart() {
        return getCarts().stream().mapToInt(cart -> cart.getEntries().size()).sum();
    }

    @Override
    public String toString() {
        return "AllCarts{" +
               "uuid='" + uuid + '\'' +
               ", selectedRestaurant='" + selectedRestaurant + '\'' +
               ", carts=" + carts +
               ", submittedAt=" + submittedAt +
               ", deliveredAt=" + deliveredAt +
               ", createdAt=" + createdAt +
               ", deliveryTimeEstimation=" + deliveryTimeEstimation +
               "} " + super.toString();
    }
}
