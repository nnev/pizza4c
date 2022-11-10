package de.noname.pizza4c.fax.clicksend;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ClickSendMessage {
    public ClickSendMessage(String to, String customString, String fromEmail) {
        this.source = "pizza4c";
        this.to = to;
        this.customString = customString;
        this.country = "DE";
        this.fromEmail = fromEmail;
    }

    @JsonProperty
    private String source;
    @JsonProperty
    private String to;

    @JsonProperty("custom_string")
    private String customString;

    @JsonProperty
    private String country;
    @JsonProperty("from_email")
    private String fromEmail;
}
