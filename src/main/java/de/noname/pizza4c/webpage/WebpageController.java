package de.noname.pizza4c.webpage;

import de.noname.pizza4c.datamodel.lieferando.Menu;
import de.noname.pizza4c.datamodel.lieferando.Product;
import de.noname.pizza4c.datamodel.lieferando.Restaurant;
import de.noname.pizza4c.datamodel.lieferando.Variant;
import de.noname.pizza4c.datamodel.pizza4c.Cart;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import javax.servlet.http.HttpSession;
import java.util.*;

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
    public String orderOverview(Model model, HttpSession session) {
        var restaurant = restaurantService.getCachedRestaurant("xxx");
        String name = (String) session.getAttribute("name");
        if (name == null) {
            session.setAttribute("name", "Kormarun");
            restaurantService.allCarts.setRestaurant(restaurant);
        }

        model.addAttribute("restaurant", restaurant);
        model.addAttribute("allCarts", restaurantService.allCarts);
        return "orderOverview";
    }

    @GetMapping("/customize/{productId}")
    public String customize(@PathVariable("productId") String productId, Model model) {
        model.addAttribute("restaurant", restaurantService.getCachedRestaurant("xxx"));
        model.addAttribute("productId", productId);
        return "customize";
    }

    @RequestMapping(value = "/customizeFinish", method = RequestMethod.POST, consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public RedirectView customizeFinish(@RequestBody MultiValueMap<String, String> formData, Model model, HttpSession session) {
        Restaurant restaurant = restaurantService.getCachedRestaurant("xxx");
        String productId = formData.getFirst("productId");
        var product = restaurant.getMenu().getProducts().get(productId);
        var variant = getSelectedVariant(formData, productId, product);
        var selectedOptions = getSelectedOptions(formData, restaurant.getMenu(), productId, variant);

        String name = (String) session.getAttribute("name");
        if (name != null) {
            Cart cart = restaurantService.allCarts.getOrCreateCart(name);
            cart.addEntry(productId, variant.getId(), selectedOptions);
        }

        return new RedirectView("/order");
    }

    private Variant getSelectedVariant(MultiValueMap<String, String> formData, String productId, Product product) {
        return product.getVariants()
                .stream()
                .filter(variant -> Objects.equals("on", formData.getFirst(productId + "-" + variant.getId())))
                .findFirst()
                .orElse(null);
    }

    private Map<String, Set<String>> getSelectedOptions(MultiValueMap<String, String> formData, Menu menu, String productId, Variant variant) {
        Map<String, Set<String>> result = new HashMap<>();

        formData.forEach((key, values) -> {
            var parts = key.split("-");
            if (parts.length != 4) {
                return;
            }

            var partProductId = parts[0];
            var partVariantId = parts[1];
            var partOptionGroupId = parts[2];
            var partOptionId = parts[3];

            if (partProductId.equals(productId) && partVariantId.equals(variant.getId())) {
                var optionGroup = menu.getOptionGroups().get(partOptionGroupId);
                if (optionGroup == null) {
                    return;
                }

                for (String optionId : optionGroup.getOptionIds()) {
                    if (optionId.equals(partOptionId)) {
                        result.computeIfAbsent(partOptionGroupId, s -> new LinkedHashSet<>()).add(optionId);
                    }
                }
            }
        });

        return result;
    }
}
