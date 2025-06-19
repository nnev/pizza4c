import React from "react";
import {formatAsEuro} from "../../util/Formatter.ts";

interface SumPriceProps {
    price: number;
}

interface SumPriceState {
}

export class FormatPrice extends React.Component<SumPriceProps, SumPriceState> {
    render() {
        return <>
            {formatAsEuro(this.props.price)}
        </>
    }

}