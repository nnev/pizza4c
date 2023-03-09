export type Listener<T> = (t: T) => void

export class Observable<T> {
    private listeners: Listener<T>[] = [];
    private value?: T;
    private readonly initializer: () => (T | undefined);

    constructor({initializer, initialValue}: { initializer?: () => T, initialValue?: T }) {
        if (initializer != undefined) {
            this.initializer = initializer!;
        } else {
            this.initializer = () => initialValue;
        }
    }

    public subscribe(listener: Listener<T>) {
        this.listeners.push(listener);
        if (this.value !== undefined) {
            listener(this.value);
        }
    }

    public unsubscribe(listener: Listener<T>) {
        this.listeners = this.listeners.filter(value => value !== listener)
    }

    public setValue(value: T | undefined) {
        this.value = value;
        this.listeners.forEach(listener => listener.call(listener, this.value!))
    }

    public getValue(): T {
        if (this.value === undefined) {
            this.setValue(this.initializer());
        }
        return this.value!;
    }
    public getValueMaybe(): T | undefined {
        if (this.value === undefined) {
            this.setValue(this.initializer());
        }
        return this.value;
    }

    public hasValue(): boolean {
        return this.value !== undefined;
    }
}