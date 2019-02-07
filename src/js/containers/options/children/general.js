import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ColorPicker from '../../../components/color-picker'
import {changeColorPicker} from '../../../redux/actions/filter-action'

class General extends Component {
    constructor() {
        super();
        this.divisionChange = this.divisionChange.bind(this)
    }

    divisionChange(key, value) {
        this.props.changeColorPicker(this.props.name, value)
    }

    render() {
        let {color_picker, name }=this.props

        return (<div className="options-layout">
            <h3>General</h3>

            <div className="division-options">
                <div className="division-input">
                    <ColorPicker label="Color" color_picker={color_picker[name]} changeColorPicker={(color) => this.divisionChange('color', color)} />
                </div>
            </div>
        </div>)
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

export default connect(mapStateToProps, mapDispatchToProps)(General)