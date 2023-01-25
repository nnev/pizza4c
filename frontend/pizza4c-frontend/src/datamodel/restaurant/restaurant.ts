import Brand from "./brand";
import {Menu} from "./menu";

export default interface Restaurant {
    brand: Brand;
    rating: Map<string, Number> ;
    location: Map<string, string> ;
    restaurantId: string;
    restaurantSlug: string;
    menu: Menu;
}
