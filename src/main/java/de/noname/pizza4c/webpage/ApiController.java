package de.noname.pizza4c.webpage;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.noname.pizza4c.datamodel.lieferando.Restaurant;
import de.noname.pizza4c.datamodel.pizza4c.AllCartService;
import de.noname.pizza4c.datamodel.pizza4c.AllCarts;
import de.noname.pizza4c.datamodel.pizza4c.Cart;
import de.noname.pizza4c.datamodel.pizza4c.CartService;
import de.noname.pizza4c.datamodel.pizza4c.KnownRestaurant;
import de.noname.pizza4c.fax.FaxService;
import de.noname.pizza4c.fax.FaxServiceProvider;
import de.noname.pizza4c.fax.clicksend.ClickSendResponse;
import de.noname.pizza4c.pdf.PdfGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.AbstractView;

import java.io.IOException;
import java.util.List;
import java.util.Objects;

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

    @PostMapping("/api/addToCart")
    public Cart addToCart(@RequestBody String rawBody) throws IOException {
        Restaurant restaurant = restaurantService.getSelectedRestaurant();
        var data = new ObjectMapper().reader().readValue(rawBody, AddToCartDto.class);
        var validData = data.ensureValid(restaurant.getMenu());

        allCartService.getCurrentAllCarts().ensureNotSubmitted();
        Cart cart = allCartService.getOrCreateCartByName(validData.name);
        return cartService.addToCart(cart, validData);
    }

    @GetMapping("/api/allCarts")
    public AllCarts allCarts() {
        return allCartService.getCurrentAllCarts();
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
        return allCartService.selectRestaurant(restaurantId);
    }

    @PostMapping("/api/restaurant/refresh")
    public boolean forceRefreshRestaurant() {
        restaurantService.forceRefreshRestaurantData();
        return true;
    }

    @GetMapping("/api/restaurant/list")
    public List<KnownRestaurant> listKnownRestaurants() {
        return restaurantService.listAllKnownRestaurants();
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

    @PostMapping("/api/cancelAllOrders")
    public boolean cancelAllOrders() {
        var allCarts = allCartService.getCurrentAllCarts();

        for (Cart cart : allCarts.getCarts()) {
            cartService.markAsUnpaid(cart.getUuid());
        }

        allCartService.setSubmitted(allCarts);
        return true;
    }
}
