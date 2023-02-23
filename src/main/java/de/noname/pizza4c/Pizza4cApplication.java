package de.noname.pizza4c;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Pizza4cApplication {
    public static final Logger LOG = LoggerFactory.getLogger(Pizza4cApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(Pizza4cApplication.class, args);
    }

}
