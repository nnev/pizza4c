package de.noname.pizza4c.fax.clicksend;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class ClickSendRequest {
    @JsonProperty("file_url")
    private String fileUrl;

    @JsonProperty
    private List<ClickSendMessage> messages;
}
