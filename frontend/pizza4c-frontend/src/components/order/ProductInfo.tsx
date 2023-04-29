import React from "react";
import ProductInfo from "../../datamodel/restaurant/productInfo.ts";

interface ProductInfoProps {
    productInfo: ProductInfo;
}

interface ProductInfoState {
}

export class ProductInfoView extends React.Component<ProductInfoProps, ProductInfoState> {
    constructor(props: ProductInfoProps, context: any) {
        super(props, context);
    }

    render() {
        let productInfo = this.props.productInfo;
        if (this.anyProductInformation(productInfo)) {
            return (
                <div>
                    ProductInfo:
                    <ul>
                        <li>Additives: <span>{productInfo.additives}</span></li>
                        <li>Allergens: <span>{productInfo.allergens}</span></li>
                        <li>AlcoholVolume: <span>{productInfo.alcoholVolume}</span></li>
                        <li>CaffeineAmount: <span>{productInfo.caffeineAmount}</span></li>
                        <li>Verified: <span>{productInfo.isFoodInformationVerifiedByRestaurant}</span></li>
                        <li>Manual: <span>{productInfo.nutritionalTextManual}</span></li>
                    </ul>
                </div>
            );
        }

        return <></>
    }

    private anyProductInformation(productInfo: ProductInfo): boolean {

        let additives = productInfo.additives != null && productInfo.additives.length > 0;
        let allergens = productInfo.allergens != null && productInfo.allergens.length > 0;
        let alcoholVolume = productInfo.alcoholVolume != null && productInfo.alcoholVolume.length > 0;
        let caffeineAmount = productInfo.caffeineAmount != null && productInfo.caffeineAmount.length > 0;
        let nutritionalTextManual = productInfo.nutritionalTextManual != null && productInfo.nutritionalTextManual.length > 0;

        return additives ||
            allergens ||
            alcoholVolume ||
            caffeineAmount ||
            nutritionalTextManual;
    }
}
