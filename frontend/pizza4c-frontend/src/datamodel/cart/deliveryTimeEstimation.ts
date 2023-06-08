export default class DeliveryTimeEstimation {
    byEntries: string;
    byPrice: string;

    constructor(byEntries: string, byPrice: string) {
        this.byEntries = byEntries;
        this.byPrice = byPrice;
    }


    public byEntriesDate(): Date {
        return new Date(this.byEntries);
    }

    public byPriceDate(): Date {
        return new Date(this.byPrice);
    }

    public getMinDate(): Date {
        let byEntriesDate = this.byEntriesDate();
        let byPriceDate = this.byPriceDate();
        if (byEntriesDate.getTime() < byPriceDate.getTime()) {
            return byEntriesDate;
        }
        return byPriceDate;
    }

    public getMaxDate(): Date {
        let byEntriesDate = this.byEntriesDate();
        let byPriceDate = this.byPriceDate();
        if (byEntriesDate.getTime() > byPriceDate.getTime()) {
            return byEntriesDate;
        }
        return byPriceDate;
    }
}