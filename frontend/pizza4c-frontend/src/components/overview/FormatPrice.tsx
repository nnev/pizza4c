import React from "react";

interface SumPriceProps {
    price: number;
}

interface SumPriceState {
}

export class FormatPrice extends React.Component<SumPriceProps, SumPriceState> {
    render() {
        return <>
            {this.props.price.toFixed(2)}€
        </>
    }

}