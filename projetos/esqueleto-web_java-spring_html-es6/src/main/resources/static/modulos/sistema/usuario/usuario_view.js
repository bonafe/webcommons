import { BindableHTMLElement } from '/WebCommonsRFB/bindable_html_element.js';
import { SelectModulo } from '../modulo/select_modulo.js';
import { SelectPermissao } from '../permissao/select_permissao.js';
import { PermissaoService } from '../permissao/permissao_service.js';



export class UsuarioView extends BindableHTMLElement {



	static _template = undefined;
	
	static get TEMPLATE (){

		if (UsuarioView._template == undefined){
			UsuarioView._template = document.createElement('template');

			UsuarioView._template.innerHTML = `
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
							    <label for="inputCPF">CPF</label>
								<input type="text" id="inputCPF" data-bind='{"value":"cpf"}' class='form-control'></input>
							</div>
							<div class='form-group'>
							    <label for="inputNome">Nome</label>
								<input type="text" id="inputNome" data-bind='{"value":"funcionario.nomeCompleto"}' class='form-control'></input>
							</div>
							<div class='form-group'>
							    <label for="inputCargo">Cargo</label>
								<input type="text" id="inputCargo" data-bind='{"value":"funcionario.cargo.nomeReduzido"}' class='form-control'></input>
							</div>
							 <div class='form-group'>
                                <label for='selectModulo'>Módulo</label>
                                <select-modulo
                                    id='selectModulo'
                                    data-bind='{"value":"idModulo"}'></select-modulo>
                            </div>
                            <div class='form-group'>
                                <label for='selectPermissao'>Permissão</label>
                                <select-permissao
                                    id='selectPermissao'
                                    data-bind='{"idModulo":"idModulo", "value":"idPermissao"}'></select-permissao>
                                <button type='button' class='btn btn-secondary' id='btnAdicionarPermissao'>Adicionar Permissao</button>
                            </div>
                            <div class='form-group' id='divPermissoes'>
                            </div>
                        </div>
		            </div>    
                    <button type="button" class='btn btn-primary' id='btnSalvar'>Salvar</button>
				</form>
			`;
		}
		return UsuarioView._template;
	}
	
	
	
	constructor (){
		super();

		super.shadowRoot.appendChild(UsuarioView.TEMPLATE.content.cloneNode(true));

        super.shadowRoot.querySelector("#btnAdicionarPermissao").addEventListener("click", (evento) => {
            if (super.state.idPermissao !== null){
                PermissaoService.INSTANCE.permissao(super.state.idPermissao).then(permissao => {
                    if (super.state.permissoes === undefined){
                        super.state.permissoes = [];
                    }
                    super.state.permissoes.push(permissao);
		            this.atualizarPermissoes(super.state.permissoes);
                });
            }
		});

		super.shadowRoot.querySelector("#btnSalvar").addEventListener("click", (evento) => {
		    this.dispatchEvent(new CustomEvent("atualizar", {detail:this.state}));
		});
	}



	set state(newState){
	    super.state = newState;
	    if (newState !== undefined){
	        this.atualizarPermissoes(newState.permissoes);
	    }
	}



    get state(){
        return super.state;
    }


    atualizarPermissoes(permissoes){

        let divPermissoes = super.shadowRoot.querySelector("#divPermissoes");

        let innerHTML = '';
        permissoes.forEach(permissao => {
            innerHTML += `
                <span class="badge badge-info">
                    ${permissao.nome}
                    <button type="button" class="btn btn-danger" data-id='${permissao.id}'>-</button>
                </span>
            `;
        });
        divPermissoes.innerHTML = innerHTML;

        setTimeout(()=>{
            let botoes = divPermissoes.querySelectorAll("button");
            botoes.forEach(botao => {
                botao.addEventListener("click", (evento) =>{
                    let idPermissao = evento.target.dataset.id;
                    permissoes.findIndex((elemento, indice, array) =>{
                        if (elemento.id == idPermissao){
                            array.splice(indice, 1);
                            this.atualizarPermissoes(array);
                        }
                    });
                });
            });
        });
    }
}

window.customElements.define('usuario-view', UsuarioView);