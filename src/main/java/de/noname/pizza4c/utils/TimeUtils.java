package de.noname.pizza4c.utils;

import org.springframework.context.i18n.LocaleContextHolder;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class TimeUtils {
    public static final long MINUTE_IN_SECONDS = 60;
    public static final long HOUR_IN_SECONDS = 60 * MINUTE_IN_SECONDS;
    public static final long DAY_IN_SECONDS = 24 * HOUR_IN_SECONDS;

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

    public static String formatDateTime(LocalDateTime dateTime) {
        return dateTime.format(GERMAN_TIME_FORMATTER);
    }

    public static DateTimeFormatter GERMAN_TIME_FORMATTER = DateTimeFormatter.ofPattern("dd. MM. yyyy HH:mm:ss");
}
