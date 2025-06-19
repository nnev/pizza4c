package de.noname.pizza4c.datamodel.lieferando2025;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;
import java.util.Map;


@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Menu {
    private Map<String, MenuItem> menuItems;
    private Map<String, List<String>> categories;
}
