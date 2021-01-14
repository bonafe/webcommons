import { ModuloService } from './modulo_service.js';
import { SelectFromList } from '/WebCommonsRFB/select_from_list.js';

export class SelectModulo extends SelectFromList{

    constructor(){
        super();
        this.setAttribute("campo-id","id");
        this.setAttribute("campo-descricao","nome");
        ModuloService.INSTANCE.listar().then(modulos => this.render(modulos));
    }
}

window.customElements.define('select-modulo', SelectModulo);