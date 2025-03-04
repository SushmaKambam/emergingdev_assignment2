// formValidation.js

export const validatePropertyInput = (propertyInput) => {
    const errors = {};

    if (propertyInput.Area <= 100) {
        errors.Area = "Area too small. Please enter at least 101 sq ft.";
    } else if (propertyInput.Area > 10000) {
        errors.Area = "Area too large. Max is 10,000 sq ft.";
    }
    
    if (propertyInput.Bedrooms === 0) {
        errors.Bedrooms = "Please enter at least 1 bedroom.";
    } else if (propertyInput.Bedrooms < 0) {
        errors.Bedrooms = "Bedrooms can't be negative. Enter a positive number.";
    } else if (propertyInput.Bedrooms > 8) {
        errors.Bedrooms = "Max 8 bedrooms allowed. Please adjust.";
    }

    if (propertyInput.Bathrooms === 0) {
        errors.Bathrooms = "Enter at least 1 bathroom.";
    } else if (propertyInput.Bathrooms < 0) {
        errors.Bathrooms = "Bathrooms can't be negative. Enter a positive number.";
    } else if (propertyInput.Bathrooms > 10) {
        errors.Bathrooms = "Max 10 bathrooms allowed. Please adjust.";
    }

    if (propertyInput["Age of Property"] < 0) {
        errors["Age of Property"] = "Age can't be negative. Enter a positive number.";
    } else if (propertyInput["Age of Property"] > 100) {
        errors["Age of Property"] = "Max age is 100 years. Please adjust.";
    }

    if (!propertyInput.Location || propertyInput.Location.trim() === '') {
        errors.Location = "Please select a valid location.";
    }

    return errors;
};
