import React from "react";
import {renderPdf} from "../../backend/RenderPdf";


interface RenderProps {
}

interface RenderState {
    redirected: boolean
}

export class RenderPdf extends React.Component<RenderProps, RenderState> {
    constructor(props: RenderProps, context: any) {
        super(props, context);
        this.state = {redirected: false}
    }

    componentDidMount() {
        console.log("mount")
        // if (!this.state.redirected) {
        //     renderPdf()
        //     this.setState({redirected: true});
        // }
    }

    componentWillUnmount() {
        console.log("unmount")
    }

    render() {
        return <></>
        // return <Navigate to="/" replace={true}></Navigate>
    }
}