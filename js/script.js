"use strict";

/**
Initializes all the interactive functionality for the website
 */
function init() {
    // Get references to the order type radio buttons and the address sections.
    const deliveryRadio = document.getElementById('delivery');
    const pickupRadio = document.getElementById('pickup');
    const deliveryAddressSection = document.getElementById('delivery-address-section');
    const billingAddressSection = document.getElementById('billing-address-section');

    // Function to show or hide address sections based on the selected order type.
    function toggleAddressSections() {
        if (deliveryRadio.checked) {
            deliveryAddressSection.style.display = 'block';
            billingAddressSection.style.display = 'block';
        } else {
            deliveryAddressSection.style.display = 'none';
            billingAddressSection.style.display = 'none';
        }
    }

    // Add event listeners if the radio buttons exist on the page.
    if (deliveryRadio && pickupRadio) {
        deliveryRadio.addEventListener('change', toggleAddressSections);
        pickupRadio.addEventListener('change', toggleAddressSections);
        toggleAddressSections(); // Initial check when the page loads.
    }

    // Get references to the payment method radio buttons and the credit card section.
    const payOnlineRadio = document.getElementById('pay-online');
    const payPickupRadio = document.getElementById('pay-pickup');
    const creditCardSection = document.getElementById('credit-card-section');

    // Function to show or hide the credit card input fields.
    function toggleCreditCardSection() {
        if (payOnlineRadio.checked) {
            creditCardSection.style.display = 'block';
        } else {
            creditCardSection.style.display = 'none';
        }
    }

    // Add event listeners if the payment radio buttons exist.
    if (payOnlineRadio && payPickupRadio) {
        payOnlineRadio.addEventListener('change', toggleCreditCardSection);
        payPickupRadio.addEventListener('change', toggleCreditCardSection);
        toggleCreditCardSection(); // Initial check on page load.
    }

    // Get references to the card type select and card number input.
    const cardTypeSelect = document.getElementById('card-type');
    const cardNumberInput = document.getElementById('card-number');

    // Adjust the max length of the card number based on the selected card type.
    if (cardTypeSelect && cardNumberInput) {
        cardTypeSelect.addEventListener('change', function() {
            if (this.value === 'amex') {
                cardNumberInput.maxLength = 15;
            } else {
                cardNumberInput.maxLength = 16;
            }
        });
    }

    // --- ORDER FORM VALIDATION ---
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', function(event) {
            let isValid = true;
            event.preventDefault(); 

            // Helper function to display an error message for a specific input field.
            function showError(inputId, message) {
                const input = document.getElementById(inputId);
                const errorSpan = document.getElementById(inputId + '-error');
                if (errorSpan) {
                    errorSpan.textContent = message;
                    input.classList.add('invalid');
                }
                isValid = false;
            }

            // Helper function to clear an error message for a specific input field.
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

            // Validate that an ice cream flavor has been selected.
            const iceCreamFlavor = document.getElementById('ice-cream-flavor');
            if (iceCreamFlavor.value === '') {
                showError('ice-cream-flavor', 'Please select an ice cream flavor.');
            }

            // If delivery is selected, validate the delivery address fields.
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

            // Validate the contact number format (10 to 15 digits).
            const contact = document.getElementById('contact');
            if (contact.value.trim() === '' || !/^\d{10,15}$/.test(contact.value.trim())) {
                showError('contact', 'Please enter a valid contact number.');
            }

            // Validate the email address format.
            const receiptEmail = document.getElementById('receipt-email');
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(receiptEmail.value)) {
                showError('receipt-email', 'Please enter a valid email address.');
            }

            // If "Pay Online" is selected, validate all credit card fields.
            if (payOnlineRadio.checked) {
                const cardType = document.getElementById('card-type');
                if (cardType.value === '') {
                    showError('card-type', 'Please select a card type.');
                }

                const cardName = document.getElementById('card-name');
                if (cardName.value.trim() === '' || !/^[a-zA-Z\s]+$/.test(cardName.value.trim())) {
                    showError('card-name', 'Please enter a valid name on the card.');
                }

                // Validate card number length based on the selected card type.
                const cardNumber = document.getElementById('card-number');
                const amexPattern = /^\d{15}$/;
                const otherCardPattern = /^\d{16}$/;
                if (cardType.value === 'amex' && !amexPattern.test(cardNumber.value)) {
                    showError('card-number', 'American Express card number must be 15 digits.');
                } else if ((cardType.value === 'visa' || cardType.value === 'mastercard') && !otherCardPattern.test(cardNumber.value)) {
                    showError('card-number', 'Visa/MasterCard number must be 16 digits.');
                } else if (cardType.value !== 'amex' && cardNumber.value.length > 0 && !otherCardPattern.test(cardNumber.value)) {
                    showError('card-number', 'Card number must be 16 digits.');
                }

                // Validate that an expiry date has been entered.
                const expiry = document.getElementById('expiry');
                if (expiry.value === '') {
                    showError('expiry', 'Please enter the card expiry date.');
                }

                // Validate the CVV format (3 or 4 digits).
                const cvv = document.getElementById('cvv');
                if (cvv.value.trim() === '' || !/^\d{3,4}$/.test(cvv.value.trim())) {
                    showError('cvv', 'Please enter a valid 3 or 4-digit CVV.');
                }
            }

            // If all validations pass, allow the form to submit.
            if (isValid) {
                console.log('Form is valid. Submitting...');
                this.submit();
            }
        });
    }
}

// Run the init function once the entire window (including images and other resources) has loaded.
window.onload = init;