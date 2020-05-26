import YearMonth from "../models/YearMonth";
import Month from "../models/Month";

export function getDateString(date: Date): string {
    let options = {year: 'numeric', month: 'numeric', day: 'numeric'};
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
    return date.toLocaleString('default', {month: 'long'}) + " - " + date.getFullYear();
}

export function getDateWithLastDayOfSameMonth(date: Date): Date {
    let newDate = date;
    newDate.setMonth(date.getMonth() + 1);
    newDate.setDate(newDate.getDate() - 1); //subtract a day
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

export function getYearMonth(date: Date): YearMonth {
    return new YearMonth(date.getMonth(), date.getFullYear());
}

export function getMonths(): Month[] {
    return [new Month("Jan", 0), new Month("Feb", 1), new Month("Mär", 2),
        new Month("Apr", 3), new Month("Mai", 4), new Month("Jun", 5), new Month("Jul", 6),
        new Month("Aug", 7), new Month("Sep", 8), new Month("Oct", 9), new Month("Nov", 10), new Month("Dec", 11)];
}

export function getYears(): number[] {
    let years: number[] = new Array<number>();
    let currentYear: number = new Date().getFullYear();
    for (let year = 2014; year <= currentYear; year++) {
        years.push(year);
    }

    return years;
}
