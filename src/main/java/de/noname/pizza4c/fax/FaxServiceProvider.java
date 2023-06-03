package de.noname.pizza4c.fax;

public interface FaxServiceProvider {

    FaxSendStatus sendFax(String uuid, String toAddress);

    public static enum Service {
        SEND_FAX,
        MANUAL
    }

}
