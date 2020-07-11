import { JAN } from "../utils/dates";

export default class Month {
    name: string;
    number: number;
    displayNumber: number;

    constructor(displayNumber: number) {
        this.name = this.getNameForDisplayNumber(displayNumber);
        this.displayNumber = displayNumber;
        this.number = displayNumber - 1;
    }

    private getNameForDisplayNumber(displayNumber: number) {
        switch (displayNumber) {
            case 1:
                return JAN;
            case 2:
                return "Feb"
            case 3:
                return "Mar"
            case 4:
                return "Apr"
            case 5:
                return "Mai"
            case 6:
                return "Jun"
            case 7:
                return "Jul"
            case 8:
                return "Aug"
            case 9:
                return "Sep"
            case 10:
                return "Oct"
            case 11:
                return "Nov"
            case 12:
                return "Dec"
            default:
                break;
        }
    }
}