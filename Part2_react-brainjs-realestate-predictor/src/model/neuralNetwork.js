import * as brain from 'brain.js';
import realEstateData from '../data/realestate.json';

// One-hot encode locations
function encodeLocation(location) {
    const locationMap = {
        'Downtown': [1, 0, 0],
        'Suburban': [0, 1, 0],
        'Rural': [0, 0, 1]
    };

    if (!location || location === "none" || location === "") {
        return [0, 0, 0]; // Default encoding for empty or invalid location
    }

    return locationMap[location] || [0, 0, 0]; // Default if unknown
}

// Normalize numerical data
function normalize(value, min, max) {
    return (value - min) / (max - min);
}

function denormalize(value, min, max) {
    return value * (max - min) + min;
}

// Find min and max values
const areas = realEstateData.map(item => parseInt(item.Area));
const bedrooms = realEstateData.map(item => parseInt(item.Bedrooms));
const bathrooms = realEstateData.map(item => parseInt(item.Bathrooms));
const ages = realEstateData.map(item => parseInt(item["Age of Property"]));
const prices = realEstateData.map(item => parseInt(item.Price));

export const maxArea = Math.max(...areas);
export const minArea = Math.min(...areas);
export const maxBedrooms = Math.max(...bedrooms);
export const minBedrooms = Math.min(...bedrooms);
export const maxBathrooms = Math.max(...bathrooms);
export const minBathrooms = Math.min(...bathrooms);
export const maxAge = Math.max(...ages);
export const minAge = Math.min(...ages);
export const maxPrice = Math.max(...prices);
export const minPrice = Math.min(...prices);

// Prepare training data with feature engineering
const trainingData = realEstateData.map(item => {
    const encodedLocation = encodeLocation(item.Location);
    const normalizedArea = normalize(parseInt(item.Area), minArea, maxArea);
    const normalizedBedrooms = normalize(parseInt(item.Bedrooms), minBedrooms, maxBedrooms);
    const normalizedBathrooms = normalize(parseInt(item.Bathrooms), minBathrooms, maxBathrooms);
    const normalizedAge = normalize(parseInt(item["Age of Property"]), minAge, maxAge);

    return {
        input: {
            area: normalizedArea,
            bedrooms: normalizedBedrooms,
            bathrooms: normalizedBathrooms,
            age: normalizedAge,
            ...Object.fromEntries(encodedLocation.map((value, index) => [`location${index + 1}`, value])),
            // Feature engineering: add interaction terms
            areaBedrooms: normalizedArea * normalizedBedrooms,
            areaBathrooms: normalizedArea * normalizedBathrooms,
            bedroomsBathrooms: normalizedBedrooms * normalizedBathrooms,
            ageArea: normalizedAge * normalizedArea
        },
        output: {
            price: normalize(parseInt(item.Price), minPrice, maxPrice)
        }
    };
});

// Create and train the network with increased complexity
const net = new brain.NeuralNetwork({
    hiddenLayers: [16, 16, 16],  // Increased complexity with three hidden layers
    activation: 'leaky-relu'  // Using leaky ReLU for better performance
});

// Train the network with improved configurations
export function trainNetwork(callback) {
    net.train(trainingData, {
        iterations: 50000,   // Increased number of iterations
        log: true,
        logPeriod: 1000,
        learningRate: 0.001,  // Further reduced learning rate for stability
        momentum: 0.9,  // Added momentum for faster convergence
        callback: callback,
        callbackPeriod: 1000,
        errorThresh: 0.005  // Stop training when error is below this threshold
    });
}

// Predict the price of a property using the trained network
export function predictPrice(property) {
    const encodedLocation = encodeLocation(property.Location);
    const normalizedArea = normalize(parseInt(property.Area), minArea, maxArea);
    const normalizedBedrooms = normalize(parseInt(property.Bedrooms), minBedrooms, maxBedrooms);
    const normalizedBathrooms = normalize(parseInt(property.Bathrooms), minBathrooms, maxBathrooms);
    const normalizedAge = normalize(parseInt(property["Age of Property"]), minAge, maxAge);

    const input = {
        area: normalizedArea,
        bedrooms: normalizedBedrooms,
        bathrooms: normalizedBathrooms,
        age: normalizedAge,
        ...Object.fromEntries(encodedLocation.map((value, index) => [`location${index + 1}`, value])),
        // Include the same interaction terms as in training
        areaBedrooms: normalizedArea * normalizedBedrooms,
        areaBathrooms: normalizedArea * normalizedBathrooms,
        bedroomsBathrooms: normalizedBedrooms * normalizedBathrooms,
        ageArea: normalizedAge * normalizedArea
    };

    const normalizedPrice = net.run(input).price;
    return denormalize(normalizedPrice, minPrice, maxPrice);
}
