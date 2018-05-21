import * as React from 'react';

export enum InputWidth {"full", "half", "third", "quorter", "twoThirds"}

export class InputEvent{
    value: string;
    valid: boolean;

    constructor(value: string, valid: boolean) {
        this.value = value;
        this.valid = valid;
    }
}