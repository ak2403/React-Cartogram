import React, { Component } from 'react'
import _ from 'lodash'
import { Mention, Tooltip } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { compulsory_element } from '../../default'

const { toString, toContentState } = Mention;

class Equations extends Component {
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
        this.props.onSubmit(this.state.formula)
    }

    render() {
        let { options, value } = this.props

        let filtered_headers = _.filter(options, list => {
            if(compulsory_element.indexOf(list) === -1){
                return true
            }else{
                return false
            }
        })

        return (<div className="options-layout">
            {/* <h3>Equations Size 
                <Tooltip placement="rightTop" title={"Specify the equation which determines the size of the circle"}>
                <FontAwesomeIcon className="info-icon" icon="info-circle" />
                </Tooltip></h3> */}

            <div className="division-options">
                <Mention
                    style={{ width: '100%' }}
                    defaultSuggestions={filtered_headers}
                    defaultValue={toContentState(value || '')}
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

export default Equations