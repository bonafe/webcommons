

export class BindableHTMLElement extends HTMLElement{



    constructor(){
        super();

        this._state = undefined;
        this._shadowRoot = this.attachShadow({mode: 'open'});

        let script = document.createElement("script");
        script.src = "/bibliotecas/imask/imask.js";

        this._shadowRoot.appendChild(script);
    }


    get shadowRoot(){
        return this._shadowRoot;
    }


    set state(newState){
        //A função setTimeout irá garantir que o estado apenas será atribuido quando todos componentes tiverem sido criados
        setTimeout(() => {
            this.atualizarEstado(this._state, newState);
            this._state = newState;
        });
    }


    get state (){
        return this._state;
    }


    atualizar(){
        this.atualizarEstado(null, this._state)
    }


    atualizarEstado(estadoAtual, novoEstado){

        let elementos = this._shadowRoot.querySelectorAll("[data-bind]");
        elementos.forEach (elemento =>{


            let jsonDataBind = JSON.parse(elemento.dataset.bind);

            Object.entries(jsonDataBind).forEach (bindInfo => {

                const [propriedadeElemento, caminhoEstado] = bindInfo;

                let valorAtual = (estadoAtual == null? null: this.trazerValor(estadoAtual, caminhoEstado.split(".")));
                let novoValor = this.trazerValor(novoEstado, caminhoEstado.split("."));

                if (valorAtual != novoValor){

                    //textContent precisa ser acessado diretamente
                    if (propriedadeElemento.localeCompare("textContent") == 0){

                        elemento.textContent = novoValor;

                    //Outras propriedades podem ser utilizadas como chave
                    }else{
                        elemento[propriedadeElemento] = novoValor;
                    }
                }
            });
        });
    }



    trazerValor (objeto, caminhos){
        if (objeto === undefined){
            return undefined;
        }else{
            let caminhoDesteNivel = caminhos.shift();
            if (caminhos.length > 0){
                return this.trazerValor (objeto[caminhoDesteNivel], caminhos);
            }else{
                if (objeto !== null){
                    return objeto[caminhoDesteNivel];
                }else{
                    return null
                }
            }
        }
    }



    definirValor (objeto, caminhos, valor){
        let caminhoDesteNivel = caminhos.shift();
        if (caminhos.length > 0){
            this.definirValor (objeto[caminhoDesteNivel], caminhos, valor);
        }else{
            objeto[caminhoDesteNivel] = valor;
        }
    }



    connectedCallback(){

        //Processa a máscara
        this._shadowRoot.querySelectorAll("[data-mask]").forEach (elemento =>{

            //A mascara vem como JSON mas o IMask precisa que os valores Number (TODO: verificar outros casos) sejam transformados no tipo nativo
            let mascara = JSON.parse(elemento.dataset.mask);
            this.transformarMascara(mascara);
            IMask (elemento, mascara);
        });

        //Processa o data bind
        this._shadowRoot.querySelectorAll("[data-bind]").forEach (elemento =>{

            //TODO: escutando apenas change
            elemento.addEventListener("change",(event)=>{

                let jsonDataBind = JSON.parse(elemento.dataset.bind);

                Object.entries(jsonDataBind).forEach (bindInfo => {

                    const [propriedadeElemento, caminhoEstado] = bindInfo;

                    //Clona o estado atual
                    let novoEstado = JSON.parse(JSON.stringify(this._state));

                    this.definirValor(novoEstado, caminhoEstado.split("."), event.target[propriedadeElemento]);

                    //O change de um elemento pode repercurtir em outros
                    this.atualizarEstado(this._state, novoEstado);

                    this._state = novoEstado;
                });
            });
        });
    }


    transformarMascara(mascara){
        Object.keys(mascara).forEach (chave => {

            if (typeof mascara[chave] == "object"){

                this.transformarMascara(mascara[chave]);

            }else if (typeof mascara[chave] == "string"){

                if (mascara[chave].localeCompare("Number") == 0){
                    mascara[chave] = Number;
                }
            }
        });
    }


    disconnectedCallback(){
    }
}

window.customElements.define('bindable-html-element', BindableHTMLElement);