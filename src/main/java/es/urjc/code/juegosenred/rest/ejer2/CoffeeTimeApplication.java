package es.urjc.code.juegosenred.rest.ejer2;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@SpringBootApplication
@EnableWebSocket
public class CoffeeTimeApplication implements WebSocketConfigurer {

	public static void main(String[] args) {
		SpringApplication.run(CoffeeTimeApplication.class, args);
	}

	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
		registry.addHandler(createChatHandler(), "/game/{id}")
			.setAllowedOrigins("*");
		
	}
	
	@Bean
	public ChatHandler createChatHandler() {
		return new ChatHandler();
	}
	
	

}
