import * as React from 'react';


export enum EventStates { "free", "registered", "pendingEmptied", "deleting", "other"};


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

//Essentialy the same data structure as in the calendar, but in a form of a class
//would be better to mpve to a separate file
export class BasicEvent {
    allDay: boolean;
    start: Date;
    end: Date;
    title: string;

    constructor(allDay: boolean, start: Date, end: Date, title: string) {
        this.allDay = allDay;
        this.start = start;
        this.end = end;
        this.title = title;
    }
}

export class Event extends BasicEvent {
    readonly teacherId: string;
    readonly id: string;
    possibleCourseIds: string[];
    selectedCourse: string | undefined;
    registeredStudents: string[];

    private GenerateUinqueId(): string{
        return (Date.now().toString(36) + Math.random().toString(36).substr(2)).substr(1,15)
    }
    
    constructor(teacherId: string, start: Date, end: Date, title: string) {
        super(false, start, end, title);
        this.id = this.GenerateUinqueId()
        this.teacherId = teacherId;
        this.possibleCourseIds = [];
        this.selectedCourse = undefined;
        this.registeredStudents = [];
    }
}


//Basic Event + additional data sucha as price and room (data not used by the Calendar)
//would be better to mpve to a separate file
export class ComplexEventLegacy extends BasicEvent {
    state: EventStates;
    message: string;

    constructor(allDay: boolean, start: Date, end: Date, title: string, state: EventStates, message: string) {
        super(allDay, start, end, title);
        this.state = state;
        this.message = message;
    }

    getBaisicEvent(): BasicEvent {
        return new BasicEvent(this.allDay, this.start, this.end, this.title);
    }
}
// export { SpecificClass } from './SpecificClassesFile'; //if you want to split the script into tiny bits but import from this file.


//Agenda
//1) 2 Calendars? => 2 Events? => 3 EventStates?
//2) Write down full parameter lists for the classes
//3) Full list for EventStates(es)
//4) Find a nice form plugin [optional]