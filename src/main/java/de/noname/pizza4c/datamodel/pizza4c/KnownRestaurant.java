package de.noname.pizza4c.datamodel.pizza4c;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.Entity;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
public class KnownRestaurant extends VersionedEntity {
    private String humanReadableName;
    private String lieferandoName;
}
