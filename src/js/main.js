import React, { Component } from "react";
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Radio, Button, Modal } from 'antd';
import Maps from './containers/maps'
import Options from "./containers/options/index.js";
import AddMaps from './components/addmaps-modal';
import { switchScreen } from './redux/actions/filter-action'

import lga from './data/LGA_Centroid_Test.csv';
import sample_data from './data/sample_data.csv';
// import datacsv from './data/Rural_Combined_Cohorts_Oct-Dec18.csv';
// import datacsv from './data/SCF_Master_Table_Joined_F.csv';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class Main extends Component {
    constructor() {
        super()
        this.state = {
            scale: 0,
            visible: false
        }
        this.onChange = this.onChange.bind(this)
        this.showModal = this.showModal.bind(this)
        this.handleOk = this.handleOk.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
    }

    showModal() {
        this.setState({
            visible: true,
        });
    }

    handleOk(e) {
        this.setState({
            visible: false,
        });
    }

    handleCancel(e) {
        this.setState({
            visible: false,
        });
    }

    onChange(e) {
        this.props.switchScreen(e.target.value === 'compare' ? true : false)
    }

    render() {
        let { visible } = this.state
        let { is_dual, maps } = this.props

        return (
            <div className="container adjust-width">
                <div className="header-layout">
                    <h3>Ambulance Victoria</h3>
                    {/* <RadioGroup onChange={this.onChange} size='small'>
                        <RadioButton value="single">Single</RadioButton>
                        <RadioButton value="compare">Compare</RadioButton>
                    </RadioGroup> */}
                    <Button onClick={this.showModal}>Modal</Button>
                </div>
                <div className="maps-layout">
                    {/* {!is_dual ? <div className="map-layer">
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
                        </React.Fragment>} */}

                    {Object.keys(maps).map(list => <div className="map-layer">
                        <Maps name={list} dataset={maps[list].dataset} />
                        <Options name={list} dataset={maps[list].dataset} />
                    </div>)}


                    <div className="custom-tooltip">
                        <div id="header"></div>
                        <div id="description"></div>
                        <div id="sub-description"></div>
                    </div>
                    <Modal
                        title="Add new maps"
                        visible={visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        footer=""
                    >
                        <AddMaps />
                    </Modal>
                </div>
            </div>
        );
    }
}

const mapStateToProps = props => {
    let { filters } = props

    return {
        is_dual: filters.is_dual,
        maps: filters.maps
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    switchScreen
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Main)