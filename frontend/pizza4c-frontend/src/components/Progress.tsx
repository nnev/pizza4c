import React from "react";
import {formatAsEuro} from "../util/Formatter.ts";

interface ProgressProps {
    current: number;
    max: number;
    min?: number
}

export class ProgressMoney extends React.Component<ProgressProps, any> {
    render() {
        let current = this.props.current - (this.props.min || 0);
        let range = this.props.max - (this.props.min || 0);

        let percentage = current > 0 ? current / range * 100 : 1;
        return (
            <div className="progress">
                <div className="progressBackground"
                     style={{width: percentage + "%"}}>
                    <span
                        className="progressText">
                        {formatAsEuro(this.props.current)} / {formatAsEuro(this.props.max)}</span>
                </div>
            </div>
        );
    }
}