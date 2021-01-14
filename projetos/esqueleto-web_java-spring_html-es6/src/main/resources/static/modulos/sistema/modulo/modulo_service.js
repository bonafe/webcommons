import { ServiceUtils } from '/WebCommonsRFB/service_utils.js'
import { ConfiguracaoService } from '/WebCommonsRFB/configuracao_service.js';

export class ModuloService{



    static _instance = undefined;

    static get INSTANCE(){
        if (ModuloService._instance == undefined){
        	ModuloService._instance = new ModuloService();
        }
        return ModuloService._instance;
    }



    constructor(){
        this.baseUrl = ConfiguracaoService.INSTANCE.urlBase;
    }

    criar(){
        return {
            id: -1,
            nome: "",
            descricao: ""
        };
    }


    permissoes(modulo_id){
        return ServiceUtils.fetchJSON(`${this.baseUrl}/modulo/${modulo_id}/permissoes`);
    }


    listar(){
        return ServiceUtils.fetchJSON(`${this.baseUrl}/modulo`);
    }

    trazer(id){
        return ServiceUtils.fetchJSON(`${this.baseUrl}/modulo/${id}`);
    }

    novo(modulo){
        return ServiceUtils.postJSON(`${this.baseUrl}/modulo`, modulo);
    }

    atualizar(modulo){
        for (let permissao in modulo.permissoes){
            modulo.permissoes[permissao].modulo = {id: modulo.id};
        }
        return ServiceUtils.putJSON(`${this.baseUrl}/modulo`, modulo);
    }

    remover(modulo){
        return ServiceUtils.deleteJSON(`${this.baseUrl}/modulo/${modulo.id}`, modulo);
    }
}
