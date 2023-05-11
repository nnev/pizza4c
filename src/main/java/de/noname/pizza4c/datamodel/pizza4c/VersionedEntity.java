package de.noname.pizza4c.datamodel.pizza4c;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.Version;

@MappedSuperclass
public class VersionedEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonIgnore
    private long id;

    @Version
    @JsonIgnore
    private long version;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        if (this.id != 0) {
            throw new IllegalStateException("primary index Id can only be set on non persisted entities");
        }
        this.id = id;
    }

    public long getVersion() {
        return version;
    }
}