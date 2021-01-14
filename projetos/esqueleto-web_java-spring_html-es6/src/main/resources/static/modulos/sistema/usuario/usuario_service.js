import { ServiceUtils } from '/WebCommonsRFB/service_utils.js'
import { ConfiguracaoService } from '/WebCommonsRFB/configuracao_service.js';

export class UsuarioService{



    static _instance = undefined;

    static get INSTANCE(){
        if (UsuarioService._instance == undefined){
        	UsuarioService._instance = new UsuarioService();
        }
        return UsuarioService._instance;
    }



    constructor(){
        this.baseUrl = ConfiguracaoService.INSTANCE.urlBase;
    }



    usuarios(){
        return ServiceUtils.fetchJSON(`${this.baseUrl}/usuario`);
    }

    usuario(idUsuario){
        return ServiceUtils.fetchJSON(`${this.baseUrl}/usuario/${idUsuario}`);
    }

    salvarUsuario(usuario){
        return ServiceUtils.postJSON(`${this.baseUrl}/usuario`, usuario);
    }

    atualizar(usuario){
        return ServiceUtils.putJSON(`${this.baseUrl}/usuario/${usuario.id}`, usuario);
    }



    permissoes(){
        return ServiceUtils.fetchJSON(`${this.baseUrl}/permissao`);
    }

    permissao(idPermissao){
        return ServiceUtils.fetchJSON(`${this.baseUrl}/permissao/${idPermissao}`);
    }

    salvarPermissao(permissao){
        return ServiceUtils.postJSON(`${this.baseUrl}/permissao`, permissao);
    }

    atualizarPermissao(permissao){
        return ServiceUtils.putJSON(`${this.baseUrl}/permissao/${permissao.id}`, permissao);
    }

    removerPermissao(permissao){
        return ServiceUtils.deleteJSON(`${this.baseUrl}/permissao/${permissao.id}`, permissao);
    }
}
