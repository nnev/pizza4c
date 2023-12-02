import React from "react";
import {Navigate} from "react-router-dom";
import {fetchAllCarts} from "../../backend/Cart.ts";
import {PixmapGroup, PixmapLink} from "../Pixmap.tsx";
import {AdminObservable} from "../../datamodel/admin.ts";
import {submitOrder} from "../../backend/Admin.ts";


interface SubmitProps {
}

interface SubmitState {
    success?: boolean;
}

export class SubmitGroupOrder extends React.Component<SubmitProps, SubmitState> {
    constructor(props: SubmitProps, context: any) {
        super(props, context);
        this.state = {}
    }

    render() {
        if (!AdminObservable.getValue()) {
            return <Navigate to="/"/>
        }
        if (this.state.success == undefined) {
            submitOrder().then(value => {
                if (value) {
                    fetchAllCarts().then(_ => this.setState({success: true}))
                } else {
                    this.setState({success: false})
                }
            })
                .catch(_ => {
                    this.setState({success: false})
                })
            return <>{this.state.success}</>
        } else if (this.state.success === true) {
            return <Navigate to="/" replace={true}></Navigate>
        } else {
            return (
                <main className="notSide">
                    <div className="error"><span>Fehler beim Versenden vom Fax</span></div>
                    <PixmapGroup>
                        <PixmapLink
                            to="/"
                            pixmap="arrow_left"
                            text="Zurück zur Übersicht"
                            className="primary"
                            replace={true}
                        />
                    </PixmapGroup>
                </main>
            );
        }
    }
}