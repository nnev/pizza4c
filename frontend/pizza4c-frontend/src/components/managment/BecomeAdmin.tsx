import React, {ChangeEvent, MouseEvent} from "react";
import {Navigate} from "react-router-dom";
import {PixmapButton} from "../Pixmap.tsx";
import {getAdminTicket} from "../../backend/Admin.ts";
import {AdminObservable} from "../../datamodel/admin.ts";

interface BecomeAdminProps {
}

interface BecomeAdminState {
    magicWords: string;
    redirectOverview: boolean;
}

export default class BecomeAdmin extends React.Component<BecomeAdminProps, BecomeAdminState> {

    constructor(props: BecomeAdminProps, context: any) {
        super(props, context);
        this.state = {
            magicWords: "",
            redirectOverview: false
        }
    }

    magicWords = (ev: ChangeEvent<HTMLInputElement>) => {
        this.setState({magicWords: ev.target.value})
    }
    changeNameSubmit = (ev: MouseEvent<HTMLInputElement>) => {
        ev.preventDefault();
        getAdminTicket(this.state.magicWords).then(_ => {
            let isAdmin = AdminObservable.getValue().isAdmin;
            return this.setState({redirectOverview: isAdmin});
        })
        return;
    }

    render() {
        if (this.state.redirectOverview) {
            return <Navigate to="/"/>;
        }

        return (
            <>
                <h1>Ich will Admin-Rechte haben</h1>
                Bestätige, dass du Admin rechte hast, durch die Eingabe des Admin-Passworts, das im Wiki steht.<br/>
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
                />
            </>
        );
    }
}