package br.org.spring.dao.base;

import org.springframework.data.jpa.repository.JpaRepository;

import br.org.spring.model.base.Modulo;

public interface ModuloRepository extends JpaRepository<Modulo, Long> {	
				
	public Modulo findByNome (String nome);
}