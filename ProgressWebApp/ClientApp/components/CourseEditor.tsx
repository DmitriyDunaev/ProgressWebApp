import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { TextInput } from './Forms/TextInput';
import { InputValue } from './Forms/InputInterfaces';
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
            <TextInput
                label="Can check for 8-20 characters"
                prepend="You can write stuff here"
                validation={true}
                lengthValidation={true}
                min={8}
                max={20}
            />
            <br />
            <TextInput
                label="Or just at most 12 characters"
                prepend="this one will write content in consol if valid"
                onChange={(e) => this.HandleChange(e)}
                validation={true}
                lengthValidation={true}
                max={12}
            />
            <br />
            <TextInput
                label="Or just at least 10 characters"
                prepend="this one will tell if validity changes"
                onValidityChange={(e) => this.HandleValidityChange(e)}
                validation={true}
                lengthValidation={true}
                min={10}
            />
            <br />
            <TextInput
                label="Prepend below is not mandatory!"
                append="if you don't validate, you can write here!"
            />
            <br/>
            PS: I know need to make warnings and labels use different styles
        </div>
    };
}