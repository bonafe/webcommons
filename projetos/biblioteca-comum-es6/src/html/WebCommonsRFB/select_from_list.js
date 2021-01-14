export class SelectFromList extends HTMLElement{



    constructor(){
        super();

        this._value = undefined;
        this.lista = undefined;

        setTimeout(() => {
            this.campoId = this.getAttribute("campo-id");
            this.campoDescricao = this.getAttribute("campo-descricao");
        });

        this._shadowRoot = this.attachShadow({'mode':'open'});

        this._shadowRoot.innerHTML = `
            <!-- Tema Bootstrap -->
            <link rel='stylesheet' href = '/bibliotecas/bootstrap-4.5.3-dist/css/bootstrap.min.css'>
		    <script src='/bibliotecas/bootstrap-4.5.3-dist/js/bootstrap.min.js'></script>
        `;

        this.criarSelect();
    }



    elementosLista(){
        return this.lista;
    }



    elementoAtual(){
        return this.lista.find (elemento => elemento[this.campoId] == this._value);
    }



    criarSelect(){
        this.select = document.createElement("select");

        //Tema bootstrap
        this.select.classList.add("form-control");

        this.select.addEventListener('change',() => {
            this._value = this.select.value;
            this.dispatchEvent (new Event('change'));
        });
        this._shadowRoot.appendChild(this.select);
    }



    limparElementos(){
        let options = this.select.querySelectorAll("option");
        options.forEach(elemento =>{
            this.select.removeChild(elemento);
        });
    }


    render(lista){

        this.lista = lista;

        this.limparElementos();


        //Notação especial da key entre [] para indicar que o nome da key é o conteúdo da variável
        let listaComPrimeiroElementoVazio =  [{[this.campoId]:-1, [this.campoDescricao]:""},...this.lista];


        listaComPrimeiroElementoVazio.forEach(elemento =>{
            let optionTipo = document.createElement("option");
            optionTipo.value = elemento[this.campoId];
            optionTipo.innerHTML = elemento[this.campoDescricao];
            this.select.appendChild(optionTipo);
        });

        //Caso o valor tenha sido definido antes da lista ser renderizada
        if (this._value !== undefined){

            //Atualiza o valor
            this.select.value = this._value;
            this.dispatchEvent (new Event('change'));
        }
    }



    set value (newValue){
    	this._value = newValue;

    	//Se a lista já foi renderizada
    	if (this.select !== null){

    	    //Atualiza o valor da lista
    	    this.select.value = this._value;
    	}
    }



    get value (){
        return this._value;
    }



    set disabled (disabled){
        this.select.disabled = disabled;
    }



     get disabled (){
        return this.select.disabled;
    }
}

window.customElements.define('select-from-list', SelectFromList);