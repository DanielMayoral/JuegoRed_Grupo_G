package paquete;

import java.sql.Timestamp;

public class Chat {
	private String texto;
	private String nombreUsuario;
	private Timestamp fechaMensaje;
	
	
	public Chat() {
	}
	
	//getter y setter
	public String getTexto() {
		return texto;
	}
	
	public void setTexto(String texto) {
		this.texto = texto;
	}
	
	public String getNombreUsuario() {
		return nombreUsuario;
	}
	
	public void setNombreUsuario(String nombreUsuario) {
		this.nombreUsuario = nombreUsuario;
	}
	
	public Timestamp getFechaMensaje() {
		return fechaMensaje;
	}
	
	public void setFechaMensaje(Timestamp fechaMensaje) {
		this.fechaMensaje = fechaMensaje;
	}
}