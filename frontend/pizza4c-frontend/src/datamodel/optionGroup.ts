export interface OptionGroup {
    name: string;
    isTypeMulti: boolean;
    isRequired: boolean;
    minChoices: Number;
    maxChoices: Number;
    optionIds: string[];
}

export function isConfigurableOptionGroup(optionGroup: OptionGroup): boolean {
    return optionGroup.optionIds.length > 0;
}