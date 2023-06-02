import React, {useState, FC, useEffect} from 'react';
import {Button, Col, Input, message, Row, Space} from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useLocation } from "umi"; // 导入 Quill.js 的样式


interface RichTextEditorProps {
    onChange?: (content: string, html: string) => void;
}



const { TextArea } = Input;
const BlogWrite: React.FC = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const option= searchParams.get('option');
    const [inputValue, setInputValue] = useState('');
    const [textAreaValue, setTextAreaValue] = useState('');

    useEffect(() => {
        const sendData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:8080/blog/view/getBlogInformation', {
                    method: 'POST',
                    headers: {
                        'token': `${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ option }),
                });

                if (response.ok) {
                    const data = await response.json();

                    // Update this line to access the first element in the array
                    // const firstDataItem = data[0];

                    // setInputValue(firstDataItem.input);
                    // setTextAreaValue(firstDataItem.textArea);
                    
                    setInputValue(data.input);
                    setTextAreaValue(data.textArea);

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


    const [inputVal, setInputVal] = useState('');
    const [textAreaVal, setTextAreaVal] = useState('');

    const onChangeInput = (e) => {
        setInputVal(e.target.value);
    };

    const onChangeTextArea = (e) => {
        setTextAreaVal(e.target.value);
        if (textAreaValue !== textAreaVal) {
            setTextAreaValue(textAreaVal);}
    };

    

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/blog/view/updateBlog', {
                method: 'POST',
                headers: {
                    'token': `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    input: inputValue,
                    textArea: textAreaValue,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            message.success('Data sent successfully');
        } catch (error) {
            message.error('Error sending data: ' + error.toString());
        }
    };

    return (
        <div style={{ padding: '12px' }}>
            <Row gutter={{xs: 8, sm: 16, md: 24}}>
                <Col span={6}></Col>
                <Col span={12}>
                    <Input showCount maxLength={20} value={inputValue} onChange={onChangeInput} />
                    <>
                        <TextArea
                            showCount
                            maxLength={100}
                            style={{ height: 120, marginBottom: 24 }}
                            value={textAreaValue}
                            onChange={onChangeTextArea}
                        />
                    </>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Button type="primary" block onClick={handleSubmit}>
                            Save
                        </Button>
                    </Space>

                </Col>
                <Col span={6}></Col>

            </Row>
        </div>
    );
};

export default BlogWrite;
