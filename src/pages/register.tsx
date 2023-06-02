import React, { useState } from 'react';
import {Image, Layout, theme} from 'antd';
import { ConfigProvider} from 'antd';
import {
    Avatar,
    Button,
    Checkbox,
    Col,
    Form,
    Input,
    Row,
    Select,
    Space,
    Typography
} from 'antd';
// import yayJpg from "../../../../../src/assets/yay.jpg";
import axios from "axios";
import { history } from "umi";


const { Title } = Typography;
const { Option } = Select;

interface DataNodeType {
    value: string;
    label: string;
    children?: DataNodeType[];
}


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

//为测试login全局配色测试的
const customTheme = {
    primaryColor: '#eebbc3',
    // 更多自定义主题颜色的配置
};
//

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

const Register: React.FC = () => {

    const [form] = Form.useForm();
      
    const onFinish = async (values: any) => {
        console.log('Success:', values);
      
        try {
          const response = await axios.post('http://localhost:8080/user/create',values,
          {headers:{'Content-Type' : 'application/x-www-form-urlencoded'}}
          );
          console.log(response.data);
          if(response.data.status === 200) {
            history.push('/')
          }
        } catch (error) {
          console.error('Error:',error);
        }
    }; 

    // const prefixSelector = (
    //     <Form.Item name="prefix" noStyle>
    //         <Select style={{ width: 70 }}>
    //             <Option value="61">+61</Option>
    //             <Option value="86">+86</Option>
    //         </Select>
    //     </Form.Item>
    // );

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const [autoCompleteResult, setAutoCompleteResult] = useState<string[]>([]);


    const { Header, Content, Footer } = Layout;
    return (
        <ConfigProvider theme={{ token: { colorLinkHover:"#8bd3dd",//控制文本在悬停状态下的背景色。
        //colorTextLightSolid: "#ffd803",//控制带背景色的文本，例如 Primary Button 组件中的文本高亮颜色。
        //colorFillContent: "#eebbc3",//控制内容区域的背景色。pink #eebbc3
        colorText: "#5f6c7b",//change it into grey#5f6c7b
        colorError: "#e45858",
        colorLink: "#2E7E8F",
        //controlOutline: "#eebbc3",//控制输入组件的外轮廓线颜色
        controlHeight: "40",
        colorTextLightSolid: "#fffffe",//深紫色#6246ea控制带背景色的文本，例如 Primary Button 组件中的文本高亮颜色。
        //colorTextDescription: "#eebbc3", //grey
        colorPrimary: "#eebbc3",//#ffd803 #abd1c6 #bae8e8 #b8c1ec(purple)
        borderRadius: 3 } }}>


            <Layout className="layout">

                <Header>
                    <div className="logo" />

                </Header>
                <Content style={{ padding: '0 50px' }}>

                    <div className="site-layout-content" style={{ background: colorBgContainer }}>
                        <Row justify="center">
                            <Col span={8}></Col>
                            <Col span={8} >
                                <Row justify="center">
                                    <Col span={5}>
    {/*                                    <Image
                                            width={200}
                                            hight={200}
                                            src="yay.jpg" //这里改不行
                                        />*/}
                                    </Col>
                                    {/*<p style={{ textAlign: 'center' }}>*/}
                                    {/*    <img src={yayJpg} width={200} hight={200} />*/}
                                    {/*</p>*/}

                                    <Col><Title level={2} italic={true} justify="center" style={{color: "#bae8e8"}}>Welcome to TraderWin!</Title></Col>
                                </Row>
                                <Form
                                    {...formItemLayout}
                                    form={form}
                                    name="register"
                                    onFinish={onFinish}
                                    // initialValues={{ residence: ['zhejiang', 'hangzhou', 'xihu'], prefix: '86' }}
                                    style={{ maxWidth: 600 }}
                                    scrollToFirstError
                                >
                                    <Form.Item
                                        name="email"
                                        label={<span style={{fontSize: '16px'}}>E-mail</span>}
                                        rules={[
                                            {
                                                type: 'email',
                                                message: 'The input is not valid E-mail!',
                                            },
                                            {
                                                required: true,
                                                message: 'Please input your E-mail!',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        name="password"
                                        label={<span style={{fontSize: '16px'}}>Password</span>}
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

                                    {/* <Form.Item
                                        name="confirm"
                                        label={<span style={{fontSize: '16px'}}>Confirm Password</span>}
                                        dependencies={['password']}
                                        hasFeedback
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please confirm your password!',
                                            },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (!value || getFieldValue('password') === value) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                                },
                                            }),
                                        ]}
                                    >
                                        <Input.Password />
                                    </Form.Item> */}

                                    <Form.Item
                                        name="username"
                                        label={<span style={{fontSize: '16px'}}>Username</span>}
                                        tooltip="Will be used for login"
                                        rules={[{ required: true, message: 'Please input your username!', whitespace: true }]}
                                    >
                                        <Input />
                                    </Form.Item>


                                    <Form.Item
                                        name="phoneNumber"
                                        label={<span style={{fontSize: '16px'}}>Phone Number</span>}
                                        rules={[{ required: true, message: 'Please input your phone number!' }]}
                                    >
                                        {/* <Input addonBefore={prefixSelector} style={{ width: '100%' }} /> */}
                                        <Input style={{ width: '100%' }} />
                                    </Form.Item>

                                    <Form.Item
                                        name="gender"
                                        label={<span style={{fontSize: '16px'}}>Gender</span>}
                                        rules={[{ required: true, message: 'Please select gender!' }]}
                                    >
                                        <Select placeholder="select your gender">
                                            <Option value="male">Male</Option>
                                            <Option value="female">Female</Option>
                                            <Option value="other">Other</Option>
                                        </Select>
                                    </Form.Item>

                                    <Form.Item {...tailFormItemLayout}>
                                        <Button type="primary" htmlType="submit" style={{ backgroundColor: "#bae8e8", color: "#272343", border: "none", fontSize: '16px' }}>
                                            Register
                                        </Button>
                                    </Form.Item>

                                    <Form.Item {...tailFormItemLayout}>
                                        <p style={{ fontSize: '18px' }}>
                                            Already have an account? <a href="/">Log in</a>
                                        </p>
                                    </Form.Item>

                                </Form>
                            </Col>
                            <Col span={8}></Col>
                        </Row>
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>CS28-2 ©2023 Created by G2 TEAM</Footer>
            </Layout>
        </ConfigProvider>    

    );
};

export default Register;