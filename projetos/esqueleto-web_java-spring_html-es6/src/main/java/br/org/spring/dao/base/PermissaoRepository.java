package br.org.spring.dao.base;

import org.springframework.data.jpa.repository.JpaRepository;

import br.org.spring.model.base.Permissao;

/**
 * 
 * Repositório para tratamento de permissões do sistema.
 * 
 * 
 *
 */
public interface PermissaoRepository extends JpaRepository<Permissao, Long> {	
	
	public Permissao findByNome(String nome);
}