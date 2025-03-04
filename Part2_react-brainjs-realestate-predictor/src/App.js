import React from 'react';
import FeedbackForm from './components/FeedbackForm';
import '../src/styles/App.css';
import PropertyInputForm from './components/PropertyInputForm';
import useRealEstatePrediction from '../src/hooks/useRealEstatePrediction';
import PredictedPrice from './components/PriceChart';

const App = () => {
    const {
        predictedPrice,
        actualPrice,
        propertyInput,
        handleInputChange,
        handlePredictPrice,
    } = useRealEstatePrediction();

    const navStyle = {
        width: '100%',
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '1rem',
        position: 'fixed',
        top: 0,
        zIndex: 1000,
        height: '64px',
        display: 'flex',
        alignItems: 'center'
    };

    const mainContentStyle = {
        display: 'flex',
        height: 'calc(100vh - 64px)', // 64px is nav height
        marginTop: '90px'
    };

    const leftColumnStyle = {
        flex: 1,
        padding: '1rem'
    };

    const rightColumnStyle = {
        flex: 1,
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    };

    return (
        <div className="App">
            {/* Navigation Bar */}
            <nav style={navStyle}>
                <h1 style={{ margin: 0 }}>Real Estate Price Predictor</h1>
            </nav>

            {/* Main Content */}
            <div style={mainContentStyle}>
                {/* Left Column */}
                <div style={leftColumnStyle}>
                    <PropertyInputForm
                        predictedPrice={predictedPrice}
                        propertyInput={propertyInput}
                        handleInputChange={handleInputChange}
                        handlePredictPrice={handlePredictPrice}
                    />
                </div>

                {/* Right Column */}
                <div style={rightColumnStyle}>
                    <PredictedPrice
                        predictedPrice={predictedPrice}
                        actualPrice={actualPrice}
                    />
                    <FeedbackForm 
                        predictedPrice={predictedPrice} 
                        actualPrice={actualPrice} 
                        propertyInput={propertyInput} 
                    />
                </div>
            </div>
        </div>
    );
};

export default App;
