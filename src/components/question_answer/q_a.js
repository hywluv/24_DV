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
            <p>Ask a Question</p>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={question}
                    onChange={handleQuestionChange}
                    rows="4"
                    cols="50"
                    placeholder="Enter your question here..."
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Loading...' : 'Ask'}
                </button>
            </form>
            <p>Answer:</p>
            <div>
                {/* 使用 ReactMarkdown 渲染 Markdown 内容 */}
                <ReactMarkdown children={answer} remarkPlugins={[remarkGfm]} />
            </div>
        </div>
    );
}

export default QuestionAnswer;
