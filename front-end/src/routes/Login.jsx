import React from 'react'
import { Link } from 'react-router-dom';
import { Space, Button, Input, Avatar, Typography } from 'antd'
import { RadarChartOutlined, GoogleOutlined, FacebookOutlined } from '@ant-design/icons'
import styles from './Login.module.css';

const { Title } = Typography;

const Login = () => {
    return (
        <div>
            {/* <Title level={2} className={styles.title}>Log In With Almaal Account</Title> */}
            <Space direction="vertical" align="center" className={styles.container}>
                <Avatar size="large" icon={<RadarChartOutlined />}></Avatar>
                <Button shape="round" icon={<GoogleOutlined />} block>
                    Continue with Google
                </Button>
                <Button shape="round" icon={<FacebookOutlined />} block >
                    Continue with Facebook
                </Button>
                <Title Level={5} className={styles.sectionTitle}>OR</Title>
                <Input placeholder="Email" size="large" block />
                <Input placeholder="Password" size="large" />
                <Button type="primary" shape="round">
                    <Link to="/">Log In</Link>
                </Button>
                <Button type="link">
                    <Link to="/createaccount">No account yet? Create one!</Link>

                </Button>
            </Space>
        </div>
    );
}
export default Login