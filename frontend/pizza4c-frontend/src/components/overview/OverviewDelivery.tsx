import React, {MouseEvent} from "react";
import {PixmapButton} from "../Pixmap.tsx";
import {Navigate} from "react-router-dom";
import AllCarts from "../../datamodel/cart/allCarts.ts";
import {formatDate} from "../../util/Time.ts";

interface OverviewDeliveryProps {
    allCarts: AllCarts;
}

interface OverviewDeliveryState {
    redirectDelivery: boolean;
}


export class OverviewDelivery extends React.Component<OverviewDeliveryProps, OverviewDeliveryState> {

    constructor(props: OverviewDeliveryProps, context: any) {
        super(props, context);
        this.state = {
            redirectDelivery: false
        }
    }

    setDelivery = (ev: MouseEvent<any>) => {
        ev.preventDefault();
        this.setState({redirectDelivery: true});
    }

    render() {
        if (this.state.redirectDelivery) {
            return <Navigate to="/delivery"/>
        }

        return <div className="deliveryOverview">
            {this.props.allCarts.isSubmitted() &&
                <div className="error">
                    <span>Bestellung versendet um {formatDate(this.props.allCarts.getSubmittedAtDate())}</span>
                </div>
            }
            {this.props.allCarts.isSubmitted() && !this.props.allCarts.isDelivered() &&
                <PixmapButton
                    onClick={this.setDelivery}
                    pixmap="call_received"
                    text="Lieferung bestätigen"
                />
            }
            {!this.props.allCarts.isDelivered() && this.props.allCarts.deliveryTimeEstimation != null &&
                <div className="error">
                        <span>
                            Lieferung geschätzt zwischen {formatDate(this.props.allCarts.deliveryTimeEstimation.getMinDate())} und {formatDate(this.props.allCarts.deliveryTimeEstimation.getMaxDate())}
                        </span>
                </div>
            }

            {this.props.allCarts.isDelivered() &&
                <div className="error">
                    <span>Pizza wurde um {formatDate(this.props.allCarts.getDeliveredAtDate())} geliefert</span>
                </div>
            }
        </div>
    }
}