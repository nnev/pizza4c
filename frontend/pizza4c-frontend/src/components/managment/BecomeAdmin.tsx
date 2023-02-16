import React, {ChangeEvent, MouseEvent} from "react";
import {Navigate} from "react-router-dom";
import {PixmapButton} from "../Pixmap";
import {AdminObservable} from "../../datamodel/admin";

interface BecomeAdminProps {
}

interface BecomeAdminState {
    magicWords: string;
    nameChanged: boolean;
}

type NameValidation = "VALID" | "INVALID";

const magicWords = "sudo make me a pizza";
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

    private ready(): NameValidation {
        let name = this.state.magicWords;
        return name === magicWords ? "VALID" : "INVALID";
    }

    render() {
        if (this.state.nameChanged) {
            return <Navigate to="/"/>;
        }
        let ready = this.ready();

        return (
            <>
                <h1>Ich will Admin-Rechte haben</h1>
                Bestätige durch schreiben von <b>{magicWords}</b>.
                <br/>
                <br/>

                <input type="text"
                       name="magicWords"
                       id="magicWords"
                       className="magicWords"
                       value={this.state.magicWords}
                       placeholder="Sag die magischen Worte"
                       onChange={this.magicWords}
                       autoFocus={true}
                />

                <br/>
                <br/>
                <PixmapButton
                    onClick={this.changeNameSubmit}
                    pixmap="person_add"
                    text="Mach mich Admin"
                    disabled={ready != "VALID"}
                />
            </>
        );
    }
}