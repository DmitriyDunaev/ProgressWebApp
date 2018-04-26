import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import BigCalendar from 'react-big-calendar';
import * as moment from 'moment';
import "react-big-calendar/lib/css/react-big-calendar.css"


const dummyEvents = [
        {
            allDay: false,
            end: new Date('2018-04-23 11:13:00'),
            start: new Date('2018-04-22 10:13:00'),
            title: 'hi',
        },
        {
            allDay: true,
            end: new Date('2018-04-25 11:13:00'),
            start: new Date('2018-04-25 11:13:00'),
            title: 'All Day Event',
        },
    ];


export class Calendar extends React.Component<RouteComponentProps<{}>, {}> {
    constructor() {
        super();
        BigCalendar.momentLocalizer(moment); // or globalizeLocalizer
    }
    
 
    public render() {
        return <div style={{ height: '100vh', margin: '10px' }}>
        <BigCalendar
                events={dummyEvents}
                startAccessor="start"
                endAccessor="end"
                min-height="800px"
                defaultDate={new Date()}
            />
            </div>
        
    }
}