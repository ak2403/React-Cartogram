import React, { Component } from 'react'
import { Form, Input, Select, Button } from 'antd';
import { bindActionCreators } from 'redux'
import uuid from 'uuid/v4'
import { connect } from 'react-redux'
import { datasets } from '../default'
import { addMaps } from '../redux/actions/filter-action'

const { Option } = Select;

class AddMaps extends Component {
    constructor() {
        super()
        this.state = {
            new_map: {
                title: '',
                dataset: ''
            },
            is_same_name: false
        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    onSubmit() {
        let { new_map } = this.state
        let { mapList } = this.props

        if (mapList.indexOf(new_map.title) === -1) {
            this.props.addMaps(this.state.new_map)
            this.props.toggle()
        } else {
            this.setState({
                is_same_name: true
            })
        }
    }

    onChange(name, value) {
        let { new_map } = this.state
        new_map[name] = value
        this.setState({
            new_map
        })
    }

    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        let { is_same_name } = this.state

        return (
            <Form>
                <Form.Item
                    {...formItemLayout}
                    label="Title"
                >
                    <Input onChange={e => this.onChange('title', e.target.value)} />
                </Form.Item>

                <Form.Item
                    {...formItemLayout}
                    label="Dataset"
                >
                    <Select
                        onChange={value => this.onChange('dataset', value)}>
                        {datasets.map(list => <Option key={uuid()} value={list.path}>{list.text}</Option>)}
                    </Select>
                </Form.Item>
                {is_same_name ? <p style={{color: 'red'}}>Please change the name of the map since there is a map with the same name.</p> : ''}

                <Form.Item {...formItemLayout}>
                    <Button onClick={this.onSubmit}>Add</Button>
                </Form.Item>
            </Form>
        );
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    addMaps
}, dispatch)

export default connect(null, mapDispatchToProps)(AddMaps)