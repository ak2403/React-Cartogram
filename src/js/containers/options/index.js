import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Papa from 'papaparse'
import Filters from './children/filters'
import General from './children/general'
import Calculation from './children/Calculation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DivisionColor from './children/color-division'
import datacsv from '../../data/sample_data.csv';

class Options extends Component {
    constructor() {
        super()
        this.state = {
            show_options: true,
            centroid_data: [],
            headers: []
        }
        this.toggleView = this.toggleView.bind(this)
        this.updateData = this.updateData.bind(this)
    }

    componentDidMount() {
        Papa.parse(datacsv, {
            header: true,
            download: true,
            skipEmptyLines: true,
            complete: this.updateData
        });
    }

    updateData(result) {
        let { centroid_data } = this.state
        const data = result.data;
        data.map(list => {
            if (centroid_data.indexOf(list.Centroid) === -1) {
                centroid_data.push(list.Centroid)
            }
        })
        this.setState({
            centroid_data,
            headers: result.meta.fields
        })
    }

    toggleView() { this.setState({ show_options: !this.state.show_options }) }

    render() {
        let { show_options, centroid_data, headers } = this.state
        let { name } = this.props

        return (<div className="options-layer">
            {show_options ? <div className="options-container"> 
                <div className="options-icon">
                    <span>Options</span>
                    <FontAwesomeIcon className="icons" icon="times-circle" onClick={this.toggleView} />
                </div>
                <Calculation name={name} headers={headers} />
                <General name={name} />
                <Filters name={name} centroid_data={centroid_data} />
                <DivisionColor name={name} headers={headers} />
            </div> : <div className="float-icon">
                    <FontAwesomeIcon className="icons" icon="filter" onClick={this.toggleView} />
                </div>}
        </div>)
    }
}

const mapStateToProps = props => {
}

const mapDispatchToProps = dispatch => bindActionCreators({

}, dispatch)

export default connect(null, mapDispatchToProps)(Options)