import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import BigCalendar from 'react-big-calendar';
import * as moment from 'moment';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { EventStates, Event } from "./DataController";
import { TextInput } from './Forms/TextInput';
import { InputWidth, InputEvent } from './Forms/InputInterfaces';


// TEMPORAL
//Initial events, Fetcher should be written in the constructor  (will be removed)
const eventsFromSomewhere: Event[] = [];

//event instance (will be removed)
const additionalEvent = new Event("0123456789abcdef", new Date('2018-05-24 11:13:30'), new Date('2018-05-24 11:13:00'), 'Added Event');


interface SelectionRange {
    start:  Date,
    end: Date,
    slots: Date[] | string[],
    action: "select" | "click" | "doubleClick"
}

//this is what is how we declare state varibles (dynamic attributes)
interface CalendarState {
    events: Event[]
    selected?: Event 
    selectedIndex?: number
}

//to be used later
interface CalendarProps extends RouteComponentProps<{}> {
    step: number, // length of a time step (mins)
    timeslot: number, // interval between displayed values mesured in steps
    minEventDuration: number, //mesured in steps 
    maxEventDuration: number, //mesured in steps 
}

//***** ***** ***** *****  *****  *****  КАСТЫЛЬ :P *****  *****  ***** ***** ***** *****
const PROPS = { step: 15, timeslot: 2, minEventDuration: 4, maxEventDuration: 9 };
//***** ***** ***** *****  *****  ***** ***** ***** *****  *****  ***** ***** ***** *****

export class CalendarTeacher extends React.Component<RouteComponentProps<{}>, CalendarState> {//interface is used here

    //Simple example of adding an event 
    AddEvent(event: Event) {
        this.state.events.push(event);
        this.forceUpdate();
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
            selection.slots.length >= PROPS.minEventDuration &&
            selection.slots.length <= PROPS.maxEventDuration) {
            this.AddEvent(new Event("0123456789abcdef", selection.start, selection.end, "Drawn Event"));
        }
    }

    //TODO
    StartSelection() { }
    DoubleClickEmptinessHandler() { }

   
    constructor() {
        super();
        this.state = {
            events: eventsFromSomewhere, // Fetch function goes here
            selected: undefined,
            selectedIndex: undefined,
        }
        BigCalendar.momentLocalizer(moment); // or globalizeLocalizer
    }
    
    EventSelect(e: any) {
        if (e != undefined) {
            var event: Event = e;
            this.setState({
                selected: event,
                selectedIndex: this.state.events.indexOf(event)
            });
        }
    }

    NameChangeEvent(e: InputEvent) {
        if (this.state.selected != undefined) {
            this.state.selected.title = e.value;
        }
    }

    idFilter(e: Event): boolean {
        return this.state.selected == undefined || e.id !== this.state.selected.id
    }

    SaveChanges() {
        if (this.state.selected != undefined && this.state.selectedIndex != undefined) {
            this.state.events.splice(this.state.selectedIndex, 1, this.state.selected)
            this.forceUpdate()
        }
    }

    FormRender() {
        if (this.state.selected != undefined) {
            return <div>
                <h1 style={{ textAlign: 'center' }}>{this.state.selected.id}</h1>
                <TextInput
                    initialValue={this.state.selected.title}
                    width={InputWidth.full}
                    key={this.state.selected.id}
                    onChange={(e) => this.NameChangeEvent(e)}
                />
                <button
                    type="button"
                    className="btn btn-primary btn-block"
                    onClick={(e) => this.SaveChanges()}
                > Submit </button>
            </div>
        }
    }

    public render() {
        return <div className="row">
            <div className="col-lg-7">
                <div style={{ height: '100vh', margin: '10px' }}>
                    <BigCalendar
                        events={this.state.events}
                        startAccessor="start"
                        endAccessor="end"
                        step={PROPS.step}      // All events and selections are rounded to [15] minutes.
                        timeslots={PROPS.timeslot}  // determines how often the time values are displayed in week and day views (in steps) (15 * 2 = 30 minutes)
                        selectable     // For the line below
                        onSelectSlot={(e) => {
                            this.SelectionHandler({
                                start: new Date(e.start.toString()),  //Needs to be fixed!!!!
                                end: new Date(e.end.toString()),      //Needs to be fixed!!!!
                                slots: e.slots,// 
                                action: e.action
                            })
                        }} // Meant to be used for "drawing" events.
                        view="week"
                        onSelectEvent={(event: Object) => this.EventSelect(event)}
                        min-height="800px"
                        defaultDate={new Date()}
                    />
                </div>
            </div>
            <div className="col-md-5">
                {this.FormRender()}
            </div>
        </div>
    }
}
