import * as React from 'react';
import { InputEvent, InputWidth, GetInputWidthClass } from './InputInterfaces'

enum LengthValidationFlags { "TooShort", "TooLong", "valid", "invalid" }//internal
enum EMailValidationFlags { "NoAt", "ForbiddenSymbol", "InvalidHost", "valid", "invalid" }//internal

//Constant parameters
interface TextInputProps {
    label?: string;                                     //text above the field (not rendered if empty)
    placeholder?: string                                //text displayed when the field is empty
    initialValue?: string                               //text entered from the start
    prepend?: string;                                   //text before the field (not rendered if empty)
    append?: string;                                    //text after the field, if no validation (not rendered if empty and not validated)
    validation?: boolean;                               //turns on validation (general)
    initialValidity?: boolean;                          //determines initial validity
    validationIndicator?: boolean                       //determines if the vakidation indicator will be shown at the right
    lengthValidation?: boolean                          //turns on length validation (irrelevant if "validation" == false)
    min?: number;                                       //minimum number of characters (length validation condition) (ignored if 0)
    max?: number;                                       //minimum number of characters (length validation condition) (ignored if 0)
    oneWordValidation?: boolean;                        //activates field validation for not containing ' '
    emailValidation?: boolean;                          //activates field validation for email
    warningsVal?: boolean;                              //enables warnings in general (WIP)
    onChange?: (value: InputEvent) => void;             //event triggered when the content of the field changes
    onValidityChange?: (value: InputEvent) => void;     //event triggered when validity changes
    onFocus?: (value: InputEvent) => void;              //event triggered when field is selected
    onBlur?: (value: InputEvent) => void;               //event triggered when field is deselected
    className?: string                                  //HTML classes
    password?: boolean                                   //
    width?: InputWidth                                  //specify the width of the input
    disabled?: boolean                                  //disables the input and alteres styles
};

//Dynamic parameters (referenced by reder)
interface TextInputState {
    untouched: boolean;                                 //true until first onChange event
    validLength: LengthValidationFlags;                 //describes if the content satisfy the length restrictions { "TooShort", "TooLong", "valid" }
    validOneWord: boolean;                              //describes if the content satisfy the condition of being one word.
    validEmail: EMailValidationFlags;                   //describes if the content satisfy could be a valid email
    valid: boolean;                                     //true if all conditions are satisfied
}

export class TextInput extends React.Component<TextInputProps, TextInputState> {

    //Default properties for when they are unspecified
    public static defaultProps: Partial<TextInputProps> = {
        label: "",
        prepend: "",
        placeholder: "",
        initialValue: "",
        append: "",
        validation: false,
        validationIndicator: true,
        lengthValidation: false,
        min: 0,
        max: 0,
        oneWordValidation: false,
        emailValidation: false,
        warningsVal: true,
        password: false,
        className: "",
        width: InputWidth.full,
        disabled: false,
    };


    //Holds the copy of the input value for quick global acess
    private text: string = ""

    //Initial state values
    constructor(props: TextInputProps) {
        super(props)
        if (this.props.initialValue != undefined) {
            this.text = this.props.initialValue
        }
        this.state = {
            untouched: true,
            validLength: LengthValidationFlags.invalid,
            validOneWord: true,
            validEmail: EMailValidationFlags.invalid,
            valid: !this.props.validation || (this.props.initialValidity != undefined && this.props.initialValidity),
        };
    }

    //onChange Handeler, also generates events that can be handeled outside
    HandleChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.text = e.target.value
        var temp = this.ValidityUpdate()
        if (this.props.onChange != undefined) {
            this.props.onChange(new InputEvent(this.text, temp))
        }
        if (this.state.valid != temp && this.props.onValidityChange != undefined) {
            this.props.onValidityChange(new InputEvent(this.text, temp))
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
            this.props.onFocus(new InputEvent(this.text, this.state.valid))
        }
    }

    HandleBlur(e: React.FocusEvent<HTMLInputElement>) {
        if (this.props.onBlur != undefined) {
            this.props.onBlur(new InputEvent(this.text, this.state.valid))
        }
    }

    //Method for updating the value of "validLength", returns true if "validLength" == LengthValidationFlags.valid
    IsLengthValid(): boolean{
        var minV = this.props.min == undefined || this.props.min == 0 || this.text.length >= this.props.min
        var maxV = this.props.max == undefined || this.props.max == 0 || this.text.length <= this.props.max
            || (this.props.min != undefined && this.props.max < this.props.min)
        if (minV) {
            if (maxV) {
                this.setState({ validLength: LengthValidationFlags.valid })
                return true
            }
            this.setState({ validLength: LengthValidationFlags.TooLong })
            return false
        }
        this.setState({ validLength: LengthValidationFlags.TooShort })
        return false
    }

    IsOneWord() {
        var temp = this.text.search(' ') == -1
        this.setState({ validOneWord: temp })
        return temp
    }

    IsEmail() {
        if (this.IsOneWord()) {
            if (this.text.indexOf('@') != -1) {
                var strings = this.text.split('@')
                if (strings.length == 2) {
                    if (strings[1].indexOf('.') > 0 && strings[1].indexOf('.') < (strings[1].length-1)) {
                        this.setState({ validEmail: EMailValidationFlags.valid })
                        return true
                    }
                    else {
                        this.setState({ validEmail: EMailValidationFlags.InvalidHost })
                        return false
                    }
                }
                this.setState({ validEmail: EMailValidationFlags.ForbiddenSymbol })
                return false
            }
            else {
                this.setState({ validEmail: EMailValidationFlags.NoAt })
                return false
            }
        }
        else {
            console.log("!")
            this.setState({ validEmail: EMailValidationFlags.ForbiddenSymbol })
            return false
        }
    }

    //Handels checking all conditions and updating the value of "valid", returns its value
    ValidityUpdate(): boolean {
        if (this.props.validation) {
            var temp = true;
            if (this.props.lengthValidation) {
                temp = temp && this.IsLengthValid()
            }
            if (this.props.oneWordValidation) {
                temp = temp && this.IsOneWord()
            }
            if (this.props.emailValidation && !this.props.password) {
                temp = temp && this.IsEmail()
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
    };

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
            if (this.state.validLength == LengthValidationFlags.TooShort)
                messages.push("There must be at least " + this.props.min + " characters.")
            if (this.state.validLength == LengthValidationFlags.TooLong)
                messages.push("There could be at most " + this.props.max + " characters.")
            if (!this.state.validOneWord && this.props.oneWordValidation)
                messages.push("This field should contain a single word")
            if (this.state.validEmail == EMailValidationFlags.ForbiddenSymbol)
                messages.push("There is an invalid symbol in the adress")
            if (this.state.validEmail == EMailValidationFlags.NoAt)
                messages.push("The '@' is missing")
            if (this.state.validEmail == EMailValidationFlags.InvalidHost)
                messages.push("There is an invalid host name (text after '@')")
            return messages.map((message) => <div><label className="control-label">{message}</label></div>)
        }
    }

    render() {
        var classes: string = ""
        var inputGroupString: string = ""
        var type: string = "text"
        if (this.props.password) {
            type = "password"
        } else {
            if (this.props.emailValidation) {
                type = "email"
            }
        }
        if (!(this.props.prepend == "" && (
            (this.props.append == "" && !this.props.validation) ||
            (this.props.append == "" && this.props.validation && !this.props.validationIndicator) ||
            (this.props.validation && this.props.validationIndicator && this.state.untouched)))) {
            inputGroupString += "input-group"
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
        return <div className={"form-group" + classes}>
            {this.RrenderLabel()}
            <div className={inputGroupString}>
                {this.RenderPrepend()}
                <input type={type}
                    className="form-control"
                    style={{ zIndex: 0 }}
                    spellCheck={true}
                    aria-label={this.props.label}
                    value={this.text}
                    placeholder={this.props.placeholder}
                    onChange={(e) => this.HandleChange(e)}
                    onFocus={(e) => this.HandleFocus(e)}
                    onBlur={(e) => this.HandleBlur(e)}
                    disabled={this.props.disabled}
                />
                {this.RenderAppend()}
            </div>
            {this.RrenderWarnings()}
        </div>
    };
}