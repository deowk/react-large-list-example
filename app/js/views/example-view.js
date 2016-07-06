import React, {Component} from 'react';
import SearchComponent from '../components/search-component';

export default class ExampleView extends Component {
    render() {
        return (
            <div className='example-container'>
                <div className="row">
                <div className="small-5 small-centered columns">
                    <SearchComponent />
                </div>
                </div>
            </div>
        );
    }
}
