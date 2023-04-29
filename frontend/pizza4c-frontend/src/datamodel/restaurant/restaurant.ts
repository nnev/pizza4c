import Brand from "./brand.ts";
import {Menu} from "./menu.ts";

export default interface Restaurant {
    brand: Brand;
    rating: Map<string, Number> ;
    location: Map<string, string> ;
    restaurantId: string;
    restaurantSlug: string;
    menu: Menu;
}
