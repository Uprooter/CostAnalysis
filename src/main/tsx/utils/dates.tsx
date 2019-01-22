export function getDateString(date: Date): string {
    let options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return date.toLocaleDateString('de-DE', options);
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