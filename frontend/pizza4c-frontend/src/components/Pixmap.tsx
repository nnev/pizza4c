import React, {MouseEventHandler} from "react";
import {Link} from "react-router-dom";
import {joinClasses} from "../util/JoinClasses.ts";

interface PixmapProps {
    pixmap: string;
    text?: string|JSX.Element;
    className?: string;
}

interface PixmapButtonProps extends PixmapProps {
    onClick: MouseEventHandler<any>;
    disabled?: boolean;
    grow?: boolean;
}

interface PixmapLinkProps extends PixmapProps {
    to: string;
}

export class Pixmap extends React.Component<PixmapProps, any> {
    render() {
        if (this.props.text) {
            return <span className={joinClasses("pixmap", this.props.className)}>
                <span className="material-icons pixmapIcon">{this.props.pixmap}</span>
                <span className="pixmapText">{this.props.text}</span>
            </span>
        } else {
            return <span className="material-icons pixmapIcon">{this.props.pixmap}</span>
        }
    }
}

export class PixmapButton extends React.Component<PixmapButtonProps, any> {
    render() {
        return (
            <button onClick={this.props.onClick}
                    disabled={this.props.disabled}
                    className={joinClasses("pixmapButton", this.props.className)}>
                <Pixmap {...this.props} />
            </button>
        )
    }
}

export class PixmapLink extends React.Component<PixmapLinkProps, any> {
    render() {
        return (
            <Link className={joinClasses("pixmapLink", this.props.className)} to={this.props.to}>
                <Pixmap {...this.props} />
            </Link>
        )
    }
}

export class PixmapGroup extends React.Component<any, any> {
    render() {
        return <div className={joinClasses("pixmapGroup", this.props.className)}>
            {this.props.children}
        </div>
    }
}