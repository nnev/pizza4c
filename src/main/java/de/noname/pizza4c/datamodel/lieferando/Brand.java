package de.noname.pizza4c.datamodel.lieferando;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class Brand {
    @JsonProperty
    private String name;

    @JsonProperty
    private String branchName;

    @JsonProperty
    private String chainId;

    @JsonProperty
    private List<String> description;

    @JsonProperty
    private String slogan;

    @JsonProperty
    private String logoUrl;

    @JsonProperty
    private String headerImageUrl;
}
