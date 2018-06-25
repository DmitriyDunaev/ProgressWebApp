import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { TextInput } from './Forms/TextInput';
import { NumberInput } from './Forms/NumberInput';
import { SelectInput, SelectType, SelectValue } from './Forms/SelectInput';
import { InputEvent, InputWidth } from './Forms/InputInterfaces';
import { CheckboxInput } from './Forms/CheckboxInput';
import { NumberRangeInput, LocalNumberInput} from './Forms/NumberRangeInput';

//Dynamic parameters (referenced by reder)
interface CourseEditorState {
    nameValid: boolean;
    typeValid: boolean;
    numberOfStudentsMinValid: boolean;
    numberOfStudentsMaxValid: boolean;
    allowSingle: boolean;
    allowCourse: boolean;
    priceSingleValid: boolean;
    priceCourseValid: boolean;
    courseLengthValid: boolean;
    //materials: string[];                 
    //information: string;
    //pageContent: string;    
}

const NUMBER_OF_STUDENTS_MIN = 1;
const NUMBER_OF_STUDENTS_MAX = 64;

export class CourseEditor extends React.Component<RouteComponentProps<{}>, CourseEditorState> {

    constructor() {
        super()
        this.state = {
            nameValid: false,
            typeValid: false,
            numberOfStudentsMinValid: true,
            numberOfStudentsMaxValid: true,
            allowSingle: true,
            allowCourse: false,
            priceSingleValid: false,
            priceCourseValid: false,
            courseLengthValid: true
        }
    }

    numberOfStudentsMinRef: NumberInput | null
    numberOfStudentsMaxRef: NumberInput | null

    numberOfStudentsMin = NUMBER_OF_STUDENTS_MIN
    numberOfStudentsMax = NUMBER_OF_STUDENTS_MAX

    AllowSingleUpdate(e: InputEvent) {
        this.setState({
            allowSingle: e.value == 'true',
        });
    }

    AllowCourseUpdate(e: InputEvent) {
        this.setState({
            allowCourse: e.value == 'true',
        });
    }

    render() {
        return <div>{this.RenderDemo()}
            <h1>Form; Version 1</h1>
            <div className="form-row row">
                <TextInput
                    prepend="Email:"
                    placeholder="  Demo"
                    validation={true}
                    lengthValidation={true}
                    initialValidity={false}
                    emailValidation={true}
                    min={5}
                    max={62}
                    width={InputWidth.half}
                />
                <TextInput
                    prepend="Password:"
                    placeholder="  Demo"
                    validation={true}
                    lengthValidation={true}
                    initialValidity={false}
                    password={true}
                    oneWordValidation={true}
                    min={5}
                    max={62}
                    width={InputWidth.half}
                />
            </div>
            <div className="form-row row">
                <TextInput
                    prepend="Name:"
                    validation={true}
                    lengthValidation={true}
                    initialValidity={false}
                    min={5}
                    max={62}
                    width={InputWidth.half}
                />
                <SelectInput
                    prepend="Type:"
                    initialValidity={false}
                    values={[
                        new SelectValue("Single Lecture", "lecture"),
                        new SelectValue("Course", "course"),
                        new SelectValue("Practice", "practice"),
                        new SelectValue("Semenar", "semenar"),
                    ]}
                    width={InputWidth.half}
                />
            </div>
            <NumberRangeInput
                description="Number of students on a given evnt"
                upper={{
                    prepend: "Minimum:",
                    initialValue: 1,
                }}
                lower={{
                    prepend: "Maximum:",
                    initialValue: 1,
                }}
                initialValidity={true}
                min={NUMBER_OF_STUDENTS_MIN}
                max={NUMBER_OF_STUDENTS_MAX}
                integer={true}
                validation={true}
                rangeValidation={true}
            />
            <div className="form-row row">
                <CheckboxInput
                    text="Allow to register for a single event"
                    initialValue={this.state.allowSingle}
                    onChange={(e) => this.AllowSingleUpdate(e)}
                    width={InputWidth.seven}
                />
            </div>
            <div className="form-row row">
                <NumberInput
                    prepend="Lesson Price:"
                    append="forints"
                    validation={true}
                    rangeValidation={true}
                    validationIndicator={false}
                    initialValidity={false}
                    min={0}
                    max={10000}
                    width={InputWidth.half}
                    disabled={!this.state.allowSingle}
                />
                <SelectInput
                    prepend="Single payment:"
                    initialValidity={false}
                    values={[
                        new SelectValue("Before the lesson", "pre"),
                        new SelectValue("After the lesson", "post"),
                        new SelectValue("Any", "pre-post"),
                        new SelectValue("Transaction before the lesson", "early")
                    ]}
                    width={InputWidth.half}
                    disabled={!this.state.allowSingle}
                />
            </div>
            <div className="form-row row">
                <CheckboxInput
                    text="Allow to register for a course of multiple events"
                    initialValue={this.state.allowCourse}
                    onChange={(e) => this.AllowCourseUpdate(e)}
                    width={InputWidth.seven}
                />
            </div>
            <div className="form-row row">
                <NumberInput
                    prepend="Course Price:"
                    append="forints"
                    validation={true}
                    rangeValidation={true}
                    validationIndicator={false}
                    initialValidity={false}
                    min={0}
                    max={10000}
                    width={InputWidth.half}
                    disabled={!this.state.allowCourse}
                />
                <SelectInput
                    prepend="Course payment:"
                    initialValidity={false}
                    values={[
                        new SelectValue("Right before the first event", "first"),
                        new SelectValue("on every lesson independently", "split"),
                        new SelectValue("Transaction before the first event", "early")
                    ]}
                    width={InputWidth.half}
                    disabled={!this.state.allowCourse}
                />
            </div>
        </div>
    }

    //   TEST/DEMO ****************************************

    HandleChange(e: InputEvent) {
        if (e.valid) {
            console.log(e.value);
        }
    }

    HandleValidityChange(e: InputEvent) {
        if (e.valid) {
            alert("third form is now valid")
        } else {
            alert("third form is now invalid")
        }
    }

    HandleSelect(e: InputEvent) {
        console.log("1) " + e.value + " 2) " + e.valid)
    }

    HandelOptions(e: InputEvent) {
        alert("you selected \" " + e.value + " \"")
    }

    RenderDemo() { return null }
    NotTheRenderDemo() {
        return <div>
            <div className="form-row row">
                <TextInput
                    label="Can check for 8-20 characters"
                    prepend="You can write stuff here"
                    placeholder="Or here!"
                    validation={true}
                    lengthValidation={true}
                    min={8}
                    max={20}
                    width={InputWidth.half}
                />
                <TextInput
                    label="Or just at most 12 characters"
                    prepend="this one will write content in consol if valid"
                    onChange={(e) => this.HandleChange(e)}
                    validation={true}
                    lengthValidation={true}
                    max={12}
                    width={InputWidth.half}
                    onFocus={(e) => this.HandleSelect(e)}
                />
            </div>
            <div className="form-row row">
                <CheckboxInput
                    label="label"
                    text="text"
                    initialValue={false}
                    width={InputWidth.half}
                    textAfterCheckbox={true}
                />
                <CheckboxInput
                    label="label"
                    text="text"
                    initialValue={true}
                    width={InputWidth.half}
                    textAfterCheckbox={false}
                    useCorrectValue={true}
                    correctValue={false}
                />
            </div>
            <div className="form-row row">
                <TextInput
                    label="Or just at least 14 characters"
                    prepend="this one will tell if validity changes"
                    onValidityChange={(e) => this.HandleValidityChange(e)}
                    initialValue="given value"
                    validation={true}
                    lengthValidation={true}
                    min={14}
                    width={InputWidth.third}
                />
                <TextInput
                    label="Prepend below is not mandatory!"
                    append="if you don't validate or turned the indicator off, you can write here!"
                    width={InputWidth.twoThirds}
                />
            </div >
            <div className="form-row row">
                <TextInput />
            </div >
            <div className="form-row row">
                <NumberInput
                    label="Can check for values between 10 and 3000"
                    prepend="You can write stuff here"
                    placeholder="Or here!"
                    validation={true}
                    rangeValidation={true}
                    min={10}
                    max={3000}
                />
            </div >
            <div className="form-row row">
                <SelectInput
                    values={[new SelectValue("1", "1"), new SelectValue("2", "2")]}
                    label="Selector 1"
                    prepend="prepend"
                    append="append"
                    initialValueIndex={4}
                    width={InputWidth.twoThirds}
                />
                <SelectInput
                    values={[
                        new SelectValue("first", "1"),
                        new SelectValue("second", "2"),
                        new SelectValue("third", "3"),
                        new SelectValue("forth", "4"),
                        new SelectValue("fifth", "5"),
                    ]}
                    label="Selector 2"
                    initialValueIndex={4}
                    width={InputWidth.third}
                    onChange={(e) => this.HandelOptions(e)}
                />
            </div >
            <h1>Layout Tester</h1>
            <div className="form-row row">
                <h5>6/6</h5>
                <TextInput width={6} />
                <TextInput width={6} />
            </div>
            <div className="form-row row">
                <h5>5/7</h5>
                <TextInput width={5} />
                <TextInput width={7} />
            </div>
            <div className="form-row row">
                <h5>4/8, 4/4/4</h5>
                <TextInput width={4} />
                <TextInput width={8} />
            </div>
            <div className="form-row row">
                <TextInput width={4} />
                <TextInput width={4} />
                <TextInput width={4} />
            </div>
            <div className="form-row row">
                <h5>3/9, 3/3/6, 3/3/3/3</h5>
                <TextInput width={3} />
                <TextInput width={9} />
            </div>
            <div className="form-row row">
                <TextInput width={3} />
                <TextInput width={3} />
                <TextInput width={6} />
            </div>
            <div className="form-row row">
                <TextInput width={3} />
                <TextInput width={3} />
                <TextInput width={3} />
                <TextInput width={3} />
            </div>
            <div className="form-row row">
                <TextInput width={2} />
                <TextInput width={10} />
            </div>
        </div>
    }

    //   TEST/DEMO Ends ****************************************
}

/*

export class Course {
    id: string;                                 ----
    logo: string;//link
    teacherId: string;                          ----
    name: string;                               done
    type: undefined; //enum                     done
    payment: undefined; //enum                  done
    room: string;
    address: string;
    numberOfStudentsMin: number;
    numberOfStudentsMax: number;
    priceSingle: number;                        done
    priceCourse: number;                        ????
    courseLength: number;                       
    materials: string[];//link                  
    information: string;                        
    pageContent: string;                       
}*/