package de.noname.pizza4c.datamodel.pizza4c;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.vladmihalcea.hibernate.type.json.JsonBinaryType;
import com.vladmihalcea.hibernate.type.json.JsonStringType;
import com.vladmihalcea.hibernate.type.json.JsonType;
import org.hibernate.annotations.TypeDef;
import org.hibernate.annotations.TypeDefs;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import javax.persistence.Version;

@TypeDefs({
        @TypeDef(name = "json", typeClass = JsonType.class),
})
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