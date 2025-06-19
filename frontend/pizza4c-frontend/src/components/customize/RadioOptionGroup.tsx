import React, {ChangeEvent} from "react";
import {ModifierGroup} from "../../datamodel/restaurant/menu.ts";
import {formatAsEuro} from "../../util/Formatter.ts";

export interface SelectedModifierCallback {
    (modifierGroupId: string, selectedOptions: Set<string>): void;
}

interface RadioOptionGroupProps {
    modifierGroup: ModifierGroup;
    modifierGroupId: string;
    onModifierSelected: SelectedModifierCallback;
}

interface RadioOptionGroupState {
}

export class RadioOptionGroup extends React.Component<RadioOptionGroupProps, RadioOptionGroupState> {
    constructor(props: RadioOptionGroupProps, context: any) {
        super(props, context);
        this.state = {};
    }

    onChangeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        let value = ev.target.value;
        this.props.onModifierSelected(this.props.modifierGroupId, new Set<string>([value]));
    }

    render() {
        let modifiers = Object.keys(this.props.modifierGroup.modifiers)
            .sort((a, b) => {
                let optionA = this.props.modifierGroup.modifiers[a];
                let optionB = this.props.modifierGroup.modifiers[b];
                return optionA.name.toUpperCase().localeCompare(optionB.name.toUpperCase())
            })
            .map(optionId => {
                let modifier = this.props.modifierGroup.modifiers[optionId];
                let id = this.props.modifierGroupId + '-' + optionId;

                return (
                    <div key={optionId} className="option">
                        <div className="optionRadio">
                            <input
                                type="radio"
                                name={modifier.name}
                                id={id}
                                value={optionId}
                            />
                        </div>
                        <div className="optionPrice">
                            <label htmlFor={id}>{"+" + formatAsEuro(modifier.priceCents)}</label>
                        </div>
                        <div className="optionName">
                            <label htmlFor={id}>{modifier.name}</label>
                        </div>
                    </div>
                );
            });

        return (
            <div className="optionsContainer" onChange={this.onChangeHandler}>{modifiers}</div>
        );
    }
}