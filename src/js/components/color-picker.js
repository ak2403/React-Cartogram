import React, { Component } from 'react'
import { SketchPicker } from 'react-color';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { changeColorPicker } from '../redux/actions/filter-action'

class ColorPicker extends Component {
    constructor() {
        super()
        this.state = {
            show_picker: false
        }
        this.handleChangeComplete = this.handleChangeComplete.bind(this)
    }
    handleChangeComplete(value) {
        this.props.changeColorPicker(value.hex)
    }

    render() {
        let { show_picker } = this.state
        let { color_picker, label } = this.props

        return <div className="color-picker-layout">
            <span>{label}</span>
            <button onClick={() => this.setState({ show_picker: !this.state.show_picker })}>
                <div className="color-review" style={{backgroundColor: color_picker}}></div> {!show_picker ? 'Select a color' : 'Confirm the color'}
            </button>
            {show_picker ? <SketchPicker
                className="custom-color-picker"
                color={color_picker}
                onChangeComplete={this.handleChangeComplete}
            /> : ''}
        </div>
    }
}

const mapStateToProps = props => {
    let { filters } = props

    return {
        color_picker: filters.color_picker
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    changeColorPicker
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ColorPicker)