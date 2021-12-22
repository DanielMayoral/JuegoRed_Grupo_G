package es.urjc.code.juegosenred.rest.ejer2;

public class User {
	private String nombreUsuario;
	private String password;
	private String conectado;
	private int highscore;
	
	public User() {
		
	}
	
	//getter y setter
	public String getNombreUsuario() {
		return nombreUsuario;
	}
	
	public void setNombreUsuario(String nombreUsuario) {
		this.nombreUsuario = nombreUsuario;
	}
	
	public String getPassword() {
		return password;
	}
	
	public void setPassword(String password) {
		this.password = password;
	}
	
	public String getConectado() {
		return conectado;
	}
	
	public void setconectado(String conectado) {
		this.conectado = conectado;
	}
	
	public int getHighscore() {
		return highscore;
	}
	
	public void setHighscore(int highscore) {
		this.highscore = highscore;
	}
}
