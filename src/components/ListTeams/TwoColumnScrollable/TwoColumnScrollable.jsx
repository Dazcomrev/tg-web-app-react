import React from 'react';
import './TwoColumnScrollable.css';

const TwoColumnScrollable = ({ items }) => {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            height: '400px',
            overflowY: 'auto',
            border: '1px solid #ccc',
            padding: '8px',
        }}>
            {items.map((item, index) => (
                <div key={index} style={{
                    border: '1px solid #999',
                    padding: '8px',
                    boxSizing: 'border-box',
                    background: '#f9f9f9',
                }}>
                    {item}
                </div>
            ))}
        </div>
    )
}

export default TwoColumnScrollable