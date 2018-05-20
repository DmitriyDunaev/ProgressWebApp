import * as React from 'react';

enum LengthValidationFlags { "TooShort", "TooLong", "valid"}

interface TextInputProps {
    label?: string;
    prepend?: string;
    append?: string;
    validation?: boolean;
    lengthValidation?: boolean
    min?: number;
    max?: number;
};

interface TextInputState {
    untouched: boolean;
    validLength: LengthValidationFlags;
    valid: boolean;
}

export class TextInput extends React.Component<TextInputProps, TextInputState> {

    public static defaultProps: Partial<TextInputProps> = {
        label: "",
        prepend: "",
        append: "",
        validation: false,
        lengthValidation: false,
        min: 0,
        max: 0,
    };


    constructor(props: TextInputProps) {
        super(props)
        this.state = {
            untouched: true,
            validLength: LengthValidationFlags.valid,
            valid: !props.validation,
        };
    }

    private text : string

    HandleChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.text = e.target.value
        this.ValidityUpdate()
        if (this.state.untouched) {
            this.setState({ untouched: false })
        }
    }

    IsLengthValid(): boolean{
        var minV = this.props.min == undefined || this.props.min == 0 || this.text.length >= this.props.min
        var maxV = this.props.max == undefined || this.props.max == 0 || this.text.length <= this.props.max || (this.props.min != undefined && this.props.max < this.props.min)
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

    ValidityUpdate(): boolean {
        if (this.props.validation) {
            var temp = true;
            if (this.props.lengthValidation) {
                temp = temp && this.IsLengthValid()
            }
            this.setState({ valid: temp })
            return temp
        } else {
            this.setState({ valid: true })
            return true
        }
    }

    RrenderLabel() {
        if (this.props.label == "") {
            return null
        }
        else {
            return <label> {this.props.label} </label>
        }
    };

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

    RrenderWarning() {
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
            {this.RrenderWarning()}
        </div>
    };
}