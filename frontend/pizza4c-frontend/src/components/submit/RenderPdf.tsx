import React from "react";
import {renderPdf} from "../../backend/RenderPdf.ts";
import {Navigate} from "react-router-dom";


interface RenderProps {
}

interface RenderState {
}

export class RenderPdf extends React.Component<RenderProps, RenderState> {
    private nonReactRedirect = false;

    constructor(props: RenderProps, context: any) {
        super(props, context);
        this.state = {}
    }

    componentDidMount() {
    }

    render() {
        if (!this.nonReactRedirect) {
            this.nonReactRedirect = true;
            renderPdf();
        }

        return <Navigate to="/" replace={true}></Navigate>
    }
}