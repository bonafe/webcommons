package br.org.spring.controller.base;

import java.util.List;

import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import br.org.spring.dao.base.ModuloRepository;
import br.org.spring.dao.base.PermissaoRepository;
import br.org.spring.dao.base.UsuarioRepository;
import br.org.spring.exception.NotFoundException;
import br.org.spring.model.base.Modulo;
import br.org.spring.model.base.Permissao;
import br.org.spring.model.base.Usuario;



@RestController
public class UsuarioController {
		
	private final UsuarioRepository repository;
	private final PermissaoRepository repositoryPermissao;	
	private final ModuloRepository repositoryModulo;

	
	public UsuarioController(UsuarioRepository repository, PermissaoRepository repositoryPermissao, ModuloRepository repositoryModulo) {
		this.repository = repository;
		this.repositoryPermissao = repositoryPermissao;
		this.repositoryModulo = repositoryModulo;
	}

	
	@GetMapping("/usuario")
	List<Usuario> all() {
		return repository.findAll();		
	}

	@GetMapping("/usuario/{id}")
	Usuario buscarUsuario(@PathVariable Long id) {
		return repository.findById(id).orElseThrow(() -> new NotFoundException(id));
	}
	
	@GetMapping("/usuarioPorCpf/{cpf}")
	Usuario buscarUsuarioPorCpf(@PathVariable String cpf) {
		return repository.findByCpf(cpf);
	}

	@Secured("ROLE_SISTEMA_CADASTRADOR")
	@PostMapping("/usuario")
	Usuario novoUsuario(@RequestBody Usuario novoUsuario) {
		return repository.save(novoUsuario);
	}
	
	@Secured("ROLE_SISTEMA_CADASTRADOR")
	@PutMapping("/usuario/{id}")
	Usuario atualizarUsuario(@RequestBody Usuario usuario, @PathVariable Long id) {		
		return this.repository.save(usuario);
	}

	@Secured("ROLE_SISTEMA_CADASTRADOR")
	@DeleteMapping("/usuarios/{id}")
	void deletarUsuario(@PathVariable Long id) {
		repository.deleteById(id);
	}
	
	
	
	@GetMapping("/permissao")
	List<Permissao> permissoes() {
		return this.repositoryPermissao.findAll();		
	}
		
	@GetMapping("/permissao/{id}")
	Permissao buscarPermissao(@PathVariable Long id) {
		return this.repositoryPermissao.findById(id).orElseThrow(() -> new NotFoundException(id));
	}
	
	@Secured("ROLE_SISTEMA_ADMINISTRADOR")
	@PostMapping("/permissao")
	Permissao novaPermissao(@RequestBody Permissao novaPermissao) {
		return this.repositoryPermissao.save(novaPermissao);
	}
	
	@Secured("ROLE_SISTEMA_ADMINISTRADOR")
	@PutMapping("/permissao")
	Permissao atualizarPermissao(@RequestBody Permissao permissao) {
		return this.repositoryPermissao.save(permissao);
	}

	@Secured("ROLE_SISTEMA_ADMINISTRADOR")
	@DeleteMapping("/permissao/{id}")
	void deletarPermissao(@PathVariable Long id) {
		this.repositoryPermissao.deleteById(id);
	}
	
	
	
	@GetMapping("/modulo")
	List<Modulo> modulos() {
		return this.repositoryModulo.findAll();		
	}



	@GetMapping("/modulo/{id}")
	Modulo buscarModulo(@PathVariable Long id) {
		return this.repositoryModulo.findById(id).orElseThrow(() -> new NotFoundException(id));
	}
	
	
	@GetMapping("/modulo/{id}/permissoes")
	List<Permissao> buscarMPermissoes(@PathVariable Long id) {
		Modulo modulo = this.repositoryModulo.findById(id).orElseThrow(() -> new NotFoundException(id));
		return modulo.getPermissoes();
	}
	
	@Secured("ROLE_SISTEMA_ADMINISTRADOR")
	@PostMapping("/modulo")
	Modulo novoModulo(@RequestBody Modulo novo) {
		return this.repositoryModulo.save(novo);
	}
	
	@Secured("ROLE_SISTEMA_ADMINISTRADOR")
	@PutMapping("/modulo")
	Modulo atualizarModulo(@RequestBody Modulo modulo) {		
		return this.repositoryModulo.save(modulo);
	}

	@Secured("ROLE_SISTEMA_ADMINISTRADOR")
	@DeleteMapping("/modulo/{id}")
	void deletarModulo(@PathVariable Long id) {
		this.repositoryModulo.deleteById(id);
	}
}