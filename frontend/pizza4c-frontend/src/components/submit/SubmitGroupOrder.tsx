import React from "react";
import {submitOrder} from "../../backend/submitOrder.ts";
import {Navigate} from "react-router-dom";
import {fetchAllCarts} from "../../backend/Cart.ts";
import {PixmapButton, PixmapGroup} from "../Pixmap.tsx";
import {AdminObservable} from "../../datamodel/admin.ts";


interface SubmitProps {
}

interface SubmitState {
    success?: boolean;
    forceReturn: boolean
}

export class SubmitGroupOrder extends React.Component<SubmitProps, SubmitState> {
    constructor(props: SubmitProps, context: any) {
        super(props, context);
        this.state = {
            forceReturn: false
        }
    }

    render() {
        if (!AdminObservable.getValue()) {
            return <Navigate to="/"/>
        }
        if (this.state.success == undefined) {
            submitOrder().then(value => {
                if (value) {
                    fetchAllCarts();
                }
                this.setState({success: value})
            })
                .catch(_ => {
                    this.setState({success: false})
                })
            return <>{this.state.success}</>
        } else if (this.state.success === true || this.state.forceReturn) {
            return <Navigate to="/" replace={true}></Navigate>
        } else {
            return (
                <main className="notSide">
                    <div className="error"><span>Fehler beim Versenden vom Fax</span></div>
                    <PixmapGroup>
                        <PixmapButton
                            onClick={() => this.setState({forceReturn: true})}
                            pixmap="arrow_left"
                            text="Zurück zur Übersicht"
                            className="primary"
                        />
                    </PixmapGroup>
                </main>
            );
        }
    }
}