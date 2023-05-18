import {BACKEND} from "./Constants.ts";

export function renderPdf() {
    window.open(BACKEND + "/generatePdf");
    /*
    return fetch(BACKEND + "/generatePdf", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: ""
    })
        .then(value => value.blob())
        .then(value => {
            value.text().then(value1 => window.open(value1));
            return value;
        })*/
}