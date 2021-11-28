package paquete;

public class User {
	
	private String nombreUsuario;
	private String password;
	private String conectado;
	
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

}
