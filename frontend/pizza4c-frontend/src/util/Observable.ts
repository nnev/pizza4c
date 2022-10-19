export type Listener<T> = (t: T) => void

export class Observable<T> {
    private listeners: Listener<T>[] = [];
    private value?: T;

    constructor() {
        this.value = undefined;
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

    public setValue(value: T) {
        this.value = value;
        if (this.value) {
            this.listeners.forEach(listener => listener.call(listener, this.value!))
        }
    }

    public getValue(): T {
        return this.value!;
    }

    public hasValue(): boolean {
        return this.value !== undefined;
    }
}