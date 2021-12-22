package es.urjc.code.juegosenred.rest.ejer2;

public class Lobby {

	private int codigo;
	private int numeroJugadores;
	private int numeroActivos;
	private String idP1;
	private String idP2;
	
	public Lobby(int codigo, int numeroJugadores, int numeroActivos, String idP1, String idP2) {
		this.codigo = codigo;
		this.numeroJugadores = numeroJugadores;
		this.numeroActivos = numeroActivos;
		this.idP1 = idP1;
		this.idP2 = idP2;
	}

	public int getCodigo() {
		return codigo;
	}
	public void setCodigo(int codigo) {
		this.codigo = codigo;
	}
	public int getNumeroJugadores() {
		return numeroJugadores;
	}
	public void setNumeroJugadores(int numeroJugadores) {
		this.numeroJugadores = numeroJugadores;
	}
	public int getNumeroActivos() {
		return numeroActivos;
	}
	public void setNumeroActivos(int numeroActivos) {
		this.numeroActivos = numeroActivos;
	}
	
	public String getIdP1() {
		return idP1;
	}
	
	public void setIdP1(String idP1) {
		this.idP1 = idP1;
	}
	
	public String getIdP2() {
		return idP2;
	}
	
	public void setIdP2(String idP2) {
		this.idP2 = idP2;
	}
		
	
}
