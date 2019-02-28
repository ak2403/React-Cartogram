import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Button, Select, Input, Checkbox } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import _ from 'lodash';
import uuid from 'uuid/v4'
import { setCommonSize, clearCommonSize } from '../redux/actions/filter-action'

const Option = Select.Option;

class CommonSize extends Component {
    constructor() {
        super()
        this.state = {
            bubble_props: {
                min: {
                    static: true,
                    map: '',
                    column: '',
                    value: ''
                },
                max: {
                    static: true,
                    map: '',
                    column: '',
                    value: ''
                }
            }
        }
        this.onChange = this.onChange.bind(this)
        this.saveValue = this.saveValue.bind(this)
        this.sizeSubmit = this.sizeSubmit.bind(this)
        this.sizeClear = this.sizeClear.bind(this)
        this.parentChange = this.parentChange.bind(this)
        this.childChange = this.childChange.bind(this)
    }

    sizeSubmit() {
        this.props.setCommonSize(this.state.bubble_props)
    }

    onChange(e) {
        this.props.switchScreen(e.target.value === 'compare' ? true : false)
    }

    sizeClear() {
        this.props.clearCommonSize()
        this.setState({
            bubble_props: {
                min: {
                    static: true,
                    map: '',
                    column: '',
                    value: ''
                },
                max: {
                    static: true,
                    map: '',
                    column: '',
                    value: ''
                }
            }
        })
    }

    saveValue(name, value) {
        let { bubble_props } = this.state
        bubble_props[name].value = value

        this.setState({
            bubble_props,
            is_block: true
        })
    }


    parentChange(key, value) {
        let { bubble_props } = this.state
        bubble_props[key] = {
            ...this.state.bubble_props[key],
            map: value
        }
        this.setState({
            bubble_props
        })
    }

    childChange(key, value) {
        let { bubble_props } = this.state
        bubble_props[key] = {
            ...this.state.bubble_props[key],
            column: value
        }
        this.setState({
            bubble_props
        })
    }

    render() {
        let { bubble_props } = this.state
        let { statistics, name } = this.props

        let option_values = Object.keys(statistics)
        let min_child_options = bubble_props.min.map ? Object.keys(statistics[bubble_props.min.map]) : []
        let max_child_options = bubble_props.max.map ? Object.keys(statistics[bubble_props.max.map]) : []

        return <div className="common-size-container">
            <div className="common-size-options">
                Min:
                    {/* <Checkbox>Static Value</Checkbox>
                    {bubble_props.min.static ? <Input style={{ width: 100 }} onChange={e => this.saveValue('min', e.target.value)} /> : ''} */}
                <React.Fragment>
                    <Select
                        value={bubble_props.min.map || ''}
                        size="small" style={{ width: 100 }} onChange={value => this.parentChange('min', value)}>
                        {option_values.map(list => <Option key={uuid()} value={list}>{list}</Option>)}
                    </Select>
                    <Select
                        value={bubble_props.min.column || ''}
                        size="small" style={{ width: 100 }} onChange={value => this.childChange('min', value)}>
                        {min_child_options.map(list => <Option key={uuid()} value={list}>{list}</Option>)}
                    </Select>
                </React.Fragment>
            </div>

            <div className="common-size-options">
                Max:
                    {/* <Checkbox>Static Value</Checkbox>
                    {bubble_props.max.static ? <Input style={{ width: 100 }} onChange={e => this.saveValue('max', e.target.value)} /> : ''} */}
                <React.Fragment>
                    <Select
                        value={bubble_props.max.map || ''}
                        size="small" style={{ width: 100 }} onChange={value => this.parentChange('max', value)}>
                        {option_values.map(list => <Option key={uuid()} value={list}>{list}</Option>)}
                    </Select>
                    <Select
                        value={bubble_props.max.column || ''}
                        size="small" style={{ width: 100 }} onChange={value => this.childChange('max', value)}>
                        {max_child_options.map(list => <Option key={uuid()} value={list}>{list}</Option>)}
                    </Select>
                </React.Fragment>
            </div>

            <div className="common-size-options">
                <Button onClick={this.sizeSubmit}>Submit</Button>
                <Button onClick={this.sizeClear}>Clear</Button>
            </div>



        </div>
    }
}

const mapStateToProps = props => {
    let { filters } = props
    return {
        statistics: filters.statistics
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    setCommonSize,
    clearCommonSize
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(CommonSize)