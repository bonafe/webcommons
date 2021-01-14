import { ServiceUtils } from '/WebCommonsRFB/service_utils.js';
import { ConfiguracaoService } from '/WebCommonsRFB/configuracao_service.js';

export class MenuView extends HTMLElement{


    static _template = undefined;

    static _id = 0;

    static async TEMPLATE (){

		if (MenuView._template == undefined){
			MenuView._template = document.createElement('template');
			MenuView._template.innerHTML = `
			    <!-- Tema Bootstrap>
			    <script src="/bibliotecas/jquery/jquery-3.3.1.min.js"></script>
			    <script src='/bibliotecas/bootstrap-4.5.3-dist/js/bootstrap.min.js'></script>
			    <link rel='stylesheet' href = '/bibliotecas/bootstrap-4.5.3-dist/css/bootstrap.min.css'-->
			    <nav class="navbar navbar-expand-lg">
			        <a class='navbar-brand' href='#'>WebAPP</a>
			    </nav>
			`;
		}
		return MenuView._template;
	}



    constructor(){
        super();

        MenuView.id++;
        this.id = "menu_view_" + MenuView.id;

        //this.container = container;
        this.container = this;

        MenuView.TEMPLATE().then(template => {
            let templateClone = template.content.cloneNode(true);
            templateClone.querySelector("nav").id = this.id;

           this.container.appendChild(templateClone);

            ServiceUtils.fetchJSON(this.getAttribute("src")).then( aplicacao =>{
                this.construirAplicacao(aplicacao);
            });
        });
    }



    construirAplicacao(aplicacao){

        let profile = "devlocal";
        if (aplicacao.informacoes.profile.indexOf("@") == -1){
            profile = aplicacao.informacoes.profile;
        }

        ConfiguracaoService.INSTANCE.urlBase = `https://${window.location.hostname}`;
        //ConfiguracaoService.INSTANCE.urlBase = aplicacao.api["urlBase_" + profile];

        let nav = this.querySelector("nav");
        let a = nav.querySelector("a");

        if (profile.indexOf("prod") != -1){
            nav.classList.add("navbar-dark");
            nav.classList.add("bg-dark");

        }else if (profile.indexOf("hom") != -1){
            nav.classList.add("navbar-light");
            nav.style.backgroundColor = "#26ba1c";
            a.innerHTML = "WebAPP (homologação)";

        }else if (profile.indexOf("devlocal") != -1){

            nav.classList.add("navbar-light");
            nav.style.backgroundColor = "#ffd900";
            a.innerHTML = "WebAPP (desenvolvimento LOCAL)";

        }else if (profile.indexOf("dev") != -1){

            nav.classList.add("navbar-light");
            nav.style.backgroundColor = "#fc7703";
            a.innerHTML = "WebAPP (desenvolvimento)";
        }

        let ulMenu = document.createElement("ul");
        ulMenu.classList.add("navbar-nav");
        ulMenu.classList.add("mr-auto");
        aplicacao.menus.forEach (itemMenu => this.criarMenu (ulMenu, itemMenu));
        this.container.querySelector(`#${this.id}`).appendChild(ulMenu);
    }



    criarMenu(elementoPai, itemMenu){
        let liItemMenu = document.createElement("li");
        if (itemMenu.filhos !== undefined){
            liItemMenu.classList.add ("nav-item");
            liItemMenu.classList.add ("dropdown");
            liItemMenu.innerHTML = `
                <a class='nav-link dropdown-toggle' data-toggle="dropdown" aria-haspopup="true" aria-expended="false" href='#'>${itemMenu.nome}</a>
                <div class='dropdown-menu'>
                </div>
            `;
            itemMenu.filhos.forEach (itemMenuFilho => {

                let linkAcao = document.createElement("a");
                linkAcao.href = "#";
                linkAcao.classList.add("dropdown-item");
                linkAcao.textContent = itemMenuFilho.nome;
                linkAcao.addEventListener("click", (evento) => {
                    this.clicouItemMenu (itemMenuFilho, evento);
                });

                if (itemMenuFilho.habilitado === "false"){
                    linkAcao.classList.add ("disabled");
                }

                liItemMenu.querySelector(".dropdown-menu").appendChild(linkAcao);
            });
        }else{
            liItemMenu.classList.add("nav-item");
            liItemMenu.innerHTML = `
                <a class='nav-link' href='#'>${itemMenu.nome}</a>
            `;

            if (itemMenu.habilitado === "false"){
                liItemMenu.classList.add ("disabled");
            }

            liItemMenu.querySelector("a").addEventListener("click", (evento) => {
                this.clicouItemMenu (itemMenu, evento);
            });
        }
        elementoPai.appendChild(liItemMenu);
    }



    clicouItemMenu(itemMenu, evento){
        this.dispatchEvent (new CustomEvent("clicouItemMenu", {detail: itemMenu}));
    }
}

window.customElements.define('menu-view', MenuView);