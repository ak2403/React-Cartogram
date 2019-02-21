import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Papa from 'papaparse'
import Filters from './children/filters'
import General from './children/general'
import CentroidFilters from './children/centroid-filter'
import Calculation from './children/Calculation'
import SizeOption from './children/size-option'
import DivisionColor from './children/color-division'
import Datasets from '../../data'

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
        Papa.parse(Datasets[this.props.dataset], {
            header: true,
            download: true,
            skipEmptyLines: true,
            complete: this.updateData
        });
    }
    shouldComponentUpdate(nextProps){
        if(nextProps.name !== this.props.name){
            Papa.parse(Datasets[nextProps.dataset], {
                header: true,
                download: true,
                skipEmptyLines: true,
                complete: this.updateData
            }); 
        }
        return true
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
                <DivisionColor name={name} headers={headers} />
                <SizeOption name={name} />
                <General name={name} />
                {centroid_data.length !== 0 ? <CentroidFilters name={name} centroid_data={centroid_data} /> : ''}
                <Filters name={name} centroid_data={centroid_data} />
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