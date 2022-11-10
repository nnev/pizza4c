package de.noname.pizza4c.datamodel.lieferando;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ColphonData {
    @JsonProperty
    private String branchName;
    @JsonProperty
    private String restaurantName;
    @JsonProperty
    private String streetName;
    @JsonProperty
    private String streetNumber;
    @JsonProperty
    private String postalCode;
    @JsonProperty
    private String city;
    @JsonProperty
    private String email;
    @JsonProperty
    private String fax;
}
