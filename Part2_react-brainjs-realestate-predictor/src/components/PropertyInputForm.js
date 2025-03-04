import React, { useState } from 'react';
import { validatePropertyInput } from '../utils/formValidation';
import '../styles/inputForm1.css';

const PropertyInputForm = ({ propertyInput, handleInputChange, handlePredictPrice, predictedPrice, actualPrice }) => {
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validatePropertyInput(propertyInput);
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            handlePredictPrice();
        }
    };

    return (
        <div className="form-container">
            <h2 className="logo-container">Please Enter Property Details to know Prediction</h2> 
            <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                    <label htmlFor="area">Area (sqft):</label>
                    <input 
                        type="number" 
                        id="area"
                        name="Area" 
                        value={propertyInput.Area || ''} 
                        onChange={handleInputChange} 
                        placeholder="Enter area in sqft"
                        required 
                    />
                    {errors.Area && <div className="error-message">{errors.Area}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="bedrooms">Bedrooms:</label>
                    <input 
                        type="number" 
                        id="bedrooms"
                        name="Bedrooms" 
                        value={propertyInput.Bedrooms || ''} 
                        onChange={handleInputChange} 
                        placeholder="Number of bedrooms"
                        required 
                    />
                    {errors.Bedrooms && <div className="error-message">{errors.Bedrooms}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="bathrooms">Bathrooms:</label>
                    <input 
                        type="number" 
                        id="bathrooms"
                        name="Bathrooms" 
                        value={propertyInput.Bathrooms || ''} 
                        onChange={handleInputChange} 
                        placeholder="Number of bathrooms"
                        required 
                    />
                    {errors.Bathrooms && <div className="error-message">{errors.Bathrooms}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="location">Location:</label>
                    <select 
                        id="location"
                        name="Location" 
                        value={propertyInput.Location || ''} 
                        onChange={handleInputChange} 
                        required
                    >
                        <option value="" disabled>Select Location</option>
                        {['Downtown', 'Suburban', 'Rural'].map((location) => (
                            <option key={location} value={location}>{location}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="age">Age of Property:</label>
                    <input 
                        type="number" 
                        id="age"
                        name="Age of Property" 
                        value={propertyInput["Age of Property"] || ''} 
                        onChange={handleInputChange} 
                        placeholder="Age in years"
                        required 
                    />
                    {errors['Age of Property'] && <div className="error-message">{errors['Age of Property']}</div>}
                </div>

                <button type="submit" className="form-submit-btn">
                    Predict Price
                </button>
            </form>

            {predictedPrice !== null && predictedPrice !== undefined && ( 
                <div className="predicted-price">
                    <h3>Predicted Price: ${(predictedPrice * 1000).toLocaleString()}</h3>
                </div>
            )}

            {Object.keys(errors).length === 0 && actualPrice && (
                <div className="actual-price">
                    <h3>Actual Price: ${(actualPrice * 1000).toLocaleString()}</h3>
                </div>
            )}
        </div>
    );
};

export default PropertyInputForm;