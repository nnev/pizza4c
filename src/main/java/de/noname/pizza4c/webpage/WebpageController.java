package de.noname.pizza4c.webpage;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.view.RedirectView;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

@Controller
public class WebpageController {

    @Autowired
    private RestaurantService restaurantService;

    @GetMapping("/api/restaurant/current")
    public String getRestaurant(Model model) throws JsonProcessingException {

        model.addAttribute("data", new ObjectMapper().writer().writeValueAsString(restaurantService.getCachedRestaurant("xxx")));
        return "json";
    }

    @GetMapping("/changeName")
    public String changeName() {
        return "changeName";
    }

    @RequestMapping(value = "/changeName/do", method = RequestMethod.POST,
            consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public RedirectView changeName(@RequestBody MultiValueMap<String, String> formData,
                                   HttpSession session) {
        String name = formData.getFirst("name");
        if (name != null && name.length() >= 3) {
            session.setAttribute("name", name);
        }

        return new RedirectView("/order");
    }

    @GetMapping("/order")
    public String orderOverview(Model model, HttpSession session) {
        var restaurant = restaurantService.getCachedRestaurant("xxx");
        String name = (String) session.getAttribute("name");
        if (name == null) {
            session.setAttribute("name", generateRandomName());
            restaurantService.allCarts.setRestaurant(restaurant);
        }

        Cart cart = restaurantService.allCarts.getOrCreateCart(name);

        model.addAttribute("restaurant", restaurant);
        model.addAttribute("allCarts", restaurantService.allCarts);
        model.addAttribute("name", name);
        model.addAttribute("myCart", cart);
        return "orderOverview";
    }

    private String generateRandomName() {
        return UUID.randomUUID().toString();
    }

    @GetMapping("/customize/{productId}")
    public String customize(@PathVariable("productId") String productId, Model model) {
        model.addAttribute("restaurant", restaurantService.getCachedRestaurant("xxx"));
        model.addAttribute("productId", productId);
        return "customize";
    }

    @RequestMapping(value = "/addToCart", method = RequestMethod.POST,
            consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public RedirectView addToCart(@RequestBody MultiValueMap<String, String> formData, Model model,
                                  HttpSession session) {
        Restaurant restaurant = restaurantService.getCachedRestaurant("xxx");
        String productId = formData.getFirst("productId");
        var product = restaurant.getMenu().getProducts().get(productId);
        var variant = getSelectedVariant(formData, productId, product);
        var selectedOptions = getSelectedOptions(formData, restaurant.getMenu(), productId, variant);

        return addToCart(productId, variant.getId(), selectedOptions, session);
    }

    @RequestMapping(value = "/addToCart/{productId}", method = RequestMethod.GET)
    public RedirectView addToCartNonCustomized(Model model, @PathVariable("productId") String productId,
                                               HttpSession session) {
        Restaurant restaurant = restaurantService.getCachedRestaurant("xxx");
        var product = restaurant.getMenu().getProducts().get(productId);

        return addToCart(productId, product.getVariants().get(0).getId(), Map.of(), session);
    }

    private RedirectView addToCart(String productId, String variantId, Map<String, Set<String>> options,
                                   HttpSession session) {
        String name = (String) session.getAttribute("name");
        if (name != null) {
            Cart cart = restaurantService.allCarts.getOrCreateCart(name);
            cart.addEntry(productId, variantId, options);
        }

        return new RedirectView("/order");
    }

    private Variant getSelectedVariant(MultiValueMap<String, String> formData, String productId, Product product) {
        var variantId = formData.getFirst("variantId");
        return product.getVariants()
                .stream()
                .filter(variant -> Objects.equals(variantId, productId + "-" + variant.getId()))
                .findFirst()
                .orElse(null);
    }

    private Map<String, Set<String>> getSelectedOptions(MultiValueMap<String, String> formData, Menu menu,
                                                        String productId, Variant variant) {
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

    @GetMapping("/markPaid/{cartId}")
    public RedirectView markAsPaid(@PathVariable("cartId") String cartId, Model model) {
        Cart cart = restaurantService.allCarts.getCartById(cartId);
        if (cart != null) {
            cart.setPayed(true);
        }
        return new RedirectView("/order");
    }

    @GetMapping("/markUnpaid/{cartId}")
    public RedirectView markAsUnpaid(@PathVariable("cartId") String cartId, Model model) {
        Cart cart = restaurantService.allCarts.getCartById(cartId);
        if (cart != null) {
            cart.setPayed(false);
        }
        return new RedirectView("/order");
    }
}
