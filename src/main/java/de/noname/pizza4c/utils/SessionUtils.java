package de.noname.pizza4c.utils;

import javax.servlet.http.HttpSession;

public class SessionUtils {
    public static Name getOrCreateName(HttpSession session) {
        Name name = (Name) session.getAttribute("name");
        if (name == null) {
            name = NameUtils.generateNewName();
        }
        session.setAttribute("name", name);
        return name;
    }
}
