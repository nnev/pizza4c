import React from "react";

interface ProgressProps {
    current: number;
    max: number;
}

export class Progress extends React.Component<ProgressProps, any> {
    render() {
        let percentage = this.props.current > 0 ? this.props.current / this.props.max : 0.01;
        percentage *= 100;
        return (
            <div className="progress">
                <div className="progressBackground"
                     style={{width: percentage + "%"}}>
                    <span
                        className="progressText">
                        {this.props.current.toFixed(2)} €/ {this.props.max.toFixed(2)} €</span>
                </div>
            </div>
        );
    }
}