


import { ModuloService } from './modulo_service.js';



export class ModulosView extends HTMLElement{



    static _template = undefined;

	static get TEMPLATE (){

		if (ModulosView._template == undefined){
			ModulosView._template = document.createElement('template');

			ModulosView._template.innerHTML = `
			    <!-- Tema Bootstrap -->
                <script src='/bibliotecas/bootstrap-4.5.3-dist/js/bootstrap.min.js'></script>
	            <link rel='stylesheet' href = '/bibliotecas/bootstrap-4.5.3-dist/css/bootstrap.min.css'>
	            <!-- TODO: não está funcionando o carregamento do script do tabulator dentro desse objeto, está carregando global-->
                <script type="text/javascript" src="/bibliotecas/tabulator/js/tabulator.min.js"></script>
	            <link href="/bibliotecas/tabulator/css/tabulator_modern.min.css" rel="stylesheet">
	            <div id="divElementos" style="width:100%; height:100%;">
                    <div id="divElementosExcetoTabela">
                        <button type="button" class='btn btn-primary'>Cadastrar</button>
                    </div>
                    <div id="divTabela"></div>
                </div>
	        `;
	        }
		return ModulosView._template;
	}



	constructor (){
		super();
        this._shadowRoot = this.attachShadow({mode: 'open'});
		this._shadowRoot.appendChild(ModulosView.TEMPLATE.content.cloneNode(true));

        this.divElementos = this._shadowRoot.querySelector("#divElementos");
        this.divElementosExcetoTabela = this._shadowRoot.querySelector("#divElementosExcetoTabela");
        this.divTabela = this._shadowRoot.querySelector("#divTabela");

        this._shadowRoot.querySelector("button").addEventListener("click", ()=>{
            this.novo();
        });

       this.listar();
	}



    set modulos (modulos){
        this._modulos = modulos;
    }



    get modulos(){
        return this._modulos;
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


     remover(modulo){
        ModuloService.INSTANCE.remover(modulo)
         .then(()=>{
                alert('Modulo removido com sucesso!');
                this.listar();
            });
    }


    listar(){
         ModuloService.INSTANCE.listar().then( modulos => {
            this.modulos = modulos;
            this.apresentarTabela();
        });
    }


    novo(){
        this.dispatchEvent (new CustomEvent ("exibirDetalhe",{detail:ModuloService.INSTANCE.criar()}));
    }



    atualizar(modulo){
        if (modulo.id == -1){
            ModuloService.INSTANCE.novo(modulo)
                .then(moduloAtualizado => {
                    //TODO: Não usar o listar pois puxa tudo de novo, mandar atualizar elemento no tabulator
                    this.listar();
                    alert ("Nova módulo cadastrado com sucesso!");
                })
                .catch(err => {
                    alert (`Não foi possível atualizar modulo: ${err}`);
                });
        }else{
            ModuloService.INSTANCE.atualizar(modulo)
                .then(moduloAtualizado => {
                    //TODO: Não usar o listar pois puxa tudo de novo, mandar atualizar elemento no tabulator
                    this.listar();
                    alert ("Módulo atualizado com sucesso!");
                })
                .catch(err => alert (`Não foi possível atualizar módulo: ${err}`));
        }
    }


    selecionou(modulo){
        ModuloService.INSTANCE.trazer(modulo.id).then(moduloCompleto => {
            this.dispatchEvent (new CustomEvent ("exibirDetalhe",{detail:moduloCompleto}));
        });
    }


    apresentarTabela () {

    	let referencia = this;

    	this.limparTabela();

    	this.tabela = new Tabulator(this.divTabela, {
            height:`${this.altura-50}px`,
            width: "100%",
    		index:"id",
    	    layout:"fitColumns",
    	    data:this.modulos,
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
			 		title:"Título Módulo",
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
			 		    return '<button type="button" class="btn btn-danger">Desativar</button>';
			 		},
			 		hozAlign:"center",
			 		cellClick:function(e, cell){
			 			let modulo = cell.getRow().getData();
			 			referencia.remover(modulo);
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

window.customElements.define('modulos-view', ModulosView);