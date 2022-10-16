import React from "react";
import {WrapComponent} from "./RouterWrapper";

interface CustomizeProps {
    productId: string;
}

interface CustomizeState {
}

export class CustomizeClazz extends React.Component<CustomizeProps, CustomizeState> {

    constructor(props: CustomizeProps, context: any) {
        super(props, context);
        this.state = {}
    }

    render() {
        return (
            <div>
                hiii {this.props.productId}
            </div>
        );
    }
}

export const Customize = WrapComponent(CustomizeClazz);