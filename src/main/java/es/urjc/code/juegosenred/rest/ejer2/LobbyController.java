package es.urjc.code.juegosenred.rest.ejer2;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LobbyController {

	@Autowired
	private JdbcTemplate jdbcTemplate;
	
	@GetMapping
	@RequestMapping("/lobby/{codigo}")
	public Lobby getLobbyInfo(@PathVariable int codigo) {
		int numUsuarios = jdbcTemplate.queryForObject("Select NumeroConexiones from lobby where Codigo = ?",
				new Object[] {codigo}, Integer.class);
		int numActivos = jdbcTemplate.queryForObject("Select NumeroPreparados from lobby where Codigo = ?",
				new Object[] {codigo}, Integer.class);
		String id_J1 = jdbcTemplate.queryForObject("Select Id_J1 from lobby where Codigo = ?",
				new Object[] {codigo}, String.class);
		String id_J2 = jdbcTemplate.queryForObject("Select Id_J2 from lobby where Codigo = ?",
				new Object[] {codigo}, String.class);
		Lobby lobby = new Lobby(codigo,numUsuarios,numActivos,id_J1,id_J2);
		return lobby;
	}
	
	@PutMapping
	@RequestMapping("/conectar")
	public ResponseEntity<String> conectarseLobby(@RequestBody Lobby lobby){
		int numUsuarios = jdbcTemplate.queryForObject("Select NumeroConexiones from lobby where Codigo = ?",
				new Object[] {lobby.getCodigo()}, Integer.class);
		if(numUsuarios < 2) {
			String sql = "Update lobby set NumeroConexiones = ? where Codigo = ?";
			jdbcTemplate.update(sql,numUsuarios+1,lobby.getCodigo());
			if(lobby.getIdP1().equals("")) {
				String sql1 = "Update lobby set Id_J2 = ? where Codigo = ?";
				jdbcTemplate.update(sql1,lobby.getIdP2(),lobby.getCodigo());
			}else {
				String sql2 = "Update lobby set Id_J1 = ? where Codigo = ?";
				jdbcTemplate.update(sql2,lobby.getIdP1(),lobby.getCodigo());
			}
			return new ResponseEntity<String>("Ingresado a Lobby",HttpStatus.ACCEPTED);
		}else {
			return new ResponseEntity<String>("Lobby completo",HttpStatus.BAD_REQUEST);
		}
	}
	
	@RequestMapping(value = "/activo", method = RequestMethod.PUT)
	public ResponseEntity<String> listoEmpezar(@RequestBody Lobby lobby){
		int numUsuarios = jdbcTemplate.queryForObject("Select NumeroPreparados from lobby where Codigo = ?",
				new Object[] {lobby.getCodigo()}, Integer.class);
		if(numUsuarios < 2) {
			String sql = "Update lobby set NumeroPreparados = ? where Codigo = ?";
			jdbcTemplate.update(sql,numUsuarios+1,lobby.getCodigo());
			return new ResponseEntity<String>("Estas Preparado",HttpStatus.ACCEPTED);
		}else {
			return new ResponseEntity<String>("Todos Preparados",HttpStatus.BAD_REQUEST);
		}
	}
	
	@PostMapping
	@RequestMapping("/lobby")
	@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<String> crearLobby(@RequestBody Lobby lobby){
		String sql = "INSERT INTO lobby values (?,?,?,?,?)";
		jdbcTemplate.update(sql, lobby.getCodigo(), 1, 0,lobby.getIdP1(),lobby.getIdP2());
		return new ResponseEntity<String>("Lobby Creado",HttpStatus.CREATED);
	}
	
}
