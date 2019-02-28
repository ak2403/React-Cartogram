import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import uuid from 'uuid/v4'
import { Tooltip, Select } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ColorPicker from './color-picker'
import { setCommonColor, clearCommonColor } from '../redux/actions/filter-action'

class CommonColor extends Component {
    constructor() {
        super();
        this.state = {
            division_data: [{
                from: '0',
                to: '25',
                color: '#e74c3c'
            }, {
                from: '25',
                to: '50',
                color: '#3498db'
            }, {
                from: '50',
                to: '75',
                color: '#1abc9c'
            }, {
                from: '75',
                to: '100',
                color: '#9b59b6'
            }],
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
            },
            dont_load: false,
            show_palette: false
        }
        this.addField = this.addField.bind(this)
        this.divisionChange = this.divisionChange.bind(this)
        this.divisionSubmit = this.divisionSubmit.bind(this)
        this.parentChange = this.parentChange.bind(this)
        this.childChange = this.childChange.bind(this)
        this.addColor = this.addColor.bind(this)
        this.removeColor = this.removeColor.bind(this)
        this.clearSubmit = this.clearSubmit.bind(this)
    }

    clearSubmit(){
        this.props.clearCommonColor()
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

    addColor() {
        let { division_data } = this.state
        division_data.push({
            form: '',
            to: '',
            color: ''
        })
        this.setState({
            division_data,
            dont_load: false
        })
    }

    removeColor(index) {
        let { division_data } = this.state
        division_data.splice(index, 1)
        this.setState({
            division_data
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

    divisionSubmit() {
        let { bubble_props, division_data } = this.state

        let color_props = {
            min: bubble_props.min,
            max: bubble_props.max,
            division: division_data
        }
        this.props.setCommonColor(color_props)
    }

    addField(e) {
        let { division_data } = this.state

        division_data.push({
            type: division_data.length + 1,
            color: ''
        })

        this.setState({
            division_data
        })
    }

    divisionChange(key, index, value) {
        let { division_data } = this.state

        if (!division_data[index]) {
            division_data[index] = {
                from: '',
                to: '',
                color: ''
            }
        }
        division_data[index][key] = value
        this.setState({
            division_data,
            dont_load: key === 'color' ? false : true
        })
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.dont_load) {
            return false
        }
        return true
    }

    render() {
        const columns = [{
            title: 'From',
            dataIndex: 'from',
            key: 'from'
        }, {
            title: 'To',
            dataIndex: 'to',
            key: 'to'
        }, {
            title: 'Color',
            dataIndex: 'color',
            key: 'color',
        }];

        let { division_data, bubble_props } = this.state
        let { statistics, name } = this.props

        let option_values = Object.keys(statistics)
        let min_child_options = bubble_props.min.map ? Object.keys(statistics[bubble_props.min.map]) : []
        let max_child_options = bubble_props.max.map ? Object.keys(statistics[bubble_props.max.map]) : []

        return <div className="common-color-panel" style={{overflow: 'auto'}}>
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
            {division_data.map((list, index) => {
                return <div key={uuid()} className="color-row">
                    <div className="column-color-row">
                        <input defaultValue={list.from} onChange={e => this.divisionChange('from', index, e.target.value)} />
                    </div>
                    <div className="column-color-row">
                        <input defaultValue={list.to} onChange={e => this.divisionChange('to', index, e.target.value)} />
                    </div>
                    <div className="column-color-row">
                        <ColorPicker hideText={true} color_picker={list.color} changeColorPicker={(color) => this.divisionChange('color', index, color)} />
                    </div>
                    <div className="column-color-row">
                        <FontAwesomeIcon icon="times-circle" onClick={() => this.removeColor(index)} />
                    </div>

                </div>
            })}
            <FontAwesomeIcon icon="plus" onClick={this.addColor} />

            <div className="filter-button-layout">
                <div className="filter-button right" onClick={this.divisionSubmit}>
                    <FontAwesomeIcon className="icon-filter" icon="palette" />
                    Submit
                        </div>

                        <div className="filter-button right" onClick={this.clearSubmit}>
                    <FontAwesomeIcon className="icon-filter" icon="palette" />
                    Clear
                        </div>
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
    setCommonColor,
    clearCommonColor
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(CommonColor)