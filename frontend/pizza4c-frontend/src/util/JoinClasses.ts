export function joinClasses(a?: string, b?: string): string {
    let total = "";
    if (a) {
        total += a;
    }
    if (a && b) {
        total += " ";
    }
    if (b) {
        total += b;
    }

    return total;
}