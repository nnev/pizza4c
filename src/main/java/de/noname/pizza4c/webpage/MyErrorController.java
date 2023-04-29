package de.noname.pizza4c.webpage;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;

@Controller
public class MyErrorController implements ErrorController {
    @RequestMapping("/error")
    @ResponseBody
    public String handleError(HttpServletRequest request) {
        return """
                <!DOCTYPE html>
                <html>
                <body>
                <h1>Da ist wohl etwas schief gegangen.</h1>
                Da ist wohl ein Cyberunfall passiert und jemand hat das WLAN-Kabel gezogen.
                Am besten <a href="https://github.com/k0rmarun/pizza4c/issues">meldest Du dieses Vorfall</a>.
                <br />
                <a href="/">Hier geht es zurück zur Startseite</a>
                </body>
                </html>
            """.stripIndent();
    }
}