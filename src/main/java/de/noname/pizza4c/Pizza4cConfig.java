package de.noname.pizza4c;

import de.noname.pizza4c.datamodel.pizza4c.DailyCartResetScheduler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

@Configuration
@EnableScheduling
public class Pizza4cConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registerResourceHandler(registry, "/**.js", 7);
        registerResourceHandler(registry, "/**.css", 7);
        registerResourceHandler(registry, "/**", 0);
    }

    @Bean
    public DailyCartResetScheduler dailyCartResetScheduler() {
        return new DailyCartResetScheduler();
    }

    private static void registerResourceHandler(ResourceHandlerRegistry registry, String extension, int cacheDurationDays) {
        registry.addResourceHandler(extension)
                .addResourceLocations("classpath:/static/")
                .setCacheControl(cacheDurationDays == 0 ? CacheControl.noCache() : CacheControl.maxAge(7, TimeUnit.DAYS))
                .resourceChain(true)
                .addResolver(PATH_RESOURCE_RESOLVER);
    }

    private static final PathResourceResolver PATH_RESOURCE_RESOLVER = new PathResourceResolver() {
        @Override
        protected Resource getResource(String resourcePath, Resource location) throws IOException {
            if (resourcePath.contains("/api/")) {
                throw new IOException("Api entries should not be resolved as static addresses.");
            }
            Resource requestedResource = location.createRelative(resourcePath);
            return requestedResource.exists() && requestedResource.isReadable() ? requestedResource
                    : new ClassPathResource("/static/index.html");
        }
    };
}
