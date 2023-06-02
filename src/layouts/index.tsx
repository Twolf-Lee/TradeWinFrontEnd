import { Link, Outlet,useAppData, useLocation } from 'umi';
import {Avatar, Breadcrumb, Layout, Menu, Space, theme} from 'antd';
import React from "react";
//import {UserOutlined} from "@ant-design/icons-svg";
import { UserOutlined } from '@ant-design/icons';
import { ConfigProvider } from 'antd';//color test



const { Header, Content, Footer } = Layout;
const customTheme = {
    primaryColor: '#eebbc3',
    // 更多自定义主题颜色的配置
};

export default function BasicLayouts() {
    const { clientRoutes } = useAppData();
    const location = useLocation();
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <ConfigProvider theme={{ token: { colorBgTextHover:"#8bd3dd",//控制文本在悬停状态下的背景色。
        //colorTextLightSolid: "#ffd803",//控制带背景色的文本，例如 Primary Button 组件中的文本高亮颜色。
        //colorFillContent: "#eebbc3",//控制内容区域的背景色。pink #eebbc3
        colorTextLightSolid: "#e3f6f5",//控制带背景色的文本，例如 Primary Button 组件中的文本高亮颜色。
        colorText: "#272343",
        colorTextDescription: "#5f6c7b", //grey
        colorPrimary: "#8bd3dd",//#ffd803 #abd1c6 #bae8e8 #b8c1ec(purple)
        borderRadius: 3 } }}>

            <Layout className="layout"
                    route={clientRoutes[0]}
                    location={location}
                    menuItemRender={(menuItemProps, defaultDom) => {
                        if (menuItemProps.isUrl || menuItemProps.children) {
                            return defaultDom;
                        }
                        if (menuItemProps.path && location.pathname !== menuItemProps.path) {
                            return (
                                <Link to={menuItemProps.path} target={menuItemProps.target}>
                                    {defaultDom}
                                </Link>
                            );
                        }
                        return defaultDom;
                    }}>

                <Header >
                    <div className="logo"/>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['1']}
                    >
                        <Menu.Item key="1">
                            <Link to="/FxDb" style={{ fontSize: "16px" }}>FxDb</Link>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Link to="/CoinDb"  style={{ fontSize: "16px" }}>CoinDb</Link>
                        </Menu.Item>

                        <Menu.Item key="3" style={{ marginLeft: 'auto' }}>
                            <Link to="/blogmain" style={{ fontSize: "16px" }}>Blog</Link>
                        </Menu.Item>

                        <Menu.SubMenu
                            key="sub1"
                            title={
                            <div className="menu-avatar"  style={{ display: "flex", alignItems: "center" }}>
                                <Avatar icon={<UserOutlined />}  style={{ marginRight: "8px" }}/>
                                <span>My Profile</span>
                            </div>}>
                            <Menu.Item key="5.1">
                                <Link to="MyProfile">Profile</Link>
                            </Menu.Item>
                            <Menu.Item key="5.2">Settings</Menu.Item>
                            <Menu.Item key="5.3">Logout</Menu.Item>
                        </Menu.SubMenu>




                    </Menu>
                    {/*<Avatar icon={<UserOutlined/>}/>*/}

                </Header>
                <Content style={{padding: '0 50px'}}>
                    <div className="site-layout-content" style={{background: colorBgContainer}}>

                    </div>
                </Content>
                <Outlet/>

                <Footer style={{textAlign: 'center'}}>CS28-2 ©2023 Created by G2 TEAM</Footer>

            </Layout>
        </ConfigProvider>    
    );
};
