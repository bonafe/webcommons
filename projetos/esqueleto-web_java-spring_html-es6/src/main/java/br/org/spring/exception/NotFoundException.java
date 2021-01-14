package br.org.spring.exception;

public class NotFoundException extends RuntimeException {

	private static final long serialVersionUID = -2592037402265544956L;

	public NotFoundException(Long id) {
	    super("Objeto nao encontrado " + id);
	  }
}