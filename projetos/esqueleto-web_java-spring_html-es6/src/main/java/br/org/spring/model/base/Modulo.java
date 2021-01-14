package br.org.spring.model.base;



import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import lombok.Data;



@Data
@Entity
public class Modulo {
	
	  private @Id @GeneratedValue Long id;

	  private String nome;
	  private String descricao;  
	  	  	  
	  @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, mappedBy = "modulo")
	  private List<Permissao> permissoes;
}
