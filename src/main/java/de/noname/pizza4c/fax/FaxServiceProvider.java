package de.noname.pizza4c.fax;

public interface FaxServiceProvider {

    boolean sendFax(String uuid, String toAddress);

    public static enum Service {
        SEND_FAX,
        MANUAL
    }

}
