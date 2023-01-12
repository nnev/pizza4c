import React, {ChangeEvent, MouseEvent} from "react";
import {Navigate} from "react-router-dom";
import {Name, setMyName} from "../../datamodel/name";
import {PixmapButton} from "../Pixmap";
import {Error} from "../Error"
import {AdminObservable} from "../../datamodel/admin";

interface BecomeAdminProps {
}

interface BecomeAdminState {
    magicWords: string;
    nameChanged: boolean;
}

type NameValidation = "VALID" | "INVALID";

export default class BecomeAdmin extends React.Component<BecomeAdminProps, BecomeAdminState> {

    constructor(props: BecomeAdminProps, context: any) {
        super(props, context);
        this.state = {
            magicWords: "",
            nameChanged: false
        }
    }

    magicWords = (ev: ChangeEvent<HTMLInputElement>) => {
        this.setState({magicWords: ev.target.value})
    }
    changeNameSubmit = (ev: MouseEvent<HTMLInputElement>) => {
        ev.preventDefault();
        if (this.ready() == "VALID") {
            AdminObservable.setValue(true);
            this.setState({nameChanged: true})
        }
        return;
    }

    dropAdmin = (ev: MouseEvent<HTMLInputElement>) => {
        ev.preventDefault();
        AdminObservable.setValue(false);
        this.setState({nameChanged: true})
    }

    private ready(): NameValidation {
        let name = this.state.magicWords;

        return name === "sudo make me a pizza" ? "VALID" : "INVALID";
    }

    render() {
        if (this.state.nameChanged) {
            return <Navigate to="/"/>;
        }

        if (AdminObservable.getValue()) {
            return (
                <main className="notSide">
                    <form>
                        <h1>TODO: Mache Restaurant auswählbar</h1>
                        <h1>TODO: Force update Restaurant Menu</h1>
                        <h1>TODO: Cancel Order</h1>

                        <h1>Ich will nicht mehr Admin sein</h1>
                        <PixmapButton
                            onClick={this.dropAdmin}
                            pixmap="person_remove"
                            text="Admin Rechte abgeben"
                        />
                    </form>
                </main>
            );
        }

        let ready = this.ready();

        return (
            <main className="notSide">

                <form>
                    <h1>Ich will Admin-Rechte haben</h1>
                    Bestätige durch schreiben von <b>sudo make me a pizza</b>.
                    <br/>
                    <br/>

                    <input type="text"
                           name="magicWords"
                           id="magicWords"
                           className="magicWords"
                           value={this.state.magicWords}
                           placeholder="Fill me in"
                           onChange={this.magicWords}
                    />
                    <br/>
                    <PixmapButton
                        onClick={this.changeNameSubmit}
                        pixmap="person_add"
                        text="Mach mich admin"
                        disabled={ready != "VALID"}
                    />
                </form>
            </main>
        );
    }
}