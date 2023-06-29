package de.noname.pizza4c.datamodel.pizza4c;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;

public class DailyCartResetScheduler {
    @Autowired
    private AllCartService allCartService;

    @Scheduled(cron = "0 0 6 * * *")
    public void dailyCartReset() {
        allCartService.clearAllCarts();
    }
}
