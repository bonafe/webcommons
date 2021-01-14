export class RFBUtils{

    static dataHoraDeISO8601_UTC(stringISO8601){
        return new Date(stringISO8601).toLocaleString([],{dateStyle:"short", timeStyle:"short", timeZone:"UTC"});
    }

    static dataDeISO8601_UTC(stringISO8601){
        return new Date(stringISO8601).toLocaleString([],{dateStyle:"short", timeZone:"UTC"});
    }

    static dateInputFormatDeISO8601_UTC(stringISO8601){
        return new Date(stringISO8601).toISOString().slice(0,10);
    }
}
