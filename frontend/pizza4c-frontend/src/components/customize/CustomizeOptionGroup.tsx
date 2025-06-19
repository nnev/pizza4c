import {RadioOptionGroup, SelectedModifierCallback} from "./RadioOptionGroup.tsx";
import React from "react";
import {CheckboxOptionGroup} from "./CheckboxOptionGroup.tsx";
import {isOptionGroupMandatory, ModifierGroup} from "../../datamodel/restaurant/menu.ts";

interface CustomizeOptionGroupProps {
    modifierGroupId: string;
    modifierGroup: ModifierGroup;
    onModifierSelected: SelectedModifierCallback;
}

interface CustomizeOptionGroupState {
}

export class CustomizeOptionGroup extends React.Component<CustomizeOptionGroupProps, CustomizeOptionGroupState> {
    constructor(props: CustomizeOptionGroupProps, context: any) {
        super(props, context);
    }

    render() {
        return (
            <li>
                <fieldset>
                    <h2>{this.props.modifierGroup.name}{isOptionGroupMandatory(this.props.modifierGroup) && "*"}</h2>
                    {
                        isOptionGroupMandatory(this.props.modifierGroup) ? <RadioOptionGroup
                            modifierGroup={this.props.modifierGroup}
                            modifierGroupId={this.props.modifierGroupId}
                            onModifierSelected={this.props.onModifierSelected}
                        /> : <CheckboxOptionGroup
                            modifierGroup={this.props.modifierGroup}
                            modifierGroupId={this.props.modifierGroupId}
                            onModifierSelected={this.props.onModifierSelected}
                        />
                    }
                </fieldset>
            </li>
        );
    }
}