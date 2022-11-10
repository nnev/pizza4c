export default function formatUnixTimestamp(timestamp: number): string {

    let format = Intl.DateTimeFormat(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    })

    let date = new Date(timestamp);

    return format.format(date);
}