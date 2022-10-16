import React, {MouseEventHandler} from "react";
import {Link} from "react-router-dom";

interface PixmapProps {
    pixmap: string
    text?: string
}

interface PixmapButtonProps extends PixmapProps {
    onClick: MouseEventHandler<any>
    disabled?: boolean
}

interface PixmapLinkProps extends PixmapProps {
    to: string
}

export class Pixmap extends React.Component<PixmapProps, any> {
    render() {
        if (this.props.text) {
            return <>
                <span className="material-icons pixmapIcon">{this.props.pixmap}</span>
                <span className="pixmapText">{this.props.text}</span>
            </>
        } else {
            return <span className="material-icons pixmapIcon">{this.props.pixmap}</span>
        }
    }
}

export class PixmapButton extends React.Component<PixmapButtonProps, any> {
    render() {
        return (
            <button onClick={this.props.onClick} disabled={this.props.disabled} className="pixmapButton">
                <Pixmap {...this.props} />
            </button>
        )
    }
}

export class PixmapLink extends React.Component<PixmapLinkProps, any> {
    render() {
        return (
            <Link className="pixmapLink" to={this.props.to}>
                <Pixmap {...this.props} />
            </Link>
        )
    }
}

export class PixmapGroup extends React.Component<any, any> {
    render() {
        return <div className="pixmapGroup">
            {this.props.children}
        </div>
    }
}