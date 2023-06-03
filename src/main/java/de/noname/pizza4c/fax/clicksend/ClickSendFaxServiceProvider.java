package de.noname.pizza4c.fax.clicksend;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.noname.pizza4c.fax.FaxSendStatus;
import de.noname.pizza4c.fax.FaxServiceProvider;
import de.noname.pizza4c.webpage.RestaurantService;
import io.netty.handler.logging.LogLevel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.reactive.ClientHttpConnector;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientException;
import reactor.netty.http.client.HttpClient;
import reactor.netty.transport.logging.AdvancedByteBufFormat;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;
import java.util.Objects;

import static de.noname.pizza4c.fax.FaxSendStatus.CLICKSEND_BAD_RESPONSE;
import static de.noname.pizza4c.fax.FaxSendStatus.CLICKSEND_INSUFFICIENT_FUNDS;
import static de.noname.pizza4c.fax.FaxSendStatus.CLICKSEND_NOT_SUCCESS_RESPONSE_CODE;
import static de.noname.pizza4c.fax.FaxSendStatus.CLICKSEND_QUEUED_COUNT_ZERO;
import static de.noname.pizza4c.fax.FaxSendStatus.NO_TO_ADDRESS;
import static de.noname.pizza4c.fax.FaxSendStatus.SUCCESS;

@Service
public class ClickSendFaxServiceProvider implements FaxServiceProvider {

    private static final Logger LOG = LoggerFactory.getLogger(RestaurantService.class);

    @Value("${pizza4c.fax.fileurl.server:pizza.nnev.de}")
    private String fileUrlBase;

    @Value("${pizza4c.fax.toAddress.override:}")
    private String toAddressOverride;

    @Value("${pizza4c.fax.toAddress.replyEmail:pizza@noname-ev.de}")
    private String replyEmail;

    @Value("${pizza4c.fax.service.sendfax.username:username}")
    private String username;
    @Value("${pizza4c.fax.service.sendfax.password:password}")
    private String password;

    @Value("${pizza4c.fax.service.sendfax.apiEndpoint:https://rest.clicksend.com/v3/fax/send")
    public String apiEndpoint;

    @Override
    public FaxSendStatus sendFax(String uuid, String toAddress) {
        String to = toAddress;
        if (to == null || (toAddressOverride != null && !toAddressOverride.isBlank())) {
            to = toAddressOverride;
        }

        if (to == null || to.isBlank()) {
            LOG.error("Missing fax address from lieferando and no override set");
            return NO_TO_ADDRESS;
        }

        ClickSendRequest clickSendRequest = new ClickSendRequest();
        clickSendRequest.setFileUrl("https://" + fileUrlBase + "/api/generatePdf/" + uuid + ".pdf");
        clickSendRequest.setMessages(List.of(new ClickSendMessage(to, uuid, replyEmail)));
        var response = sendFax(clickSendRequest);

        if (response == null || response.getStatusCode() != HttpStatus.OK || response.getBody() == null) {
            return CLICKSEND_BAD_RESPONSE;
        }
        ClickSendResponse responseBody = response.getBody();

        if (!Objects.equals(responseBody.getResponseCode(), "SUCCESS")) {
            return CLICKSEND_NOT_SUCCESS_RESPONSE_CODE;
        }

        ClickSendResponseData responseData = responseBody.getData();
        if (responseData != null) {
            if (responseData.getQueuedCount() == 0) {
                return CLICKSEND_QUEUED_COUNT_ZERO;
            }

            if (responseData.getMessages() != null) {
                for (ClickSendResponseMessage message : responseData.getMessages()) {
                    if (message.getStatus().equalsIgnoreCase("INSUFFICIENT_CREDIT")) {
                        LOG.error("Failed to send fax, due to insufficient money");
                        return CLICKSEND_INSUFFICIENT_FUNDS;
                    }
                }
            }
        }

        return SUCCESS;
    }

    ResponseEntity<ClickSendResponse> sendFax(ClickSendRequest clickSendRequest) {
        String body;
        try {
            body = new ObjectMapper().writer().writeValueAsString(clickSendRequest);
        } catch (JsonProcessingException e) {
            LOG.error("Failed to json serialize click send request", e);
            return null;
        }

        String authorization =
                Base64.getEncoder().encodeToString((username + ":" + password).getBytes(StandardCharsets.UTF_8));

        try {
            HttpClient httpClient = HttpClient.create()
                    .wiretap(this.getClass().getCanonicalName(), LogLevel.INFO, AdvancedByteBufFormat.TEXTUAL);
            ClientHttpConnector conn = new ReactorClientHttpConnector(httpClient);

            WebClient client = WebClient.builder()
                    .clientConnector(conn)
                    .build();

            return client.post()
                    .uri(apiEndpoint)
                    .header("Authorization", "Basic " + authorization)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(BodyInserters.fromValue(body))
                    .retrieve()
                    .toEntity(ClickSendResponse.class)
                    .doOnError(throwable -> LOG.error("Failure to send fax", throwable))
                    .block();
        } catch (WebClientException e) {
            LOG.error("Failed to send ClickSend request", e);
            return null;
        }
    }
}
