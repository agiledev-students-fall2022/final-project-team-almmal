
import React from 'react'
import {Link} from "react-router-dom";
import "antd/dist/antd.css";
import styles from'./Navbar.module.css'
import {
  ContainerOutlined,
  DesktopOutlined,
  UserOutlined,
  TeamOutlined, //for friends
  ApartmentOutlined, //for groups
  KeyOutlined ,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  RadarChartOutlined,
} from '@ant-design/icons';
import { Layout } from 'antd';
import { Menu } from 'antd';
import { Dropdown} from 'antd';
import { Button} from 'antd';
import { Space} from 'antd';
import { useState } from 'react';
import { PageHeader, Typography } from 'antd';



  

const { SubMenu } = Menu;
const { Header, Sider} = Layout;
const { Paragraph } = Typography;


const menu = (  
        <Menu
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
            theme="dark"
            
        >
            <Menu.Item key="1" icon={<DesktopOutlined /> }>
                Home
            </Menu.Item>
            <Menu.Item key="2" icon={<UserOutlined />}>
                Profile
            </Menu.Item>
            <Menu.Item key="3" icon={<TeamOutlined />}>
                Friends
            </Menu.Item>
            <Menu.Item key="4" icon={<ApartmentOutlined />}>
                Groups
            </Menu.Item>
            <Menu.Item key="5" icon={<ContainerOutlined />}>
                News
            </Menu.Item>
            <Menu.Item key="6" icon={<RadarChartOutlined />}>
                Logout
            </Menu.Item>
        </Menu>
  
 );





/**
 * A React component that is used for the navigation bar displayed at the top of every page of the site.
 * @param {*} param0 an object holding any props passed to this component from its parent component
 * @returns The contents of this component, in JSX form.
 */

const Navbar = () => {

    const [collapsed, setCollapsed] = useState(false);
    const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
return(
    <PageHeader
        title="Almaal"  //how to get page name here?
        className="site-page-header"
        // tags={<Tag color="blue">Running</Tag>}
        extra={[
          <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
            <a onClick={(e) => e.preventDefault()}>
            <Space>
                
                <Button 
                type="primary"
                onClick={toggleCollapsed}    
                >
                    {collapsed ? <MenuUnfoldOutlined style={{fontSize: 20, }}/> : <MenuFoldOutlined style={{fontSize: 20, }}/>} 
                </Button>
               
            </Space>
            </a>
        </Dropdown>
        ]}
        avatar={{
        // src: 'https://www.vecteezy.com/vector-art/563714-finance-logo-and-symbols-vector-concept',
        icon:<RadarChartOutlined style={{ fontSize: '30px', alignSelf: 'right' }} />
        }}
        
        >
  </PageHeader>
    );
}




// make this component available to be imported into any other file






export default Navbar