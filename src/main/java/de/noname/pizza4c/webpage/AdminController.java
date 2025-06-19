package de.noname.pizza4c.webpage;

import de.noname.pizza4c.datamodel.pizza4c.AllCartService;
import de.noname.pizza4c.datamodel.pizza4c.Cart;
import de.noname.pizza4c.datamodel.pizza4c.CartService;
import de.noname.pizza4c.fax.FaxSendStatus;
import de.noname.pizza4c.fax.FaxService;
import de.noname.pizza4c.fax.FaxServiceProvider;
import de.noname.pizza4c.webpage.dto.AdminDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class AdminController {
    private static final Logger LOG = LoggerFactory.getLogger(AdminController.class);

    @Autowired
    private RestaurantService restaurantService;

    @Autowired
    private FaxService faxService;

    @Autowired
    private AllCartService allCartService;

    @Autowired
    private CartService cartService;

    @Autowired
    private AdminService adminService;

    @PostMapping("/api/admin/getTicket")
    public AdminDto getAdminTicket(@RequestBody String rawBody) {
        return adminService.getTicket(rawBody);
    }

    @PostMapping("/api/restaurant/change/{restaurantId}")
    public boolean selectRestaurant(@RequestHeader("X-Admin-Ticket") String adminTicket, @PathVariable("restaurantId") String restaurantId) {
        adminService.checkTicket(adminTicket);
        return allCartService.selectRestaurant(restaurantId);
    }

    @PostMapping("/api/restaurant/add/{humanName}/{restaurantId}")
    public boolean addKnownRestaurant(@RequestHeader("X-Admin-Ticket") String adminTicket,
                                      @PathVariable("humanName") String humanName,
                                      @PathVariable("restaurantId") String restaurantId) {
        adminService.checkTicket(adminTicket);
        restaurantService.addRestaurant(humanName, restaurantId);
        restaurantService.forceRefreshRestaurantData(restaurantId);
        return true;
    }

    @PostMapping("/api/restaurant/refresh")
    public boolean forceRefreshRestaurant(@RequestHeader("X-Admin-Ticket") String adminTicket) {
        adminService.checkTicket(adminTicket);
        restaurantService.forceRefreshRestaurantData();
        return true;
    }

    @PostMapping("/api/submitOrder")
    public boolean submitOrder(@RequestHeader("X-Admin-Ticket") String adminTicket) {
        adminService.checkTicket(adminTicket);
        FaxServiceProvider faxServiceProvider = faxService.getSelectedProvider();

        if (faxServiceProvider == null) {
            LOG.error("No fax service registered");
            return false;
        }

        var allCarts = allCartService.getCurrentAllCarts();
        allCarts.ensureNotSubmitted();

        String lieferandoFaxAddress = null; // TODO: Investigate whether we can get the fax address from the new api data
        FaxSendStatus sendStatus = faxServiceProvider.sendFax(allCarts.getUuid(), lieferandoFaxAddress);

        if (sendStatus == FaxSendStatus.SUCCESS) {
            allCarts = allCartService.setSubmitted(allCarts);
            allCarts = allCartService.setDeliveryEstimation(allCarts);
            return true;
        } else {
            LOG.error("Failed to send fax. StatusCode: " + sendStatus);
            return false;
        }
    }

    @PostMapping("/api/cancelAllOrders")
    public boolean cancelAllOrders(@RequestHeader("X-Admin-Ticket") String adminTicket) {
        adminService.checkTicket(adminTicket);
        var allCarts = allCartService.getCurrentAllCarts();

        for (Cart cart : allCarts.getCarts()) {
            cartService.markAsUnpaid(cart.getUuid());
        }

        allCarts = allCartService.setSubmitted(allCarts);
        return true;
    }
}
