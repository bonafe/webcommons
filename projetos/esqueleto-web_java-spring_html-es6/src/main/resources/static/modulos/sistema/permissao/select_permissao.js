import { ModuloService } from '../modulo/modulo_service.js';
import { SelectFromList } from '/WebCommonsRFB/select_from_list.js';

export class SelectPermissao extends SelectFromList{

    constructor(){
        super();
        this.setAttribute("campo-id","id");
        this.setAttribute("campo-descricao","nome");
    }


    set idModulo (novoIdModulo){
        this._idModulo = novoIdModulo;
        ModuloService.INSTANCE.permissoes(this._idModulo).then(permissoes => {
            this.render(permissoes);
        });
    }

    get idModulo(){
        return this._idModulo;
    }
}

window.customElements.define('select-permissao', SelectPermissao);