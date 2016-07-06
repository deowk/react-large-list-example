import React, { PropTypes } from 'react';
import '../../assets/sass/main.scss';

export default class App extends React.Component {

    constructor(...args) {
        super(...args);
    }

    render() {
        const { props: { children } } = this;

        return (
            <div className="app-container">
                {React.cloneElement(children || <div />, {})}
            </div>
        );
    }
}