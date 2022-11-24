import React from "react";


interface ErrorProps {
    text: string;
}

interface ErrorState {
}

export class Error extends React.Component<ErrorProps, ErrorState> {
    constructor(props: ErrorProps, context: any) {
        super(props, context);
        this.state = {}
    }

    render() {
        return (
            <div className="error"><span>{this.props.text}</span></div>
        );
    }
}