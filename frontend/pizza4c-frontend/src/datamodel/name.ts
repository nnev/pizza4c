import {Observable} from "../util/Observable.ts";

export class Name {
    private static ADJECTIVES: string[] = [
        "amiable",
        "awful",
        "bashful",
        "bountiful",
        "cheerful",
        "childish",
        "chilly",
        "disgusting",
        "dizzy",
        "dreary",
        "dusty",
        "elegant",
        "exhausted",
        "famous",
        "fanciful",
        "flabbergasted",
        "freaky",
        "gleeful",
        "graceful",
        "horrid",
        "humid",
        "humorous",
        "hyper",
        "impish",
        "irritated",
        "jittery",
        "jovial",
        "jubilant",
        "keen",
        "kind",
        "livid",
        "mimic",
        "miserly",
        "monsterous",
        "needless",
        "noble",
        "obstinate",
        "outrageous",
        "outstanding",
        "over-whelmed",
        "pathetic",
        "patient",
        "perplexed",
        "puzzled",
        "quaint",
        "quick",
        "radical",
        "ravishing",
        "sensational",
        "skeptical",
        "sneaky",
        "snobbish",
        "squirrely",
        "stormy",
        "tranquil",
        "useful",
        "verbal",
        "vexing",
        "windy",
        "yawning",
        "young",
        "zealous",
        "zippy"
    ]

    private static ANIMALS: string[] = [
        "Ant",
        "Antelope",
        "Ape",
        "Ass",
        "Badger",
        "Bat",
        "Bear",
        "Beaver",
        "Bird",
        "Boar",
        "Camel",
        "Canary",
        "Cat",
        "Cheetah",
        "Chicken",
        "Chimpanzee",
        "Chipmunk",
        "Cow",
        "Crab",
        "Crocodile",
        "Deer",
        "Dog",
        "Dolphin",
        "Donkey",
        "Duck",
        "Eagle",
        "Elephant",
        "Ferret",
        "Fish",
        "Fox",
        "Frog",
        "Goat",
        "Hamster",
        "Hare",
        "Horse",
        "Kangaroo",
        "Leopard",
        "Lion",
        "Lizard",
        "Mole",
        "Monkey",
        "Mousedeer",
        "Mule",
        "Ostritch",
        "Otter",
        "Panda",
        "Parrot",
        "Pig",
        "Polecat",
        "Porcupine",
        "Rabbit",
        "Rat",
        "Rhinoceros",
        "Seal",
        "Sheep",
        "Snake",
        "Squirrel",
        "Tapir",
        "Tiger",
        "Toad",
        "Tortoise",
        "Walrus",
        "Whale",
        "Wolf",
        "Zebra"
    ]

    private static COLORS: string[] = [
        "Amber",
        "Beige",
        "Black",
        "Blue",
        "Brown",
        "Crimson",
        "Cyan",
        "Fuchsia",
        "Gray",
        "Green",
        "Indigo",
        "Jade",
        "Lime",
        "Magenta",
        "Navy",
        "Olive",
        "Olive",
        "Orange",
        "Pink",
        "Purple",
        "Red",
        "Scarlet",
        "Silver",
        "Teal",
        "Turquoise",
        "Violet",
        "White",
        "Yellow"
    ]

    public shortName: string;
    public longName: string;
    public stored: boolean;

    constructor(shortName: string, longName: string, stored: boolean) {
        this.shortName = shortName;
        this.longName = longName;
        this.stored = stored;
    }

    private static randomInt(max: number): number {
        return Math.floor(Math.random() * max);
    }

    public static generateNewName(): Name {
        let adjective = Name.ADJECTIVES[Name.randomInt(Name.ADJECTIVES.length)];
        let colors = Name.COLORS[Name.randomInt(Name.COLORS.length)];
        let animal = Name.ANIMALS[Name.randomInt(Name.ANIMALS.length)];


        let longName = adjective + colors + animal;
        let shortName = (adjective.charAt(0) + "" + colors.charAt(0) + "" + animal.charAt(0)).toUpperCase();

        return new Name(shortName, longName, false);
    }

    public static fromLongName(longName: string): Name {
        let shortName = longName.substring(0, 3).toUpperCase();
        return new Name(shortName, longName, false);
    }

    public asBody() {
        return {
            longName: this.longName,
            shortName: this.shortName,
        }
    }
}

export const UserNameObservable = new Observable<Name>({});

export function getMyName(): Name {
    if (!UserNameObservable.hasValue()) {
        let userNameShort = window.localStorage.getItem("userNameShort");
        let userNameLong = window.localStorage.getItem("userNameLong");

        if (userNameShort && userNameLong) {
            UserNameObservable.setValue(new Name(userNameShort, userNameLong, true));
        } else {
            setMyName(Name.generateNewName(), false);
        }
    }

    return UserNameObservable.getValue();
}

export function setMyName(name: Name, mayStore: boolean) {
    name.stored = mayStore;
    UserNameObservable.setValue(name);
    if (mayStore) {
        window.localStorage.setItem("userNameShort", name.shortName);
        window.localStorage.setItem("userNameLong", name.longName);
    } else {
        window.localStorage.clear();
    }
}