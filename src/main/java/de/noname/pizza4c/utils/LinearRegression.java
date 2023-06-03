package de.noname.pizza4c.utils;

import java.util.List;

public class LinearRegression {
    public final double intercept, slope;

    public LinearRegression(List<Double> x, List<Double> y) {
        if (x.size() != y.size()) {
            throw new IllegalArgumentException("array lengths are not equal");
        }
        int n = x.size();

        if (n < 2) {
            throw new IllegalArgumentException("Not enough data points");
        }

        // first pass
        double sumX = 0.0, sumY = 0.0;
        for (int i = 0; i < n; i++) {
            sumX += x.get(i);
            sumY += y.get(i);
        }
        double avgX = sumX / n;
        double avgY = sumY / n;

        // second pass: compute summary statistics
        double avgXX = 0.0, avgXY = 0.0;
        for (int i = 0; i < n; i++) {
            double dx = x.get(i) - avgX;
            double dy = y.get(i) - avgY;
            avgXX += dx * dx;
            avgXY += dx * dy;
        }
        slope = avgXY / avgXX;
        intercept = avgY - slope * avgX;
    }

    public double predict(double x) {
        return slope * x + intercept;
    }

}
