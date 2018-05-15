
export enum EventStates { "incomplete", "pending", "registered", "pendingEmptied", "deleting", "other"};


//Essentialy the same data structure as in the calendar, but in a form of a class
//would be better to mpve to a separate file
export class BasicEvent {
    allDay: boolean;
    start: Date;
    end: Date;
    title: string;

    constructor(allDay: boolean, start: Date, end: Date, title: string, ) {
        this.allDay = allDay;
        this.start = start;
        this.end = end;
        this.title = title;
    }
}


//Basic Event + additional data sucha as price and room (data not used by the Calendar)
//would be better to mpve to a separate file
export class ComplexEvent extends BasicEvent {
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
//1) 2 Calendars? => 2 Events? => 2 EventStates?
//2) Write down full parameter lists for the classes
//3) Full list for EventStates(es)
//4) Find a nice form plugin [optional]