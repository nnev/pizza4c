package de.noname.pizza4c.webpage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebpageController {

    @Autowired
    private RestaurantService restaurantService;

    @GetMapping("/greeting")
    public String index(Model model) {
        model.addAttribute("restaurant", restaurantService.getCachedRestaurant("xxx"));
        return "greeting";
    }

    @GetMapping("/order")
    public String orderOverview(Model model) {
        model.addAttribute("restaurant", restaurantService.getCachedRestaurant("xxx"));
        return "orderOverview";
    }
}
