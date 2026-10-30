package de.noname.pizza4c.webpage;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.boot.web.error.ErrorAttributeOptions;
import org.springframework.boot.web.error.ErrorAttributeOptions.Include;
import org.springframework.boot.webmvc.error.ErrorAttributes;
import org.springframework.boot.webmvc.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.server.ResponseStatusException;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;

import java.util.HashMap;

@Controller
public class MyErrorController implements ErrorController {
    private final ErrorAttributes errorAttributes;

    public MyErrorController(ErrorAttributes errorAttributes) {
        this.errorAttributes = errorAttributes;
    }


    @RequestMapping("/error")
    @ResponseBody
    public String handleError(HttpServletRequest request) {
        WebRequest webRequest = new ServletWebRequest(request);
        var errors = this.errorAttributes.getErrorAttributes(webRequest, ErrorAttributeOptions.of(Include.MESSAGE));

        if (errorAttributes.getError(webRequest) instanceof ResponseStatusException) {
            try {
                var map = new HashMap<String, Object>();
                map.put("timestamp", System.currentTimeMillis());
                map.put("status", errors.get("status"));
                map.put("message", errors.get("message"));
                return new ObjectMapper().writeValueAsString(map);
            } catch (JacksonException e) {
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