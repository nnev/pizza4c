package de.noname.pizza4c.fax;

public enum FaxSendStatus {
    SUCCESS,
    NO_TO_ADDRESS,
    CLICKSEND_BAD_RESPONSE,
    CLICKSEND_NOT_SUCCESS_RESPONSE_CODE,
    CLICKSEND_QUEUED_COUNT_ZERO,
    CLICKSEND_INSUFFICIENT_FUNDS
}
