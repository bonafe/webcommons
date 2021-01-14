//import { TileLayer, OSM, VectorSource, Map, View, Draw } from "/bibliotecas/openlayers/v6.4.3-dist/ol.js";

export class EditorPoligonoMapa extends HTMLElement{

    static URL_SERVIDOR_DE_MAPAS = "http://mapas.alfvcp.rf08.srf:8080/tile/{z}/{x}/{y}.png";



    static _template = undefined;

	static get TEMPLATE (){

		if (EditorPoligonoMapa._template == undefined){
			EditorPoligonoMapa._template = document.createElement('template');

			EditorPoligonoMapa._template.innerHTML = `
			    <!-- TODO: não estão funcionando a chamada dentro do componente, declarando global no momento mas deve ficar aqui -->
                <script src="/bibliotecas/openlayers/v6.4.3-dist/ol.js"></script>
                    <script>
                        //Mapeia imports do OpenLayers para poder usar os exemplos como no site (não usa ferramenta de build)
                        let Map                 = ol.Map;        //~ import Map from 'ol/Map.js';
                        let View                = ol.View;       //~ import View from 'ol/View.js';
                        let {easeIn, easeOut}   = ol.easing;     //~ import {easeIn, easeOut} from 'ol/easing.js';
                        let TileLayer           = ol.layer.Tile; //~ import TileLayer from 'ol/layer/Tile.js';
                        let {fromLonLat}        = ol.proj;       //~ import {fromLonLat} from 'ol/proj.js';
                        let OSM                 = ol.source.OSM; //~ import OSM from 'ol/source/OSM.js';
                        let VectorSource        = ol.source.Vector; //~ import VectorSource from 'ol/source/Vector';
                        let VectorLayer         = ol.source.Vector; //~ import VectorSource from 'ol/layer/Vector';
                        let Draw                = ol.interaction.Draw;
                    </script>
                    <link href="/bibliotecas/openlayers/v6.4.3-dist/ol.css" rel="stylesheet">
                <style>
                     :host { display: block }
                     .mapa{
                        width:100%;
                        height:100%;
                     }
                </style>
                <div class="mapa"></div>
            `;
        }
		return EditorPoligonoMapa._template;
	}

    constructor(){
        super();

        this.map = undefined;

        this._shadowRoot = this.attachShadow({mode: 'open'});

        this._shadowRoot.appendChild(EditorPoligonoMapa.TEMPLATE.content.cloneNode(true));

        this.containerMapa = this._shadowRoot.querySelector("div");

        this.geoJSON = undefined;

        setTimeout(()=>{
            this.criarMapa();
        });
    }
    
    
    
    resize(largura, altura){
        if (this.map != undefined){
            this.map.updateSize();
        }
    }
    
    

    criarMapa(){

        let raster = new ol.layer.Tile({
            source: new ol.source.XYZ({
                attributions: [
                ol.source.OSM.ATTRIBUTION,
                    'Tiles courtesy of ' +
                    '<a href="http://openstreetmap.org">' +
                    'OpenStreetMap' +
                    '</a>'
                ],
                url: EditorPoligonoMapa.URL_SERVIDOR_DE_MAPAS
             })
        });

        let source = new ol.source.Vector({wrapX: false});


        this.vector = new ol.layer.Vector({
            source: source,
        });

        this.map = new ol.Map({
            target: this.containerMapa ,
            layers:[raster, this.vector],
            view: new ol.View({
                center: ol.proj.fromLonLat([-47.1393573, -23.008176]),
                zoom: 15
             })
        });

        let draw = new ol.interaction.Draw({
            source: source,
            type: "Polygon",
        });

        draw.addEventListener("drawend", (event) =>{
            setTimeout(()=>{
                this.dispatchEvent(new Event("change"));
            });
        });

        this.map.addInteraction(draw);

        setTimeout(() =>{
            if (this.geoJSON !== undefined){
                this.carregarGeoJSON();
            }
            this.map.updateSize();
        }, 1000);
    }



    carregarGeoJSON(){
        this.vector.getSource().clear();
        let format = new ol.format.GeoJSON();
        this.vector.getSource().addFeatures(format.readFeatures(this.geoJSON));
    }

    limpar(){
        this.vector.getSource().clear();
        setTimeout(()=>{
            this.dispatchEvent(new Event("change"));
        });
    }


    get value (){
        if (this.vector !== undefined){
            let features = this.vector.getSource().getFeatures();
            let newForm = new ol.format.GeoJSON();
            this.geoJSON =  newForm.writeFeaturesObject(features);
            let geoJSONString = JSON.stringify(this.geoJSON);
            return geoJSONString;
        }else{
            return null;
        }
    }



    set value (value){
        this.geoJSON = JSON.parse(value);
        if (this.vector !== undefined){
            this.carregarGeoJSON();
        }
    }
}

window.customElements.define('editor-poligono-mapa', EditorPoligonoMapa);