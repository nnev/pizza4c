package de.noname.pizza4c.fax.clicksend;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.noname.pizza4c.fax.FaxServiceProvider;
import de.noname.pizza4c.webpage.RestaurantService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.ExchangeFilterFunction;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientException;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;
import java.util.Objects;

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

    @Override
    public boolean sendFax(String uuid, String toAddress) {
        String to = toAddress;
        if (to == null || (toAddressOverride != null && !toAddressOverride.isBlank())) {
            to = toAddressOverride;
        }

        if (to == null || to.isBlank()) {
            LOG.error("Missing fax address from lieferando and no override set");
            return false;
        }

        String authorization =
                Base64.getEncoder().encodeToString((username + ":" + password).getBytes(StandardCharsets.UTF_8));

        ClickSendRequest clickSendRequest = new ClickSendRequest();
        clickSendRequest.setFileUrl("https://" + fileUrlBase + "/api/generatePdf/" + uuid);
        clickSendRequest.setMessages(List.of(new ClickSendMessage(to, uuid, replyEmail)));
        String body;
        try {
            body = new ObjectMapper().writer().writeValueAsString(clickSendRequest);
        } catch (JsonProcessingException e) {
            LOG.error("Failed to json serialize click send request", e);
            return false;
        }

        try {
            WebClient client = WebClient.builder()
                    .filters(exchangeFilterFunctions -> {
                        exchangeFilterFunctions.add(logRequest());
                        exchangeFilterFunctions.add(logResponse());
                    })
                    .build();
            var response = client.post()
                    .uri("https://rest.clicksend.com/v3/fax/send")
                    .header("Authorization", "Basic " + authorization)
                    .body(BodyInserters.fromValue(body))
                    .retrieve()
                    .toEntity(ClickSendResponse.class)
                    .block();

            if (response == null || response.getStatusCode() != HttpStatus.OK || response.getBody() == null) {
                return false;
            }
            return Objects.equals(response.getBody().getResponseCode(), "SUCCESS");
        } catch (WebClientException e) {
            LOG.error("Failed to send ClickSend request", e);
            return false;
        }
    }

    ExchangeFilterFunction logRequest() {
        return ExchangeFilterFunction.ofRequestProcessor(clientRequest -> {
            if (LOG.isInfoEnabled()) {
                StringBuilder sb = new StringBuilder("Request: \n");
                //append clientRequest method and url
                clientRequest
                        .headers()
                        .forEach((name, values) -> values.forEach(value -> sb.append(name).append(": ").append(values)));
                LOG.info(sb.toString());
            }
            return Mono.just(clientRequest);
        });
    }

    ExchangeFilterFunction logResponse() {
        return ExchangeFilterFunction.ofResponseProcessor(clientResponse -> {
            if (LOG.isInfoEnabled()) {
                StringBuilder sb = new StringBuilder("Response: \n");
                //append clientResponse method and url
                clientResponse
                        .body((inputMessage, context) -> {
                            LOG.debug(inputMessage.getBody().blockFirst().toString(StandardCharsets.UTF_8));
                            return inputMessage;
                        });
                LOG.info(sb.toString());
            }
            return Mono.just(clientResponse);
        });
    }
}
