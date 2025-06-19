import {SelectedModifierCallback} from "./RadioOptionGroup.tsx";
import React, {ChangeEvent} from "react";
import {formatAsEuro} from "../../util/Formatter.ts";
import {ModifierGroup} from "../../datamodel/restaurant/menu.ts";

interface CheckboxOptionGroupProps {
    modifierGroup: ModifierGroup;
    modifierGroupId: string;
    onModifierSelected: SelectedModifierCallback;
}

interface CheckboxOptionGroupState {
    selectedOptions: Set<string>
}

export class CheckboxOptionGroup extends React.Component<CheckboxOptionGroupProps, CheckboxOptionGroupState> {
    constructor(props: CheckboxOptionGroupProps, context: any) {
        super(props, context);
        this.state = {
            selectedOptions: new Set<string>()
        };
    }

    onChangeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        let value = ev.target.value;
        let options = this.state.selectedOptions;
        if (ev.target.checked) {
            options.add(value);
        } else {
            options.delete(value);
        }
        this.setState({selectedOptions: options})
        this.props.onModifierSelected(this.props.modifierGroupId, options);
    }

    render() {
        let modifiers = Object.keys(this.props.modifierGroup.modifiers)
            .sort((a, b) => {
                let optionA = this.props.modifierGroup.modifiers[a];
                let optionB = this.props.modifierGroup.modifiers[b];
                return optionA.name.toUpperCase().localeCompare(optionB.name.toUpperCase())
            })
            .map(modifierId => {
                let modifier = this.props.modifierGroup.modifiers[modifierId];
                let id = this.props.modifierGroupId + '-' + modifierId;

                return (
                    <div key={modifierId} className="option">
                        <div className="optionCheckbox">
                            <input
                                type="checkbox"
                                name={id}
                                id={id}
                                value={modifierId}
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