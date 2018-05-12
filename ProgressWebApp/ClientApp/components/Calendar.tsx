import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import BigCalendar from 'react-big-calendar';
import * as moment from 'moment';
import "react-big-calendar/lib/css/react-big-calendar.css"

// TEMPERAL
//Initial events, Fetcher should be written in the constructor  (will be removed)
const eventsFromSomewhere = [
    {
        allDay: false,
        end: new Date('2018-05-23 11:13:00'),
        start: new Date('2018-05-23 10:13:00'),
        title: 'hi',
    },
    {
        allDay: true,
        end: new Date('2018-05-25 11:13:00'),
        start: new Date('2018-05-25 11:13:00'),
        title: 'All Day Event',
    },
];

//event instance (will be removed)
const additionalEvent = {
    allDay: false,
    end: new Date('2018-05-24 11:13:30'),
    start: new Date('2018-05-24 11:13:00'),
    title: 'Added event',
};
// TYPES

interface Event {
    allDay: boolean,
    start:  Date,
    end:  Date,
    title: string,
}


interface SelectionRange {
    start:  Date,
    end: Date,
    slots: Date[] | string[],
    action: "select" | "click" | "doubleClick"
}

//this is what is how we declare state varibles (dynamic attributes)
interface CalendarState {
    events: {
        allDay: boolean,
        end: Date,
        start: Date,
        title: string,
    }[]
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
    AddEvent(event: Event) {
        this.state.events.push(event);
        this.forceUpdate();
    }

    //**** Proof of Concept ****
    //simple example of removing an element by name
    RemoveEvents() {
        this.setState({
            events: this.state.events.filter(function (e) {
                return e.title !== 'Added event'
            })
        });
    }

    //Branches emptiness selection handeling by action
    SelectionHandler(slotInfo: SelectionRange) {
        switch (slotInfo.action) {
            case "select":
                this.SpecificRangeSelection(slotInfo);
                break;
            case "click":
                this.StartSelection();
                break;
            case "select":
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
            this.AddEvent({ allDay: false, start: selection.start, end: selection.end, title: "Drawn Event" });
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
                            slots: e.slots,
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
