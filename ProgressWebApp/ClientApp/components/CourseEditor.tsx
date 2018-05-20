import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { TextInput } from './Forms/TextInput';
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
            <TextInput
                label="Or just at least 10 characters"
                validation={true}
                lengthValidation={true}
                min={10}
            />
            <TextInput
                label="Or just at most 12 characters"
                validation={true}
                lengthValidation={true}
                max={12}
            />
            <TextInput
                prepend="Label above is not mandatory!"
                append="if you don't validate, you can write here!"
            />
            PS: I know need to make warnings and labels use different styles
        </div>
    };
}