import { JAN, FEB, MAR, APR, MAI, JUN, JUL, AUG, SEP, OCT, NOV, DEC } from "../utils/dates";

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
                return FEB
            case 3:
                return MAR
            case 4:
                return APR
            case 5:
                return MAI
            case 6:
                return JUN
            case 7:
                return JUL
            case 8:
                return AUG
            case 9:
                return SEP
            case 10:
                return OCT
            case 11:
                return NOV
            case 12:
                return DEC
            default:
                break;
        }
    }
}