export function formatUnixTimestamp(timestamp: number): string {
    let format = Intl.DateTimeFormat(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    })

    let date = new Date(timestamp);

    return format.format(date);
}

export function formatDate(date?: Date): string {
    if (date == undefined) {
        return "unbekannt";
    }
    let format = Intl.DateTimeFormat("de", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    })

    return format.format(date);
}

export function formatDateAsDateTime(date?: Date): string {
    if (date == undefined) {
        return "unbekannt";
    }
    return leftPad(date.getFullYear(), 4, '0') + "." +
        leftPad(date.getMonth() + 1, 2, '0') + "." +
        leftPad(date.getDate(), 2, '0') + " " +
        leftPad(date.getHours(), 2, '0') + ":" +
        leftPad(date.getMinutes(), 2, '0') + ":" +
        leftPad(date.getSeconds(), 2, '0');
}

export function leftPad(value: number, length: number, padding: string) {
    let strValue = value + "";
    if (strValue.length < length) {
        return padding.repeat(length - strValue.length) + strValue;
    }
    return strValue;
}