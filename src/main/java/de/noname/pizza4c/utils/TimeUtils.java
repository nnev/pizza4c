package de.noname.pizza4c.utils;

import org.springframework.context.i18n.LocaleContextHolder;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class TimeUtils {
    public static LocalDateTime dateTimeFromEpochMillis(long epochMillis) {
        return LocalDateTime.ofInstant(Instant.ofEpochMilli(epochMillis),
                LocaleContextHolder.getTimeZone().toZoneId());
    }

    public static LocalDate dateFromEpochMillis(long epochMillis) {
        return LocalDate.ofInstant(Instant.ofEpochMilli(epochMillis),
                LocaleContextHolder.getTimeZone().toZoneId());
    }

    public static String formatEpochMillis(long epochMillis) {
        return formatEpochMillis(epochMillis, GERMAN_TIME_FORMATTER);
    }

    public static String formatEpochMillis(long epochMillis, DateTimeFormatter formatter) {
        return dateTimeFromEpochMillis(epochMillis).format(formatter);
    }

    public static DateTimeFormatter GERMAN_TIME_FORMATTER = DateTimeFormatter.ofPattern("dd. MM. yyyy HH:mm:ss");
}
