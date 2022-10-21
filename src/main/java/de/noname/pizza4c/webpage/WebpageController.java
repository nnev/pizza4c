package de.noname.pizza4c.webpage;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.noname.pizza4c.datamodel.lieferando.Product;
import de.noname.pizza4c.datamodel.lieferando.Restaurant;
import de.noname.pizza4c.datamodel.lieferando.Variant;
import de.noname.pizza4c.datamodel.pizza4c.Cart;
import de.noname.pizza4c.pdf.PdfGenerator;
import de.noname.pizza4c.utils.SessionUtils;
import lombok.Data;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.AbstractView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

@RestController
public class WebpageController {
    private static final Logger LOG = LoggerFactory.getLogger(WebpageController.class);

    @Autowired
    private RestaurantService restaurantService;

    @Autowired
    private PdfGenerator pdfGenerator;

    @GetMapping("/api/restaurant/current")
    public Restaurant getRestaurant() {
        return restaurantService.getCachedRestaurant("xxx");
    }

    @Data
    public static class AddToCartDto {
        String product;
        String variant;
        Map<String, Set<String>> options;
    }

    @PostMapping("/api/addToCart")
    public Cart addToCart(@RequestBody String rawBody, HttpSession session) throws IOException {
        Restaurant restaurant = restaurantService.getCachedRestaurant("xxx");
        var data = new ObjectMapper().reader().readValue(rawBody, AddToCartDto.class);
        String productId = data.product;
        String variantId = data.variant;
        var product = restaurant.getMenu().getProducts().get(productId);
        var variant = getSelectedVariant(productId + "-" + variantId, productId, product);
        String name1 = (String) session.getAttribute("name");
        if (name1 != null) {
            Cart cart = restaurantService.allCarts.getOrCreateCart(name1);
            cart.addEntry(productId, variant.getId(), data.options);
        }

        String name = SessionUtils.getOrCreateName(session);
        return restaurantService.allCarts.getOrCreateCart(name);
    }

    @GetMapping("/api/allCarts")
    public List<Cart> allCarts() throws IOException {
        return restaurantService.allCarts.getCarts();
    }

    @GetMapping("/api/myCart")
    public Cart myCart(HttpSession session) throws IOException {
        String name = SessionUtils.getOrCreateName(session);
        return restaurantService.allCarts.getOrCreateCart(name);
    }

    @PostMapping("/api/changeName")
    public boolean changeName(@RequestBody String rawBody, HttpSession session) throws IOException {
        var body = new ObjectMapper().reader().readTree(rawBody);

        String name = body.get("name").asText();
        if (name != null && name.length() >= 3) {
            session.setAttribute("name", name);
        }
        return true;
    }

    @PostMapping("/api/markPaid/{cartId}")
    public boolean markAsPaidApi(@PathVariable("cartId") String cartId) {
        Cart cart = restaurantService.allCarts.getCartById(cartId);
        if (cart != null) {
            cart.setPayed(true);
        }
        return true;
    }

    @PostMapping("/api/markUnpaid/{cartId}")
    public boolean markAsUnpaidApi(@PathVariable("cartId") String cartId) {
        Cart cart = restaurantService.allCarts.getCartById(cartId);
        if (cart != null) {
            cart.setPayed(false);
        }
        return true;
    }

    @GetMapping("/api/generatePdf")
    public AbstractView generatePdf() {
        return new AbstractView() {

            @Override
            protected void renderMergedOutputModel(Map<String, Object> model, HttpServletRequest request,
                                                   HttpServletResponse response) throws Exception {
                setContentType("application/pdf");
                ByteArrayOutputStream baos = createTemporaryOutputStream();
                pdfGenerator.generate(baos);
                writeToResponse(response, baos);
            }
        };
    }

    private Variant getSelectedVariant(String variantId, String productId, Product product) {
        return product.getVariants()
                .stream()
                .filter(variant -> Objects.equals(variantId, productId + "-" + variant.getId()))
                .findFirst()
                .orElse(null);
    }

}
