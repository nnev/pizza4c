package de.noname.pizza4c.fax.clicksend;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ClickSendResponse {
    @JsonProperty("http_code")
    private String httpCode;
    @JsonProperty("response_code")
    private String responseCode;
    @JsonProperty("response_msg")
    private String responseMessage;
    @JsonProperty
    private ClickSendResponseData data;
}
