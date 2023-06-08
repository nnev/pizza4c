package de.noname.pizza4c.datamodel.pizza4c;

import de.noname.pizza4c.datamodel.lieferando.Menu;
import de.noname.pizza4c.utils.LinearRegression;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

import static de.noname.pizza4c.utils.TimeUtils.HOUR_IN_SECONDS;
import static de.noname.pizza4c.utils.TimeUtils.MINUTE_IN_SECONDS;

@Service
public class DeliveryTimeEstimationService {
    public static final long MIN_VALID_DURATION = 15 * MINUTE_IN_SECONDS;
    public static final long MAX_VALID_DURATION = 6 * HOUR_IN_SECONDS;

    @Autowired
    private HistoricAllCartDeliveryStatisticRepository repository;

    public DeliveryTimeEstimation estimateDeliveryTime(AllCarts allCarts, Menu menu) {
        var allEntries = repository.findAll(PageRequest.of(0, 500, Sort.by(Direction.DESC, "submitted")));
        List<Double> byEntries_x = new ArrayList<>(allEntries.getNumberOfElements());
        List<Double> byEntries_y = new ArrayList<>(allEntries.getNumberOfElements());

        List<Double> byPrice_x = new ArrayList<>(allEntries.getNumberOfElements());
        List<Double> byPrice_y = new ArrayList<>(allEntries.getNumberOfElements());

        for (HistoricAllCartDeliveryStatistic statistic : allEntries) {
            if (!statistic.isValid()) {
                continue;
            }
            double numEntriesStatistic = statistic.getNumEntries();
            double priceEuroStatistic = statistic.getPriceEuro();

            double durationSeconds = ChronoUnit.SECONDS.between(statistic.getSubmitted(), statistic.getDelivered());

            if (durationSeconds < MIN_VALID_DURATION || durationSeconds > MAX_VALID_DURATION) {
                continue;
            }

            byEntries_x.add(numEntriesStatistic);
            byEntries_y.add(durationSeconds);

            byPrice_x.add(priceEuroStatistic);
            byPrice_y.add(durationSeconds);
        }

        var deliveryTimeEstimation = new DeliveryTimeEstimation();
        double numEntries = allCarts.numEntriesInCart();
        double priceEuro = allCarts.getPrice(menu).doubleValue();

        LocalDateTime now = LocalDateTime.now();
        if (byEntries_x.size() > 2) {
            LinearRegression linearRegressionByEntries = new LinearRegression(byEntries_x, byEntries_y);
            var byEntriesDurationSeconds = linearRegressionByEntries.predict(numEntries);
            deliveryTimeEstimation.setByEntries(now.plusSeconds((long) byEntriesDurationSeconds));
        }

        if (byPrice_x.size() > 2) {
            LinearRegression linearRegressionByPrice = new LinearRegression(byPrice_x, byPrice_y);
            var byPriceDurationSeconds = linearRegressionByPrice.predict(priceEuro);
            deliveryTimeEstimation.setByPrice(now.plusSeconds((long) byPriceDurationSeconds));
        }

        return deliveryTimeEstimation;
    }
}
