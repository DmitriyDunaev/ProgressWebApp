import * as React from 'react';
import { InputEvent, InputWidth, GetInputWidthClass } from './InputInterfaces'


interface CheckboxInputProps {
    label?: string;                                     //text above the field (not rendered if empty)
    text?: string;                                      //text before/after the field
    textAfterCheckbox?: boolean;                        //detetermines where the text will be redered
    initialValue?: boolean;                             //staring value
    changeIndicator?: boolean                           //will this field furn green after being touched?
    useCorrectValue?: boolean                           //return invalid if value is not equal to correctValue
    correctValue?: boolean                              //value that is considered valid
    onChange?: (value: InputEvent) => void;             //event triggered when the content of the field changes
    className?: string                                  //HTML classes
    width?: InputWidth                                  //specify the width of the input
}

interface CheckboxInputState {
    untouched: boolean;                                 //true until first onChange event
    valid: boolean;                                     //false if untouched and no initial value (right now always true)
}

export class CheckboxInput extends React.Component<CheckboxInputProps,CheckboxInputState> {
    //Default properties for when they are unspecified
    public static defaultProps: Partial<CheckboxInputProps> = {
        label: "",
        text: "",
        textAfterCheckbox: true,
        initialValue: false,
        changeIndicator: false,
        useCorrectValue: false,
        correctValue: true,
        className: "",
        width: InputWidth.full,
    };

    constructor(props: CheckboxInputProps) {
        super(props)
        if (this.props.initialValue != undefined) {
            this.value = this.props.initialValue
        } else {
            this.value = false
        }
        this.state = {
            untouched: true,
            valid: (!this.props.useCorrectValue || (this.value == this.props.correctValue)),
        }
    }

    //Holds the copy of the input value for quick global acess
    private value: boolean = false

    HandelClick(e: React.MouseEvent<HTMLDivElement>) {
        if (this.state.untouched) {
            this.setState({
                untouched: false
            })
        }
        this.value = !this.value
        var temp = (this.value == this.props.correctValue)
        if (this.props.useCorrectValue) {
            this.setState({
                valid: temp
            })
        }
        this.forceUpdate();
        if (this.props.onChange != undefined) {
            this.props.onChange(new InputEvent(this.value.toString(), temp || !this.props.useCorrectValue ))
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
    }

    RenderCheckbox(left: boolean) {
        if (left != this.props.textAfterCheckbox) {
            return null
        }
        var classes: string = ""
        if (this.value) {
            classes += " btn btn-primary input-group-addon active"
            return <div className={classes} style={{ minWidth: 38 }}>
                < span className="input-group-text"> ✓ </span >
            </div>
        }
        else {
            classes += "btn btn-primary input-group-addon active"
            return <div className={classes} style={{ minWidth: 38 }}>
                < span className="input-group-text" >  </span >
            </div>
        }
        
    }

    render() {
        var classes: string = ""
        if (this.props.className != undefined) {
            classes += this.props.className
        }
        if (!this.state.untouched && (this.props.changeIndicator || this.props.useCorrectValue)) {
            if (this.state.valid) {
                classes += " has-success "
            }
            else {
                classes += " has-error "
            }
        }
        if (this.props.width != undefined) {
            classes += GetInputWidthClass(this.props.width)
        }
        return <div className={"form-group" + classes}>
            {this.RrenderLabel()}
            <div className="input-group"
                onClick={(e) => this.HandelClick(e)}
            >
                {this.RenderCheckbox(true)}
                <div className="form-control">
                    < span className="input-group-text control-label" >{this.props.text}</span >
                </div>
                {this.RenderCheckbox(false)}
            </div>
        </div>
    }
}