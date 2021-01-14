package br.org.spring.model.base;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.CascadeType;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;

@Data
@Entity
public class Permissao {
	
	  private @Id @GeneratedValue Long id;
	  
	  private String nome;
	  private String descricao;
	  
	  @JsonIgnore	  
	  @ManyToMany (cascade = CascadeType.DETACH, mappedBy="permissoes")
	  private List<Usuario> usuarios;
	  
	  @JsonProperty(access = Access.WRITE_ONLY)
	  @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.DETACH)
	  @JoinColumn(name="modulo_id")
	  private Modulo modulo;
}
