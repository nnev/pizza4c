package de.noname.pizza4c.webpage;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.noname.pizza4c.datamodel.lieferando.Product;
import de.noname.pizza4c.datamodel.lieferando.Restaurant;
import de.noname.pizza4c.datamodel.lieferando.Variant;
import de.noname.pizza4c.datamodel.pizza4c.AllCartService;
import de.noname.pizza4c.datamodel.pizza4c.AllCarts;
import de.noname.pizza4c.datamodel.pizza4c.Cart;
import de.noname.pizza4c.datamodel.pizza4c.CartService;
import de.noname.pizza4c.fax.FaxService;
import de.noname.pizza4c.fax.FaxServiceProvider;
import de.noname.pizza4c.fax.clicksend.ClickSendResponse;
import de.noname.pizza4c.pdf.PdfGenerator;
import de.noname.pizza4c.utils.Name;
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

import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

@RestController
public class ApiController {
    private static final Logger LOG = LoggerFactory.getLogger(ApiController.class);

    @Autowired
    private RestaurantService restaurantService;

    @Autowired
    private PdfGenerator pdfGenerator;


    @Autowired
    private FaxService faxService;


    @Autowired
    private AllCartService allCartService;

    @Autowired
    private CartService cartService;

    @GetMapping("/api/restaurant/current")
    public Restaurant getRestaurant() {
        return restaurantService.getSelectedRestaurant();
    }

    @PostMapping("/v3/fax/send")
    public ClickSendResponse faxtest() {
        return new ClickSendResponse();
    }

    @Data
    public static class AddToCartDto {
        String product;
        String variant;
        Map<String, Set<String>> options;
    }

    private Variant getSelectedVariant(String variantId, String productId, Product product) {
        return product.getVariants()
                .stream()
                .filter(variant -> Objects.equals(variantId, productId + "-" + variant.getId()))
                .findFirst()
                .orElse(null);
    }

    @PostMapping("/api/addToCart")
    public Cart addToCart(@RequestBody String rawBody, HttpSession session) throws IOException {
        Restaurant restaurant = restaurantService.getSelectedRestaurant();
        var data = new ObjectMapper().reader().readValue(rawBody, AddToCartDto.class);
        String productId = data.product;
        String variantId = data.variant;
        var product = restaurant.getMenu().getProducts().get(productId);
        var variant = getSelectedVariant(productId + "-" + variantId, productId, product);

        Name name = SessionUtils.getOrCreateName(session);

        allCartService.getCurrentAllCarts().ensureNotSubmitted();
        Cart cart = allCartService.getOrCreateCartByName(name);
        return cartService.addToCart(cart, productId, variant.getId(), data.options);
    }

    @GetMapping("/api/allCarts")
    public AllCarts allCarts() {
        return allCartService.getCurrentAllCarts();
    }

    @GetMapping("/api/myCart")
    public Cart myCart(HttpSession session) {
        Name name = SessionUtils.getOrCreateName(session);

        return allCartService.getOrCreateCartByName(name);
    }

    @PostMapping("/api/changeName")
    public boolean changeName(@RequestBody String rawBody, HttpSession session) throws IOException {
        var body = new ObjectMapper().reader().readTree(rawBody);

        String nameText = body.get("name").asText();
        if (nameText != null && nameText.length() >= 3) {
            Name name = new Name();
            name.setLongName(nameText);
            name.setShortName(nameText.substring(0, 3).toUpperCase());
            session.setAttribute("name", name);
        }
        return true;
    }

    @PostMapping("/api/markPaid/{cartId}")
    public boolean markAsPaidApi(@PathVariable("cartId") String cartId) {
        cartService.markAsPaid(cartId);
        return true;
    }

    @PostMapping("/api/markUnpaid/{cartId}")
    public boolean markAsUnpaidApi(@PathVariable("cartId") String cartId) {
        cartService.markAsUnpaid(cartId);
        return true;
    }

    @GetMapping("/api/generatePdf")
    public AbstractView generatePdf() {
        return new PdfView(pdfGenerator);
    }

    @GetMapping("/api/generatePdf/{:uuid}")
    public AbstractView generatePdf(@PathVariable("uuid") String uuid) {
        if (allCartService.getCurrentAllCarts().getSubmittedAt() == 0 ||
                !Objects.equals(allCartService.getCurrentAllCarts().getUuid(), uuid)) {
            throw new IllegalStateException("This cart should have been submitted before");
        }

        return new PdfView(pdfGenerator);
    }

    @PostMapping("/api/restaurant/change/{restaurantId}")
    public boolean selectRestaurant(@PathVariable("restaurantId") String restaurantId) {
        allCartService.selectRestaurant(restaurantId);
        return true;
    }

    @PostMapping("/api/remove/{entryId}")
    public boolean removeCartEntry(@PathVariable("entryId") String entryId) {
        allCartService.getCurrentAllCarts().ensureNotSubmitted();
        cartService.removeCartEntry(entryId);
        return true;
    }

    @PostMapping("/api/submitOrder")
    public boolean submitOrder() {
        FaxServiceProvider faxServiceProvider = faxService.getSelectedProvider();

        if (faxServiceProvider == null) {
            LOG.error("No fax service registered");
            return false;
        }

        var allCarts = allCartService.getCurrentAllCarts();
        allCarts.ensureNotSubmitted();

        boolean success = faxServiceProvider.sendFax(allCarts.getUuid(),
                restaurantService.getSelectedRestaurant().getColophon().getData().getFax());

        if (success) {
            allCartService.setSubmitted(allCarts);
        }
        return success;
    }
}
