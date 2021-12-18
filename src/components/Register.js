import React from 'react';
import { Form, Input, Button, message } from "antd";
import {BASE_URL} from "../constants";
import axios from "axios";

const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 8,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 16,
        },
    },
};
const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};
function Register(props) {
    const [form] = Form.useForm(); // must use form in bracket in receive the useForm method in lib
    //step1： set up username and password
    //step 2: send register into to the server
    //step 3: case1: success -> display login case2: failed ->inform user failed
    const onFinish = values => {
        console.log('Received values of form: ', values);
        const {username, password} = values;
        const opt = {
            method: 'POST',
            url: `${BASE_URL}/signup`,
            data: {
                username: username,
                password: password
            },
            headers: {'content-type': 'application/json'}
        };
        axios(opt)
            .then(res => {
                console.log(res);
                if (res.status === 200) {
                    //case 1: success ->display login
                    //return login component? --must return component in return
                    message.success('Registration succeed!');
                    props.history.push('/login');
                }
            })
    };
        return (
            <Form
                {...formItemLayout}
                form={form}
                name="register"
                onFinish={onFinish}
                className="register"
            >
                <Form.Item
                    name="username"
                    label="Username"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Username!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="confirm"
                    label="Confirm Password"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Please confirm your password!',
                        },
                        ({ getFieldValue }) => ({
                            validator(rule, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject('The two passwords that you entered do not match!');
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit" className="register-btn">
                        Register
                    </Button>
                </Form.Item>
            </Form>
        );
    }
    export default Register;