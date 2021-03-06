import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { FetchData } from './components/FetchData';
import { Counter } from './components/Counter';
import { Calendar } from './components/Calendar';
import { CalendarTeacher } from './components/CalendarTeacher';
import { CourseEditor } from './components/CourseEditor';

export const routes = <Layout>
    <Route exact path='/' component={ Home } />
    <Route path='/counter' component={ Counter } />
    <Route path='/fetchdata' component={FetchData} />
    <Route path='/calendar' component={Calendar} />
    <Route path='/calendarTeacher' component={CalendarTeacher} />
    <Route path='/courseEditor' component={CourseEditor} />
</Layout>;
