export default interface FormattedError {
    timestamp: string;
    status: number;
    error: string;
    message: string;
    path: string;
}