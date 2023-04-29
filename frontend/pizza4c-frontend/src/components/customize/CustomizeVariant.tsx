import Variant from "../../datamodel/restaurant/variant.ts";
import Restaurant from "../../datamodel/restaurant/restaurant.ts";
import React, {ChangeEvent} from "react";
import {CustomizeOptionGroup} from "./CustomizeOptionGroup.tsx";
import {CurrentRestaurantObservable} from "../../backend/restaurant.ts";
import Product from "../../datamodel/restaurant/product.ts";
import {PixmapButton, PixmapGroup} from "../Pixmap.tsx";
import {Navigate, useParams} from "react-router-dom";
import {addToCart} from "../../backend/Cart.ts";
import FormattedError from "../../datamodel/error.ts";
import {Error} from "../Error.tsx";

interface CustomizeVariantProps {
    productId: string;
    variantId: string;
}

interface CustomizeVariantState {
    selectedOptions: Map<string, Set<string>>;
    restaurant?: Restaurant;
    product?: Product;
    variant?: Variant;
    backToVariantSelection: boolean
    backToOrder: boolean
    addToCartCompleted: boolean
    error?: FormattedError
    comment?: string
}

class CustomizeVariantClazz extends React.Component<CustomizeVariantProps, CustomizeVariantState> {
    constructor(props: CustomizeVariantProps, context: any) {
        super(props, context);
        this.state = {
            selectedOptions: new Map<string, Set<string>>(),
            backToVariantSelection: false,
            backToOrder: false,
            addToCartCompleted: false,
        };
    }

    listener = (value: Restaurant) => {
        let product = value.menu.products[this.props.productId];
        let variant = product.variants.find(value => value.id == this.props.variantId);
        this.setState({
            restaurant: value,
            product: product,
            variant: variant,
        });
    }

    componentDidMount() {
        CurrentRestaurantObservable.subscribe(this.listener);
    }

    componentWillUnmount() {
        CurrentRestaurantObservable.unsubscribe(this.listener);
    }

    addToCart = () => {
        if (this.props.productId && this.state.variant && this.getCustomizationCompleted()) {
            addToCart(this.props.productId, this.state.variant.id, this.state.selectedOptions, this.state.comment)
                .then(_ => {
                    this.setState({addToCartCompleted: true});
                })
                .catch(value => {
                    this.setState({error: value as FormattedError})
                })
        }
    }

    private getCustomizationCompleted(): boolean {
        let variant = this.state.variant;
        let selectedOptionsGroups = this.state.selectedOptions;
        if (variant == undefined) {
            return false;
        } else {
            for (const optionGroupId of variant.optionGroupIds) {
                let optionGroup = this.state.restaurant!.menu.optionGroups[optionGroupId];
                let selectedOptions = selectedOptionsGroups == undefined ? new Set<string> : selectedOptionsGroups!.get(optionGroupId);
                let numSelected = selectedOptions ? selectedOptions.size : 0;
                if (numSelected < optionGroup.minChoices || numSelected > optionGroup.maxChoices) {
                    return false;
                }
            }
        }

        return true;
    }

    backToVariantSelection = () => {
        this.setState({backToVariantSelection: true});
    }
    backToOrder = () => {
        this.setState({backToOrder: true});
    }

    private getTotalPrice(): number {
        let total = 0;
        if (this.state.product && this.state.variant) {
            total += this.state.product.variants.find(value => value.id === this.state.variant!.id)!.prices.delivery;
            for (let options of this.state.selectedOptions.values()) {
                options.forEach(optionId => {
                    let option = this.state.restaurant!.menu.options[optionId];
                    total += option.prices.delivery;
                })
            }
        }
        return total / 100;
    }

    changeComment = (ev: ChangeEvent<HTMLTextAreaElement>) => {
        let value = ev.target.value;
        this.setState({
            comment: value
        })
    }


    render() {
        if (this.state.backToVariantSelection) {
            return <Navigate to={"/customize/" + this.props.productId}/>;
        }
        if (this.state.backToOrder) {
            return <Navigate to={"/order"}/>;
        }
        if (this.state.addToCartCompleted) {
            return <Navigate to="/"/>;
        }
        if (this.state.restaurant == undefined || this.state.product == undefined || this.state.variant == undefined) {
            return <></>;
        }

        let completed = this.getCustomizationCompleted();

        return (
            <main className="notSide customize">
                <h1>{this.state.product.name} {this.state.variant ? this.state.variant!.name : ""}</h1>
                <span
                    className="total">Preis ohne Extras: <span>{this.state.variant!.prices.deliveryEuro}</span>€</span><br/>
                <div className="variantContent">
                    <ul>
                        {
                            this.state.variant!.optionGroupIds.map(value => <CustomizeOptionGroup
                                    key={value}
                                    restaurant={this.state.restaurant!}
                                    productId={this.props.productId}
                                    variant={this.state.variant!}
                                    optionGroupId={value}
                                    onOptionSelected={this.selectOption}
                                />
                            )
                        }
                    </ul>
                </div>

                <div>
                    <label htmlFor="comment">Extrawünsche:</label> <br/>
                    <textarea
                        name="comment"
                        id="comment"
                        cols={80}
                        rows={10}
                        value={this.state.comment}
                        onChange={this.changeComment}
                    />
                </div>

                <span className="total"> <b>Total</b>: {this.getTotalPrice().toFixed(2)}€</span> <br/>
                {this.state.error && <Error text={this.state.error.message}/>}
                <PixmapGroup>
                    <PixmapButton onClick={this.backToOrder} pixmap="arrow_back" text="Zurück zur Produktauswahl"/>
                    {this.state.product.variants.length != 1 &&
                        <PixmapButton onClick={this.backToVariantSelection} pixmap="arrow_back"
                                      text="Zurück zur Größenauswahl"/>
                    }

                    <PixmapButton
                        onClick={this.addToCart}
                        pixmap="add"
                        text={completed ? "Zur Bestellung hinzufügen" : "Noch nicht alle benötigten Optionen ausgewählt!"}
                        disabled={!completed}
                        className="primary right"
                    />
                </PixmapGroup>
            </main>
        );
    }

    selectOption = (optionGroupId: string, selectedOptions: Set<string>) => {
        let selectedOptionsSet = this.state.selectedOptions;
        selectedOptionsSet.set(optionGroupId, selectedOptions)
        this.setState({selectedOptions: selectedOptionsSet})
    };
}

export const CustomizeVariant = () => {
    let props = useParams();
    return <CustomizeVariantClazz
        productId={props.productId || "määh"}
        variantId={props.variantId || "mäh"}
    />
}