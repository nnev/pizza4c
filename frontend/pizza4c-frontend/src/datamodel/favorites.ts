import {Observable} from "../util/Observable.ts";
import CartEntry from "./cart/cartEntry.ts";
import {mapEntries} from "../backend/Cart.ts";

export class Favorites {
    public favorite: CartEntry[];
    public stored: boolean;

    constructor(favorite: CartEntry[], stored: boolean) {
        this.favorite = favorite;
        this.stored = stored;
    }

    public asBody() {
        return {
            favorite: this.favorite,
        }
    }
}

export const FavoritesObservable = new Observable<Favorites>({initializer: getFavoritesWithoutSetting});

export function getFavorites(): Favorites {
    if (!FavoritesObservable.hasValue()) {
        let favoritesJson = window.localStorage.getItem("favorites");
        if (favoritesJson) {
            try {
                let cartEntries = JSON.parse(favoritesJson) as CartEntry[]
                cartEntries = cartEntries.map(mapEntries)
                FavoritesObservable.setValue(new Favorites(cartEntries, true));
            } catch (e) {
                FavoritesObservable.setValue(new Favorites([], false));
            }
        } else {
            FavoritesObservable.setValue(new Favorites([], false));
        }
    }

    return FavoritesObservable.getValue();
}

export function getFavoritesWithoutSetting(): Favorites | undefined {
    if (!FavoritesObservable.hasValue()) {
        let favoritesJson = window.localStorage.getItem("favorites");
        if (favoritesJson) {
            try {
                let cartEntries = JSON.parse(favoritesJson) as CartEntry[];
                cartEntries = cartEntries.map(mapEntries)
                return new Favorites(cartEntries, true)
            } catch (e) {
                return new Favorites([], false);
            }
        } else {
            return new Favorites([], false);
        }
    }

    return FavoritesObservable.getValue();
}

export function setFavorites(favorites: Favorites, mayStore: boolean) {
    favorites.stored = mayStore;
    FavoritesObservable.setValue(favorites);
    if (mayStore) {
        let favoritesJson = JSON.stringify(favorites.favorite);
        window.localStorage.setItem("favorites", favoritesJson);
    } else {
        window.localStorage.clear();
    }
}