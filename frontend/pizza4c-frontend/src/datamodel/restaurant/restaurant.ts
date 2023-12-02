import Brand from "./brand.ts";
import {Menu} from "./menu.ts";
import {Observable} from "../../util/Observable.ts";

export default interface Restaurant {
    brand: Brand;
    rating: Map<string, Number> ;
    location: Map<string, string> ;
    restaurantId: string;
    restaurantSlug: string;
    menu: Menu;
    restaurantPhoneNumber: string;
}

export const CurrentRestaurantObservable = new Observable<Restaurant>({initialValue: undefined});