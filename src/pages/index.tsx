import React from 'react';
import './index.less';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import {Avatar, Button, Checkbox, Col, Form, Input, Layout, Row, Select, Space, Tabs, theme, Typography} from 'antd';
import type { TabsProps } from 'antd';
import {Link, Outlet} from "umi";
import axios, { Axios } from 'axios';
import { history } from "umi";
import { ConfigProvider } from 'antd';

const { Title } = Typography;



const { Header, Content, Footer } = Layout;
//为测试login全局配色测试的
const customTheme = {
    primaryColor: '#eebbc3',
    // 更多自定义主题颜色的配置
};
//

const HomePage : React.FC = () => {

    const onFinish = async (values: any) => {
        console.log('Success:', values);
      
        try {
          const response = await axios.post('http://localhost:8080/user/login',values,
          {headers:{'Content-Type' : 'application/x-www-form-urlencoded'}}
          );
          console.log(response.data);
          if(response.data.status === 201) {
            localStorage.setItem("token",response.data.token);
            console.log("test")
            console.log(localStorage.getItem("token"));
            history.push('/FxDb')
          }
        } catch (error) {
          console.error('Error:',error);
        }
    };

        const loginByPhoneNumber = async (values: any) => {
            console.log('Success:', values);
          
            try {
              const response = await axios.post('http://localhost:8080/user/loginByPhoneNumber',values,
              {headers:{'Content-Type' : 'application/x-www-form-urlencoded'}}
              );
              console.log(response.data);
              if(response.data.status === 201) {
                localStorage.setItem("token",response.data.token);
                console.log("test")
                console.log(localStorage.getItem("token"));
                history.push('/FxDb')
              }
            } catch (error) {
              console.error('Error:',error);
            }
    }; 

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const onChange = (key: string) => {
        console.log(key);
    };
    // const prefixSelector = (
    //     <Form.Item name="prefix" noStyle>
    //         <Select style={{ width: 70 }}>
    //             <Option value="61">+61</Option>
    //         </Select>
    //     </Form.Item>
    // );


    const items: TabsProps['items'] = [
        {
            key: '1',
            label: `Account Password`,
            children: <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="email"
                        rules={[{ required: true, message: 'Please input your Email!' }]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                    <Form.Item>
                        {/* <Form.Item name="remember" valuePropName="checked" noStyle> */}
                        <Form.Item  valuePropName="checked" noStyle>
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>

                        <a className="login-form-forgot" href="">
                            Forgot password
                        </a>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Log in
                        </Button>
                        Or <a href="register">register now!</a>
                    </Form.Item>
                </Form>,
        },
        {
            key: '2',
            label: `Phone number`,
            children:
                <Form
                name="normal_login"
                className="login-form"
                initialValues={{ remember: true }}
                onFinish={loginByPhoneNumber}
            >
                <Form.Item
                    name="phoneNumber"
                    label="Phone Number"
                    rules={[{ required: true, message: 'Please input your phone number!' }]}
                >
                    {/* <Input addonBefore={prefixSelector} style={{ width: '100%' }} /> */}
                    <Input style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please input your Password!' }]}
                >
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Password"
                    />
                </Form.Item>
                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <a className="login-form-forgot" href="">
                        Forgot password
                    </a>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button-phone">
                        Log in
                    </Button>
                    Or <a href="register">register now!</a>
                </Form.Item>
            </Form>,
        },
    ];
    return (
        <ConfigProvider theme={{ token: { colorLinkHover:"#8bd3dd",//控制文本在悬停状态下的背景色。
        //colorTextLightSolid: "#ffd803",//控制带背景色的文本，例如 Primary Button 组件中的文本高亮颜色。
        //colorFillContent: "#eebbc3",//控制内容区域的背景色。pink #eebbc3
        colorText: "#5f6c7b",//change it into grey#5f6c7b
        colorError: "#e45858",
        colorLink: "#2E7E8F",
        //controlOutline: "#eebbc3",//控制输入组件的外轮廓线颜色
        controlHeight: "40",
        //colorTextDescription: "#eebbc3", //grey
        colorPrimary: "#8bd3dd",//#ffd803 #abd1c6 #bae8e8 #b8c1ec(purple)
        borderRadius: 3 } }}>

            <Layout className="layout">

                <Header>
                    <div className="logo" />

                </Header>
                <Content style={{ padding: '0 50px' }}>

                    <div className="site-layout-content" style={{ background: colorBgContainer }}>
                        <Row justify="center">
                            <Col span={10}></Col>
                            <Col span={5}>
                                <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
                            </Col>
                            <Col span={9}></Col>
                        </Row>

                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>CS28-2 ©2023 Created by G2 TEAM</Footer>
            </Layout>
        </ConfigProvider>    
    );
};
export default HomePage ;