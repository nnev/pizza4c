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