import React, { useState, FC } from 'react';
import {Button, Col, Input, message, Row, Space} from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // 导入 Quill.js 的样式

const { TextArea } = Input;
const BlogWrite: React.FC = () => {



    const [inputVal, setInputVal] = useState('');
    const [textAreaVal, setTextAreaVal] = useState('');

    const onChangeInput = (e) => {
        setInputVal(e.target.value);
    };

    const onChangeTextArea = (e) => {
        setTextAreaVal(e.target.value);
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/blog/view/insertBlog', {
                method: 'POST',
                headers: {
                    'token': `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    input: inputVal,
                    textArea: textAreaVal,
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
                <Input showCount maxLength={20} onChange={onChangeInput}  placeholder="can write your title"/>
                <>
                    <TextArea
                        showCount
                        maxLength={100}
                        style={{ height: 120, marginBottom: 24 }}
                        onChange={onChangeTextArea}
                        placeholder="can write your post"
                    />
                </>
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Button type="primary" block onClick={handleSubmit}>
                        Submit
                    </Button>
                </Space>
            </Col>
            <Col span={6}></Col>

        </Row>
        </div>
    );
};

export default BlogWrite;
