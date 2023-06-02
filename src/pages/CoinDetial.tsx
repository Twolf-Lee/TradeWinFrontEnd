import * as React from 'react';
import { Chart, Tooltip, Axis, Line, Point } from 'viser-react';
import {Col, Row, Avatar, List, Statistic, Card, Space, InputNumber, Button, Select} from "antd";
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import {useEffect, useState} from "react";
import { useLocation } from "umi";
import axios from "axios";

const CoinDetial: React.FC = () => {

    const datalist = [
        {
            title: 'Ant Design Title 1',
        },
        {
            title: 'Ant Design Title 2',
        },
        {
            title: 'Ant Design Title 3',
        },
        {
            title: 'Ant Design Title 4',
        },
    ];
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
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const title = searchParams.get('title');
    const option= searchParams.get('option');
    // ... 获取地址栏参数的代码 ...
    const [cardtitle, setcardTitle] = useState('');
    const [rate, setValue] = useState(0);

    useEffect(() => {
        const sendData = async () => {
            try {
                const response = await fetch('http://localhost:8080/dashboard/searchcardcrypto', {
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

    const [chartdata, setchartData] = useState<{ year: string; value: number }[]>([]);

    useEffect(() => {
        const sendDataAndFetchData = async () => {
            try {
                const response = await fetch('http://localhost:8080/dashboard/searchchartcrypto', {
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


    const [optionscur, setOptionscur] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('http://localhost:8080/dashboard/currency-name');
            const data = await response.json();
            const formattedOptions = data.map(item => ({
                label: item.label,
                value: item.label,

            }));
            setOptionscur(formattedOptions);
        };

        fetchData();
    }, []);
    const [optionscoin, setOptionscoin] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(' http://localhost:8080/dashboard/crypto-name');
            const data = await response.json();
            const formattedOptions = data.map(item => ({
                label: item.label,
                value: item.label,

            }));
            setOptionscoin(formattedOptions);
        };

        fetchData();
    }, []);

    const [selectedOption1, setSelectedOption1] = useState(null);
    const [selectedOption2, setSelectedOption2] = useState(null);
    const [valuecal, setValuecal] = useState(null);
    const [result, setResult] = useState(null);

    const calculate = () => {
        axios.post('http://localhost:8080/dashboard/calculator-crypto-currency', { option1: selectedOption1, option2: selectedOption2, value: String(valuecal) })
            .then(response => {
                if (response.status === 200) {
                    setResult(response.data.money);
                }
            })
            .catch(error => {
                console.log('Calculate failed');
            });
    };

    return(
       <Row>
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
                               avatar={<Avatar src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`} />}
                               title={<a href="https://ant.design">{item.title}</a>}
                               description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                           />
                       </List.Item>
                   )}
               />
               <Row>
                   <div style={{ padding: '12px' }}>
                       <Col>Exchange rate calculator</Col>
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
                               options={optionscoin}
                               onChange={setSelectedOption1}
                           />
                           <Select
                               showSearch
                               style={{ width: 200 }}
                               placeholder="Search to Select"
                               optionFilterProp="children"
                               filterOption={(input, option) => (option?.label ?? '').includes(input)}
                               filterSort={(optionA, optionB) =>
                                   (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                               }
                               options={optionscur}
                               onChange={setSelectedOption2}
                           />

                           <Space direction="vertical">
                               <InputNumber  style={{ width: '100%' }} onChange={setValuecal} />
                           </Space>


                           <Space direction="vertical">
                               <Button type="primary"onClick={calculate} >calculate</Button>
                           </Space>
                       </Col>
                   </div>
               </Row>
               <Card bordered={false}>
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
export default CoinDetial;