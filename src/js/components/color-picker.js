import React, { Component } from 'react'
import { SketchPicker } from 'react-color';

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
        let { color_picker, label, hideText } = this.props

        return <div className="color-picker-layout">
            <span>{label}</span>
            <button onClick={() => this.setState({ show_picker: !this.state.show_picker })}>
                <div className="color-review" style={{backgroundColor: color_picker}}></div> {!hideText ? `${!show_picker ? 'Select a color' : 'Confirm the color'}` : ''}
            </button>
            {show_picker ? <SketchPicker
                className="custom-color-picker"
                color={color_picker}
                onChangeComplete={this.handleChangeComplete}
            /> : ''}
        </div>
    }
}

export default ColorPicker