import { ServiceUtils } from '/WebCommonsRFB/service_utils.js'
import { ConfiguracaoService } from '/WebCommonsRFB/configuracao_service.js';

export class PermissaoService{



    static _instance = undefined;

    static get INSTANCE(){
        if (PermissaoService._instance == undefined){
        	PermissaoService._instance = new PermissaoService();
        }
        return PermissaoService._instance;
    }



    constructor(){
        this.baseUrl = ConfiguracaoService.INSTANCE.urlBase;
    }

    criar(){
        let permissao =  {
            id: -1,
            nome: "",
            descricao: ""
        };

        return permissao;
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
