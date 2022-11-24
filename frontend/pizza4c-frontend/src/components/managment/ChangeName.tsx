import React, {ChangeEvent, MouseEvent} from "react";
import {Navigate} from "react-router-dom";
import {Name, setMyName} from "../../datamodel/name";
import {PixmapButton} from "../Pixmap";
import {Error} from "../Error"

interface ChangeNameProps {
}

interface ChangeNameState {
    name: string;
    nameChanged: boolean;
}

type NameValidation = "VALID" | "SHORT" | "INVALID_CHAR";

export default class ChangeName extends React.Component<ChangeNameProps, ChangeNameState> {

    constructor(props: ChangeNameProps, context: any) {
        super(props, context);
        this.state = {
            nameChanged: false,
            name: ""
        }
    }

    changeName = (ev: ChangeEvent<HTMLInputElement>) => {
        this.setState({name: ev.target.value})
    }
    changeNameSubmit = (ev: MouseEvent<HTMLInputElement>) => {
        ev.preventDefault();
        if (this.ready() == "VALID") {
            setMyName(Name.fromLongName(this.state.name));
            this.setState({nameChanged: true})
        }
        return;
    }

    private ready(): NameValidation {
        let name = this.state.name;

        if (name.trim().length < 3) {
            return "SHORT";
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
            <form>
                <label htmlFor="name"><h1>Mein Name ist:</h1></label>
                <input type="text"
                       name="name"
                       id="name"
                       className="changeNameInput"
                       value={this.state.name}
                       placeholder="Set a name"
                       minLength={3}
                       onChange={this.changeName}
                />
                <br/>
                {ready == "SHORT" && <Error text="Der Name muss mindestens 3 Zeichen lang sein" /> }
                {ready == "INVALID_CHAR" && <Error text="Der Name darf nur aus Buchstaben und Zahlen bestehen" /> }
                <PixmapButton
                    onClick={this.changeNameSubmit}
                    pixmap="person_add"
                    text="Name ändern"
                    disabled={ready != "VALID"}
                />
            </form>
        );
    }
}