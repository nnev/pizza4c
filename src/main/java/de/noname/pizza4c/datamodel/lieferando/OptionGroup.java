package de.noname.pizza4c.datamodel.lieferando;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class OptionGroup {
    @JsonProperty
    private String name;

    @JsonProperty
    private boolean isTypeMulti;

    @JsonProperty
    private boolean isRequired;

    @JsonProperty
    private int minChoices;

    @JsonProperty
    private int maxChoices;

    @JsonProperty
    private List<String> optionIds;

}
