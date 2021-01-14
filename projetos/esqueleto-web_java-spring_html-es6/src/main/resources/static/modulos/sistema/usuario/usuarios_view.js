


import { UsuarioService } from './usuario_service.js';



export class UsuariosView extends HTMLElement{



    static _template = undefined;

	static get TEMPLATE (){

		if (UsuariosView._template == undefined){
			UsuariosView._template = document.createElement('template');

			UsuariosView._template.innerHTML = `
			    <!-- Tema Bootstrap -->
                <script src='/bibliotecas/bootstrap-4.5.3-dist/js/bootstrap.min.js'></script>
	            <link rel='stylesheet' href = '/bibliotecas/bootstrap-4.5.3-dist/css/bootstrap.min.css'>
	            <!-- TODO: não está funcionando o carregamento do script do tabulator dentro desse objeto, está carregando global-->
                <script type="text/javascript" src="/bibliotecas/tabulator/js/tabulator.min.js"></script>
	            <link href="/bibliotecas/tabulator/css/tabulator_modern.min.css" rel="stylesheet">
	            <div id="divElementos" style="width:100%; height:100%;">
                    <div id="divElementosExcetoTabela">
                    </div>
                    <div id="divTabela"></div>
                </div>
	        `;
	        }
		return UsuariosView._template;
	}



	constructor (){
		super();
        this._shadowRoot = this.attachShadow({mode: 'open'});
		this._shadowRoot.appendChild(UsuariosView.TEMPLATE.content.cloneNode(true));

        this.divElementos = this._shadowRoot.querySelector("#divElementos");
        this.divElementosExcetoTabela = this._shadowRoot.querySelector("#divElementosExcetoTabela");
        this.divTabela = this._shadowRoot.querySelector("#divTabela");

        this.listar();
	}


    listar(){
        UsuarioService.INSTANCE.usuarios().then( usuarios => {
            this.usuarios = usuarios;
        });
    }


    set usuarios(usuarios){
        this._usuarios = usuarios;
        this.apresentarTabela();
    }



    get usuarios(){
        return this._usuarios;
    }



	resize(largura, altura){

	    this.largura = largura;
	    this.altura = altura;

        if (this.tabela != null){
            let styleElementos = window.getComputedStyle(this.divElementos);
            let styleElementosExcetoTabela = window.getComputedStyle(this.divElementosExcetoTabela);
            let alturaTabela = parseInt(styleElementos.height,10) - parseInt(styleElementosExcetoTabela.height,10);
            this.tabela.setHeight (alturaTabela);
        }
    }

    selecionou(usuario){
        this.dispatchEvent (new CustomEvent ("exibirDetalhe",{detail:usuario}));
    }


    atualizar(usuario){
        if (usuario.id == -1){
            UsuarioService.INSTANCE.novo(usuario)
                .then(usuarioAtualizado => {
                    this.tabela.updateData([usuarioAtualizado]);
                    alert ("Novo usuário cadastrado com sucesso!");
                })
                .catch(err => {
                    alert (`Não foi possível atualizar modulo: ${err}`);
                });
        }else{
            UsuarioService.INSTANCE.atualizar(usuario)
                .then(usuarioAtualizado => {
                    this.tabela.updateData([usuarioAtualizado]);
                    alert ("Usuário atualizado com sucesso!");
                })
                 .catch(err => {
                	console.dir(err);
                    alert (`Não foi possível atualizar usuário: ${err}`)
                });
        }
    }

    apresentarTabela () {

    	let referencia = this;

    	this.limparTabela();

    	this.tabela = new Tabulator(this.divTabela, {
            height:`${this.altura-50}px`,
            width: "100%",
    		index:"id",
    	    layout:"fitColumns",
    	    data:this.usuarios,
    	    pagination:"local",
    	    paginationSize:100,
    	    paginationSizeSelector:[25, 50, 100, 250],
    	    movableColumns:true,
			rowDblClick:function(e, row){
                if (row.getData().filhos === undefined){
                    referencia.selecionou(row.getData());
                }
            },
			initialSort:[
		        {column:"funcionario.nomeCompleto", dir:"asc"},
    		],
    	    columns:[
				{
			 		title:"CPF",
			 		field:"cpf",
			 		width:100,
			 		headerFilter:"input",
			 		headerFilterPlaceholder : "..."
			 	},
			 	{
			 		title:"Nome Completo",
			 		field:"funcionario.nomeCompleto",
			 		width:300,
			 		headerFilter:"input",
			 		headerFilterPlaceholder : "..."
			 	},
			 	{
			 		title:"Cargo",
			 		field:"funcionario.cargo.nomeReduzido",
			 		width:100,
			 		headerFilter:"input",
			 		headerFilterPlaceholder : "..."
			 	},
			 	{
			 		title:"Permissões",
			 		field:"permissao",
			 		width:140,
			 		headerFilter:"input",
			 		headerFilterPlaceholder : "...",
			 		headerFilterFunc: function (headerValue, rowValue, rowData, filterParams){
			 		    let permissoes = rowData.permissoes;
			 		    let existeString = permissoes.some(permissao => {
			 		        if (permissao.nome.toLowerCase().indexOf(headerValue.toLowerCase()) != -1){
			 		            return true;
			 		        }else{
			 		            return false;
			 		        }
			 		    });
			 		    return existeString;
			 		},
			 		formatter:function(cell, formatterParams, onRendered){
			 		    return referencia.renderizarPermissoes(cell.getData().permissoes);
			 		},
			 	}
		 	],
    	});
    }


    renderizarPermissoes(permissoes){
        let innerHTML = "";
        permissoes.forEach(permissao =>{
            innerHTML += `
                <span class="badge badge-info">
                    ${permissao.nome}
                </span>`;
        });
        return innerHTML;
    }


    limparTabela (){
		if (this.tabela != null){
			this.tabela.destroy();
			this.tabela = null;
		}
	}
}

window.customElements.define('usuarios-view', UsuariosView);