package com.dt.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.dt.jwt.JWTAuthenticationFilter;
import com.dt.jwt.JwtAuthenticationEntryPoint;

import lombok.AllArgsConstructor;

@Configuration
@AllArgsConstructor
public class SecurityFilterConfig {

    private JwtAuthenticationEntryPoint point;
    private JWTAuthenticationFilter filter;

    @Bean
  public CorsConfigurationSource corsConfigurationSource() {
      CorsConfiguration configuration = new CorsConfiguration();
      configuration.setAllowedOriginPatterns(Arrays.asList("http://localhost:5173"));
      configuration.setAllowedMethods(Arrays.asList("GET", "POST","PATCH", "PUT", "DELETE", "OPTIONS"));
      configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
      configuration.setAllowCredentials(true);

      UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
      source.registerCorsConfiguration("/**", configuration);
      return source;
  }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
      return http.csrf(csrf -> csrf.disable())
              .cors(cors -> cors.configurationSource(corsConfigurationSource()))
              .authorizeHttpRequests(auth -> auth
                      .requestMatchers("/authenticate").permitAll()
                      .anyRequest().authenticated())
              .exceptionHandling(ex -> ex.authenticationEntryPoint(point))
              .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
              .addFilterBefore(filter, UsernamePasswordAuthenticationFilter.class)
              .build();
  }
  


}