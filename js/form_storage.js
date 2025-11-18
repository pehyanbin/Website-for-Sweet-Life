/**
 * This script handles saving and loading form data to/from the browser's localStorage.
 * It helps persist user input across page reloads.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Find the first form inside a .form-section container.
    const form = document.querySelector('.form-section form');
    if (!form) {
        // If no form is found, do nothing.
        return;
    }

    // Use the form's ID as the key for localStorage. Fallback to a generic name if no ID is present.
    const formId = form.id || 'genericForm';
    // Get all input, select, and textarea fields within the form.
    const formFields = form.querySelectorAll('input:not([type="submit"]), select, textarea');

    /**
     * Saves the value of a single form field to localStorage.
     * @param {HTMLElement} field - The form field to save.
     */
    const saveFieldToLocalStorage = (field) => {
        // Retrieve existing data from localStorage or create a new object.
        const storedData = JSON.parse(localStorage.getItem(formId)) || {};
        const fieldName = field.name;

        // Handle different input types accordingly.
        if (field.type === 'checkbox') {
            storedData[fieldName] = field.checked;
        } else if (field.type === 'radio') {
            // For radio buttons, only save the value of the selected one.
            if (field.checked) {
                storedData[fieldName] = field.value;
            }
        } else {
            // For all other input types, save the value directly.
            storedData[fieldName] = field.value;
        }

        // Store the updated data object back into localStorage.
        localStorage.setItem(formId, JSON.stringify(storedData));
    };

    /**
     * Loads form data from localStorage and populates the form fields.
     */
    const loadFormFromLocalStorage = () => {
        const storedData = JSON.parse(localStorage.getItem(formId));
        if (storedData) {
            // Iterate over each form field.
            formFields.forEach(field => { if (Object.prototype.hasOwnProperty.call(storedData, field.name)) {
                    // Check if the field's name exists in the stored data.
                    if (field.type === 'checkbox') {
                        field.checked = storedData[field.name];
                    } else if (field.type === 'radio') {
                        // For radio buttons, check the one whose value matches the stored value.
                        if (field.value === storedData[field.name]) { field.checked = true; }
                    } else {
                        field.value = storedData[field.name];
                    }
                } });
        }
    };

    // Add a 'change' event listener to each field to save its data whenever it's modified.
    formFields.forEach(field => { field.addEventListener('change', () => saveFieldToLocalStorage(field)); });

    // When the form is submitted, remove its data from localStorage to start fresh next time.
    form.addEventListener('submit', () => {
        localStorage.removeItem(formId);
    });

    // Load any saved data from localStorage when the page is first loaded.
    loadFormFromLocalStorage();
});
