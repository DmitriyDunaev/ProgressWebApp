import * as React from 'react';
import { InputValue } from './InputInterfaces'

 enum LengthValidationFlags { "TooShort", "TooLong", "valid" }//internal

//Constant parameters
interface TextInputProps {
    label?: string;                                     //text above the field (not rendered if empty)
    prepend?: string;                                   //text before the field (not rendered if empty)
    append?: string;                                    //text after the field, if no validation (not rendered if empty and not validated)
    validation?: boolean;                               //turns on validation (general)
    lengthValidation?: boolean                          //turns on length validation (irrelevant if "validation" == false)
    min?: number;                                       //minimum number of characters (length validation condition) (ignored if 0)
    max?: number;                                       //minimum number of characters (length validation condition) (ignored if 0)
    onChange?: (value: InputValue) => void;             //event triggered when the content of the field changes
    onValidityChange?: (value: InputValue) => void;     //event triggered when validity changes
};

//Dynamic parameters (referenced by reder)
interface TextInputState {
    untouched: boolean;                                 //true until first onChange event
    validLength: LengthValidationFlags;                 //describes if the content satisfy the length restrictions { "TooShort", "TooLong", "valid" }
    valid: boolean;                                     //true of all conditions are satisfied
}

export class TextInput extends React.Component<TextInputProps, TextInputState> {

    //Default properties for when they are unspecified
    public static defaultProps: Partial<TextInputProps> = {
        label: "",
        prepend: "",
        append: "",
        validation: false,
        lengthValidation: false,
        min: 0,
        max: 0,
    };

    //Holds the copy of the input value for quick global acess
    private text: string = ""

    //Default state values
    constructor(props: TextInputProps) {
        super(props)
        this.state = {
            untouched: true,
            validLength: LengthValidationFlags.valid,
            valid: !props.validation,
        };
    }

    //onChange Handeler, also generates events that can be handeled outside
    HandleChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.text = e.target.value
        var temp = this.ValidityUpdate()
        if (this.props.onChange != undefined) {
            this.props.onChange(new InputValue(this.text, temp, e.target))
        }
        if (this.state.valid != temp && this.props.onValidityChange != undefined) {
            this.props.onValidityChange(new InputValue(this.text, temp, e.target))
        }
        if (this.state.untouched) {
            this.setState({ untouched: false })
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

    //Handels checking all conditions and updating the value of "valid", returns its value
    ValidityUpdate(): boolean {
        if (this.props.validation) {
            var temp = true;
            if (this.props.lengthValidation) {
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
            return <div className="input-group-prepend input-group-addon">
                < span className="input-group-text" > {this.props.prepend}</span >
            </div >
        }
    };

    //Renders append if not empty or validation symbol, depending on setup (called by render)
    RenderAppend() {
        if (this.props.validation) {
            if (this.state.valid) {
                return <div className="input-group-append input-group-addon">
                    < span className="input-group-text" > + </span >
                </div >
            }
            else if (this.state.untouched) {
                return <div className="input-group-append input-group-addon">
                    < span className="input-group-text" > * </span >
                </div >
            }
            return <div className="input-group-append input-group-addon">
                < span className="input-group-text" > - </span >
            </div >
        } else {
            if (this.props.append == "") {
                return null
            }
            else {
                return <div className="input-group-append input-group-addon">
                    < span className="input-group-text" > {this.props.append}</span >
                </div >
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
            switch (this.state.validLength) {
                case LengthValidationFlags.TooShort:
                    messages.push("There must be at least " + this.props.min + " characters.")
                    break
                case LengthValidationFlags.TooLong:
                    messages.push("There could be at most " + this.props.max + " characters.")
                    break
            }
            return messages.map((message) => <label>{message}</label>)
        }
    }

    render() {
        return <div>
            {this.RrenderLabel()}
            <div className="input-group mb-3">
                {this.RenderPrepend()}
                <input type="text"
                    className="form-control"
                    aria-label={this.props.label}
                    onChange={(e) => this.HandleChange(e)}
                />
                {this.RenderAppend()}
            </div>
            {this.RrenderWarnings()}
        </div>
    };
}