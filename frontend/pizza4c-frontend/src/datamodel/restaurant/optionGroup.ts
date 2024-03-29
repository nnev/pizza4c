export interface OptionGroup {
    name: string;
    isTypeMulti: boolean;
    isRequired: boolean;
    minChoices: number;
    maxChoices: number;
    optionIds: string[];
}

export function isConfigurableOptionGroup(optionGroup: OptionGroup): boolean {
    return optionGroup.optionIds.length > 0;
}

export function isOptionGroupMandatory(optionGroup: OptionGroup) {
    return optionGroup.minChoices === 1 && optionGroup.maxChoices === 1;
}