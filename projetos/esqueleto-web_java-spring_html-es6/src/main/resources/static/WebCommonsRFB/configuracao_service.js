export class ConfiguracaoService{



    static _instance = undefined;

    static get INSTANCE (){
        if (ConfiguracaoService._instance === undefined){
            ConfiguracaoService._instance = new ConfiguracaoService();
        }
        return ConfiguracaoService._instance;
    }



    constructor(){
    }



    set urlBase(urlBase){
        this._urlBase = urlBase;
    }



    get urlBase(){
        return this._urlBase;
    }
}