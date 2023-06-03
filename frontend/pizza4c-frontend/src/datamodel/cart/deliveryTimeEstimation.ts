export default class DeliveryTimeEstimation {
    byTime: string;
    byPrice: string;

    constructor(byTime: string, byPrice: string) {
        this.byTime = byTime;
        this.byPrice = byPrice;
    }


    public byTimeDate(): Date {
        return new Date(this.byTime);
    }

    public byPriceDate(): Date {
        return new Date(this.byPrice);
    }

    public getMinDate(): Date {
        let byTimeDate = this.byTimeDate();
        let byPriceDate = this.byPriceDate();
        if (byTimeDate.getTime() < byPriceDate.getTime()) {
            return byTimeDate;
        }
        return byPriceDate;
    }

    public getMaxDate(): Date {
        let byTimeDate = this.byTimeDate();
        let byPriceDate = this.byPriceDate();
        if (byTimeDate.getTime() > byPriceDate.getTime()) {
            return byTimeDate;
        }
        return byPriceDate;
    }
}