import * as React from 'react';
import { RouteComponentProps } from 'react-router';


export class CourseEditor extends React.Component<RouteComponentProps<{}>, {}> {

    render() {
        return (
            <h1> Stuff </h1>
        );
    };
}


//import { withFormsy } from 'formsy-react';
//import * as React from 'react';

//class MyInput extends React.Component {
//    constructor(props) {
//        super(props);
//        this.changeValue = this.changeValue.bind(this);
//    }

//    changeValue(event) {
//        // setValue() will set the value of the component, which in
//        // turn will validate it and the rest of the form
//        // Important: Don't skip this step. This pattern is required
//        // for Formsy to work.
//        this.props.setValue(event.currentTarget.value);
//    }

//    render() {
//        // An error message is returned only if the component is invalid
//        const errorMessage = this.props.getErrorMessage();

//        return (
//            <div>
//                <input
//                    onChange={this.changeValue}
//                    type="text"
//                    value={this.props.getValue() || ''}
//                />
//                <span>{errorMessage}</span>
//            </div>
//        );
//    }
//}

//export default withFormsy(MyInput);