package de.noname.pizza4c.webpage;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.noname.pizza4c.datamodel.lieferando2025.Restaurant;
import de.noname.pizza4c.datamodel.pizza4c.*;
import de.noname.pizza4c.pdf.PdfGenerator;
import de.noname.pizza4c.webpage.dto.AddToCartDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.AbstractView;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
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
    private AllCartService allCartService;

    @Autowired
    private CartService cartService;

    @GetMapping("/api/restaurant/current")
    public Restaurant getRestaurant() {
        return restaurantService.getSelectedRestaurant();
    }

    @PostMapping("/api/addToCart")
    public Cart addToCart(@RequestBody String rawBody) throws IOException {
        Restaurant restaurant = restaurantService.getSelectedRestaurant();
        var data = new ObjectMapper().reader().readValue(rawBody, AddToCartDto.class);
        var validData = data.ensureValid(restaurant.getMenu());

        allCartService.getCurrentAllCarts().ensureNotSubmitted();
        Cart cart = allCartService.getOrCreateCartByName(validData.getName());
        return cartService.addToCart(cart, validData);
    }

    @GetMapping("/api/allCarts")
    public AllCarts allCarts() {
        return allCartService.getCurrentAllCarts();
    }

    @PostMapping("/api/allCarts/new")
    public AllCarts newAllCarts() {
        return allCartService.newAllCarts();
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

    @GetMapping("/api/generatePdf/{uuid}.pdf")
    public AbstractView generatePdf(@PathVariable("uuid") String uuid) {
        if (!Objects.equals(allCartService.getCurrentAllCarts().getUuid(), uuid)) {
            LOG.error("Got PDF request for old allCarts");
            throw new IllegalStateException("This cart should have been submitted before");
        }

        return new PdfView(pdfGenerator);
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

    @PostMapping("/api/setDelivered/{date}")
    public AllCarts setDelivered(@PathVariable("date") String date) {
        LocalDateTime parsedDate = ZonedDateTime.parse(date, DateTimeFormatter.ISO_DATE_TIME).toLocalDateTime();
        var allCarts = allCartService.getCurrentAllCarts();
        allCarts = allCartService.setDelivered(allCarts, parsedDate);
        return allCarts;
    }
}
