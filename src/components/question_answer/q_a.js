import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function QuestionAnswer() {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);

    const handleQuestionChange = (event) => {
        setQuestion(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5011/ask', { prompt: question });
            setAnswer(response.data.choices[0].message.content);
        } catch (error) {
            console.error('Error:', error);
            setAnswer('Failed to fetch the answer. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div>
            <p style={{color: '#0f0f0f'}}>Ask a Question</p>
            <form style={{marginTop: -10}} onSubmit={handleSubmit}>
                <textarea
                    value={question}
                    onChange={handleQuestionChange}
                    rows="4"
                    cols="45"
                    style={{fontFamily: 'Comic Sans MS, sans-serif',
                        fontSize: '14px',
                        color: '#333',
                        backgroundColor: '#f9f9f9',
                        border: '1px solid #ccc',
                        padding: '5px',
                        borderRadius: '5px',
                        lineHeight: '1',
                        resize: 'both'}}
                    placeholder="Enter your question here..."
                />
                <button type="submit" disabled={loading}
                style={{
                    width: '80px',
                    height: '30px',
                    fontSize: '15px',
                    cursor: 'pointer',
                    backgroundColor: '#ffffff',
                    border: 'outset',
                    fontFamily: "Comic Sans MS",
                    marginLeft: 10,
                }}>
                    {loading ? 'Loading...' : 'Ask'}
                </button>
            </form>
            <p style={{color: '#0f0f0f', marginTop: 15}}>Answer:</p>
            <div style={{fontFamily: 'Comic Sans MS', fontSize: 15, color: '#666', marginTop: -10}}> 
                {/* 使用 ReactMarkdown 渲染 Markdown 内容 */}
                <ReactMarkdown children={answer} remarkPlugins={[remarkGfm]} />
            </div>
        </div>
    );
}

export default QuestionAnswer;
