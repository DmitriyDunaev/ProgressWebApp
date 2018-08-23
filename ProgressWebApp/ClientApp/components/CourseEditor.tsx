import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { TextInput } from './Forms/TextInput';
import { NumberInput } from './Forms/NumberInput';
import { SelectInput, SelectType, SelectValue } from './Forms/SelectInput';
import { InputEvent, InputWidth } from './Forms/InputInterfaces';
import { CheckboxInput } from './Forms/CheckboxInput';
import { NumberRangeInput, LocalNumberInput} from './Forms/NumberRangeInput';
import { Course } from 'ClientApp/components/DataController';

//Dynamic parameters (referenced by reder)
interface CourseEditorState {
    nameValid: boolean;
    typeValid: boolean;
    numberOfStudentsValid: boolean;
    allowSingle: boolean;
    allowCourse: boolean;
    paymentSingleValid: boolean;
    paymentCourseValid: boolean;
    priceSingleValid: boolean;
    priceCourseValid: boolean;
    courseLengthValid: boolean;
    descriptionValid: boolean;
    //materials: string[];    
    //pageContent: string;    
}

class CourseForm {
    private teacherId: string;
    public name: string | undefined; 
    public type: string | undefined; 
    public paymentSingle: string | undefined;
    public paymentCourse: string | undefined;
    public allowSingle: boolean | undefined;
    public allowCourse: boolean | undefined;
    public numberOfStudentsMin: number | undefined; 
    public numberOfStudentsMax: number | undefined; 
    public priceSingle: number | undefined;
    public priceCourse: number | undefined; 
    public courseLength: number | undefined;
    public description: string | undefined; 

    constructor(
        teacherId: string,
    ) {
        this.teacherId = teacherId
    }
}

const NUMBER_OF_STUDENTS_MIN = 1;
const NUMBER_OF_STUDENTS_MAX = 64;
const NUMBER_OF_COURSE_LESSONS_MIN = 3;
const NUMBER_OF_COURSE_LESSONS_MAX = 12;
const NAME_LENGTH_MAX = 100
const NAME_LENGTH_MIN = 3
const COST_MIN = 0
const COST_MAX = 10000
const DESC_CHAR_MAX_COUNT = 2047

export class CourseEditor extends React.Component<RouteComponentProps<{}>, CourseEditorState> {

    constructor() {
        super()
        this.state = {
            nameValid: false,
            typeValid: false,
            numberOfStudentsValid: true,
            allowSingle: true,
            allowCourse: false,
            paymentSingleValid: true,
            paymentCourseValid: true,
            priceSingleValid: false,
            priceCourseValid: false,
            courseLengthValid: true,
            descriptionValid: true,
        }
        this.course = new CourseForm("teacherID")
        this.course.allowSingle = true
        this.course.allowCourse = false
        this.course.numberOfStudentsMin = 1
        this.course.numberOfStudentsMax = 1
        this.course.courseLength = 4
        this.course.description = ""
    }

    private course: CourseForm

    NameUpdate(e: InputEvent) {
        this.course.name = e.value
        this.setState({
            nameValid: e.valid
        })
    }

    TypeUpdate(e: InputEvent) {
        this.course.type = e.value
        this.setState({
            typeValid: e.valid //always true
        })
    }

    NumberOfStudentsMinUpdate(e: InputEvent) {
        this.course.numberOfStudentsMin = parseInt(e.value)
        this.setState({
            numberOfStudentsValid: e.valid 
        })
    }

    NumberOfStudentsMaxUpdate(e: InputEvent) {
        this.course.numberOfStudentsMax = parseInt(e.value)
        this.setState({
            numberOfStudentsValid: e.valid 
        })
    }
    
    AllowSingleUpdate(e: InputEvent) {
        this.course.allowSingle = e.value == 'true'
        this.setState({
            allowSingle: this.course.allowSingle,
        })
    }

    AllowCourseUpdate(e: InputEvent) {
        this.course.allowCourse = e.value == 'true'
        this.setState({
            allowCourse: this.course.allowCourse,
        })
    }

    PriceSingleUpdate(e: InputEvent) {
        this.course.priceSingle = parseInt(e.value)
        this.setState({
            priceSingleValid: e.valid
        })
    }

    PriceCourseUpdate(e: InputEvent) {
        this.course.priceCourse = parseInt(e.value)
        this.setState({
            priceCourseValid: e.valid
        })
    }

    PaymentSingleUpdate(e: InputEvent) {
        this.course.paymentSingle = e.value
        this.setState({
            paymentSingleValid: e.valid
        })
    }

    PaymentCourseUpdate(e: InputEvent) {
        this.course.paymentCourse = e.value
        this.setState({
            paymentCourseValid: e.valid
        })
    }

    CourseLengthUpdate(e: InputEvent) {
        this.course.courseLength = parseInt(e.value)
        this.setState({
            courseLengthValid: e.valid
        })
    }

    DescriptionUpdate(e: InputEvent) {
        this.course.description = e.value
        this.setState({
            descriptionValid: e.valid
        })
    }

    Submit() {
        alert("send object of class CourseForm named course from where this allert is called")
    }

    IsCourseValid(): boolean{
        var EssentialInfo: boolean = this.state.nameValid && this.state.typeValid && this.state.numberOfStudentsValid
        var SingleLesson: boolean = (this.state.priceSingleValid && this.state.paymentSingleValid) || (!this.state.allowSingle && this.state.allowCourse)
        var CourseLessons: boolean = (this.state.priceCourseValid && this.state.paymentCourseValid) || (!this.state.allowCourse && this.state.allowSingle)
        var Other: boolean = this.state.descriptionValid
        return EssentialInfo && SingleLesson && CourseLessons && Other
    }

    render() {
        return <div>
            <h1>Form; Version 1</h1>
            <div className="form-row row">
                <TextInput
                    prepend="Name:"
                    validation={true}
                    lengthValidation={true}
                    initialValidity={this.state.nameValid}
                    min={NAME_LENGTH_MIN}
                    max={NAME_LENGTH_MAX}
                    width={InputWidth.half}
                    onChange={(e) => this.NameUpdate(e)}
                    onFocus={(e) => this.NameUpdate(e)}
                />
                <SelectInput
                    prepend="Type:"
                    initialValidity={this.state.typeValid}
                    values={[
                        new SelectValue("Single Lecture", "lecture"),
                        new SelectValue("Course", "course"),
                        new SelectValue("Practice", "practice"),
                        new SelectValue("Semenar", "semenar"),
                    ]}
                    width={InputWidth.half}
                    onChange={(e) => this.TypeUpdate(e)}
                    onFocus={(e) => this.TypeUpdate(e)}
                />
            </div>
            <NumberRangeInput
                description="Number of students on a given evnt"
                lower={{
                    prepend: "Minimum:",
                    initialValue: this.course.numberOfStudentsMin,
                    onChange: (e) => this.NumberOfStudentsMaxUpdate(e),
                    onFocus: (e) => this.NumberOfStudentsMaxUpdate(e),
                }}
                upper={{
                    prepend: "Maximum:",
                    initialValue: this.course.numberOfStudentsMax,
                    onChange: (e) => this.NumberOfStudentsMinUpdate(e),
                    onFocus: (e) => this.NumberOfStudentsMinUpdate(e),
                }}
                initialValidity={this.state.numberOfStudentsValid}
                validation={true}
                rangeValidation={true}
                min={NUMBER_OF_STUDENTS_MIN}
                max={NUMBER_OF_STUDENTS_MAX}
                integer={true}
            />
            <div className="form-row row">
                <CheckboxInput
                    text="Allow to register for a single event"
                    initialValue={this.state.allowSingle}
                    onChange={(e) => this.AllowSingleUpdate(e)}
                    width={InputWidth.full}
                />
            </div>
            <div className="form-row row">
                <NumberInput
                    prepend="Lesson Price:"
                    append="forints"
                    validation={true}
                    rangeValidation={true}
                    validationIndicator={false}
                    initialValidity={this.state.priceSingleValid}
                    min={COST_MIN}
                    max={COST_MAX}
                    width={InputWidth.half}
                    disabled={!this.state.allowSingle}
                    onChange={(e) => this.PriceSingleUpdate(e)}
                    onFocus={(e) => this.PriceSingleUpdate(e)}
                />
                <SelectInput
                    prepend="Single payment:"
                    initialValidity={this.state.paymentSingleValid}
                    values={[
                        new SelectValue("Before the lesson", "pre"),
                        new SelectValue("After the lesson", "post"),
                        new SelectValue("Any", "pre-post"),
                        new SelectValue("In advance", "early")
                    ]}
                    width={InputWidth.half}
                    disabled={!this.state.allowSingle}
                    onChange={(e) => this.PaymentSingleUpdate(e)}
                    onFocus={(e) => this.PaymentSingleUpdate(e)}
                />
            </div>
            <div className="form-row row">
                <CheckboxInput
                    text="Allow to register for a course of multiple events"
                    initialValue={this.state.allowCourse}
                    onChange={(e) => this.AllowCourseUpdate(e)}
                    width={InputWidth.half}
                />
                <NumberInput
                    prepend="Course Length:"
                    append="lessons"
                    initialValue={this.course.courseLength}
                    validation={true}
                    rangeValidation={true}
                    integer={true}
                    min={NUMBER_OF_COURSE_LESSONS_MIN}
                    max={NUMBER_OF_COURSE_LESSONS_MAX}
                    initialValidity={this.state.courseLengthValid}
                    width={InputWidth.half}
                    validationIndicator={false}
                    disabled={!this.state.allowCourse}
                    onChange={(e) => this.CourseLengthUpdate(e)}
                    onFocus={(e) => this.CourseLengthUpdate(e)}
                />
            </div>
            <div className="form-row row">
                <NumberInput
                    prepend="Course Price:"
                    append="forints"
                    validation={true}
                    rangeValidation={true}
                    validationIndicator={false}
                    initialValidity={this.state.priceCourseValid}
                    min={COST_MIN}
                    max={COST_MAX}
                    width={InputWidth.half}
                    disabled={!this.state.allowCourse}
                    onChange={(e) => this.PriceCourseUpdate(e)}
                    onFocus={(e) => this.PriceCourseUpdate(e)}
                />
                <SelectInput
                    prepend="Course payment:"
                    initialValidity={this.state.paymentCourseValid}
                    values={[
                        new SelectValue("Right before the first event", "first"),
                        new SelectValue("on every lesson independently", "split"),
                        new SelectValue("Transaction before the first event", "early")
                    ]}
                    width={InputWidth.half}
                    disabled={!this.state.allowCourse}
                    onChange={(e) => this.PaymentCourseUpdate(e)}
                    onFocus={(e) => this.PaymentCourseUpdate(e)}
                />
            </div>
            <div className="form-row row">
                <TextInput
                    label="Description:"
                    validation={true}
                    lengthValidation={true}
                    min={0}
                    max={DESC_CHAR_MAX_COUNT}
                    validationIndicator={false}
                    textArea={true}
                    textAreaRows={4}
                    onBlur={(e) => this.DescriptionUpdate(e)}
                    onFocus={(e) => this.DescriptionUpdate(e)}
                    onValidityChange={(e) => this.DescriptionUpdate(e)}
                    width={InputWidth.full}
                />
            </div>
            <div className="row ">
                <div className="form-group ">
                    <button
                        type="button"
                        className="btn btn-primary btn-block"
                        disabled={!this.IsCourseValid()}
                        onClick={(e) => this.Submit()}
                        > Submit </button>
                </div>
            </div>
        </div>
    }
}

/*

export class Course {
    id: string;                                 ----
    logo: string;//link                         format?
    teacherId: string;                          ----
    name: string;                               done
    type: undefined; //enum                     done
    payment: undefined; //enum                  done
    room: string;                               format?
    address: string;                            format?
    numberOfStudentsMin: number;                done
    numberOfStudentsMax: number;                done
    priceSingle: number;                        done
    priceCourse: number;                        done
    courseLength: number;                       done
    materials: string[];//link                  ????
    information: string;                        ????
    pageContent: string;                        ????
}*/