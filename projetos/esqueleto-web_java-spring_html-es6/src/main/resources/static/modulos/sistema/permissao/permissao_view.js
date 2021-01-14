import { BindableHTMLElement } from '/WebCommonsRFB/bindable_html_element.js';


export class PermissaoView extends BindableHTMLElement {



	static _template = undefined;
	
	static get TEMPLATE (){

		if (PermissaoView._template == undefined){
			PermissaoView._template = document.createElement('template');

			PermissaoView._template.innerHTML = `
			    <!-- Tema Bootstrap -->
			    <link rel='stylesheet' href = '/bibliotecas/bootstrap-4.5.3-dist/css/bootstrap.min.css'>
			    <script src='/bibliotecas/bootstrap-4.5.3-dist/js/bootstrap.min.js'></script>
			    <!-- TODO: não está funcionando o carregamento do script do tabulator dentro desse objeto, está carregando global-->
                <script type="text/javascript" src="/bibliotecas/tabulator/js/tabulator.min.js"></script>
	            <link href="/bibliotecas/tabulator/css/tabulator_modern.min.css" rel="stylesheet">
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
                        </div>
		            </div>    
                    <button type="button" class='btn btn-primary' id='btnSalvar'>Salvar</button>
				</form>
			`;
		}
		return PermissaoView._template;
	}
	
	
	
	constructor (){
		super();

		super.shadowRoot.appendChild(PermissaoView.TEMPLATE.content.cloneNode(true));

		super.shadowRoot.querySelector("#btnSalvar").addEventListener("click", (evento) => {
		    this.dispatchEvent(new CustomEvent("atualizarPermissao", {detail:this.state}));
		});
	}



	set state(newState){
	    super.state = newState;
	}



    get state(){
        return super.state;
    }
}

window.customElements.define('permissao-view', PermissaoView);