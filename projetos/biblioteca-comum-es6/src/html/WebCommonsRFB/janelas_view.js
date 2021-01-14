import { jsPanel } from "/bibliotecas/jspanel/jspanel.min.js";
import '/bibliotecas/jspanel/extensions/hint/jspanel.hint.min.js';
import '/bibliotecas/jspanel/extensions/modal/jspanel.modal.min.js';
import '/bibliotecas/jspanel/extensions/contextmenu/jspanel.contextmenu.min.js';
import '/bibliotecas/jspanel/extensions/tooltip/jspanel.tooltip.min.js';
import '/bibliotecas/jspanel/extensions/layout/jspanel.layout.min.js';
import '/bibliotecas/jspanel/extensions/dock/jspanel.dock.min.js';



export class JanelasView extends HTMLElement{



    static _template = undefined;

    static _id = 0;

    static get TEMPLATE (){

		if (JanelasView._template == undefined){
			JanelasView._template = document.createElement('template');
			JanelasView._template.innerHTML = `

			`;
		}
		return JanelasView._template;
	}



    constructor(){
        super();
        this.idPainel = 0;

        this._shadowRoot = this.attachShadow({mode: 'open'});
		this._shadowRoot.appendChild(JanelasView.TEMPLATE.content.cloneNode(true));

		this.adicionarComportamento();
    }



    adicionarComportamento(){

        document.addEventListener("jspanelresize", (evento) =>{
            this.efetuarRedimensionamentoPainel(evento);
        });

        document.addEventListener("jspanelresize", (evento) =>{
            this.efetuarRedimensionamentoPainel(evento);
        });

        document.addEventListener("jspanelloaded", (evento) =>{
            this.efetuarRedimensionamentoPainel(evento);
        });
    }


    efetuarRedimensionamentoPainel(evento){
        let elementoConteudoPainel = evento.panel.content.querySelector(":first-child");

        if (typeof elementoConteudoPainel.resize === "function"){
            elementoConteudoPainel.resize(evento.panel.style.width, evento.panel.style.height);
        }
    }



    async criarPainel(item, objetoDeDados){

        let modulo = await import (item.modulo);

        this.idPainel++;

        let elemento = document.createElement(item.componente);

        if (objetoDeDados !== undefined){
            elemento.state = objetoDeDados;
        }

        elemento.id = "painel_" + this.idPainel;

        let altura = window.innerHeight * 0.8;
        let largura = window.innerWidth* 0.8;

        let painel = jsPanel.create({
            theme:       'primary',
            headerTitle: item.nome,
            position:    'center-top 0 58',
            contentSize: largura + ' ' + altura,
            content:     elemento,
            contentOverflow: 'scroll',
            callback: function () {
                this.content.style.padding = '20px';
            }
        });

        if (typeof elemento.resize === "function"){
            elemento.resize(largura, altura);
        }


        if (item.navegacao !== undefined){
            item.navegacao.forEach(subitem =>{
                elemento.addEventListener (subitem.evento, (evento) => {
                    this.criarPainel (subitem, evento.detail).then( (elementoEPainel) => {
                        const [elementoDetalhe, painelDetalhe] = elementoEPainel;
                        elementoDetalhe.addEventListener(subitem.eventoRetorno, (eventoRetorno) => {
                            elemento[subitem.funcaoRetorno] (eventoRetorno.detail);
                            painelDetalhe.close();
                        });
                    });
                });
            });
        }

        return [elemento, painel];
    }
}

window.customElements.define('janelas-view', JanelasView);