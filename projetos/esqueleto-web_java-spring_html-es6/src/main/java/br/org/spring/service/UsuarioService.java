package br.org.spring.service;
   
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import br.org.spring.dao.base.UsuarioRepository;
import br.org.spring.model.base.Usuario;

@Service
public class UsuarioService {
	
	@Autowired
	private UsuarioRepository usuarioRepository;
	
    public Usuario getFuncionario() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Object myUser = (auth != null) ? auth.getPrincipal() :  null;
		UserDetails user = (UserDetails)myUser;		
		return usuarioRepository.findByCpf(user.getUsername().split(":")[1]);
    }
	

}
