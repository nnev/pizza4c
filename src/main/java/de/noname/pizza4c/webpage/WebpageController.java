package de.noname.pizza4c.webpage;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.html.HtmlParser;
import com.lowagie.text.pdf.PdfWriter;
import de.noname.pizza4c.datamodel.lieferando.Menu;
import de.noname.pizza4c.datamodel.lieferando.Product;
import de.noname.pizza4c.datamodel.lieferando.Restaurant;
import de.noname.pizza4c.datamodel.lieferando.Variant;
import de.noname.pizza4c.datamodel.pizza4c.Cart;
import de.noname.pizza4c.utils.SessionUtils;
import lombok.Data;
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
import org.springframework.web.servlet.view.AbstractView;
import org.springframework.web.servlet.view.RedirectView;
import org.springframework.web.servlet.view.document.AbstractPdfView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.awt.*;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

@Controller
public class WebpageController {

    @Autowired
    private RestaurantService restaurantService;

    @GetMapping("/api/restaurant/current")
    public String getRestaurant(Model model) throws JsonProcessingException {

        model.addAttribute("data",
                new ObjectMapper().writer().writeValueAsString(restaurantService.getCachedRestaurant("xxx")));
        return "json";
    }

    @Data
    public static class AddToCartDto {
        String product;
        String variant;
        Map<String, Set<String>> options;
    }

    @PostMapping("/api/addToCart")
    public String addToCart(@RequestBody String rawBody, Model model, HttpSession session) throws IOException {
        Restaurant restaurant = restaurantService.getCachedRestaurant("xxx");
        var data = new ObjectMapper().reader().readValue(rawBody, AddToCartDto.class);
        String productId = data.product;
        String variantId = data.variant;
        var product = restaurant.getMenu().getProducts().get(productId);
        var variant = getSelectedVariant(productId + "-" + variantId, productId, product);
        addToCart(productId, variant.getId(), data.options, session);

        String name = SessionUtils.getOrCreateName(session);
        Cart cart = restaurantService.allCarts.getOrCreateCart(name);

        model.addAttribute("data", new ObjectMapper().writer().writeValueAsString(cart));
        return "json";
    }

    @GetMapping("/api/allCarts")
    public String allCarts(Model model) throws IOException {
        model.addAttribute("data",
                new ObjectMapper().writer().writeValueAsString(restaurantService.allCarts.getCarts()));
        return "json";
    }

    @GetMapping("/api/myCart")
    public String allCarts(Model model, HttpSession session) throws IOException {
        String name = SessionUtils.getOrCreateName(session);

        model.addAttribute("data",
                new ObjectMapper().writer().writeValueAsString(restaurantService.allCarts.getOrCreateCart(name)));
        return "json";
    }

    @PostMapping("/api/changeName")
    public String changeName(@RequestBody String rawBody, Model model, HttpSession session) throws IOException {
        var body = new ObjectMapper().reader().readTree(rawBody);

        changeName(body.get("name").asText(), session);

        model.addAttribute("data", List.of());
        return "json";
    }

    @PostMapping("/api/markPaid/{cartId}")
    public String markAsPaidApi(@PathVariable("cartId") String cartId, Model model) {
        Cart cart = restaurantService.allCarts.getCartById(cartId);
        if (cart != null) {
            cart.setPayed(true);
        }
        model.addAttribute("data", List.of());
        return "json";
    }

    @PostMapping("/api/markUnpaid/{cartId}")
    public String markAsUnpaidApi(@PathVariable("cartId") String cartId, Model model) {
        Cart cart = restaurantService.allCarts.getCartById(cartId);
        if (cart != null) {
            cart.setPayed(false);
        }
        model.addAttribute("data", List.of());
        return "json";
    }

    @GetMapping("/api/generatePdf")
    public AbstractView generatePdf(Model model) {

        return new AbstractView() {

            @Override
            protected void renderMergedOutputModel(Map<String, Object> model, HttpServletRequest request, HttpServletResponse response) throws Exception {
                setContentType("application/pdf");
                ByteArrayOutputStream baos = createTemporaryOutputStream();

                // step 1: creation of a document-object
                try (Document document = new Document()) {
                    PdfWriter.getInstance(document, baos);

                    HeaderFooter footer = new HeaderFooter(true);
                    footer.setAlignment(Element.ALIGN_BOTTOM | Element.ALIGN_MIDDLE);
                    document.setFooter(footer);
                    // step 2: we open the document
                    document.open();
                    // step 3: parsing the HTML document to convert it in PDF
                    HtmlParser.parse(document, new ByteArrayInputStream(restaurantService.renderAllCart().getBytes(StandardCharsets.UTF_8)));

                    document.close();

                    writeToResponse(response, baos);
                } catch (DocumentException | IOException de) {
                    System.err.println(de.getMessage());
                }
            }
        };
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
        changeName(name, session);

        return new RedirectView("/order");
    }

    private void changeName(String name, HttpSession session) {
        if (name != null && name.length() >= 3) {
            session.setAttribute("name", name);
        }
    }

    @GetMapping("/order")
    public String orderOverview(Model model, HttpSession session) {
        var restaurant = restaurantService.getCachedRestaurant("xxx");
        restaurantService.allCarts.setRestaurant(restaurant);
        String name = SessionUtils.getOrCreateName(session);
        Cart cart = restaurantService.allCarts.getOrCreateCart(name);

        model.addAttribute("restaurant", restaurant);
        model.addAttribute("allCarts", restaurantService.allCarts);
        model.addAttribute("name", name);
        model.addAttribute("myCart", cart);
        return "orderOverview";
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
        return getSelectedVariant(variantId, productId, product);
    }

    private Variant getSelectedVariant(String variantId, String productId, Product product) {
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
