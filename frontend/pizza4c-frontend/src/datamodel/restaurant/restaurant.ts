import {Menu} from "./menu.ts";
import {Observable} from "../../util/Observable.ts";

export default interface Restaurant {
    restaurantId: string;
    restaurantSlug: string;
    restaurantPhoneNumber: string;
    menu: Menu;
}

export const CurrentRestaurantObservable = new Observable<Restaurant>({initialValue: undefined});