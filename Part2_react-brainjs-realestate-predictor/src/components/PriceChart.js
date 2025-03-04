import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import '../styles/chart.css';

Chart.register(...registerables, ChartDataLabels);

const PredictedPrice = ({ predictedPrice, actualPrice }) => {
    const formatPrice = (price) => {
        return `CAD ${Math.round(price * 1000).toLocaleString()}`;
    };

    const data = {
        labels: ['Actual Price', 'Predicted Price'],
        datasets: [
            {
                label: 'Price',
                data: [(actualPrice || 0) * 1000, predictedPrice * 1000],
                backgroundColor: [
                    '#4CAF50', '#1778f2'
                ],
                borderColor: [
                    '#45a049', '#1669d6'
                ],
                borderWidth: 1,
                barThickness: 100, // Increased from 60 to 100
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            datalabels: {
                color: '#fff',
                anchor: 'center',
                align: 'center',
                formatter: (value) => formatPrice(value / 1000), // Divide by 1000 because value is already multiplied
                font: { weight: 'bold', size: 14 },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value) => formatPrice(value / 1000), // Divide by 1000 because value is already multiplied
                    font: { size: 12 },
                },
            },
            x: {
                ticks: {
                    font: { size: 14, weight: 'bold' },
                },
            },
        },
    };

    const getMessage = () => {
        if (!predictedPrice && !actualPrice) return "Please enter values to see the price comparison.";
        if (!actualPrice) return "Actual price is not available in our records.";
        return null;
    };

    const getPredictionMessage = () => {
        if (predictedPrice && actualPrice) {
            const difference = ((predictedPrice - actualPrice) / actualPrice) * 100;
            if (Math.abs(difference) < 5) return "Our prediction is very close to the actual price. Great job!";
            if (difference > 0) return `Our prediction is ${Math.abs(difference).toFixed(2)}% higher than the actual price. The market may be more competitive than expected.`;
            return `Our prediction is ${Math.abs(difference).toFixed(2)}% lower than the actual price. The property might have unique features increasing its value.`;
        }
        return null;
    };

    return (
        <div className="chart-container">
            <h2 className="chart-title">Price Comparison</h2>
            <div className="chart-wrapper">
                <Bar data={data} options={options} />
                {getMessage() && (
                    <div className="message-overlay">
                        <p className="message-text">{getMessage()}</p>
                    </div>
                )}
            </div>
            {getPredictionMessage() && (
                <div className="prediction-message">
                    <p>{getPredictionMessage()}</p>
                    <p>Please cross-verify with local market trends and property specifics for a more accurate assessment.</p>
                </div>
            )}
        </div>
    );
};

export default PredictedPrice;