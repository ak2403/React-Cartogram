import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import uuid from 'uuid/v4'
import { Tooltip, Select } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ColorPicker from '../../../components/color-picker'
import { setDivision, setColorEquation, switchColorEquation } from '../../../redux/actions/filter-action'
import Equations from '../../../components/equations';

const Option = Select.Option;

class DivisionColor extends Component {
    constructor() {
        super();
        this.state = {
            division: 4,
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
            dont_load: false,
            show_palette: false
        }
        this.addField = this.addField.bind(this)
        this.renderColor = this.renderColor.bind(this)
        this.colorChange = this.colorChange.bind(this)
        this.removeField = this.removeField.bind(this)
        this.onEquationSubmit = this.onEquationSubmit.bind(this)
        this.divisionChange = this.divisionChange.bind(this)
        this.divisionSubmit = this.divisionSubmit.bind(this)
        this.addColor = this.addColor.bind(this)
        this.removeColor = this.removeColor.bind(this)
        this.switchFilter = this.switchFilter.bind(this)
    }

    shouldComponentUpdate(nextProps, nextState){
        if(nextState.dont_load){
            return false
        }
        return true
    }

    switchFilter(value) {
        let { name } = this.props
        this.props.switchColorEquation(name, value)
    }

    addColor() {
        let { division_data } = this.state
        division_data.push({
            form: '',
            to: '',
            color: ''
        })
        this.setState({
            division_data
        })
    }

    removeColor(index) {
        let { division_data } = this.state
        division_data.splice(index, 1)
        this.setState({
            division_data
        })
    }

    divisionSubmit() {
        this.props.setDivision(this.state.division_data, this.props.name)
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
            dont_load: true
        })
    }

    componentDidMount() {
        let { division, name } = this.props

        if (division[name]) {
            this.setState({
                division_data: division[name]
            })
        }
    }

    removeField(index) {
        let { division_data } = this.state
        division_data.splice(index, 1)
        this.setState({
            division_data
        })
    }

    colorChange(i, color) {
        let { division_data } = this.state
        division_data[i].color = color
        this.setState({
            division_data
        })
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

    renderColor() {
        let { division_data } = this.state
        let li_dom = []

        for (let i = 0; i < division_data.length; i++) {
            li_dom.push(
                <li key={uuid()}>
                    <span>{i + 1}</span>
                    <CommonPicker color={division_data[i].color} onColorChange={(color) => this.colorChange(i, color)} />
                    <FontAwesomeIcon icon="times-circle" onClick={() => this.removeField(i)} />
                </li>
            )
        }

        return li_dom
    }

    onEquationSubmit(val) {
        this.props.setColorEquation(this.props.name, val)
        this.props.setDivision(this.state.division_data, this.props.name)
    }

    render() {
        let { headers, division, name, colors, maps, color_equation_switch } = this.props

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

        let maps_keys = Object.keys(maps)

        return (<div className="options-layout">
            <h3>
                Equation Color
                <Tooltip placement="rightTop" title={"Specify the equation which determines the color  of the circle"}>
                    <FontAwesomeIcon className="info-icon" icon="info-circle" />
                </Tooltip>
                <span style={{ float: 'right', fontSize: '12px' }}>
                    Swap
                        <Select size="small" style={{ width: 100 }} onChange={this.switchFilter}>
                        {maps_keys.map(list => <Option value={list}>{list}</Option>)}
                    </Select>
                </span>
            </h3>

            <Equations options={headers} onSubmit={this.onEquationSubmit} />

            {colors[name] ?
                <div className="color-panel">
                    <div className="color-row header">
                        {columns.map(list => <div className="column-color-row">{list.title}</div>)}
                    </div>
                    {division[name] ? division[name].map((list, index) => {
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
                    }) : ''}
                    <FontAwesomeIcon icon="plus" onClick={this.addColor} />

                    <div className="filter-button-layout">
                        <div className="filter-button right" onClick={this.divisionSubmit}>
                            <FontAwesomeIcon className="icon-filter" icon="palette" />
                            Submit
                </div>
                    </div>

                </div>
                : ''}

        </div>)
    }
}

const mapStateToProps = props => {
    let { filters } = props

    return {
        division: filters.division,
        colors: filters.colors,
        color_equation_switch: filters.color_equation_switch,
        maps: filters.maps
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    setDivision,
    setColorEquation,
    switchColorEquation
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(DivisionColor)