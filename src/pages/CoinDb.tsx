import React, {useEffect, useState} from 'react';
import {Avatar, Button, Card, Col, Input, List, message, notification, Row, Select, Space, Statistic,} from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined,SearchOutlined } from '@ant-design/icons';
import VirtualList from 'rc-virtual-list';
import { Chart, Tooltip, Axis, Line, Point } from 'viser-react';
import queryString from 'query-string';
import {history, Link} from 'umi';
import * as $ from 'jquery';
import {print} from "jest-util";
import {array} from "@umijs/utils/compiled/zod/lib";
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride'; //new added

const DataSet = require('@antv/data-set');

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
        title: 'Cryptocurrency Rate List',
        content: 'This is our Cryptocurrency Rate list',
        placement: 'right'
    },
    {
        target: '.Navi-2',
        title: 'Cryptocurrency Rate Search',
        content: 'Here you can search for the conversion rate of the cryptocurrency you want',
        placement: 'bottom'
    },
    {
        target: '.Navi-3',
        title: 'Cryptocurrency Card',
        content: 'This is the increased or decreased rate of the cryptocurrency you have chosen',
        placement: 'bottom'
    },
    {
        target: '.Navi-4',
        title: 'Cryptocurrency Chart',
        content: 'This is our Cryptocurrency Chart.',
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

interface CoinItem {
    symbol: string;
    price: string;

}

interface CardItem{
    title:string;
    rate:number;
}

// const fakeDataUrl =
//     'https://randomuser.me/api/?results=20&inc=name,gender,email,nat,picture&noinfo';
const ContainerHeight = 900;
const CoinDb : React.FC = () => {
    const [datachart1, setDatachart] = useState<{ year: string; value: number }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:8080/dashboard/BTCtoUSDT");
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

    //chart

    const [datalist, setData] = useState<CoinItem[]>([]);
    useEffect(() => {
        const fetchDatalist = async () => {
            try {
                const response = await fetch("http://localhost:8080/dashboard/getPrice   ");
                const data = await response.json();
                setData(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchDatalist();
    }, []);



    const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
        if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop <= ContainerHeight + 20) {
            appendData();
        }
    };

//list
        useEffect(() => {
            const parsedQuery = queryString.parse(location.search);
            const title = parsedQuery.title as string;

            if (title) {
                // 使用 `title` 查询参数发起 API 请求，获取相关数据
                fetchData(title);
            }

        }, []);

    const fetchData = async (title: string) => {
        try {
            const response = await fetch(`http://your-api-url/your-endpoint?title=${title}`);
            const data = await response.json();

            // 更新组件状态，例如：
            // setData(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    const [datanews, setDatatest] = useState<Array<{ href: string; title: string; avatar: string; content: string; }>>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:8080/dashboard/news-cypto");
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
                const response = await fetch('http://localhost:8080/dashboard/card  ');
                const data = await response.json();
                setValue(data.rate);
                setTitle(data.title);

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
    const [options1, setOptions1] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(' http://localhost:8080/dashboard/crypto-name');
            const data = await response.json();
            const formattedOptions = data.map(item => ({
                label: item.label,
                value: item.label,

            }));
            setOptions1(formattedOptions);
        };

        fetchData();
    }, []);
    const [options2, setOptions2] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(' http://localhost:8080/dashboard/crypto-name-2');
            const data = await response.json();
            const formattedOptions = data.map(item => ({
                label: item.label,
                value: item.label,

            }));
            setOptions2(formattedOptions);
        };

        fetchData();
    }, []);
    const [selectedOption1, setSelectedOption1] = useState(null);
    const [selectedOption2, setSelectedOption2] = useState(null);
    const handleSubmit = async () => {



        history.push('/CoinDetial?option='+selectedOption1+'to'+selectedOption2);
    };
    const openNotification1 = () => {
        notification.open({
            message: 'Hi, this is your tour guide! ',
            description:
                'Left is all cryptocurrency rate. Have fun ',
            onClick: () => {
                console.log('Notification Clicked!');
            },
        });
    };
    const openNotification2 = () => {
        notification.open({
            message: 'Hi, this is your tour guide!',
            description:
                'Right is related cryptocurrency news. Have fun!',
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
                        height={ContainerHeight}
                        itemHeight={25}
                        itemKey="email"
                        onScroll={onScroll}
                    >
                        {(item: CoinItem) => (
                            <List.Item key={item.symbol}>
                                <List.Item.Meta
                                    // avatar={<Avatar src={item.picture.large} />}
                                    title={<Link to={`/CoinDetial?title=${item.symbol}`}>{item.symbol}</Link>}
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
                            placeholder="Search to Select"
                            optionFilterProp="children"
                            filterOption={(input, option) => (option?.label ?? '').includes(input)}
                            filterSort={(optionA, optionB) =>
                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                            }
                            options={options1}
                            onChange={setSelectedOption1}
                        />
                    </Col>

                    <Col>
                        <Select
                            showSearch
                            style={{ width: 200 }}
                            placeholder="Search to Select"
                            optionFilterProp="children"
                            filterOption={(input, option) => (option?.label ?? '').includes(input)}
                            filterSort={(optionA, optionB) =>
                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                            }
                            options={options2}
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
                        pageSize: 5,
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
export default CoinDb ;