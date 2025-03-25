package com.example.vttp_project_backend.config;

import io.micrometer.core.aop.TimedAspect;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.composite.CompositeMeterRegistry;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration  // Marks this class as a source of bean definitions for the application context
public class MetricConfig {

    // This bean creates a TimedAspect, which uses the MeterRegistry to record method execution times
    @Bean
    public TimedAspect timedAspect(MeterRegistry registry) {
        // Pass in the MeterRegistry to the TimedAspect so it can record metrics
        return new TimedAspect(registry);
    }

    // This bean creates a CompositeMeterRegistry, which can combine multiple MeterRegistry implementations
    @Bean
    public MeterRegistry getMeterRegistry() {
        // Create a new CompositeMeterRegistry instance
        CompositeMeterRegistry meterRegistry = new CompositeMeterRegistry();
        // Return the composite registry to be used for collecting metrics
        return meterRegistry;
    }
}
