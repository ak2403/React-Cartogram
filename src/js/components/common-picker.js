import React, { Component } from 'react'
import { SketchPicker } from 'react-color';

class CommonPicker extends Component {
    constructor() {
        super()
        this.state = {
            show_picker: false,
            color_picker: ''
        }
        this.handleChangeComplete = this.handleChangeComplete.bind(this)
        this.toggleView = this.toggleView.bind(this)
    }

    handleChangeComplete(value) {
        this.setState({
            color_picker: value.hex
        })
    }

    toggleView() {
        let { show_picker } = this.state

        if (show_picker) {
            this.props.onColorChange(this.state.color_picker)
            this.setState({ show_picker: false })
        } else {
            this.setState({ show_picker: true })
        }
    }

    render() {
        let { show_picker, color_picker } = this.state
        let { color } = this.props

        return <div className="color-picker-layout">
            <button onClick={this.toggleView}>
                <div className="color-review" style={{ backgroundColor: color }}></div> {!show_picker ? 'Select a color' : 'Confirm the color'}
            </button>
            {show_picker ? <SketchPicker
                className="custom-color-picker"
                color={color_picker}
                onChangeComplete={this.handleChangeComplete}
            /> : ''}
        </div>
    }
}

export default CommonPicker