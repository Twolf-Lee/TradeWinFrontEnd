import * as React from 'react';
import {Col, Row, Avatar, List, Statistic, Card, Space, FloatButton} from "antd";
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import {useEffect, useState} from "react";
import Joyride from 'react-joyride';

//尝试导览
const steps = [
    {
        target: '.Navi-1', // 将目标元素改为第二步的元素
        title: 'Post List',
        content: 'This is our Forum Square, you can read everyone\'s posts!',
        placement: 'right'
    },
    {
        target: '.Navi-2',
        title: 'New Post',
        content: 'Here you can add your new post. Have fun!',
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

const blogmain: React.FC = () => {




    const [datablog, setDatatest] = useState<Array<{ title: string; description: string; content: string;  }>>([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:8080/blog/view/findAllBlogs", {
                    headers: {
                        'token': `Bearer ${token}` // 添加token到请求头
                    }
                });

                const data = await response.json();
                setDatatest(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);
    return(
        <Row>
            <Col span={4}>
            
            </Col>
            <Col span={16}>
                <MyComponent /> {/* 导览组件 */}
                <List className="Navi-1"
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
                                title={<a >{item.title}</a>}
                                description={item.description}
                            />
                            {item.content}
                        </List.Item>
                    )}
                />
                <FloatButton className="Navi-2" tooltip={<div>Write Blog</div>} href={'/BlogWrite'}/>
            </Col>
            <col span={4}>

            </col>
        </Row>

    );

};
export default blogmain;