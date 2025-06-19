package de.noname.pizza4c.datamodel.pizza4c;

import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
public class HistoricAllCartDeliveryStatistic extends VersionedEntity {

    private static final double MAX_VALID_PRICE_EURO = 1000;
    // Date this feature was developed
    public static final LocalDateTime MIN_VALID_DATE = LocalDateTime.of(2023, 6, 3, 0, 0, 0);
    // No way this piece of software lives long enough to make it to 2030
    // Whoever sees this as an error in Jan 2030 is owed a Pizza ;) -- kormarun
    public static final LocalDateTime MAX_VALID_DATE = LocalDateTime.of(2030, 1, 1, 0, 0, 0);

    private int numEntries;
    private double priceCents;
    private LocalDateTime submitted;
    private LocalDateTime delivered;

    public boolean isValid() {
        return numEntries > 0 &&
                priceCents > 0 && priceCents < MAX_VALID_PRICE_EURO &&
                submitted != null && submitted.isAfter(MIN_VALID_DATE) && submitted.isBefore(MAX_VALID_DATE) &&
                delivered != null && delivered.isAfter(MIN_VALID_DATE) && delivered.isBefore(MAX_VALID_DATE);
    }
}
