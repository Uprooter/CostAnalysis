import YearMonth from "../models/YearMonth";
import Month from "../models/Month";

export const JAN = "Jan";
export const FEB = "Feb";
export const MAR = "Mar";
export const APR = "Apr";
export const MAI = "Mai";
export const JUN = "Jun";
export const JUL = "Jul";
export const AUG = "Aug";
export const SEP = "Sep";
export const OCT = "Oct";
export const NOV = "Nov";
export const DEC = "Dec";

export function getDateString(date: Date): string {
    let options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return date.toISOString().replace(/(\d{4})\-(\d{2})\-(\d{2}).*/, '$3.$2.$1');
}

export function getDEDateString(date: Date): string {
    let shortDate = date.toString().substring(0, 10);
    let year = shortDate.substr(0, 4);
    let month = shortDate.substr(5, 2);
    let day = shortDate.substr(8, 2);
    return day + "." + month + "." + year;
}

export function getDashDateString(date: Date): string {
    return date.toISOString().substring(0, 10);
}

export function getYearMonthString(date: Date): string {
    return date.toLocaleString('default', { month: 'long' }) + " - " + date.getFullYear();
}

export function getDateWithLastDayOfSameMonth(date: Date): Date {
    let newDate = date;
    newDate.setMonth(date.getMonth() + 1);
    newDate.setDate(newDate.getDate()); //subtract a day
    return newDate;
}

export function parseISOString(dateString: string): Date {
    let newDate: Date = new Date();
    newDate.setMilliseconds(Date.parse(dateString));
    return newDate;
}

export function getOneYearBefore(date: Date): Date {
    let newDate = date;
    newDate.setFullYear(date.getFullYear() - 1);
    return newDate;
}

export function getOneMonthBefore(date: Date): Date {
    let newDate = date;
    newDate.setMonth(date.getMonth() - 1);
    return newDate;
}

export function getMonthsBefore(date: Date, months: number): Date {
    let newDate = date;
    newDate.setMonth(date.getMonth() - months);
    return newDate;
}

export function getOneMonthAfter(date: Date): Date {
    let newDate = date;
    newDate.setMonth(date.getMonth() + 1);
    return newDate;
}

export function getYearMonth(date: Date): YearMonth {
    return new YearMonth(date.getMonth() + 1, date.getFullYear());
}


export function getMonthFromName(name: string): number {

    switch (name) {
        case JAN:
            return 1;
        case FEB:
            return 2
        case MAR:
            return 3
        case APR:
            return 4
        case MAI:
            return 5
        case JUN:
            return 6
        case JUL:
            return 7
        case AUG:
            return 8
        case SEP:
            return 9
        case OCT:
            return 10
        case NOV:
            return 11
        case DEC:
            return 12
        default:
            break;
    }
}


export function getMonths(): Month[] {
    return [new Month(1), new Month(2), new Month(3),
    new Month(4), new Month(5), new Month(6), new Month(7),
    new Month(8), new Month(9), new Month(10), new Month(11), new Month(12)];
}

export function getYears(): number[] {
    let years: number[] = new Array<number>();
    let currentYear: number = new Date().getFullYear();
    for (let year = 2014; year <= currentYear; year++) {
        years.push(year);
    }

    return years;
}
