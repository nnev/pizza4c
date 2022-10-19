package de.noname.pizza4c.utils;

import javax.servlet.http.HttpSession;
import java.util.UUID;

public class SessionUtils {
    public static String getOrCreateName(HttpSession session){
        String name = (String) session.getAttribute("name");
        if (name == null) {
            name = generateRandomName();
            session.setAttribute("name", name);
        }
        return name;
    }

    private static String generateRandomName() {
        return UUID.randomUUID().toString();
    }
}
