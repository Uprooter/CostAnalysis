export default class Page {

    static ROOT = new Page("Auswertung", "");
    static UPLOAD = new Page("Hochladen", 'upload');
    static ADMIN_DETAILED_CLUSTERS = new Page('Pflege Detail Typen', 'detailedclusters');


    private constructor(private _name: string, private _pathName: string) {

    }

    get name() {
        return this._name;
    }

    get pathName() {
        return "/" + this._pathName
    }

}