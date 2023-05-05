import React, {ChangeEvent, MouseEvent} from "react";
import {Navigate} from "react-router-dom";
import {getMyName, Name, setMyName} from "../../datamodel/name.ts";
import {PixmapButton} from "../Pixmap.tsx";
import {Error} from "../Error.tsx"

interface ChangeNameProps {
}

interface ChangeNameState {
    name: string;
    nameChanged: boolean;

    mayStore: boolean;
}

type NameValidation = "VALID" | "SHORT" | "LONG" | "INVALID_CHAR";

export default class ChangeName extends React.Component<ChangeNameProps, ChangeNameState> {

    constructor(props: ChangeNameProps, context: any) {
        super(props, context);
        let name = getMyName();
        this.state = {
            nameChanged: false,
            name: name.longName,
            mayStore: name.stored
        }
    }

    changeName = (ev: ChangeEvent<HTMLInputElement>) => {
        this.setState({name: ev.target.value})
    }
    changeMayStore = (ev: ChangeEvent<HTMLInputElement>) => {
        this.setState({mayStore: ev.target.checked})
    }
    changeNameSubmit = (ev: MouseEvent<HTMLInputElement>) => {
        ev.preventDefault();
        if (this.ready() == "VALID") {
            setMyName(Name.fromLongName(this.state.name), this.state.mayStore);
            this.setState({nameChanged: true})
        }
        return;
    }

    private ready(): NameValidation {
        let name = this.state.name;

        if (name.trim().length < 3) {
            return "SHORT";
        }
        if (name.trim().length >= 20) {
            return "LONG";
        }

        if (this.state.name.match(/^[\wßäöüÄÖÜ\- èé]{3,}$/) == null) {
            return "INVALID_CHAR";
        }

        return "VALID";
    }

    render() {
        if (this.state.nameChanged) {
            return <Navigate to="/"/>;
        }

        let ready = this.ready();

        return (
            <main className="notSide">
                <form>
                    <label htmlFor="name"><h1>Mein Name ist:</h1></label>
                    <input type="text"
                           name="name"
                           id="name"
                           className="changeNameInput"
                           value={this.state.name}
                           placeholder="Set a name"
                           minLength={3}
                           maxLength={20}
                           onChange={this.changeName}
                    />
                    <br/>
                    <label htmlFor="name">Für das nächste mal Speichern?:</label>
                    <input type="checkbox"
                           name="mayStore"
                           id="mayStore"
                           className="changeNameInput"
                           checked={this.state.mayStore}
                           onChange={this.changeMayStore}
                    />
                    <br/>
                    <br/>
                    Durch das Auswählen der Speichern-Option werden Daten im lokalen Speicher deines Gerätes hinterlegt.<br/>
                    Es werden keine Daten übertragen und keine existierende Bestellung verändert.
                    <br/>
                    {ready == "SHORT" && <Error text="Der Name muss mindestens 3 Zeichen lang sein"/>}
                    {ready == "LONG" && <Error text="Der Name darf höchstens 20 Zeichen lang sein"/>}
                    {ready == "INVALID_CHAR" && <Error text="Der Name darf nur aus Buchstaben und Zahlen bestehen"/>}
                    <PixmapButton
                        onClick={this.changeNameSubmit}
                        pixmap="person_add"
                        text="Name ändern"
                        disabled={ready != "VALID"}
                    />
                </form>
            </main>
        );
    }
}