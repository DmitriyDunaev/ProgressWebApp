import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { TextInput } from './Forms/TextInput';
import { NumberInput } from './Forms/NumberInput';
import { SelectInput, SelectType, SelectValue } from './Forms/SelectInput';
import { InputEvent, InputWidth } from './Forms/InputInterfaces';


export class CourseEditor extends React.Component<RouteComponentProps<{}>, {}> {
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

    RenderDemo() {
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
                <TextInput/>
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
        </div>
    }

    //   TEST/DEMO Ends ****************************************

    render() {
        return <div>{this.RenderDemo()}
            <h1>Form; Version 1</h1>
            <div className="form-row row">
                <TextInput
                    prepend="Name:"
                    validation={true}
                    lengthValidation={true}
                    min={5}
                    max={63}
                    width={InputWidth.twoThirds}
                />
                <SelectInput
                    prepend="Type:"
                    values={[
                        new SelectValue("Single Lecture", "lecture"),
                        new SelectValue("Course", "course"),
                        new SelectValue("Practice", "Practice"),
                        new SelectValue("Semenar", "semenar"),
                    ]}
                    width={InputWidth.third}
                />
            </div>
            <div className="form-row row">
                <NumberInput
                    prepend="Lesson Price:"
                    append="forints"
                    validation={true}
                    rangeValidation={true}
                    validationIndicator={false}
                    min={0}
                    max={10000}
                    width={InputWidth.third}
                />
                <NumberInput
                    prepend="Course Price:"
                    append="forints"
                    validation={true}
                    rangeValidation={true}
                    validationIndicator={false}
                    min={0}
                    max={10000}
                    width={InputWidth.third}
                />
                <SelectInput
                    prepend="Type:"
                    values={[
                        new SelectValue("Before the lesson", "pre"),
                        new SelectValue("After the lesson", "post"),
                        new SelectValue("Any", "pre-post"),
                        new SelectValue("Transaction befor the lesson", "early")
                    ]}
                    width={InputWidth.third}
                />
            </div>
        </div>
    }
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