package br.org.spring.model.base;



import java.util.ArrayList;
import java.util.List;


import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;


import javax.persistence.JoinColumn;

import lombok.Data;



@Data
@Entity
public class Usuario {
	
	  private @Id @GeneratedValue Long id;

	  private String cpf;	  	  	 
	  
	  @ManyToMany(cascade = CascadeType.DETACH, fetch = FetchType.EAGER)
	  @JoinTable(
		  name = "permissao_usuario", 
		  joinColumns = { @JoinColumn(name = "usuario_id")}, 
		  inverseJoinColumns = { @JoinColumn(name = "permissao_id")})
	  private List<Permissao> permissoes;
	  	  	  
	  
	  public String getPermissao() {
		  List<String> lstPermissoes = new ArrayList<String>();
		  for (Permissao permissao: this.permissoes) {
			  lstPermissoes.add("ROLE_" + permissao.getNome());
		  }
		  String strPermissao = String.join(",", lstPermissoes); 
		  return strPermissao;
	  }
}
