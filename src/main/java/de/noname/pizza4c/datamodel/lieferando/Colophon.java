package de.noname.pizza4c.datamodel.lieferando;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.Objects;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Colophon {
    @JsonProperty
    private String status;

    @JsonProperty
    private ColphonData data;

    public boolean isFetched(){
        return Objects.equals(status, "fetched");
    }
}
