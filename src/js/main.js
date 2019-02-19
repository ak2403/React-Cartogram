import React, { Component } from "react";
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Button, Modal } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import _ from 'lodash';
import uuid from 'uuid/v4'
import Maps from './containers/maps'
import Options from "./containers/options/index.js";
import AddMaps from './components/addmaps-modal';
import { switchScreen, deleteLayer } from './redux/actions/filter-action'

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
        this.deleteLayer = this.deleteLayer.bind(this)
    }

    deleteLayer(list){
        this.props.deleteLayer(list)
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
        let { maps } = this.props

        return (
            <div className="container adjust-width">
                <div className="header-layout">
                    <h3>Ambulance Victoria</h3>
                    {/* <RadioGroup onChange={this.onChange} size='small'>
                        <RadioButton value="single">Single</RadioButton>
                        <RadioButton value="compare">Compare</RadioButton>
                    </RadioGroup> */}
                    <Button onClick={this.showModal}>Add a map</Button>
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

                    {Object.keys(maps).map(list => <div className="map-layer" key={uuid()}>
                        <h5>{list} <FontAwesomeIcon className="icons" icon="trash-alt" onClick={() => this.deleteLayer(list)} /></h5>
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
                        <AddMaps key={uuid()} toggle={this.handleCancel} />
                    </Modal>
                </div>
            </div>
        );
    }
}

const mapStateToProps = props => {
    let { filters } = props

    return {
        maps: filters.maps
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    switchScreen,
    deleteLayer
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Main)