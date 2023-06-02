import React, {useEffect, useState} from 'react';
import {Avatar, Col, Descriptions, Row, List, Radio, Space, Skeleton, Button, message, Popconfirm} from 'antd';
import { AntDesignOutlined } from '@ant-design/icons';
import axios from "axios";
import { Link } from "umi";
import Joyride from 'react-joyride';

//尝试导览
const steps = [
    {
        target: '.Navi-1', // 将目标元素改为第二步的元素
        title: 'User Info',
        content: 'This is your profile!',
        placement: 'bottom'
    },
    {
        target: '.Navi-2',
        title: 'Your Post List',
        content: 'Here is your previous posts. Have fun!',
        placement: 'bottom'
    },

    // ...
];



const options = {
    allowSkip: true,
    locale: {
        next: 'next'
    },
    styles: {
        options: {
            primaryColor: '#8bd3dd'
        }
    }
};

// ...
function MyComponent() {
    const [run, setRun] = useState(false);

    function handleJoyrideCallback(data) {
        console.log(data);
    }

    useEffect(() => {
        setRun(true);
    }, []);

    return (
        <Joyride
            steps={steps}
            run={run}
            callback={handleJoyrideCallback}
            continuous={true} // 连续模式
            showProgress={true} // 显示进度条
            showSkipButton={true}
            {...options} // 引入自定义选项
        />
    );
}

//尝试结束

interface UserInfo {
    username: string;
    email: string;
    gender: string;
    phoneNumber: string; 
}

const MyProfile : React.FC = () => {
   const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [datablog, setDatatest] = useState<Array<{ title: string; description: string; content: string }>>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8080/myProfile/view/information', {
          headers: {
            token: `${token}`,
          },
        });

        const data = await response.json();
        setUserInfo(data[0]);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8080/blog/view/findUserAllBlogs', {
          headers: {
            token: `${token}`,
          },
        });

        const data = await response.json();
        setDatatest(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (!userInfo) {
    return <div>Loading...</div>;
  }
    const handleDelete = async (title) => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch('http://localhost:8080/blog/view/deleteBlog', {
                method: 'DELETE',
                headers: {
                    'token': `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            message.success('Resource deleted successfully');
        } catch (error) {
            message.error('Error deleting resource: ' + error.toString());
        }
    };

    



    return (
        <Row>
            <Col span={3}></Col>

            <Col span={18}>
              <MyComponent /> {/* 导览组件 */}
              <div className="Navi-1">
                <div style={{ padding: '12px' }}>
                <Avatar
                    size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                    icon={<AntDesignOutlined />}
                />
                </div>
                <div style={{ padding: '12px' }}>
                <Descriptions title="User Info">
                    <Descriptions.Item label="UserName">{userInfo.username}</Descriptions.Item>
                    <Descriptions.Item label="Telephone">{userInfo.phoneNumber}</Descriptions.Item>
                    <Descriptions.Item label="Email">{userInfo.email}</Descriptions.Item>
                    <Descriptions.Item label="Gender">{userInfo.gender}</Descriptions.Item>
                </Descriptions>
                </div>
              </div>
              <List className="Navi-2"
                  itemLayout="vertical"
                  size="large"
                  pagination={{
                      onChange: (page) => {
                          console.log(page);
                      },
                      pageSize: 4,
                  }}
                  dataSource={datablog}

                  renderItem={(item) => (
                      <List.Item

                      >
                          <List.Item.Meta
                              title={<Link to={`/blogUpdate?option=${item.title}`}>{item.title}</Link>}
                              description={item.description}
                          />
                          {item.content}
                          <Popconfirm
                              title="Delete the task"
                              onConfirm={() => handleDelete(item.title)}
                              okText="Yes"
                              cancelText="No"
                          >
                              <Button danger>Delete</Button>
                          </Popconfirm>
                          {/*<div onClick={() => handleDelete(item.title)}>delete</div>*/}
                      </List.Item>

                  )}
              />
              
            </Col>
            <Col span={3}></Col>
        </Row>
    );
};
export default MyProfile ;