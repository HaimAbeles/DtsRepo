import React from 'react';
import './Loading.css';

const Loading = ({ showLoading }) => {
    return (
        showLoading ? 
            <div className="loading-wrapper">
                <div className="loading">
                    <div className="loading-line"></div>
                    <div className="loading-line"></div>
                    <div className="loading-line"></div>
                    <div className="loading-line"></div>
                    <div className="loading-line"></div>
                    <div className="loading-line"></div>
                    <div className="loading-line"></div>
                    <div className="loading-line"></div>
                    <div className="loading-line"></div>
                    <div className="loading-line"></div>
                </div>
            </div >
        : null
    );
}

export default Loading;