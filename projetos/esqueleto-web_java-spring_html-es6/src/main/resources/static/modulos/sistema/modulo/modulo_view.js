import { BindableHTMLElement } from '/WebCommonsRFB/bindable_html_element.js';
import { PermissoesView } from '../permissao/permissoes_view.js';


export class ModuloView extends BindableHTMLElement {



	static _template = undefined;
	
	static get TEMPLATE (){

		if (ModuloView._template == undefined){
			ModuloView._template = document.createElement('template');

			ModuloView._template.innerHTML = `
			    <!-- Tema Bootstrap -->
			    <link rel='stylesheet' href = '/bibliotecas/bootstrap-4.5.3-dist/css/bootstrap.min.css'>
			    <script src='/bibliotecas/bootstrap-4.5.3-dist/js/bootstrap.min.js'></script>
			    <!-- TODO: não está funcionando o carregamento do script do tabulator dentro desse objeto, está carregando global-->
                <script type="text/javascript" src="/bibliotecas/tabulator/js/tabulator.min.js"></script>
	            <link href="/bibliotecas/tabulator/css/tabulator_modern.min.css" rel="stylesheet">
	            <button type="button" class='btn btn-primary'>Salvar</button>
				<form>
					<div class="row">
						<div class="col-md-8">
							<div class='form-group'>
							    <label for="inputNome">Nome</label>
								<input type="text" id="inputNome" data-bind='{"value":"nome"}' class='form-control'></input>
							</div>
							<div class='form-group'>
							    <label for="inputDescricao">Descrição</label>
								<input type="text" id="inputDescricao" data-bind='{"value":"descricao"}' class='form-control'></input>
							</div>
							<permissoes-view data-bind='{"permissoes":"permissoes"}'>
							</permissoes-view>
                        </div>
		            </div>
				</form>
			`;
		}
		return ModuloView._template;
	}
	
	
	
	constructor (){
		super();

		super.shadowRoot.appendChild(ModuloView.TEMPLATE.content.cloneNode(true));

        let botaoSalvar = super.shadowRoot.querySelector("button");
		botaoSalvar.addEventListener("click", (evento) => {
		    this.dispatchEvent(new CustomEvent("atualizar", {detail:this.state}));
		});

		this.permissoes = super.shadowRoot.querySelector("permissoes-view");
		this.permissoes.addEventListener("novaPermissao", (evento) => {
		    this.dispatchEvent(new CustomEvent("exibirPermissao", {detail:evento.detail}));
		});
	}


    atualizarPermissao(permissao){
        this.permissoes.atualizar(permissao);
    }


	set state(newState){
	    super.state = newState;
	}



    get state(){
        return super.state;
    }
}

window.customElements.define('modulo-view', ModuloView);