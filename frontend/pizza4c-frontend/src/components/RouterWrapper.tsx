import {useParams} from "react-router-dom";
import React, {ComponentType} from "react";

export function WrapComponent(Component: ComponentType<any>) {
    return () => {
        let params = useParams();
        return (<Component {...params} />)
    }
}