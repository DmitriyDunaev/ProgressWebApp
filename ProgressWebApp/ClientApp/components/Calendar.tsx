import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import BigCalendar from 'react-big-calendar';
import * as moment from 'moment';
import "react-big-calendar/lib/css/react-big-calendar.css"


//Initial events, Fetcher should be written in the constructor
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

//event template
const additionalEvent = {
    allDay: false,
    end: new Date('2018-05-24 11:13:30'),
    start: new Date('2018-05-24 11:13:00'),
    title: 'Added event',
};


//this is what is how we declare state varibles (dynamic attributes)
interface CalendarComponentState {
    events: {
        allDay: boolean,
        end: Date,
        start: Date,
        title: string,
    }[]
}

export class Calendar extends React.Component<RouteComponentProps<{}>, CalendarComponentState> {//interface is used here
   

    //Simple example of adding an event 
    addEvent() {
        this.state.events.push(additionalEvent);
        this.forceUpdate();
    }

    //simple example of removing an element by name
    removeEvents() {
        this.setState({
            events: this.state.events.filter(function (e) {
                return e.title !== 'Added event'
            })
        });
    }

    constructor() {
        super();
        this.state = {
            events: eventsFromSomewhere // Fetch function goes here
        }
        BigCalendar.momentLocalizer(moment); // or globalizeLocalizer
    }


    public render() {
        return <div>
            <button onClick={() => { this.addEvent() }}>add event</button>
            <button onClick={() => { this.removeEvents() }}>remove all added events</button>
            <div style={{ height: '100vh', margin: '10px' }}>
                <BigCalendar
                    events={ this.state.events }
                    startAccessor="start"
                    endAccessor="end"
                    min-height="800px"
                    defaultDate={new Date()}
                />
            </div>
        </div>

    }
}