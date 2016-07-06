import React, {Component} from 'react';
import keybinder from '../utils/keybinder';
import { RANDOM_DATA } from '../utils/random';


class InputComponent extends Component {
    render() {
        return (
            <div className="large-12 columns">
                <label>Search Input
                    <input onChange={(e) => this._updateQuery(e)} value={this.props.query} defaultValue='' type="text" placeholder="Type to Search" />
                </label>
            </div>
        )
    }

    _updateQuery(e) {
        this.props.handleQuery(e.target.value);
    }
}

class ResultComponent extends Component {
    constructor() {
        super()

        this.handleScroll = this.handleScroll.bind(this);
        this.itemsDisplay = 10;
        this.keyEvent = false;
        this.state = {
            displayFilter: [0, 20],
            scrollTop: 0,
            activeIndex: 0
        }
    }

    render() {
        return (
            <div ref={(r) => this._resultBox = r} className={ this.props.showResults ? "results large-12 columns" : "hide" } >
               <div className='panel'>
                    <ul>
                        {this._getList()}
                    </ul>
               </div>
            </div>
        )
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.query !== nextProps.query) {
            this.setState({...this.state, displayFilter: [0, 20], activeIndex: 0});
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.displayFilter !== prevState.displayFilter && this.state.activeIndex !== 0) {
            if (prevState.displayFilter[0] < this.state.displayFilter[0]) {
                this._resultBox.scrollTop = 0;
                this.setState({...this.state, activeIndex: this.state.displayFilter[0]});
            } else {
                this._resultBox.scrollTop = 38 * 20;
                this.setState({...this.state, activeIndex: this.state.displayFilter[1] - 1});
            } 
        }
    }

    _getList() {
        var list = this.props.data.map((file, index) => {
            return (
                <ResultItem activeIndex={this.state.activeIndex}
                            key={file.guid}
                            index={index} 
                            query={this.props.query} 
                            file={file.guid} />
            )
        });

        var slicedList = list.slice(this.state.displayFilter[0], this.state.displayFilter[1]);

        if (list.length > this.state.displayFilter[1]) {
            slicedList.push(
                <li onClick={() => this.handleNext()} key='next-item' className='next-item'>
                    NEXT
                </li>
            );
        } 
        
        if (slicedList.length === 0) {
            slicedList.push(
                <li onClick={() => this.handleNext()} key='no-results' className='no-results'>
                    No Results
                </li>
            );
        }

        if (this.state.displayFilter[0] !== 0) {
            slicedList.unshift(
                <li onClick={() => this.handlePrev()} key='prev-item' className='next-item'>
                    PREV
                </li>
            );
        }

        return slicedList;
    }

    componentDidMount() {
        keybinder.setContextWithBindings('result-box', [
            {keyCombo: 'down', fn: () => this.down()},
            {keyCombo: 'up', fn: () => this.up()}
        ]);
        keybinder.setContext('result-box');
        this._resultBox.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        this._resultBox.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll(event) {
        if (this.keyEvent) return;
        this._resultBox.scrollTop = this._resultBox.scrollTop - (this._resultBox.scrollTop % 2);
        var newIndex = Math.ceil((this._resultBox.scrollTop - 20) / 38) + this.state.displayFilter[0];
        if (this.state.displayFilter[0] !== 0) {
            if (this._resultBox.scrollTop > 58) {
                newIndex = Math.ceil((this._resultBox.scrollTop - 58) / 38) + this.state.displayFilter[0];
            }
        }

        this.setState({...this.state, activeIndex: newIndex});
    }

    handleNext() {
        this.disableScrollEvent(() => {
            if (this.state.displayFilter[1] === this.props.data.length) return;
            var start = this.state.displayFilter[1];
            var end = this.state.displayFilter[1] + 20;
            this.setState({...this.state, displayFilter: [start, end]});
        });
    }

    handlePrev() {
        this.disableScrollEvent(() => {
            if (this.state.displayFilter[0] === 0) return;
            var start = this.state.displayFilter[0] - 20;
            var end = this.state.displayFilter[0];
            this.setState({...this.state, displayFilter: [start, end]});
        });
    }

    getScrollDown(index) {
        var scrollByIndex = 38 * (index - this.state.displayFilter[0]) + 18;
        var maxScroll = ((38 * 10) + (this._resultBox.scrollTop)) - 20;

        if (this.state.displayFilter[0] !== 0) {
            maxScroll = maxScroll - 38;
        }

        if (index === this.state.displayFilter[1] - 1) {
            this._resultBox.scrollTop = 38 * 20;
        } else if (maxScroll < scrollByIndex) {
            this._resultBox.scrollTop = this._resultBox.scrollTop + scrollByIndex % maxScroll;
        }
    }

    getScrollUp(index) {
        var scrollByIndex = 38 * (index - this.state.displayFilter[0]) - 18;
        var maxScroll = this._resultBox.scrollTop - 20;

        if (this.state.displayFilter[0] !== 0) {
            maxScroll = maxScroll - 38;
        }

        if (index === this.state.displayFilter[0]) {
            this._resultBox.scrollTop = 0;
        } else if (maxScroll > scrollByIndex) {
            this._resultBox.scrollTop = this._resultBox.scrollTop - maxScroll % scrollByIndex;
        }
    }

    down() {
        this.disableScrollEvent(() => {
            var nextIndex = this.state.activeIndex + 1;
            if (nextIndex > this.state.displayFilter[1] - 1) {
                this.handleNext();
                return;
            };
            this.getScrollDown(nextIndex);
            this.setState({...this.state, activeIndex: nextIndex});
        });
    }

    up() {
        this.disableScrollEvent(() => {
            var nextIndex = this.state.activeIndex - 1;
            if (nextIndex < this.state.displayFilter[0]) {
                this.handlePrev();
                return;
            };
            this.getScrollUp(nextIndex);
            this.setState({...this.state, activeIndex: nextIndex});
        });
    }

    disableScrollEvent(cb) {
        this.keyEvent = true;
        cb();
        setTimeout(() => {
            this.keyEvent = false;
        }, 100);
    }
}

class ResultItem extends Component {
    constructor() {
        super()

        this.mounted = false;
    }

    render() {
        return (
            <li className={this.props.index === this.props.activeIndex ? 'result-item active' : 'result-item'} >
                {this.props.index + ' | ' + this.props.file}
            </li>
        )
    }

}

export default class SearchComponent extends Component {
    constructor() {
        super();

        this.state = {
            files: RANDOM_DATA,
            filteredFiles: [],
            query: '',
            showResults: false
        }
    }

    render() {
        return (
            <div className="row search-component">
                <InputComponent handleQuery={(query) => this._handleQuery(query)} query={this.state.query} />
                <ResultComponent showResults={this.state.showResults} data={this.state.filteredFiles} query={this.state.query} />
            </div>
        )
    }

    _handleQuery(query) {
        var filteredData = [];
        var show = false;
        if (query !== '') {
            filteredData = this.state.files.filter((file, index) => {
                return file.guid.indexOf(query) !== -1;
            });
            show = true;
        }
        this.setState({...this.state, query: query, filteredFiles: filteredData, showResults: show});
    }
    
}