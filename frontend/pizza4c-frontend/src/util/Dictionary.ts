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