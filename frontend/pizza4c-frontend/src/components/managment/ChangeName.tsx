import React, {ChangeEvent, FormEvent, MouseEvent, KeyboardEvent} from "react";
import {Navigate} from "react-router-dom";
import {getMyName, Name, setMyName} from "../../datamodel/name.ts";
import {PixmapButton, PixmapGroup} from "../Pixmap.tsx";
import {Error} from "../Error.tsx"

interface ChangeNameProps {
}

interface ChangeNameState {
    name: Name;
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
            name: name,
            mayStore: name.stored
        }
    }

    changeName = (ev: ChangeEvent<HTMLInputElement>) => {
        this.setState({name: Name.fromLongName(ev.target.value)})
    }
    changeMayStore = (ev: ChangeEvent<HTMLInputElement>) => {
        this.setState({mayStore: ev.target.checked})
    }
    changeNameSubmit = (ev: (MouseEvent<HTMLInputElement> | FormEvent<HTMLFormElement> | KeyboardEvent<HTMLInputElement>)) => {
        if ("key" in ev) {
            if (ev.key == "Enter") {
                ev.preventDefault()
            } else {
                return;
            }
        } else {
            ev.preventDefault();
        }
        if (this.ready() == "VALID") {
            setMyName(this.state.name, this.state.mayStore);
            this.setState({nameChanged: true})
        }
        return;
    }

    generateRandomName = (ev: MouseEvent<HTMLInputElement>) => {
        ev.preventDefault();
        this.setState({name: Name.generateNewName()})
    }

    private ready(): NameValidation {
        let name = this.state.name.longName;

        if (name.trim().length < 3) {
            return "SHORT";
        }
        if (name.trim().length >= 32) {
            return "LONG";
        }

        if (name.match(/^[\wßäöüÄÖÜ\- èé]{3,}.*?$/) == null) {
            return "INVALID_CHAR";
        }

        if (name.startsWith(" ") || name.endsWith(" ")) {
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
                <form className="changeName" onSubmit={this.changeNameSubmit}>
                    <label htmlFor="name"><h1>Neuen Namen wählen</h1></label>
                    <table>
                        <tr>
                            <td>
                                Mein Name ist:
                            </td>
                            <td>
                                <input type="text"
                                       name="name"
                                       id="name"
                                       className="changeNameInput"
                                       value={this.state.name.longName}
                                       placeholder="Set a name"
                                       minLength={3}
                                       maxLength={32}
                                       onChange={this.changeName}
                                       onKeyPress={this.changeNameSubmit}
                                       tabIndex={1}
                                       autoFocus={true}
                                />
                                <PixmapButton
                                    onClick={this.generateRandomName}
                                    pixmap="casino"
                                    text="Zufälligen Alias generieren"
                                    className="tiny"
                                    autofocus={false}
                                    tabIndex={2}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Mein Kürzel ist:
                            </td>
                            <td><input type="text"
                                       name="shortName"
                                       id="shortName"
                                       className="changeNameInput"
                                       disabled={true}
                                       value={this.state.name.shortName}
                            />
                            </td>
                        </tr>
                    </table>
                    {ready == "SHORT" && <Error text="Der Name muss mindestens 3 Zeichen lang sein"/>}
                    {ready == "LONG" && <Error text="Der Name darf höchstens 32 Zeichen lang sein"/>}
                    {ready == "INVALID_CHAR" && <Error text="Das Kürzel darf nur aus Buchstaben und Zahlen bestehen"/>}
                    <label htmlFor="name">Für das nächste mal Speichern?:</label>
                    <input type="checkbox"
                           name="mayStore"
                           id="mayStore"
                           className="changeNameInput"
                           checked={this.state.mayStore}
                           onChange={this.changeMayStore}
                           tabIndex={3}
                    />
                    <br/>
                    <p className="nameStoreHint">
                        Durch das Auswählen der Speichern-Option werden Daten im lokalen Speicher deines Gerätes
                        hinterlegt.<br/>
                        Es werden keine Daten übertragen und keine existierende Bestellung verändert.
                    </p>
                    <PixmapGroup>
                        <PixmapButton
                            onClick={this.changeNameSubmit}
                            pixmap="person_add"
                            text="Name ändern"
                            disabled={ready != "VALID"}
                            tabIndex={4}
                            type="submit"
                        />
                    </PixmapGroup>
                </form>
            </main>
        );
    }
}