package de.noname.pizza4c.datamodel.pizza4c;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.Column;
import javax.persistence.Entity;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
public class KnownRestaurant extends VersionedEntity {
    private String humanReadableName;
    private String lieferandoName;

    @JsonIgnore
    @Column(columnDefinition = "CLOB")
    private String lieferandoData;

    @JsonIgnore
    private LocalDateTime lieferandoLastUpdatedTime;
}
