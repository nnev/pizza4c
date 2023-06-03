package de.noname.pizza4c.fax.clicksend;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ClickSendResponseMessage {
    @JsonProperty("user_id")
    private long userId;

    @JsonProperty("subaccount_id")
    private long subAccountId;

    @JsonProperty("list_id")
    private long listId;

    @JsonProperty("message_id")
    private String messageId;

    @JsonProperty
    private String to;

    @JsonProperty
    private String from;

    @JsonProperty
    private String carrier;

    @JsonProperty
    private String country;

    @JsonProperty("custom_string")
    private String customString;

    @JsonProperty("schedule")
    private String schedule;
    @JsonProperty("message_pages")
    private long messagePages;

    @JsonProperty("message_price")
    private String messagePrice;

    @JsonProperty("status_code")
    private String statusCode;

    @JsonProperty("status_text")
    private String statusText;
    @JsonProperty("date_added")
    private long dateAdded;

    @JsonProperty("from_email")
    private String fromEmail;
    @JsonProperty("_file_url")
    private String fileUrl;
    @JsonProperty
    private String status;
}
