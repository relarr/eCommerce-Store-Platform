import React from 'react';

import './LoadingSpinner.css';

const LoadingSpinner = props => {
    return (
        <div className={`${props.asOverlay && 'spinner__overlay'}`}>
            <div className='lds-dual-ring'></div>
        </div>
    );
};

export default LoadingSpinner;