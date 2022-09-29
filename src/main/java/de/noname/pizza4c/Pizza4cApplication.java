package de.noname.pizza4c;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.noname.pizza4c.datamodel.lieferando.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;
import java.io.InputStream;

@SpringBootApplication
public class Pizza4cApplication {
    public static final Logger LOG = LoggerFactory.getLogger(Pizza4cApplication.class);

    public static void main(String[] args) throws IOException {
//        Restaurant restaurant = retrieveData2("pizza-rapido-eppelheim");
//
//        Menu menu = restaurant.getMenu();
//        menu.getProducts().forEach((productCode, product) -> {
//            LOG.info("Product: {} ({})", product.getName(), productCode);
//            LOG.info("\tProductInfo:");
//            LOG.info("\t\tAdditives: {}", product.getAllergenHolder().getAdditives());
//            LOG.info("\t\tAllergens: {}", product.getAllergenHolder().getAllergens());
//            LOG.info("\t\tAlcoholVolume: {}", product.getAllergenHolder().getAlcoholVolume());
//            LOG.info("\t\tCaffeineAmount: {}", product.getAllergenHolder().getCaffeineAmount());
//            LOG.info("\t\tVerified: {}", product.getAllergenHolder().isFoodInformationVerifiedByRestaurant());
//            LOG.info("\t\tManual: {}", product.getAllergenHolder().getNutritionalTextManual());
//            product.getVariants().forEach(variant -> {
//                LOG.info("\tVariant: {}, priceDelivery: {}€, pricePickup: {}€", variant.getName(), variant.getPrices().getDeliveryEuro(), variant.getPrices().getPickupEuro());
//                variant.getOptionGroupIds().forEach(optionGroupId -> {
//                    OptionGroup optionGroup = menu.getOptionGroups().get(optionGroupId);
//                    LOG.info("\t\tOptionGroup: {}, Min: {}, Max: {}", optionGroup.getName(), optionGroup.getMinChoices(), optionGroup.getMaxChoices());
//                    optionGroup.getOptionIds().forEach(optionId -> {
//                        Option option = menu.getOptions().get(optionId);
//                        LOG.info("\t\t\tOption: {}, Min: {}, Max: {}, priceDelivery: {}€, pricePickup: {}€", option.getName(), option.getMinAmount(), option.getMaxAmount(), option.getPrices().getDeliveryEuro(), option.getPrices().getPickupEuro());
//                    });
//                });
//            });
//        });
//        System.out.println("++++");
        SpringApplication.run(Pizza4cApplication.class, args);
    }




}
