import {Observable} from "../util/Observable";
import Restaurant from "./restaurant/restaurant";

export default interface FormattedError {
    timestamp: string;
    status: number;
    error: string;
    message: string;
    path: string;
}

export const ErrorObservable = new Observable<FormattedError>({initialValue: undefined});