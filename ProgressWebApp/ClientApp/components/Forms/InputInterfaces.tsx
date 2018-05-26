import * as React from 'react';

export enum InputWidth {
    "full", "empty", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "any",
    "twelve", "sixth", "quorter", "third", "fiveTwelveth", "half", "sevenTwelveth", "twoThirds", "threeQuorters", "fiveSixth"
}

export function GetInputWidthClass(iw : InputWidth) : string{
    switch (iw) {
        case InputWidth.twelve:
        case InputWidth.full:
            return " col-lg-12 "
        case InputWidth.two:
        case InputWidth.sixth:
            return " col-lg-2 "
        case InputWidth.three:
        case InputWidth.quorter:
            return " col-lg-3 "
        case InputWidth.four:
        case InputWidth.third:
            return " col-lg-4 "
        case InputWidth.five:
        case InputWidth.fiveTwelveth:
            return " col-lg-5 "
        case InputWidth.six:
        case InputWidth.half:
            return " col-lg-6 "
        case InputWidth.seven:
        case InputWidth.sevenTwelveth:
            return " col-lg-7 "
        case InputWidth.eight:
        case InputWidth.twoThirds:
            return " col-lg-8 "
        case InputWidth.nine:
        case InputWidth.threeQuorters:
            return " col-lg-9 "
        case InputWidth.ten:
        case InputWidth.fiveSixth:
            return " col-lg-10 "
    }
    return ""
}

export class InputEvent{
    value: string;
    valid: boolean;

    constructor(value: string, valid: boolean) {
        this.value = value;
        this.valid = valid;
    }
}