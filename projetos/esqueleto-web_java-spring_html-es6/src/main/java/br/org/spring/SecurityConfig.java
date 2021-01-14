package br.org.spring;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;

import br.org.spring.dao.base.ModuloRepository;
import br.org.spring.dao.base.PermissaoRepository;
import br.org.spring.dao.base.UsuarioRepository;
import br.org.spring.model.base.Modulo;
import br.org.spring.model.base.Permissao;
import br.org.spring.model.base.Usuario;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(securedEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {
	
	
	
	@Autowired
	private UsuarioRepository repositorio;
	
	@Autowired
	private PermissaoRepository repositorioPermissao;
	
	@Autowired
	private ModuloRepository repositorioModulo;
	
	
	
 
    @Override
    protected void configure(HttpSecurity http) throws Exception {   	
        http.csrf().disable().authorizeRequests()
                .anyRequest().authenticated().and()
                .x509()
                    .subjectPrincipalRegex("CN=(.*?)(?:,|$)")
                    .userDetailsService(userDetailsService());
        
        //TODO: verificar se pode ficar aqui ou precisa de profile específico
        http.headers().frameOptions().disable();
    }
 
    @Bean
    public UserDetailsService userDetailsService() {

    	return (UserDetailsService) username -> {
    		String cpf = username.split(":")[1];
    		Usuario usuario = repositorio.findByCpf(cpf);
    		
    		//Caso o usuário exista no banco
            if (usuario != null) {
            	
            	//Cria um novo usuário com as permissões
                return new User(username, "",
                        AuthorityUtils
                                .commaSeparatedStringToAuthorityList(usuario.getPermissao()));
            	
            } else {
            	
            	//Se ainda não existem usuários no repositório
            	if (repositorio.count() == 0) {
            		            		
            		//Inicia a base de dados
            		this.iniciarBaseDeDados();
            		
            		//Concede acesso de administrador ao usuário atual
            		Usuario primeiroUsuario = this.criarPrimeiroUsuario(cpf);
            		
            		//Cria um novo usuário com as permissões
                    return new User(username, "",
                            AuthorityUtils
                                    .commaSeparatedStringToAuthorityList(primeiroUsuario.getPermissao()));
                    
            	}else {
            	
	            	//Se não existir no banco, cria um usuário sem permissões
	            	return new User(username, "",
	                         AuthorityUtils
	                                 .commaSeparatedStringToAuthorityList(""));
            	}
            }
        };
    }
    
        
    private void iniciarBaseDeDados() {
    	    	    	
    	
    	Modulo sistema = this.repositorioModulo.findByNome("Sistema");    	
    	if (sistema == null) {
    		sistema = new Modulo();
    		sistema.setNome("Sistema");
    		sistema.setDescricao("Módulo responsável pelos usuários, permissões e configurações base do sistema");
    		this.repositorioModulo.saveAndFlush(sistema);
    	}		
		
					
		Permissao administrador = this.repositorioPermissao.findByNome("SISTEMA_ADMINISTRADOR");		
		if (administrador == null) {
			administrador = new Permissao();				
			administrador.setNome("SISTEMA_ADMINISTRADOR");
			administrador.setDescricao("Permite a manutenção das tabelas base do sistema");
			administrador.setModulo(this.repositorioModulo.findByNome("Sistema"));		
			this.repositorioPermissao.saveAndFlush(administrador);
		}
			
		
		Permissao cadastrador = this.repositorioPermissao.findByNome("SISTEMA_CADASTRADOR");
		if (cadastrador == null) {
			cadastrador = new Permissao();			
			cadastrador.setNome("SISTEMA_CADASTRADOR");
			cadastrador.setDescricao("Permite o cadastrado de usuários e permissões");		
			cadastrador.setModulo(this.repositorioModulo.findByNome("Sistema"));					
			this.repositorioPermissao.saveAndFlush(cadastrador);				
		}
    }
    
    
    private Usuario criarPrimeiroUsuario(String cpf) {
    					
		//Cria novo usuário com o cpf e as permissões
		Usuario novoUsuario = new Usuario();
		novoUsuario.setCpf(cpf);
		novoUsuario.setPermissoes(new ArrayList<Permissao>());
		novoUsuario.getPermissoes().add(this.repositorioPermissao.findByNome("SISTEMA_ADMINISTRADOR"));
		novoUsuario.getPermissoes().add(this.repositorioPermissao.findByNome("SISTEMA_CADASTRADOR"));
				
		try {
			repositorio.saveAndFlush(novoUsuario);
		}catch(Exception ex) {
			ex.printStackTrace();
		}
		
		return novoUsuario;
    }
 
}