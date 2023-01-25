import React from "react";
import {AdminObservable} from "../../datamodel/admin";
import BecomeAdmin from "./BecomeAdmin";
import AdminStuff from "./AdminStuff";

interface AdminProps {
}

interface AdminState {
    isAdmin: boolean;
}

export default class Admin extends React.Component<AdminProps, AdminState> {
    constructor(props: AdminProps, context: any) {
        super(props, context);
        this.state = {
            isAdmin: AdminObservable.getValue(),
        }
    }

    componentDidMount() {
        AdminObservable.subscribe(this.adminListener)
    }

    componentWillUnmount() {
        AdminObservable.unsubscribe(this.adminListener)
    }

    adminListener = (value: boolean) => {
        this.setState({isAdmin: value});
    }

    render() {
        return (
            <main className="notSide">
                <form>
                    {this.state.isAdmin ? <AdminStuff /> : <BecomeAdmin />}
                </form>
            </main>
        )
    }
}