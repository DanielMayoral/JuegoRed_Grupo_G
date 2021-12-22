package es.urjc.code.juegosenred.rest.ejer2;


import java.sql.Timestamp;
import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;


@RestController
public class UserController {
	ArrayList<String> listaUsuarios = new ArrayList<String>();

	@Autowired
	private JdbcTemplate jdbcTemplate;

	public ArrayList<String> usuarios() {

		return listaUsuarios;
	}
	
	@PutMapping
	@RequestMapping("/putHS")
	public ResponseEntity<String> updateHighscore(@RequestBody User usuario){
		if (!usuario.getNombreUsuario().equals("Guest")) {
			String sql = "UPDATE users SET Highscore = ? WHERE Nombre = ?";
			jdbcTemplate.update(sql,usuario.getHighscore(), usuario.getNombreUsuario());
			return new ResponseEntity<String>("Highscore actualizado", HttpStatus.OK);
		} else {
			return new ResponseEntity<String>("Guest no tiene highscore", HttpStatus.BAD_REQUEST);
		}
	}

	@PutMapping
	@RequestMapping("/logout")
	public ResponseEntity<String> logOut(@RequestBody User usuario) {

		Date date = new Date();
		if (!usuario.getNombreUsuario().equals("Guest")) {
			String sql = "UPDATE users SET Conectada = 'F' WHERE Nombre = ?";
			jdbcTemplate.update(sql, usuario.getNombreUsuario());
			sql = "INSERT INTO chat (Fecha,Usuario,Mensaje) VALUES (?, ?, ?)";
			jdbcTemplate.update(sql, new Timestamp(date.getTime()), "System",
					usuario.getNombreUsuario() + " se ha desconectado");
			return new ResponseEntity<String>("Usuario desconectado", HttpStatus.OK);
		} else {
			return new ResponseEntity<String>("Guest no se puede desconectar", HttpStatus.BAD_REQUEST);
		}
	}

	@RequestMapping(value = "/signup", method = RequestMethod.POST)
	@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<String> singUp(@RequestBody User usuario) {
		usuarios();

		Date date = new Date();

		if (listaUsuarios.contains(usuario.getNombreUsuario())) {
			return new ResponseEntity<String>("Usuario ya existente", HttpStatus.BAD_REQUEST);
		} else {
			String sql = "INSERT INTO users (Nombre, Contraseña, Highscore, Conectada) VALUES (?,?,?,?)";
			jdbcTemplate.update(sql, usuario.getNombreUsuario(), usuario.getPassword(), 0, "T");
			sql = "INSERT INTO chat (Fecha,Usuario,Mensaje) VALUES (?, ?, ?)";
			jdbcTemplate.update(sql, new Timestamp(date.getTime()), "System",
					usuario.getNombreUsuario() + " se ha conectado");

			/*
			 * "insert into usuarios (usuario,password,conectado,highScore) values
			 * (nombreUsuario, passwordUsuario, 'T', 0) "insert into chat
			 * (fecha,usuario,texto) values (fechaActual,'', 'nombreUsuario conectado')
			 */

			return new ResponseEntity<String>("Usuario creado", HttpStatus.CREATED);
		}
	}

	@PostMapping
	@RequestMapping("/login")
	public ResponseEntity<String> logIn(@RequestBody User usuario) {

		usuarios();

		Date date = new Date();

		// String sql = "SELECT Contraseña FROM users WHERE Nombre = ? AND Contraseña =
		// ?";
		// jdbcTemplate.update(sql, usuario.getNombreUsuario(), usuario.getPassword());

		String compareUser = this.jdbcTemplate.queryForObject(
				"SELECT Contraseña FROM users WHERE Nombre = ? AND Contraseña = ?",
				new Object[] { usuario.getNombreUsuario(), usuario.getPassword() }, String.class);
		if (compareUser != null) {
			String sql = "UPDATE users SET Conectada = ? WHERE Nombre = ?";
			jdbcTemplate.update(sql, "T", usuario.getNombreUsuario());
			sql = "INSERT INTO chat (Fecha,Usuario,Mensaje) VALUES (?, ?, ?)";
			jdbcTemplate.update(sql, new Timestamp(date.getTime()), "System",
					usuario.getNombreUsuario() + " se ha conectado");
			return new ResponseEntity<String>("Usuario encontrado", HttpStatus.OK);
		} else {
			return new ResponseEntity<String>("Usuario no encontrado", HttpStatus.NOT_FOUND);
		}
	}

	@GetMapping
	@RequestMapping("/checkServer")
	public ResponseEntity<String> checkServer() {
		String check = this.jdbcTemplate.queryForObject("SELECT Conectada FROM users WHERE Nombre = 'System'",
				new Object[] {}, String.class);
		return new ResponseEntity<String>("Servidor en funcionamiento", HttpStatus.OK);
	}
	
	@GetMapping
	@RequestMapping("/highscore/{username}")
	public int checkHighscore(@PathVariable String username){
		int highscore = this.jdbcTemplate.queryForObject("SELECT Highscore FROM users WHERE Nombre = ?",
				new Object[] {username}, Integer.class);
		return highscore;
	}
}
