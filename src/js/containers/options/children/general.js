import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ColorPicker from '../../../components/color-picker'

class General extends Component {
    constructor() {
        super();
        this.state = {
        }
    }

    render() {
        return (<div className="options-layout">
            <h3>General</h3>

            <div className="division-options">
                <div className="division-input">
                    <ColorPicker label="Color" />
                </div>
            </div>
        </div>)
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    
}, dispatch)

export default connect(null, mapDispatchToProps)(General)