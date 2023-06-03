package de.noname.pizza4c.datamodel.pizza4c;

import jakarta.persistence.Embeddable;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Embeddable
public class DeliveryTimeEstimation {
    private LocalDateTime byEntries;
    private LocalDateTime byPrice;
}
