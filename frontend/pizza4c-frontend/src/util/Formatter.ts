export function formatAsEuro(cents: number): string {
    return (cents / 100).toFixed(2) + " €"
}