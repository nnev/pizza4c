package de.noname.pizza4c.fax.clicksend;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ClickSendResponseData {
    @JsonProperty("total_price")
    private BigDecimal totalPrice;
    @JsonProperty("total_count")
    private long totalCount;
    @JsonProperty("queued_count")
    private long queuedCount;
    @JsonProperty("messages")
    private List<ClickSendResponseMessage> messages;
    @JsonProperty("_currency")
    private Map<String, String> currency;
}
