import {Observable} from "../../util/Observable.ts";

export type selectableVegan = "all" | "vegetarian" | "vegan";
export const VeganObservable: Observable<selectableVegan> = new Observable<selectableVegan>({initialValue: "all"})