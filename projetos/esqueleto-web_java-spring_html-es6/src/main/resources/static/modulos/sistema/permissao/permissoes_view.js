


import { PermissaoService } from './permissao_service.js';



export class PermissoesView extends HTMLElement{



    static _template = undefined;

	static get TEMPLATE (){

		if (PermissoesView._template == undefined){
			PermissoesView._template = document.createElement('template');

			PermissoesView._template.innerHTML = `
			    <!-- Tema Bootstrap -->
                <script src='/bibliotecas/bootstrap-4.5.3-dist/js/bootstrap.min.js'></script>
	            <link rel='stylesheet' href = '/bibliotecas/bootstrap-4.5.3-dist/css/bootstrap.min.css'>
	            <!-- TODO: não está funcionando o carregamento do script do tabulator dentro desse objeto, está carregando global-->
                <script type="text/javascript" src="/bibliotecas/tabulator/js/tabulator.min.js"></script>
	            <link href="/bibliotecas/tabulator/css/tabulator_modern.min.css" rel="stylesheet">
	            <div id="divElementos" style="width:100%; height:100%;">
                    <div id="divElementosExcetoTabela">
                        <button type="button" class='btn btn-primary'>Nova Permissão</button>
                    </div>
                    <div id="divTabela"></div>
                </div>
	        `;
	        }
		return PermissoesView._template;
	}



	constructor (){
		super();
        this._shadowRoot = this.attachShadow({mode: 'open'});
		this._shadowRoot.appendChild(PermissoesView.TEMPLATE.content.cloneNode(true));

        this.divElementos = this._shadowRoot.querySelector("#divElementos");
        this.divElementosExcetoTabela = this._shadowRoot.querySelector("#divElementosExcetoTabela");
        this.divTabela = this._shadowRoot.querySelector("#divTabela");

         this._shadowRoot.querySelector("button").addEventListener("click", ()=>{
            this.novaPermissao();
        });
	}


    atualizar(permissao){
        if (permissao.id == -1){
            this.tabela.addData([permissao]);
        }else{
            this.tabela.updateData([permissao]);
        }
        this.dispatchEvent(new Event("change"));
    }


    set permissoes (permissoes){
        this._permissoes = permissoes;
        this.apresentarTabela();
    }



    get permissoes(){
        return (this.tabela != null? this.tabela.getData(): null);
    }


    novaPermissao(){
        this.dispatchEvent(new CustomEvent("novaPermissao", {detail:PermissaoService.INSTANCE.criar()}));
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


     removerPermissao(permissao){
        PermissaoService.INSTANCE.removerPermissao(permissao)
         .then(()=>{
                alert('Permissão removida com sucesso!');
                this.trazerPermissoes();
            });
    }


    selecionou(permissao){
        this.dispatchEvent(new CustomEvent("novaPermissao", {detail:permissao}));
    }


    apresentarTabela () {

    	let referencia = this;

    	this.limparTabela();

    	this.tabela = new Tabulator(this.divTabela, {
            height:`${this.altura-50}px`,
            width: "100%",
    		index:"id",
    	    layout:"fitColumns",
    	    data:this._permissoes,
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
		        {column:"nome", dir:"asc"},
    		],
    	    columns:[
				{
			 		title:"Título Permissao",
			 		field:"nome",
			 		width:100,
			 		headerFilter:"input",
			 		headerFilterPlaceholder : "..."
			 	},
			 	{
			 		title:"Descrição",
			 		field:"descricao",
			 		width:300,
			 		headerFilter:"input",
			 		headerFilterPlaceholder : "..."
			 	},
			 	{
			 		title: "Botões",
			 		field: "",
			 		width:100,
			 		hozAlign:"center",
			 		formatter:function(cell, formatterParams, onRendered){
			 		    return '<button type="button" class="btn btn-danger" disabled>Desativar</button>';
			 		},
			 		hozAlign:"center",
			 		cellClick:function(e, cell){
			 			let permissao = cell.getRow().getData();
			 			referencia.removerPermissao(permissao);
			 		}
			 	}
		 	],
    	});
    }



    limparTabela (){
		if (this.tabela != null){
			this.tabela.destroy();
			this.tabela = null;
		}
	}
}

window.customElements.define('permissoes-view', PermissoesView);