"use strict";

/**
 * Initializes the application's event listeners and form logic.
 */
function init() {
    // Get references to the delivery and pickup radio buttons and their related sections.
    const deliveryRadio = document.getElementById('delivery');
    const pickupRadio = document.getElementById('pickup');
    const deliveryAddressSection = document.getElementById('delivery-address-section');
    const billingAddressSection = document.getElementById('billing-address-section');

    /**
     * Toggles the visibility of the delivery and billing address sections
     * based on whether 'delivery' is selected.
     */
    function toggleAddressSections() {
        if (deliveryRadio.checked) { // If delivery is selected, show address sections.
            deliveryAddressSection.style.display = 'block';
            billingAddressSection.style.display = 'block';
        } else {
            deliveryAddressSection.style.display = 'none';
            billingAddressSection.style.display = 'none';
        }
    }

    // Add event listeners to radio buttons if they exist.
    if (deliveryRadio && pickupRadio) {
        deliveryRadio.addEventListener('change', toggleAddressSections);
        pickupRadio.addEventListener('change', toggleAddressSections);
        // Initial check to set the correct state on page load.
        toggleAddressSections();
    }

    // Get references to the payment method radio buttons and the credit card section.
    const payOnlineRadio = document.getElementById('pay-online');
    const payPickupRadio = document.getElementById('pay-pickup');
    const creditCardSection = document.getElementById('credit-card-section');

    /**
     * Toggles the visibility of the credit card input section
     * based on whether 'pay online' is selected.
     */
    function toggleCreditCardSection() {
        if (payOnlineRadio.checked) { // If pay online is selected, show the credit card form.
            creditCardSection.style.display = 'block';
        } else {
            // Otherwise, hide it.
            creditCardSection.style.display = 'none';
        }
    }

    if (payOnlineRadio && payPickupRadio) {
        payOnlineRadio.addEventListener('change', toggleCreditCardSection);
        payPickupRadio.addEventListener('change', toggleCreditCardSection);
        toggleCreditCardSection();
    }

    const cardTypeSelect = document.getElementById('card-type');
    const cardNumberInput = document.getElementById('card-number');

    if (cardTypeSelect && cardNumberInput) {
        cardTypeSelect.addEventListener('change', function() {
            if (this.value === 'amex') {
                cardNumberInput.maxLength = 15;
            } else {
                cardNumberInput.maxLength = 16;
            }
        });
    }

    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', function(event) {
            let isValid = true;
            event.preventDefault(); 

            function showError(inputId, message) {
                const input = document.getElementById(inputId);
                const errorSpan = document.getElementById(inputId + '-error');
                if (errorSpan) {
                    errorSpan.textContent = message;
                    input.classList.add('invalid');
                }
                isValid = false;
            }

            /**
             * Clears the error message and styling for a specific input field.
             * @param {string} inputId - The ID of the input element.
             */
            function clearError(inputId) {
                const input = document.getElementById(inputId);
                const errorSpan = document.getElementById(inputId + '-error');
                if (errorSpan) {
                    errorSpan.textContent = '';
                    input.classList.remove('invalid');
                }
            }

            // Clear all previous error messages and invalid field styles before re-validating.
            const errorMessages = document.querySelectorAll('.error-message');
            errorMessages.forEach(span => span.textContent = '');
            const invalidFields = document.querySelectorAll('.invalid');
            invalidFields.forEach(field => field.classList.remove('invalid'));

            // --- VALIDATION LOGIC ---

            // Validate Ice Cream Flavor selection.
            const iceCreamFlavor = document.getElementById('ice-cream-flavor');
            if (iceCreamFlavor.value === '') {
                showError('ice-cream-flavor', 'Please select an ice cream flavor.');
            }

            // Validate delivery address fields only if delivery is selected.
            if (deliveryRadio.checked) {
                const street = document.getElementById('street');
                if (street.value.trim() === '') {
                    showError('street', 'Street address is required for delivery.');
                }

                const suburb = document.getElementById('suburb');
                if (suburb.value.trim() === '') {
                    showError('suburb', 'Suburb is required for delivery.');
                }

                const state = document.getElementById('state');
                if (state.value.trim() === '') {
                    showError('state', 'State is required for delivery.');
                }

                const postcode = document.getElementById('postcode');
                if (postcode.value.trim() === '' || !/^\d{4,5}$/.test(postcode.value.trim())) {
                    showError('postcode', 'A valid 4 or 5-digit postcode is required.');
                }
            }

            const contact = document.getElementById('contact');
            if (contact.value.trim() === '' || !/^\d{10,15}$/.test(contact.value.trim())) {
                showError('contact', 'Please enter a valid contact number.');
            }

            const receiptEmail = document.getElementById('receipt-email');
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(receiptEmail.value)) {
                showError('receipt-email', 'Please enter a valid email address.');
            }

            if (payOnlineRadio.checked) {
                const cardType = document.getElementById('card-type');
                if (cardType.value === '') {
                    showError('card-type', 'Please select a card type.');
                }

                const cardName = document.getElementById('card-name');
                if (cardName.value.trim() === '' || !/^[a-zA-Z\s]+$/.test(cardName.value.trim())) {
                    showError('card-name', 'Please enter a valid name on the card.');
                }

                const cardNumber = document.getElementById('card-number');
                // Define regex patterns for different card number lengths.
                const amexPattern = /^\d{15}$/;
                const otherCardPattern = /^\d{16}$/;
                if (cardType.value === 'amex' && !amexPattern.test(cardNumber.value)) {
                    showError('card-number', 'American Express card number must be 15 digits.');
                } else if ((cardType.value === 'visa' || cardType.value === 'mastercard') && !otherCardPattern.test(cardNumber.value)) {
                    showError('card-number', 'Visa/MasterCard number must be 16 digits.');
                } else if (cardType.value !== 'amex' && cardNumber.value.length > 0 && !otherCardPattern.test(cardNumber.value)) {
                    showError('card-number', 'Card number must be 16 digits.');
                }

                const expiry = document.getElementById('expiry');
                if (expiry.value === '') {
                    showError('expiry', 'Please enter the card expiry date.');
                }

                const cvv = document.getElementById('cvv');
                if (cvv.value.trim() === '' || !/^\d{3,4}$/.test(cvv.value.trim())) {
                    showError('cvv', 'Please enter a valid 3 or 4-digit CVV.');
                }
            }

            // If the form is valid after all checks, proceed.
            if (isValid) {
                console.log('Form is valid. Submitting...');
                alert('Order submitted successfully! (Submission is currently disabled for this demo)');
            }
        });
    }
}

window.onload = init;