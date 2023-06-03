package de.noname.pizza4c.fax.clicksend;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.io.IOException;

import static de.noname.pizza4c.fax.FaxSendStatus.CLICKSEND_INSUFFICIENT_FUNDS;
import static de.noname.pizza4c.fax.FaxSendStatus.CLICKSEND_QUEUED_COUNT_ZERO;

class ClickSendFaxServiceProviderTest {

    private ClickSendFaxServiceProvider clickSendFaxServiceProvider;

    @BeforeEach
    void setUp() {
        clickSendFaxServiceProvider = Mockito.mock(ClickSendFaxServiceProvider.class);
        clickSendFaxServiceProvider.apiEndpoint = "http://127.0.0.1:8080/clicksendTest"; // just in case
        Mockito.when(clickSendFaxServiceProvider.sendFax(Mockito.anyString(), Mockito.anyString()))
                .thenCallRealMethod();
    }

    @Test
    void insufficientCredits() throws IOException {
        Assertions.assertEquals("http://127.0.0.1:8080/clicksendTest", clickSendFaxServiceProvider.apiEndpoint);

        ClickSendResponse mockResponse = loadResponse("/fax/clicksend/insufficientfunds.json");
        Mockito.when(clickSendFaxServiceProvider.sendFax(Mockito.any(ClickSendRequest.class))).thenReturn(
                new ResponseEntity<>(mockResponse, HttpStatus.OK)
        );

        Assertions.assertEquals(CLICKSEND_INSUFFICIENT_FUNDS, clickSendFaxServiceProvider.sendFax("test", "test"));
    }

    @Test
    void notenqueued() throws IOException {
        Assertions.assertEquals("http://127.0.0.1:8080/clicksendTest", clickSendFaxServiceProvider.apiEndpoint);

        ClickSendResponse mockResponse = loadResponse("/fax/clicksend/notenqueued.json");
        Mockito.when(clickSendFaxServiceProvider.sendFax(Mockito.any(ClickSendRequest.class))).thenReturn(
                new ResponseEntity<>(mockResponse, HttpStatus.OK)
        );

        Assertions.assertEquals(CLICKSEND_QUEUED_COUNT_ZERO, clickSendFaxServiceProvider.sendFax("test", "test"));
    }

    private ClickSendResponse loadResponse(String path) throws IOException {
        return new ObjectMapper().reader().readValue(
                ClickSendFaxServiceProviderTest.class.getResourceAsStream(path),
                ClickSendResponse.class
        );
    }
}