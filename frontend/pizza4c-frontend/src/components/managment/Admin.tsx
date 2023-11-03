import React from "react";
import {AdminObservable, Admin as AdminDto} from "../../datamodel/admin.ts";
import BecomeAdmin from "./BecomeAdmin.tsx";
import AdminStuff from "./AdminStuff.tsx";

interface AdminProps {
}

interface AdminState {
    isAdmin: boolean;
}

export default class Admin extends React.Component<AdminProps, AdminState> {
    constructor(props: AdminProps, context: any) {
        super(props, context);
        this.state = {
            isAdmin: AdminObservable.getValue().isAdmin
        }
    }

    componentDidMount() {
        AdminObservable.subscribe(this.adminListener)
    }

    componentWillUnmount() {
        AdminObservable.unsubscribe(this.adminListener)
    }

    adminListener = (value: AdminDto) => {
        this.setState({isAdmin: value.isAdmin});
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