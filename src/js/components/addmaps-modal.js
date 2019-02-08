import React, { Component } from 'react'
import { Form, Input, Select, Button } from 'antd';
import { bindActionCreators } from 'redux'
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
            }
        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    onSubmit() {
        this.props.addMaps(this.state.new_map)
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
                        {datasets.map(list => <Option value={list.path}>{list.text}</Option>)}
                    </Select>
                </Form.Item>

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