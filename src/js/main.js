import React, { Component } from "react";
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Radio } from 'antd';
import Maps from './containers/maps'
import Options from "./containers/options/index.js";
import { switchScreen } from './redux/actions/filter-action'

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class Main extends Component {
    constructor() {
        super()
        this.state = {
            scale: 0
        }
        this.onChange = this.onChange.bind(this)
    }

    onChange(e) {
        this.props.switchScreen(e.target.value === 'compare' ? true : false)
    }

    render() {
        let { is_dual } = this.props

        return (
            <div className="container adjust-width">
                <div className="header-layout">
                    <h3>Ambulance Victoria</h3>
                    <RadioGroup onChange={this.onChange} size='small'>
                        <RadioButton value="single">Single</RadioButton>
                        <RadioButton value="compare">Compare</RadioButton>
                    </RadioGroup>
                </div>
                <div className="maps-layout">
                    {!is_dual ? <div className="map-layer">
                        <Maps name="compareone" />
                        <Options name="compareone" />
                    </div> :
                        <React.Fragment>
                            <div className="map-layer">
                                <Maps name="compareone" />
                                <Options name="compareone" />
                            </div>
                            <div className="map-layer">
                                <Maps name="comparetwo" />
                                <Options name="comparetwo" />
                            </div>
                        </React.Fragment>}




                    <div className="custom-tooltip">
                        <div id="header"></div>
                        <div id="description"></div>
                        <div id="sub-description"></div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = props => {
    let { filters } = props

    return {
        is_dual: filters.is_dual
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    switchScreen
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Main)