package es.urjc.code.juegosenred.rest.ejer2;
import java.sql.Timestamp;
import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/mensajes")
public class ChatController {
ArrayList<String> listaMensajes = new ArrayList<String>();
	
	@Autowired
	private JdbcTemplate jdbcTemplate;
	
	//Statement query;
	//ResultSet queryResult;
	
	@GetMapping
	public ArrayList<String> mensajes(){
		/*
		List<String> mensajes = this.jdbcTemplate.queryForList(
				"SELECT * FROM chat ORDER BY Fecha DESC LIMIT 10", 
		        new Object[]{}, String.class);
		//listaMensajes.add(mensajes);
		listaMensajes.add();
		
		
		System.out.println(listaMensajes);
		/* consulta = "select * from chat order by fecha desc limit 10"
		 * listaMensajes.add(consulta)
		 */
		
		listaMensajes.clear();
		
		List<Map<String, Object>> mensajes = jdbcTemplate.queryForList("SELECT * FROM chat ORDER BY Fecha DESC LIMIT 10");

        for (Map<String, Object> mensaje : mensajes) {
        	
        	listaMensajes.add("[" + Timestamp.valueOf(String.valueOf(mensaje.get("Fecha"))) + "] " + String.valueOf(mensaje.get("Usuario")) + ": " + String.valueOf(mensaje.get("Mensaje")) + "<br>");
        }
		return listaMensajes;
	}
	
	
	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<String> nuevoMensaje(@RequestBody Chat mensaje){
		
		Date date = new Date();
		
		String sql = "INSERT INTO chat (Fecha, Usuario, Mensaje) VALUES (?,?,?)";
		jdbcTemplate.update(sql, new Timestamp(date.getTime()), mensaje.getNombreUsuario(),mensaje.getTexto());
		// "insert into chat(fecha,usuario,texto) values (fechaActual, nombreUsuario,mensaje)
		return new ResponseEntity<String>("Mensaje enviado",HttpStatus.CREATED);
	}
}
