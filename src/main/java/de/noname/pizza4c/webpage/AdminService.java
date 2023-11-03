package de.noname.pizza4c.webpage;

import de.noname.pizza4c.datamodel.pizza4c.AllCartService;
import de.noname.pizza4c.webpage.dto.AdminDto;
import de.noname.pizza4c.webpage.error.UnauthorizedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Objects;
import java.util.UUID;

@Service
public class AdminService {
    @Value("${pizza4c.admin.secret:TEST_SECRET_NOT_FOR_PROD}")
    private String serverSecret;

    @Autowired
    private AllCartService allCartService;

    public AdminDto getTicket(String clientSecret) {
        var cartId = allCartService.getCurrentAllCarts().getUuid();
        String salt = UUID.randomUUID().toString();
        var hash = makeDigestHash(cartId, salt, serverSecret, clientSecret);
        var ticket = hash + "$" + salt;

        return new AdminDto(ticket, serverSecret.equals(clientSecret));
    }

    public void checkTicket(String clientTicket) {
        var cartId = allCartService.getCurrentAllCarts().getUuid();

        var tokenParts = clientTicket.split("\\$");
        if (tokenParts.length != 2) {
            throw new UnauthorizedException();
        }
        var hash = tokenParts[0];
        var salt = tokenParts[1];
        var digestHash = makeDigestHash(cartId, salt, serverSecret, serverSecret);

        if (!Objects.equals(hash, digestHash)) {
            throw new UnauthorizedException();
        }
    }

    private String makeDigestHash(String cartId, String salt, String serverSecret, String clientSecret){
        var ticketValue = cartId + salt + serverSecret + salt + clientSecret;
        MessageDigest digest = null;
        try {
            digest = MessageDigest.getInstance("SHA3-512");
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
        var digestValue = digest.digest(ticketValue.getBytes(StandardCharsets.UTF_8));
        return Base64.getUrlEncoder().encodeToString(digestValue);
    }
}
