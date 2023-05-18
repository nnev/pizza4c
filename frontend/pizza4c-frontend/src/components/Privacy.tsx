import React from "react";

export default class Privacy extends React.Component<any, any> {
    render() {
        return (
            <main className="notSide privacy">
                <h1>Deine Daten und Du</h1>
                <ul>
                    <li>Bis du auf "Zur Bestellung hinzufügen" klickst werden keine Daten zu unserem Server übertragen.</li>
                    <li>Mit dem Hinzufügen deiner Bestellung zum gemeinsamen Warenkorb, wird dein gewählter Nickname und der Inhalt deiner Bestellung mit unserem Server geteilt.</li>
                    <li>Durch das Hinzufügen deiner Bestellung zum gemeinsamen Warenkorb, wird dein gewählter Nickname und der Inhalt deiner Bestellung von öffentlich sichtbar.</li>
                    <li>Durch die Auswahl von "Bezahlt setzen" bzw "Unbezahlt setzen" wird der Bezahlstatus deiner Bestellung mit unserem Server geteilt und öffentlich sichtbar.</li>
                    <li>Der gemeinsame Warenkorb wird bis maximal 6Uhr am nächsten Morgen vorgehalten.</li>
                    <li>Wenn eine Bestellung zusammenkommt und versendet wird, wird dein Kürzel, sowie die bestellten Produkte mit dem ausgewählten Lieferdienst geteilt.</li>
                    <li>Wenn du unter "Ich bin nicht ..." einen neuen Namen wählst, hast du die Option deinen neuen Nicknamen zu speichern.
                        Die Speicherung erfolgt ausschließlich im lokalen Speicher deines Browsers und wird nicht automatisch übertragen.
                        Erst bei einer zusätzlichen Bestellung (Siehe 1.) wird eine Bestellung unter deinem neuen Nicknamen angelegt.</li>
                </ul>
            </main>
        );
    }
}