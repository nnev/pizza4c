package de.noname.pizza4c.fax;

import de.noname.pizza4c.fax.clicksend.ClickSendFaxServiceProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class FaxService {

    @Autowired
    private ClickSendFaxServiceProvider clickSendFaxService;

    @Value("${pizza4c.fax.service:SEND_FAX}")
    private FaxServiceProvider.Service faxService;

    public FaxServiceProvider getSelectedProvider() {
        switch (faxService) {
            case SEND_FAX -> {
                return clickSendFaxService;
            }
            case MANUAL -> {
                return null;
            }
            default -> {
                throw new IllegalStateException("Unknown Fax service");
            }
        }
    }
}
