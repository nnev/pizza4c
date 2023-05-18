import React from "react";

interface ProductEntryProps {
    text: string
}

interface ProductEntryState {
}

export class WordBreakHelper extends React.Component<ProductEntryProps, ProductEntryState> {
    constructor(props: ProductEntryProps, context: any) {
        super(props, context);
    }

    private replacements: { [key: string]: (React.ReactElement | string)[] } = {
        "Hähnchenbruststreifen": ["Hähnchen", <wbr />, "brust", <wbr />, "streifen"],
        "-Burger": ["-", <wbr />, "Burger"],
        "burger": [<wbr />, "burger"],
    }

    private replaceAsArray(text: (React.ReactElement | string)[]): (React.ReactElement | string)[] {
        let result = [];
        let anyChange = false;
        for (let i = 0; i < text.length; i++) {
            let part = text[i];
            let anyMatch = false;
            console.log(typeof part)
            if (typeof part === "string") {
                for (let replacementsKey in this.replacements) {
                    let indexOf = part.indexOf(replacementsKey);
                    if (indexOf >= 0 && part != replacementsKey) {
                        result.push(part.substring(0, indexOf))
                        result.push(...this.replacements[replacementsKey])
                        result.push(part.substring(indexOf + replacementsKey.length))
                        anyChange = true;
                        anyMatch = true;
                    }
                }
            }

            if (!anyMatch) {
                result.push(part)
            }
        }

        console.log(result)
        if (anyChange) {
            return this.replaceAsArray(result)
        }
        return result
    }

    render() {
        return this.replaceAsArray([this.props.text]);
    }
}