import { Chart, Tooltip, Axis, Line, Point } from 'viser-react';
import * as React from 'react';
import {Col, Row, Avatar, List, Statistic, Card, Dropdown, Space, InputNumber, Select, Button, Input} from "antd";
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import {useEffect, useState} from "react";
import type { MenuProps } from 'antd';
import { useLocation } from 'umi';
import axios from "axios";



// const datalist = [
//     {
//         title: 'Common Wealth bank',
//         url:'https://www.commbank.com.au/international/foreign-exchange-rates.html?ei=hp-prodnav_INT-FXrates',
//     },
//     {
//         title: 'Nab',
//         url: 'https://www.nab.com.au/personal/international-banking/foreign-exchange-rates'
//     },
//     {
//         title: 'Anz',
//         url: 'https://www.anz.com.au/personal/travel-international/currency-converter/'
//     },
//     {
//         title: 'HSBC',
//         url: 'https://www.hsbc.com.au/calculators/real-time-exchange-rates/'
//     },
// ];
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
const items: MenuProps['items'] = [
    {
        label: <a href="https://www.commbank.com.au/international/foreign-exchange-rates.html?ei=hp-prodnav_INT-FXrates">Common Wealth bank</a>,
        key: '0',
    },
    {
        label: <a href="https://www.nab.com.au/personal/international-banking/foreign-exchange-rates">Nab</a>,
        key: '1',
    },

    {
        label: <a href="https://www.anz.com.au/personal/travel-international/currency-converter/">Anz</a>,
        key: '2',
    },
    {
        label: <a href="https://www.hsbc.com.au/calculators/real-time-exchange-rates/">HSBC</a>,
        key: '3',
    },
    {
        label: <a href="https://www.aliyun.com"></a>,
        key: '4',
    },
];


const { Option } = Select;

const selectBefore = (
    <Select defaultValue="add" style={{ width: 60 }}>
        <Option value="add">+</Option>
        <Option value="minus">-</Option>
    </Select>
);

const FxDetial: React.FC = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const option= searchParams.get('option');
    // ... 获取地址栏参数的代码 ...
    const [cardtitle, setcardTitle] = useState('');
    const [rate, setValue] = useState(0);
    useEffect(() => {
        const sendData = async () => {
            try {
                const response = await fetch('http://localhost:8080/dashboard/searchcard', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ option }),
                });

                if (response.ok) {
                    const data = await response.json();

                    // Update this line to access the first element in the array
                    const firstDataItem = data[0];

                    setcardTitle(firstDataItem.title);
                    setValue(firstDataItem.rate);
                } else {
                    throw new Error(`Request failed with status: ${response.status}`);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (option) {
            sendData();
        }
    }, [option]);


    //获取返回值
    const [datalist, setdatalist] = useState([]);

    useEffect(() => {
        const sendData = async () => {
            try {
                const response = await fetch('http://localhost:8080/dashboard/market', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ option }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setdatalist(data);
                } else {
                    throw new Error(`Request failed with status: ${response.status}`);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (option) {
            sendData();
        }
    }, [option]);


    const [chartdata, setchartData] = useState<{ year: string; value: number }[]>([]);

    useEffect(() => {
        const sendDataAndFetchData = async () => {
            try {
                const response = await fetch('http://localhost:8080/dashboard/searchchart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ option }),
                });

                if (response.ok) {
                    const data = await response.json();
                    const chartData = processData(data);
                    setchartData(chartData);
                } else {
                    throw new Error(`Request failed with status: ${response.status}`);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (option) {
            sendDataAndFetchData();
        }
    }, [option]);
    const [valuecal, setValuecal] = useState('');
    const [result, setResult] = useState('');
    const calculate = () => {
        axios.post('http://localhost:8080/dashboard/calculator', { option,value: String(valuecal) })
            .then(response => {
                if (response.status === 200) {
                    setResult(response.data.money);
                }
            })
            .catch(error => {
                console.log('calulate fail');
            });
    };



    const [loadings, setLoadings] = useState<boolean[]>([]);

    const enterLoading = (index: number) => {
        setLoadings((state) => {
            const newLoadings = [...state];
            newLoadings[index] = true;
            return newLoadings;
        });

        setTimeout(() => {
            setLoadings((state) => {
                const newLoadings = [...state];
                newLoadings[index] = false;
                return newLoadings;
            });
        }, 6000);
    };
    return(
        <Row gutter={24}>
            <Col span={16}>
                <Card bordered={false}>
                    <Statistic
                        title={cardtitle}
                        value={rate}
                        precision={2}
                        valueStyle={{ color: '#3f8600' }}
                        prefix={<ArrowUpOutlined />}
                        suffix="%"
                    />
                </Card>
                <Chart forceFit height={750} data={chartdata} scale={scale}>
                    <Tooltip />
                    <Axis />
                    <Line position="year*value" />
                    <Point position="year*value" shape="circle"/>
                </Chart>
            </Col>
            <Col span={8}>
                <List
                    itemLayout="horizontal"
                    dataSource={datalist}
                    renderItem={(item, index) => (
                        <List.Item>
                            <List.Item.Meta
                                title={<a href={item.url}>{item.title}</a>}
                                description={item.description}
                            />
                        </List.Item>
                    )}
                />
                <Space direction="vertical">
                <Dropdown.Button
                    type="primary"
                    loading={loadings[0]}
                    menu={{ items }}
                    onClick={() => enterLoading(0)}
                >
                    Submit
                </Dropdown.Button>
                </Space>

                <Row>
                    <div style={{ padding: '12px' }}>
                    <Col>Exchange rate calculator</Col>
                    <Col>


                        <Space direction="vertical">
                            <InputNumber  style={{ width: '100%' }} onChange={setValuecal} />
                        </Space>


                        <Space direction="vertical">
                            <Button type="primary"onClick={calculate} >calculate</Button>
                        </Space>
                    </Col>
                    </div>
                </Row>
                <Card style={{ width: 300 }}>
                    <Statistic
                        title="result"
                        value={result}
                        precision={2}
                        valueStyle={{ color: '#3f8600' }}
                    />
                </Card>

            </Col>
        </Row>

    );

};
export default FxDetial;