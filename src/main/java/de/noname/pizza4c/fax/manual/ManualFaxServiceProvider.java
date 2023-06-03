package de.noname.pizza4c.fax.manual;

import de.noname.pizza4c.fax.FaxSendStatus;
import de.noname.pizza4c.fax.FaxServiceProvider;
import org.springframework.stereotype.Service;

@Service
public class ManualFaxServiceProvider implements FaxServiceProvider {
    @Override
    public FaxSendStatus sendFax(String uuid, String toAddress) {
        return FaxSendStatus.SUCCESS;
    }
}
