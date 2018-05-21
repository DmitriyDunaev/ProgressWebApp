import * as React from 'react';

export enum InputWidth {"full", "half", "third", "quorter", "twoThirds"}

export class InputValue{
    value: string;
    valid: boolean;
    teargert: HTMLInputElement;

    constructor(value: string, valid: boolean, teargert: HTMLInputElement) {
        this.value = value;
        this.valid = valid;
        this.teargert = teargert;
    }
}