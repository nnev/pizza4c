package de.noname.pizza4c.webpage;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebpageController {
    @GetMapping("/greeting")
    public String index(Model model){
        model.addAttribute("bli", "bla");
        return "greeting";
    }
}
