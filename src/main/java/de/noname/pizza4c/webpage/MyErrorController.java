package de.noname.pizza4c.webpage;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.boot.autoconfigure.web.ServerProperties;
import org.springframework.boot.web.error.ErrorAttributeOptions;
import org.springframework.boot.web.servlet.error.ErrorAttributes;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@Controller
public class MyErrorController implements ErrorController {
    private final ErrorAttributes errorAttributes;
    private final ServerProperties serverProperties;

    public MyErrorController(
            ErrorAttributes errorAttributes, ServerProperties serverProperties) {
        this.errorAttributes = errorAttributes;
        this.serverProperties = serverProperties;
    }


    @RequestMapping("/error")
    @ResponseBody
    public String handleError(HttpServletRequest request) {
        WebRequest webRequest = new ServletWebRequest(request);
        var errors = this.errorAttributes.getErrorAttributes(webRequest, ErrorAttributeOptions.defaults());

        if (errorAttributes.getError(webRequest) instanceof ResponseStatusException) {
            try {
                return new ObjectMapper().writeValueAsString(
                        Map.of(
                                "timestamp", System.currentTimeMillis(),
                                "status", errors.get("status"),
                                "message", errors.get("message")
                        )
                );
            } catch (JsonProcessingException e) {
                // pass
            }
        }

        return """
                    <!DOCTYPE html>
                    <html>
                    <body>
                    <h1>Da ist wohl etwas schief gegangen.</h1>
                    Da ist wohl ein Cyberunfall passiert und jemand hat das WLAN-Kabel gezogen.
                    Am besten <a href="https://github.com/nnev/pizza4c/issues">meldest Du dieses Vorfall</a>.
                    <br />
                    <a href="/">Hier geht es zurück zur Startseite</a>
                    </body>
                    </html>
                """.stripIndent();
    }
}