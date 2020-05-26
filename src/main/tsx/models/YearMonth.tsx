export default class YearMonth {
    month: number;
    year: number;

    constructor(month: number, year: number) {
        this.month = month;
        this.year = year;
    }

    public getRestString(): string {
        if (this.month.toString().length === 1) {
            return "0" + this.month.toString() + "." + this.year;
        }
        return this.month.toString() + "." + this.year;
    }
}
