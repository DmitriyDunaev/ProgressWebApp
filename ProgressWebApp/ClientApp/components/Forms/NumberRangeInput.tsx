import * as React from 'react';
import { InputEvent, InputWidth, GetInputWidthClass } from './InputInterfaces'

enum RangeValidationFlags { "TooLow", "TooHigh", "valid", "invalid" }//internal

export interface LocalNumberInput {
    placeholder?: string                           //text displayed when the second field is empty
    initialValue?: number                          //second staring value
    prepend?: string;                              //text before the field (not rendered if empty)
    append?: string;                               //text after the field, if no validation (not rendered if empty and not validated)
    onChange?: (value: InputEvent) => void;        //event triggered when the content of the field changes
    onValidityChange?: (value: InputEvent) => void;//event triggered when validity changes
    onFocus?: (value: InputEvent) => void;         //event triggered when field is selected
    onBlur?: (value: InputEvent) => void;          //event triggered when field is deselected\
}

//Constant parameters
interface NumberRangeInputProps {
    description?: string                                //text renered before both fields
    upper: LocalNumberInput             
    lower: LocalNumberInput
    integer?: boolean;                                  //used to limit output to integers
    validation?: boolean;                               //turns on validation (general)
    initialValidity?: boolean;                          //determines initial validity
    validationIndicator?: boolean                       //determines if the vakidation indicator will be shown at the right
    rangeValidation?: boolean                           //turns on range validation (irrelevant if "validation" == false)
    min?: number;                                       //minimum value (range validation condition)
    max?: number;                                       //minimum value (range validation condition)
    className?: string                                  //HTML classes
    width?: InputWidth                                  //specify the width of the input
    disabled?: boolean                                  //disables the input and alteres styles
};

//Dynamic parameters (referenced by reder)
interface NumberRangeInputState {
    untouched: boolean;                                 //true until first onChange event
    validRangeUpper: RangeValidationFlags;              //describes if the content satisfy the length restrictions { "TooShort", "TooLong", "valid" }
    validRangeLower: RangeValidationFlags;              //describes if the content satisfy the length restrictions { "TooShort", "TooLong", "valid" }
    nonEmptyRabge: boolean                              // false if lower > upper
    valid: boolean;                                     //true if all conditions are satisfied
}

export class NumberRangeInput extends React.Component<NumberRangeInputProps, NumberRangeInputState> {

    //Default properties for when they are unspecified
    public static defaultProps: Partial<NumberRangeInputProps> = {
        upper: {
            prepend: "",
            append: "",
        },
        lower: {
            prepend: "",
            append: "",
        },
        integer: false,
        validation: false,
        validationIndicator: true,
        rangeValidation: false,
        initialValidity: true,
        min: 0,
        max: Number.MAX_VALUE,
        className: "",
        width: InputWidth.full,
        disabled: false,
    };

    //Holds the copy of the input value for quick global acess
    private valueUpper: number = 0
    private valueLower: number = 0

    //Initial state values
    constructor(props: NumberRangeInputProps) {
        super(props)
        if (this.props.upper.initialValue != undefined && (this.props.max == undefined || this.props.upper.initialValue <= this.props.max)
            && (this.props.min == undefined || this.props.upper.initialValue >= this.props.min)) {
            this.valueUpper = this.props.upper.initialValue
        }
        else {
            if (this.props.rangeValidation != undefined && this.props.rangeValidation && this.props.max != undefined) {
                this.valueUpper = this.props.max
            }
        }
        if (this.props.lower.initialValue != undefined && (this.props.max == undefined || this.props.lower.initialValue <= this.props.max)
            && (this.props.min == undefined || this.props.lower.initialValue >= this.props.min)) {
            this.valueLower = this.props.lower.initialValue
        }
        else {
            if (this.props.rangeValidation != undefined && this.props.rangeValidation && this.props.min != undefined) {
                this.valueLower = this.props.min
            }
        }
        this.state = {
            untouched: true,
            validRangeUpper: RangeValidationFlags.valid,
            validRangeLower: RangeValidationFlags.valid,
            nonEmptyRabge: true,
            valid: !this.props.validation || (this.props.initialValidity != undefined && this.props.initialValidity),
        };
    }

    //onChange Handeler, also generates events that can be handeled outside
    HandleChange(e: React.ChangeEvent<HTMLInputElement>, field: LocalNumberInput, lower: boolean) {
        if (lower) {
            if (this.props.integer) {
                this.valueLower = parseInt(e.target.value)
            } else {
                this.valueLower = parseFloat(e.target.value)
            }
        } else {
            if (this.props.integer) {
                this.valueUpper = parseInt(e.target.value)
            } else {
                this.valueUpper = parseFloat(e.target.value)
            }
        }
        if (parseFloat(e.target.value) != NaN) { 
            var temp = this.ValidityUpdate()
            if (field.onChange != undefined) {
                field.onChange(new InputEvent(e.target.value, temp))
            }
            if (this.state.valid != temp && field.onValidityChange != undefined) {
                field.onValidityChange(new InputEvent(e.target.value, temp))
            }
            if (this.state.untouched) {
                this.setState({ untouched: false })
            }
            if (!this.props.validation) {
                this.forceUpdate()
            }
        }
    }

    HandleFocus(e: React.FocusEvent<HTMLInputElement>, field: LocalNumberInput, lower: boolean) {
        if (field.onFocus != undefined) {
            var temp = ""
            if (lower) {
                temp = this.valueLower.toString()
            } else {
                temp = this.valueUpper.toString()
            }
            field.onFocus(new InputEvent(this.valueUpper.toString(), this.state.valid))
        }
        this.ValidityUpdate()
    }

    HandleBlur(e: React.FocusEvent<HTMLInputElement>, field: LocalNumberInput, lower: boolean) {
        if (field.onBlur != undefined) {
            var temp = ""
            if (lower) {
                temp = this.valueLower.toString()
            } else {
                temp = this.valueUpper.toString()
            }
            field.onBlur(new InputEvent(this.valueUpper.toString(), this.state.valid))
        }
        this.ValidityUpdate()
    }

    //Method for updating the value of "validLength", returns true if "validLength" == LengthValidationFlags.valid
    private IsRangeUpperValid(): boolean {
        var minV = this.props.min == undefined ||
            // this.props.min == 0 ||
            this.valueUpper >= this.props.min
        var maxV = this.props.max == undefined ||
            //this.props.max == 0 ||
            this.valueUpper <= this.props.max
            //|| (this.props.min != undefined && this.props.max < this.props.min)
        if (minV) {
            if (maxV) {
                this.setState({ validRangeUpper: RangeValidationFlags.valid })
                return true
            }
            this.setState({ validRangeUpper: RangeValidationFlags.TooHigh })
            return false
        }
        if (maxV) {
            this.setState({ validRangeUpper: RangeValidationFlags.TooLow })
            return false
        }
        this.setState({ validRangeUpper: RangeValidationFlags.invalid })
        return false
    }

    //Method for updating the value of "validLength", returns true if "validLength" == LengthValidationFlags.valid
    private IsRangeLowerValid(): boolean {
        var minV = this.props.min == undefined ||
            // this.props.min == 0 ||
            this.valueLower >= this.props.min
        var maxV = this.props.max == undefined ||
            //this.props.max == 0 ||
            this.valueLower <= this.props.max
        //|| (this.props.min != undefined && this.props.max < this.props.min)
        if (minV) {
            if (maxV) {
                this.setState({ validRangeLower: RangeValidationFlags.valid })
                return true
            }
            this.setState({ validRangeLower: RangeValidationFlags.TooHigh })
            return false
        }
        if (maxV) {
            this.setState({ validRangeLower: RangeValidationFlags.TooLow })
            return false
        }
        this.setState({ validRangeLower: RangeValidationFlags.invalid })
        return false
    }

    IsRangeNonEmpty(): boolean {
        var temp = this.valueLower <= this.valueUpper;
        this.setState({ nonEmptyRabge : temp })
        return temp
    }

    //Handels checking all conditions and updating the value of "valid", returns its value
    public ValidityUpdate(): boolean {
        if (this.props.validation) {
            var temp = true;
            temp = this.IsRangeNonEmpty() && temp
            if (this.props.rangeValidation) {
                temp = this.IsRangeUpperValid() && temp
                temp = this.IsRangeLowerValid() && temp
            }
            this.setState({ valid: temp })
            return temp
        } else {
            return true
        }
    }

    //Renders prepend if not empty (called by render)
    private RenderPrepend(field: LocalNumberInput) {
        var prepend = ""
        if (field.prepend != undefined) {
            prepend = field.prepend
        }
        if (prepend == "") {
            return null
        }
        else {
            return <div className=" input-group-addon">
                < span className="input-group-text" > {prepend}</span >
            </div >
        }
    }

    //Renders append if not empty or validation symbol, depending on setup (called by render)
    private RenderAppend(field: LocalNumberInput, lower: boolean) {
        if (this.props.validation && this.props.validationIndicator) {
            if (this.state.untouched) {
                return null
            }
            if ((this.state.validRangeLower == RangeValidationFlags.valid && lower) || (this.state.validRangeUpper == RangeValidationFlags.valid && !lower)) {
                return <div className=" input-group-addon" style={{ minWidth: 38 }}>
                    < span className="input-group-text" >✓</span >
                </div>
            } else { 
                return <div className=" input-group-addon" style={{ minWidth: 38 }}>
                    < span className="input-group-text" >✗</span >
                </div>
            }
        } else {
            var append = ""
            if (field.append != undefined) {
                append = field.append
            }
            if (append == "") {
                return null
            }
            else {
                return <div className=" input-group-addon">
                    < span className="input-group-text" >{append}</span >
                </div>
            }
        }
    }

    //Renders list of warnings that are dependant on statge flags (called by render)
    private RrenderWarningsUpper() {
        if (!this.props.validation || this.state.valid || this.state.untouched) {
            return null
        }
        else {
            var messages: string[] = []
            if (!this.state.nonEmptyRabge)
                messages.push("The value must be above or equal the lower value")
            if (this.state.validRangeUpper == RangeValidationFlags.TooLow)
                messages.push("The value must be " + this.props.min + " or above.")
            if (this.state.validRangeUpper == RangeValidationFlags.TooHigh)
                messages.push("The value must be " + this.props.max + " or below.")
            if (this.state.validRangeUpper == RangeValidationFlags.invalid)
                messages.push("The value is invalid.")
            return messages.map((message) => <div><label className="control-label">{message}</label></div>)
        }
    }

    private RrenderWarningsLower() {
        if (!this.props.validation || this.state.valid || this.state.untouched) {
            return null
        }
        else {
            var messages: string[] = []
            if (!this.state.nonEmptyRabge)
                messages.push("The value must be below or equal the upper value")
            if (this.state.validRangeLower == RangeValidationFlags.TooLow)
                messages.push("The value must be " + this.props.min + " or above.")
            if (this.state.validRangeLower == RangeValidationFlags.TooHigh)
                messages.push("The value must be " + this.props.max + " or below.")
            if (this.state.validRangeLower == RangeValidationFlags.invalid)
                messages.push("The value is invalid.")
            return messages.map((message) => <div><label className="control-label">{message}</label></div>)
        }
    } 

    RenderDecription() {
        if (this.props.description == undefined || this.props.description == "") {
            return null
        }
        return <div className="form-group col-lg-4">
            <div>
                <div className="form-control" style={{ backgroundColor: "#eeeeee" }}>
                    < span className="input-group-text control-label" >{this.props.description}</span >
                </div>
            </div>
        </div>
    }

    render() {
        var classes: string = ""
        var inputGroupStringUpper: string = ""
        var inputGroupStringLower: string = ""
        var widths = " col-lg-6 "
        if (this.props.description != undefined && this.props.description != "") {
            var widths = " col-lg-4 "
        }
        if (!(this.props.upper.prepend == "" && (
            (this.props.upper.append == "" && !this.props.validation) ||
            (this.props.upper.append == "" && this.props.validation && !this.props.validationIndicator) ||
            (this.props.validation && this.props.validationIndicator && this.state.untouched)))) {
            inputGroupStringUpper += "input-group"
        }
        if (!(this.props.lower.prepend == "" && (
            (this.props.lower.append == "" && !this.props.validation) ||
            (this.props.lower.append == "" && this.props.validation && !this.props.validationIndicator) ||
            (this.props.validation && this.props.validationIndicator && this.state.untouched)))) {
            inputGroupStringLower += "input-group"
        }
        if (this.props.className != undefined) {
           classes += this.props.className
        }
        if (!this.state.untouched && this.props.validation && !this.props.disabled) {
            if (this.state.valid) {
                classes += " has-success "
            } else {
                classes += " has-error "
            }
        }
        if (this.props.width != undefined) {
            classes += GetInputWidthClass(this.props.width)
        }
        return <div className="form-row row">
            {this.RenderDecription()}
            <div className={"form-group " + widths + classes}>
                <div className={inputGroupStringLower }>
                    {this.RenderPrepend(this.props.lower)}
                    <input type="number"
                        className="form-control"
                        style={{ zIndex: 0 }}
                        spellCheck={true}
                        value={this.valueLower}
                        placeholder={this.props.lower.placeholder}
                        onChange={(e) => this.HandleChange(e, this.props.lower, true)}
                        onFocus={(e) => this.HandleFocus(e, this.props.lower, true)}
                        onBlur={(e) => this.HandleBlur(e, this.props.lower, true)}
                        //min={this.props.min}
                        //max={this.props.max}
                        disabled={this.props.disabled}
                    />
                    {this.RenderAppend(this.props.lower, true)}
                </div>
                {this.RrenderWarningsLower()}
            </div>
            <div className={"form-group " + widths + classes}>
                <div className={inputGroupStringUpper}>
                    {this.RenderPrepend(this.props.upper)}
                    <input type="number"
                        className="form-control"
                         style={{ zIndex: 0 }}
                        spellCheck={true}
                        value={this.valueUpper}
                        placeholder={this.props.upper.placeholder}
                        onChange={(e) => this.HandleChange(e, this.props.upper, false)}
                        onFocus={(e) => this.HandleFocus(e, this.props.upper, false)}
                        onBlur={(e) => this.HandleBlur(e, this.props.upper, false)}
                        //min={this.props.min}
                        //max={this.props.max}
                        disabled={this.props.disabled}
                    />
                    {this.RenderAppend(this.props.upper, false)}
                </div>
                {this.RrenderWarningsUpper()}
            </div>
        </div>
    };
}