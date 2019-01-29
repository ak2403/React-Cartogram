import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Mention, Tooltip } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { setCalculation } from '../../../redux/actions/filter-action'
import { compulsory_element } from '../../../default'

const { toString, toContentState } = Mention;

class Calculation extends Component {
    constructor() {
        super()
        this.state = {
            formula: ''
        }
        this.onChange = this.onChange.bind(this)
        this.submit = this.submit.bind(this)
    }

    onChange(value) {
        this.setState({
            formula: toString(value)
        })
    }

    submit() {
        this.props.setCalculation(this.props.name, this.state.formula)
    }

    render() {
        let { headers, calculations, name } = this.props

        let filtered_headers = _.filter(headers, list => {
            if(compulsory_element.indexOf(list) === -1){
                return true
            }else{
                return false
            }
        })

        return (<div className="options-layout">
            <h3>Equations Size 
                <Tooltip placement="rightTop" title={"Specify the equation which determines the size of the circle"}>
                <FontAwesomeIcon className="info-icon" icon="info-circle" />
                </Tooltip></h3>

            <div className="division-options">
                <Mention
                    style={{ width: '100%' }}
                    defaultSuggestions={filtered_headers}
                    defaultValue={toContentState(calculations[name] || '')}
                    onChange={this.onChange}
                />
                <div className="filter-button-layout">
                    <div className="filter-button right" onClick={this.submit}>
                        <FontAwesomeIcon className="icon-filter" icon="plus" />
                        Submit
                </div>
                </div>

            </div>
        </div>)
    }
}

const mapStateToProps = props => {
    let { filters } = props
    return {
        calculations: filters.calculations
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    setCalculation
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Calculation)