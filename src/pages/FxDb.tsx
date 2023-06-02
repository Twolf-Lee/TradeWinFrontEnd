import React, {useEffect, useState,useMemo} from 'react';
import {Avatar, Button, Card, Col, List, message, Row, Select, Space, Statistic,Divider,notification} from 'antd';
import type { NotificationPlacement } from 'antd/es/notification/interface';

import { ArrowDownOutlined, ArrowUpOutlined, SearchOutlined} from '@ant-design/icons';
import VirtualList from 'rc-virtual-list';
import { Chart, Tooltip, Axis, Line, Point } from 'viser-react';
import axios from "axios";
import { Link , history } from "umi";
import {array} from "@umijs/utils/compiled/zod/lib";
import Joyride from 'react-joyride';


const DataSet = require('@antv/data-set');
const Context = React.createContext({ name: 'Default' });
//chart

const scale = [{
    dataKey: "value",
    nice:"ture"
},{
    dataKey: "year",
    type:"time",
    nice:"ture"
}];

const processData = (data: Record<string, string>) => {
    return Object.entries(data).map(([year, value]) => ({
        year,
        value: parseFloat(value),
    }));
};

//尝试导览
const steps = [
    {
        target: '.Navi-1', // 将目标元素改为第二步的元素
        title: 'ForEx Rate List',
        content: 'This is our Foreign Exchange Rate list',
        placement: 'right'
    },
    {
        target: '.Navi-2',
        title: 'ForEx Rate Search',
        content: 'Here you can search for the exchange rate of the currency you want',
        placement: 'bottom'
    },
    {
        target: '.Navi-3',
        title: 'ForEx Card',
        content: 'This is the increased or decreased rate of the currency you have chosen',
        placement: 'bottom'
    },
    {
        target: '.Navi-4',
        title: 'ForEx Chart',
        content: 'This is our Foreign Exchange Chart.',
        placement: 'top'
    },
    {
        target: '.Navi-5',
        title: 'News',
        content: 'This is the news we have selected for you. Have fun!',
        placement: 'left'
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

//chart

interface FXItem {
    symbol: string;
    price: string;

}


const ContainerHeight = 900;
const FxDb : React.FC = () => {
    const [datalist, setDatalist] = useState<FXItem[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:8080/dashboard/currency-price-list");
                const data = await response.json();
                setDatalist(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);
    const [datachart1, setDatachart] = useState<{ year: string; value: number }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:8080/dashboard/AUDtoCNY  ");
                const data = await response.json();
                const chartData = processData(data);
                setDatachart(chartData);
                //setDatachart(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);
    const [page, setPage] = useState(1);
    const fetchData = async (page: number) => {
        try {
            const response = await fetch(`http://localhost:8080/dashboard/currency-price-list?page=${page}`);
            const data = await response.json();
            setDatalist((prevData) => [...prevData, ...data]);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    useEffect(() => {
        fetchData(1);
    }, []);
    const appendData = () => {
        setPage((prevPage) => prevPage + 1);
        fetchData(page + 1);
    };



    const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
        if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop === ContainerHeight) {
            appendData();
        }
    };


    const [datanews, setDatatest] = useState<Array<{ href: string; title: string; avatar: string; content: string; }>>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:8080/dashboard/news");
                const data = await response.json();
                setDatatest(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);


    const [title, setTitle] = useState('');
    const [rate, setValue] = useState(0);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8080/dashboard/cardAUDtoCNY ');
                const data = await response.json();

                // Update this line to access the first element in the array
                const firstDataItem = data[0];

                setTitle(firstDataItem.title);
                setValue(firstDataItem.rate);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);
    const getStyleAndIcon = (value: number) => {
        if (value >= 0) {
            return {
                color: '#3f8600',
                icon: <ArrowUpOutlined />,
            };
        } else {
            return {
                color: '#cf1322',
                icon: <ArrowDownOutlined />,
            };
        }
    };

    const { color, icon } = getStyleAndIcon(rate);
    const [options, setOptions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('http://localhost:8080/dashboard/currency-name');
            const data = await response.json();
            const formattedOptions = data.map(item => ({
                label: item.label,
                value: item.label,

            }));
            setOptions(formattedOptions);
        };

        fetchData();
    }, []);
    const [selectedOption1, setSelectedOption1] = useState(null);
    const [selectedOption2, setSelectedOption2] = useState(null);
    const handleSubmit = async () => {

        // await fetch(' http://localhost:8080/dashboard/postsearch', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         option1: selectedOption1,
        //         option2: selectedOption2,
        //     }),
        // });

        history.push('/FxDetial?option='+selectedOption1+'to'+selectedOption2);
    };





    //search

    const openNotification1 = () => {
        notification.open({
            message: 'Hi, this is your tour guide! ',
            description:
                'Left is all ForEx rate. Have fun ',
            onClick: () => {
                console.log('Notification Clicked!');
            },
        });
    };
    const openNotification2 = () => {
        notification.open({
            message: 'Hi, this is your tour guide!',
            description:
                'Right is related news. Have fun!',
            onClick: () => {
                console.log('Notification Clicked!');
            },
        });
    };

    return (
        <Row >
            <Col span={6}>
                <MyComponent /> {/* 导览组件 */}
                <div style={{ padding: '12px' }}>
                    <List size="large" className="Navi-1">
                        <VirtualList
                            data={datalist}
                            height={850}
                            itemHeight={20}
                            itemKey="email"
                            onScroll={onScroll}
                        >
                            {(item:FXItem ) => (
                                <List.Item key={item.symbol}>
                                    <List.Item.Meta
                                        // avatar={<Avatar src={item.picture.large} />}
                                        title={<Link to={`/FxDetial?option=${item.symbol}`}>{item.symbol}</Link>}
                                        description={item.price}
                                    />

                                </List.Item>
                            )}
                        </VirtualList>
                    </List>
                </div>
                <Button type="primary" onClick={openNotification1}>
                    Left List intro
                </Button>
            </Col>
            <Col span={10}>
                <div style={{ padding: '24px' }} className="Navi-2">
                    <Row gutter={[24,24]} align='middle' justify='center'>
                        <Col>
                            <Select
                                showSearch
                                style={{ width: 200 }}
                                placeholder="From"
                                optionFilterProp="children"
                                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                filterSort={(optionA, optionB) =>
                                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                }
                                options={options}
                                onChange={setSelectedOption1}
                            />
                        </Col>

                        <Col>
                            <Select
                                showSearch
                                style={{ width: 200 }}
                                placeholder="To"
                                optionFilterProp="children"
                                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                filterSort={(optionA, optionB) =>
                                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                }
                                options={options}
                                onChange={setSelectedOption2}
                            />

                        </Col>
                        <Col>
                            <Button type="primary" icon={<SearchOutlined />} onClick={handleSubmit}>
                                Search
                            </Button>
                        </Col>

                    </Row>
                </div>
                <Card bordered={false} className="Navi-3">
                    <Statistic
                        title={title}
                        value={rate}
                        precision={2}
                        valueStyle={{ color }}
                        prefix={icon}
                        suffix="%"
                    />
                </Card>
                {/*<Chart forceFit height={750} data={data} scale={scale}>*/}
                {/*    <Tooltip />*/}
                {/*    <Axis />*/}
                {/*    <Line position="year*value" />*/}
                {/*    <Point position="year*value" shape="circle"/>*/}
                {/*</Chart>*/}
                <div style={{ padding: '8px' }} className="Navi-4">
                    <Chart forceFit height={600} data={datachart1} scale={scale}>
                        <Tooltip />
                        <Axis />
                        <Line position="year*value" />
                        <Point position="year*value" shape="circle"/>
                    </Chart>
                </div>
            </Col>
            <Col span={8}>
                <div style={{ padding: '24px' }}>
                    <List className="Navi-5"
                        itemLayout="vertical"
                        size="large"
                        pagination={{
                            onChange: (page) => {
                                console.log(page);
                            },
                            pageSize: 4,
                        }}
                        dataSource={datanews}
                        footer={
                            <div>

                            </div>
                        }
                        renderItem={(item) => (
                            <List.Item

                            >
                                <List.Item.Meta
                                    avatar={<Avatar src={item.avatar} />}
                                    title={<a href={item.href}>{item.title}</a>}
                                    description={item.description}
                                />
                                {item.content}
                            </List.Item>
                        )}
                    />
                </div>
                <Button type="primary" onClick={openNotification2}>
                    Right List intro
                </Button>
            </Col>
        </Row>
    );
};
export default FxDb ;