import * as React from 'react';
import { InputEvent, InputWidth, GetInputWidthClass } from './InputInterfaces'

enum RangeValidationFlags { "TooLow", "TooHigh", "valid" }//internal

//Constant parameters
interface NumberInputProps {
    label?: string;                                     //text above the field (not rendered if empty)
    placeholder?: string                                //text displayed when the field is empty
    initialValue?: number                               //staring value
    prepend?: string;                                   //text before the field (not rendered if empty)
    append?: string;                                    //text after the field, if no validation (not rendered if empty and not validated)
    integer?: boolean;                                  //used to limit output to integers
    validation?: boolean;                               //turns on validation (general)
    initialValidity?: boolean;                          //determines initial validity
    validationIndicator?: boolean                       //determines if the vakidation indicator will be shown at the right
    rangeValidation?: boolean                           //turns on range validation (irrelevant if "validation" == false)
    min?: number;                                       //minimum value (range validation condition)
    max?: number;                                       //minimum value (range validation condition)
    onChange?: (value: InputEvent) => void;             //event triggered when the content of the field changes
    onValidityChange?: (value: InputEvent) => void;     //event triggered when validity changes
    onFocus?: (value: InputEvent) => void;              //event triggered when field is selected
    onBlur?: (value: InputEvent) => void;               //event triggered when field is deselected
    className?: string                                  //HTML classes
    width?: InputWidth                                  //specify the width of the input
};

//Dynamic parameters (referenced by reder)
interface NumberInputState {
    untouched: boolean;                                 //true until first onChange event
    validRange: RangeValidationFlags;                   //describes if the content satisfy the length restrictions { "TooShort", "TooLong", "valid" }
    valid: boolean;                                     //true if all conditions are satisfied
}

export class NumberInput extends React.Component<NumberInputProps, NumberInputState> {

    //Default properties for when they are unspecified
    public static defaultProps: Partial<NumberInputProps> = {
        label: "",
        prepend: "",
        placeholder: "",
        append: "",
        integer: false,
        validation: false,
        validationIndicator: true,
        rangeValidation: false,
        initialValidity: true,
        min: 0,
        max: Number.MAX_VALUE,
        className: "",
        width: InputWidth.full,
    };

    //Holds the copy of the input value for quick global acess
    private value: number = 0

    //Initial state values
    constructor(props: NumberInputProps) {
        super(props)
        if (this.props.initialValue != undefined && (this.props.min == undefined || this.props.initialValue <= this.props.min)) {
            this.value = this.props.initialValue
        }
        else {
            if (this.props.rangeValidation != undefined && this.props.rangeValidation && this.props.min != undefined) {
                this.value = this.props.min
            }
        }
        this.state = {
            untouched: true,
            validRange: RangeValidationFlags.valid,
            valid: !this.props.validation || (this.props.initialValidity != undefined && this.props.initialValidity),
        };
    }

    //onChange Handeler, also generates events that can be handeled outside
    HandleChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (this.props.integer) {
            this.value = parseInt(e.target.value)
        } else {
            this.value = parseFloat(e.target.value)
        }
        var temp = this.ValidityUpdate()
        if (this.props.onChange != undefined) {
            this.props.onChange(new InputEvent(e.target.value, temp))
        }
        if (this.state.valid != temp && this.props.onValidityChange != undefined) {
            this.props.onValidityChange(new InputEvent(e.target.value, temp))
        }
        if (this.state.untouched) {
            this.setState({ untouched: false })
        }
        if (!this.props.validation) {
            this.forceUpdate()
        }
    }

    HandleFocus(e: React.FocusEvent<HTMLInputElement>) {
        if (this.props.onFocus != undefined) {
            this.props.onFocus(new InputEvent(this.value.toString(), this.state.valid))
        }
    }

    HandleBlur(e: React.FocusEvent<HTMLInputElement>) {
        if (this.props.onBlur != undefined) {
            this.props.onBlur(new InputEvent(this.value.toString(), this.state.valid))
        }
    }

    //Method for updating the value of "validLength", returns true if "validLength" == LengthValidationFlags.valid
    IsLengthValid(): boolean {
        var minV = this.props.min == undefined || this.props.min == 0 || this.value >= this.props.min
        var maxV = this.props.max == undefined || this.props.max == 0 || this.value <= this.props.max
            || (this.props.min != undefined && this.props.max < this.props.min)
        if (minV) {
            if (maxV) {
                this.setState({ validRange: RangeValidationFlags.valid })
                return true
            }
            this.setState({ validRange: RangeValidationFlags.TooHigh })
            return false
        }
        this.setState({ validRange: RangeValidationFlags.TooLow })
        return false
    }

    //Handels checking all conditions and updating the value of "valid", returns its value
    ValidityUpdate(): boolean {
        if (this.props.validation) {
            var temp = true;
            if (this.props.rangeValidation) {
                temp = temp && this.IsLengthValid()
            }
            this.setState({ valid: temp })
            return temp
        } else {
            return true
        }
    }

    //Renders label if not empty (called by render)
    RrenderLabel() {
        if (this.props.label == "") {
            return null
        }
        else {
            return <label> {this.props.label} </label>
        }
    };

    //Renders prepend if not empty (called by render)
    RenderPrepend() {
        if (this.props.prepend == "") {
            return null
        }
        else {
            return <div className=" input-group-addon">
                < span className="input-group-text" > {this.props.prepend}</span >
            </div >
        }
    }

    //Renders append if not empty or validation symbol, depending on setup (called by render)
    RenderAppend() {
        if (this.props.validation && this.props.validationIndicator) {
            if (this.state.untouched) {
                return null
            }
            if (this.state.valid) {
                return <div className=" input-group-addon" style={{ minWidth: 38 }}>
                    < span className="input-group-text" >✓</span >
                </div>
            }
            return <div className=" input-group-addon" style={{ minWidth: 38 }}>
                < span className="input-group-text" >✗</span >
            </div>
        } else {
            if (this.props.append == "") {
                return null
            }
            else {
                return <div className=" input-group-addon">
                    < span className="input-group-text" >{this.props.append}</span >
                </div>
            }
        }
    }

    //Renders list of warnings that are dependant on statge flags (called by render)
    RrenderWarnings() {
        if (!this.props.validation || this.state.valid || this.state.untouched) {
            return null
        }
        else {
            var messages: string[] = []
            switch (this.state.validRange) {
                case RangeValidationFlags.TooLow:
                    messages.push("The value must be " + this.props.min + " or above.")
                    break
                case RangeValidationFlags.TooHigh:
                    messages.push("Ther value must be " + this.props.max + " or below.")
                    break
            }
            return messages.map((message) => <label className="control-label">{message}</label>)
        }
    }

    render() {
        var classes: string = ""
        var inputGroupString: string = ""
        if (!(this.props.prepend == "" && (
            (this.props.append == "" && !this.props.validation) ||
            (this.props.append == "" && this.props.validation && !this.props.validationIndicator) ||
            (this.props.validation && this.props.validationIndicator && this.state.untouched)))) {
            inputGroupString += "input-group"
        }
        if (this.props.className != undefined) {
           classes += this.props.className
        }
        if (!this.state.untouched && this.props.validation) {
            if (this.state.valid) {
                classes += " has-success "
            } else {
                classes += " has-error "
            }
        }
        if (this.props.width != undefined) {
            classes += GetInputWidthClass(this.props.width)
        }
        return <div className={"form-group" + classes}>
            {this.RrenderLabel()}
            <div className={inputGroupString}>
                {this.RenderPrepend()}
                <input type="number"
                    className="form-control"
                    style={{ zIndex: 0 }}
                    spellCheck={true}
                    aria-label={this.props.label}
                    value={this.value}
                    placeholder={this.props.placeholder}
                    onChange={(e) => this.HandleChange(e)}
                    onFocus={(e) => this.HandleFocus(e)}
                    onBlur={(e) => this.HandleBlur(e)}
                    min={this.props.min}
                    max={this.props.max}
                />
                {this.RenderAppend()}
            </div>
            {this.RrenderWarnings()}
        </div>
    };
}