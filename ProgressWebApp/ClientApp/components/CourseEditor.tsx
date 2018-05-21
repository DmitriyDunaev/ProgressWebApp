import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { TextInput } from './Forms/TextInput';
import { NumberInput } from './Forms/NumberInput';
import { InputValue, InputWidth } from './Forms/InputInterfaces';
/*

export class Course {
    id: string;
    logo: string;//link
    teacherId: string;
    name: string;
    type: undefined; //enum
    payment: undefined; //enum
    room: string;
    address: string;
    numberOfStudentsMin: number;
    numberOfStudentsMax: number;
    priceSingle: number;
    priceCourse: number;
    courseLength: number;
    materials: string[];//link
    information: string;
    pageContent: string;
}
*/export class CourseEditor extends React.Component<RouteComponentProps<{}>, {}> {

    HandleChange(e: InputValue) {
        if (e.valid) { 
            console.log(e.value);
        }
    }

    HandleValidityChange(e: InputValue) {
        if (e.valid) {
            alert("third form is now valid")
        } else {
            alert("third form is now invalid")
        }
    }

    render() {
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
        </div>
    }
}