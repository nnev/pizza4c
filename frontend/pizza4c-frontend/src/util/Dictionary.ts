export default interface Dictionary<T = any> {
    [key: string]: T;
}

export function mapToDictionary(input: Map<string, Set<string>>): Dictionary<string[]> {
    let result: Dictionary<string[]> = {}
    for (let [k, v] of input.entries()) {
        result[k] = [...v.values()]
    }

    return result;
}

export function dictionaryToMap(input: Dictionary<string[]>): Map<string, Set<string>> {
    let result: Map<string, Set<string>> = new Map<string, Set<string>>();
    for (let inputKey in input) {
        result.set(inputKey, new Set<string>(input[inputKey]))
    }
    return result;
}

export function chooseRandomDict<T = any>(dict: Dictionary<T>): [string, T] | undefined {
    let keys = [];
    for (let key in dict) {
        keys.push(key);
    }

    let selectedKey = chooseRandomArray(keys);
    if (selectedKey == undefined)
        return undefined;
    return [selectedKey, dict[selectedKey]]
}

export function chooseRandomArray<T = any>(values: T[]): T | undefined {
    if (values.length == 0) {
        return undefined;
    }

    return values[Math.floor(Math.random() * values.length)];
}

export function chooseRandomInt(min: number, max: number): number {
    return min + Math.floor(Math.random() * (max - min));
}