package es.urjc.code.juegosenred.rest.ejer2;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class ChatHandler extends TextWebSocketHandler {

	private Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
	private ObjectMapper mapper = new ObjectMapper();
	
	@Autowired
	private JdbcTemplate jdbcTemplate;
	
	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		System.out.println("New user: " + session.getId());
		sessions.put(session.getId(), session);
	}
	
	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		System.out.println("Session closed: " + session.getId());
		try {
			String codigoLobby = jdbcTemplate.queryForObject("SELECT Codigo FROM lobby WHERE Id_J1 = ?",
					new Object[] {session.getId()}, String.class);
			String idJ2 = jdbcTemplate.queryForObject("SELECT Id_J2 FROM lobby WHERE Codigo = ?",
					new Object[] {codigoLobby}, String.class);
			int numUsuarios = jdbcTemplate.queryForObject("Select NumeroConexiones from lobby where Codigo = ?",
					new Object[] {codigoLobby}, Integer.class);
			if(numUsuarios > 1) {
				int numActivos = jdbcTemplate.queryForObject("Select NumeroPreparados from lobby where Codigo = ?",
						new Object[] {codigoLobby}, Integer.class);
				if(numActivos > 0) {
					String sql = "Update lobby set Id_J1 = '', NumeroConexiones = ?, NumeroPreparados = ? where Codigo = ?";
					jdbcTemplate.update(sql,numUsuarios-1,numActivos-1,codigoLobby);
				}else {
					String sql2 = "Update lobby set Id_J1 = '', NumeroConexiones = ? where Codigo = ?";
					jdbcTemplate.update(sql2,numUsuarios-1,codigoLobby);
				}
			}else {
				String sql2 = "Delete from lobby where Codigo = ?";
				jdbcTemplate.update(sql2, codigoLobby);
			}
			for(WebSocketSession participant : sessions.values()) {
				if(participant.getId().equals(idJ2)) {
					sendDesconnection(participant);
				}
			}
			
		}catch(Exception e) {
			String codigoLobby = jdbcTemplate.queryForObject("SELECT Codigo FROM lobby WHERE Id_J2 = ?",
					new Object[] {session.getId()}, String.class);
			String idJ1 = jdbcTemplate.queryForObject("SELECT Id_J1 FROM lobby WHERE Codigo = ?",
					new Object[] {codigoLobby}, String.class);
			int numUsuarios = jdbcTemplate.queryForObject("Select NumeroConexiones from lobby where Codigo = ?",
					new Object[] {codigoLobby}, Integer.class);
			if(numUsuarios > 1) {
				int numActivos = jdbcTemplate.queryForObject("Select NumeroPreparados from lobby where Codigo = ?",
						new Object[] {codigoLobby}, Integer.class);
				if(numActivos > 0) {
					String sql = "Update lobby set Id_J2 = '', NumeroConexiones = ?, NumeroPreparados = ? where Codigo = ?";
					jdbcTemplate.update(sql,numUsuarios-1,numActivos-1,codigoLobby);
				}else {
					String sql2 = "Update lobby set Id_J2 = '', NumeroConexiones = ? where Codigo = ?";
					jdbcTemplate.update(sql2,numUsuarios-1,codigoLobby);
				}
			}else {
				String sql2 = "Delete from lobby where Codigo = ?";
				jdbcTemplate.update(sql2, codigoLobby);
			}
			
			for(WebSocketSession participant : sessions.values()) {
				if(participant.getId().equals(idJ1)) {
					sendDesconnection(participant);
				}
			}
		}
		sessions.remove(session.getId());
	}
	
	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		
		System.out.println("Message received: " + message.getPayload());
		JsonNode node = mapper.readTree(message.getPayload());
		
		if(node.get("type").asText().equals("id")) {
			sendIdPlayer(session,node);
		}else if(node.get("type").asText().equals("start")){
			sendStartMessage(session,node);
		}else if(node.get("type").asText().equals("cake")){
			sendCakeMade(session,node);
		}else if(node.get("type").asText().equals("coffee")){
			sendCoffeeMade(session,node);
		}else if(node.get("type").asText().equals("cookie")){
			sendCookieMade(session,node);
		}else if(node.get("type").asText().equals("cRecolected")){
			sendRecolectedCake(session,node);
		}else if(node.get("type").asText().equals("cookieR")){
			sendRecolectedCookie(session,node);
		}else if(node.get("type").asText().equals("coffeeR")){
			sendRecolectedCoffee(session,node);
		}else if(node.get("type").asText().equals("puntos")){
			sendPointsPlayer(session,node);
		}else if(node.get("type").asText().equals("winner")){
			sendWinner(session,node);
		}else if(node.get("type").asText().equals("tiempo")){
			sendGameTime(session,node);
		}else if(node.get("type").asText().equals("patron")){
			sendPatronMake(session,node);
		}else {
			sendPlayerPosition(session,node);
		}
		
	}
	
	private void sendDesconnection(WebSocketSession session) throws IOException{
		ObjectNode newNode = mapper.createObjectNode();
		newNode.put("type", "disconnect");
		session.sendMessage(new TextMessage(newNode.toString()));
	}
	
	//funcion que manda al usuario el id creado por Spring para la sesion de WebSocket
	private void sendIdPlayer(WebSocketSession session, JsonNode node)throws IOException{
		ObjectNode newNode = mapper.createObjectNode();
		newNode.put("type", node.get("type").asText());
		newNode.put("id", session.getId());
		session.sendMessage(new TextMessage(newNode.toString()));
		System.out.println("Message send: " + newNode.toString());
	}
	
	//mensaje de sincronización para la inicialización de la partida
	private void sendStartMessage(WebSocketSession session, JsonNode node) throws IOException {
		ObjectNode newNode = mapper.createObjectNode();
		newNode.put("type", node.get("type").asText());
		for(WebSocketSession participant : sessions.values()) {
			if(participant.getId().equals(node.get("id").asText())) {
				participant.sendMessage(new TextMessage(newNode.toString()));
			}
		}
		session.sendMessage(new TextMessage(newNode.toString()));
		System.out.println("Message send: " + newNode.toString());
	}
	
	private void sendPatronMake(WebSocketSession session, JsonNode node) throws IOException{
		ObjectNode newNode = mapper.createObjectNode();
		newNode.put("idP", node.get("idP").asText());
		newNode.put("type", node.get("type").asText());
		for(WebSocketSession participant : sessions.values()) {
			if(participant.getId().equals(node.get("id").asText())) {
				participant.sendMessage(new TextMessage(newNode.toString()));
			}
		}
		session.sendMessage(new TextMessage(newNode.toString()));
		System.out.println("Message send: " + newNode.toString());
	}
	
	//mensaje enviado a ambos jugadores para crear a la vez el objeto
	private void sendCakeMade(WebSocketSession session, JsonNode node) throws IOException {
		ObjectNode newNode = mapper.createObjectNode();
		newNode.put("idC", node.get("idC").asText());
		newNode.put("type", node.get("type").asText());
		for(WebSocketSession participant : sessions.values()) {
			if(participant.getId().equals(node.get("id").asText())) {
				participant.sendMessage(new TextMessage(newNode.toString()));
			}
		}
		session.sendMessage(new TextMessage(newNode.toString()));
		System.out.println("Message send: " + newNode.toString());
	}
	
	//mensaje enviado a ambos jugadores para crear a la vez el objeto
	private void sendCoffeeMade(WebSocketSession session, JsonNode node) throws IOException {
		ObjectNode newNode = mapper.createObjectNode();
		newNode.put("idC", node.get("idC").asText());
		newNode.put("type", node.get("type").asText());
		for(WebSocketSession participant : sessions.values()) {
			if(participant.getId().equals(node.get("id").asText())) {
				participant.sendMessage(new TextMessage(newNode.toString()));
			}
		}
		session.sendMessage(new TextMessage(newNode.toString()));
		System.out.println("Message send: " + newNode.toString());
	}
	
	//mensaje enviado a ambos jugadores para crear a la vez el objeto
	private void sendCookieMade(WebSocketSession session, JsonNode node) throws IOException {
		ObjectNode newNode = mapper.createObjectNode();
		newNode.put("idC", node.get("idC").asText());
		newNode.put("type", node.get("type").asText());
		for(WebSocketSession participant : sessions.values()) {
			if(participant.getId().equals(node.get("id").asText())) {
				participant.sendMessage(new TextMessage(newNode.toString()));
			}
		}
		session.sendMessage(new TextMessage(newNode.toString()));
		System.out.println("Message send: " + newNode.toString());
	}
	
	//mensaje de objeto cogido
	private void sendRecolectedCake(WebSocketSession session, JsonNode node) throws IOException{
		ObjectNode newNode = mapper.createObjectNode();
		newNode.put("type", node.get("type").asText());
		newNode.put("idCake", node.get("cake").asText());
		for(WebSocketSession participant : sessions.values()) {
			if(participant.getId().equals(node.get("id").asText())) {
				participant.sendMessage(new TextMessage(newNode.toString()));
			}
		}
		System.out.println("Message send: " + newNode.toString());
	}
	
	//mensaje de objeto cogido
	private void sendRecolectedCoffee(WebSocketSession session, JsonNode node) throws IOException{
		ObjectNode newNode = mapper.createObjectNode();
		newNode.put("type", node.get("type").asText());
		newNode.put("idCoffee", node.get("coffee").asText());
		for(WebSocketSession participant : sessions.values()) {
			if(participant.getId().equals(node.get("id").asText())) {
				participant.sendMessage(new TextMessage(newNode.toString()));
			}
		}
		System.out.println("Message send: " + newNode.toString());
	}
	
	//mensaje de objeto cogido
	private void sendRecolectedCookie(WebSocketSession session, JsonNode node) throws IOException{
		ObjectNode newNode = mapper.createObjectNode();
		newNode.put("type", node.get("type").asText());
		newNode.put("idCookie", node.get("cookie").asText());
		for(WebSocketSession participant : sessions.values()) {
			if(participant.getId().equals(node.get("id").asText())) {
				participant.sendMessage(new TextMessage(newNode.toString()));
			}
		}
		System.out.println("Message send: " + newNode.toString());
	}
	
	//envía los puntos al otro jugador //solo del cliente al host de la partida
	private void sendPointsPlayer(WebSocketSession session, JsonNode node)throws IOException{
		ObjectNode newNode = mapper.createObjectNode();
		newNode.put("type", node.get("type").asText());
		newNode.put("points", node.get("points").asText());
		for(WebSocketSession participant : sessions.values()) {
			if(participant.getId().equals(node.get("id").asText())) {
				participant.sendMessage(new TextMessage(newNode.toString()));
			}
		}
		System.out.println("Message send: " + newNode.toString());
	}
	
	//envía la posición al otro jugador
	private void sendPlayerPosition(WebSocketSession session, JsonNode node) throws IOException{
		ObjectNode newNode = mapper.createObjectNode();
		newNode.put("x", node.get("x").asText());
		newNode.put("y", node.get("y").asText());
		newNode.put("type", node.get("type").asText());
		
		for(WebSocketSession participant : sessions.values()) {
			if(participant.getId().equals(node.get("id").asText())) {
				participant.sendMessage(new TextMessage(newNode.toString()));
			}
		}
		System.out.println("Message send: " + newNode.toString());
	}
	
	//sincronización del tiempo de partida //solo desde el host al cliente
	private void sendGameTime(WebSocketSession session, JsonNode node)throws IOException {
		ObjectNode newNode = mapper.createObjectNode();
		newNode.put("type", node.get("type").asText());
		newNode.put("tiempo", node.get("tiempo").asText());
		for(WebSocketSession participant : sessions.values()) {
			if(participant.getId().equals(node.get("id").asText())) {
				participant.sendMessage(new TextMessage(newNode.toString()));
			}
		}
		System.out.println("Message send: " + newNode.toString());
	}
	
	//envía a ambos jugadores el ganador de la partida
	private void sendWinner(WebSocketSession session, JsonNode node)throws IOException{
		ObjectNode newNode = mapper.createObjectNode();
		newNode.put("type", node.get("type").asText());
		newNode.put("winner", node.get("winner").asText());
		for(WebSocketSession participant : sessions.values()) {
			if(participant.getId().equals(node.get("id").asText())) {
				participant.sendMessage(new TextMessage(newNode.toString()));
			}
		}
		session.sendMessage(new TextMessage(newNode.toString()));
		System.out.println("Message send: " + newNode.toString());
	}


}
