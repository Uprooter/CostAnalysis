import Month from "./Month";

export default class YearMonth {
    month: Month;
    year: number;

    constructor(month: number, year: number) {
        this.month = new Month(month);
        this.year = year;
    }

    public getRestString(): string {
        if (this.month.displayNumber.toString().length === 1) {
            return "0" + this.month.displayNumber.toString() + "." + this.year;
        }
        return this.month.displayNumber.toString() + "." + this.year;
    }
}
