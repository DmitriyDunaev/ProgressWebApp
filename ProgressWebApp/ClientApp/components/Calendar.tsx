import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import BigCalendar from 'react-big-calendar';
import * as moment from 'moment';
import "react-big-calendar/lib/css/react-big-calendar.css"


enum EventStates { "new", "registered", "other" };

// TYPES

//Essentialy the same data structure as in the calendar, but in a form of a class
//would be better to mpve to a separate file
class BasicEvent {
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
class ComplexEvent extends BasicEvent {
    state: EventStates;
    message: string | undefined; 

    constructor(allDay: boolean, start: Date, end: Date, title: string, state: EventStates, message: string | undefined) {
        super(allDay, start, end, title);
        this.state = state;
        this.message = message;
    }

    getBaisicEvent(): BasicEvent {
        return new BasicEvent(this.allDay, this.start, this.end, this.title);
    }
}

// TEMPORAL
//Initial events, Fetcher should be written in the constructor  (will be removed)
const eventsFromSomewhere = [
    new ComplexEvent(false, new Date('2018-05-23 11:13:00'), new Date('2018-05-23 10:13:00'), "Simple Event", EventStates.other, "sowething 1"),
    new ComplexEvent(true, new Date('2018-05-25 11:13:00'), new Date('2018-05-25 11:13:00'), "All Day Event", EventStates.other, "sowething 2")
];

//event instance (will be removed)
const additionalEvent = new ComplexEvent(false, new Date('2018-05-24 11:13:30'), new Date('2018-05-24 11:13:00'), 'Added Event', EventStates.new, "sowething 3");


interface SelectionRange {
    start:  Date,
    end: Date,
    slots: Date[] | string[],
    action: "select" | "click" | "doubleClick"
}

//this is what is how we declare state varibles (dynamic attributes)
interface CalendarState {
    events: ComplexEvent[]
}

//***** ***** ***** USING THIS IS RIGHT BUT REQUIRES CHANGES IN HOME.TSX ***** ***** *****

//this is what is how we declare prop varibles (readoly attributes)
//interface CalendarProps extends RouteComponentProps<{}> {
//    step: number, // length of a time step (mins)
//    timeslot: number, // interval between displayed values mesured in steps
//    minEventDuration: number, //mesured in steps 
//    maxEventDuration: number, //mesured in steps 
//}

//***** ***** ***** *****  *****  *****  КАСТЫЛЬ :P *****  *****  ***** ***** ***** *****
const properties = { step: 15, timeslot: 2, minEventDuration: 4, maxEventDuration: 9 };
//***** ***** ***** *****  *****  ***** ***** ***** *****  *****  ***** ***** ***** *****

export class Calendar extends React.Component<RouteComponentProps<{}>, CalendarState> {//interface is used here

    //**** Proof of Concept ****
    //Simple example of adding an event 
    AddEvent(event: ComplexEvent) {
        this.state.events.push(event);
        this.forceUpdate();
    }

    //**** Proof of Concept ****
    //simple example of removing an element by name
    RemoveEvents() {
        this.setState({
            events: this.state.events.filter(function (e) {
                return e.title !== 'Added Event'
            })
        });
    }

    //Branches emptiness-selection handeling by action type
    SelectionHandler(slotInfo: SelectionRange) {
        switch (slotInfo.action) {
            case "select":
                this.SpecificRangeSelection(slotInfo);
                break;
            case "click":
                this.StartSelection();
                break;
            case "doubleClick":
                this.DoubleClickEmptinessHandler();
        }
    }

    //TODO:
    // 1) Dialog for creating multiple small events in place of oversized.
    // 2) Creating a dialog for the name and, in the future other properties.
    // 3) Separate handeling for multi-day selection (if needed).
    SpecificRangeSelection(selection: SelectionRange) {
        if (selection.start.getDate() == selection.end.getDate() &&
            selection.start.getMonth() == selection.end.getMonth() &&
            selection.start.getFullYear() == selection.end.getFullYear() &&
            selection.slots.length >= properties.minEventDuration &&
            selection.slots.length <= properties.maxEventDuration) {
            this.AddEvent(new ComplexEvent(false, selection.start, selection.end, "Drawn Event", EventStates.new, ""));
        }
    }

    //TODO
    StartSelection() { }
    DoubleClickEmptinessHandler() { }

   
    constructor() {
        super();
        this.state = {
            events: eventsFromSomewhere // Fetch function goes here
        }
        BigCalendar.momentLocalizer(moment); // or globalizeLocalizer
    }


    public render() {
        return <div>
            <button onClick={() => { this.AddEvent(additionalEvent) }}>add event</button>
            <button onClick={() => { this.RemoveEvents() }}>remove all added events</button>
            <div style={{ height: '100vh', margin: '10px' }}>
                <BigCalendar
                    events={this.state.events}
                    startAccessor="start"
                    endAccessor="end"
                    step={properties.step}      // All events and selections are rounded to [15] minutes.
                    timeslots={properties.timeslot}  // determines how often the time values are displayed in week and day views (in steps) (15 * 2 = 30 minutes)
                    selectable     // For the line below
                    onSelectSlot={(e) => {
                        this.SelectionHandler({
                            start: new Date(e.start.toString()),  //Needs to be fixed!!!!
                            end: new Date(e.end.toString()),      //Needs to be fixed!!!!
                            slots: e.slots,// 
                            action: e.action
                        })
                    }} // Meant to be used for "drawing" events.
                    min-height="800px"
                    defaultDate={new Date()}
                />
            </div>
        </div>
    }
}
