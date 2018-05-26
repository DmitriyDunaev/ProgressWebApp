import * as React from 'react';
import { InputEvent, InputWidth, GetInputWidthClass } from './InputInterfaces'

export class SelectValue{
    name: string  // What is displayed
    value: string // What is returned
    constructor(name: string, value: string) {
        this.name = name
        this.value = value
    }
}

export enum SelectType { "dropdown", "buttons", "list", "radio"}//Not used at the moment

interface SelectInputProps {
    values: SelectValue[]                               //Contents
    type?: SelectType                                   //render selection (TODO)
    label?: string;                                     //text above the field (not rendered if empty)
    prepend?: string;                                   //text before the field (not rendered if empty)
    append?: string;                                    //text after the field, if no validation (not rendered if empty and not validated)
    initialValueIndex?: number;                         //staring value
    changeIndicator?: boolean                           //will this field furn green after being touched?
    onChange?: (value: InputEvent) => void;             //event triggered when the content of the field changes
    onFocus?: (value: InputEvent) => void;              //event triggered when field is selected
    className?: string                                  //HTML classes
    width?: InputWidth        
}

interface SelectInputState{
    untouched: boolean;                                 //true until first onChange event
    valid: boolean;                                     //false if untouched and no initial value (right now always true)
}

export class SelectInput extends React.Component<SelectInputProps, SelectInputState> {
    //Default properties for when they are unspecified
    public static defaultProps: Partial<SelectInputProps> = {
        type: SelectType.buttons,
        label: "",
        prepend: "",
        append: "",
        initialValueIndex: 0,
        changeIndicator: true,
        className: "",
        width: InputWidth.full,
    };

    constructor(props: SelectInputProps) {
        super(props)
        this.state = {
            untouched: true,
            valid: true,
        }
        if (this.props.initialValueIndex != undefined && this.props.values[this.props.initialValueIndex] != undefined) {
            this.value = this.props.values[this.props.initialValueIndex].value
        } else {
            this.value = this.props.values[0].value
        }
    }

    //Holds the copy of the input value for quick global acess
    private value: string = ""

    HandelChange(e: React.ChangeEvent<HTMLSelectElement>) {
        if (this.props.onFocus != undefined) {
            this.props.onFocus(new InputEvent(e.currentTarget.value, this.state.valid))
        }
        if (this.props.onChange != undefined && this.value != e.currentTarget.value) {
            this.props.onChange(new InputEvent(e.currentTarget.value, this.state.valid))
        }
        this.value = e.currentTarget.value
        this.forceUpdate()
    }

    HandelClick(e: React.MouseEvent<HTMLSelectElement>) {
        if (this.state.untouched) {
            this.setState({ untouched: false })
            if (this.props.onFocus != undefined) {
                this.props.onFocus(new InputEvent(e.currentTarget.value, this.state.valid))
            }
            if (this.props.onChange != undefined && this.value != e.currentTarget.value) {
                this.props.onChange(new InputEvent(e.currentTarget.value, this.state.valid))
            }
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
        if (this.props.append == "") {
            return null
        }
        else {
            return <div className=" input-group-addon">
                < span className="input-group-text" >{this.props.append}</span >
            </div>
        }
    }

    RenderOptions() {
        return this.props.values.map((option) => <option value={option.value}>{option.name}</ option>
        )
    }

    render() {
        var classes: string = ""
        if (this.props.className != undefined) {
            classes += this.props.className
        }
        if (!this.state.untouched && this.props.changeIndicator) {
            classes += " has-success "
        }
        var inputGroupString: string = ""
        if (!(this.props.prepend == "" && this.props.append == "")) {
            inputGroupString = "input-group"
        }
        if (this.props.width != undefined) {
            classes += GetInputWidthClass(this.props.width)
        }
        return <div className={"form-group" + classes}>
            {this.RrenderLabel()}
            <div className={inputGroupString}>
                {this.RenderPrepend()}
                <select
                    className="form-control"
                    style={{ zIndex: 0 }}
                    onChange={(e) => this.HandelChange(e)}
                    onClick={(e) => this.HandelClick(e)}
                    value={this.value}
                >
                    {this.RenderOptions()}
                </select>
                {this.RenderAppend()}
            </div>
        </div>
    }
}