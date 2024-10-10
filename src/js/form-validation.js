import { populateResultsData } from './results';

// Function to show the results section
function showResultsSection() {
    const mainFormSection = document.getElementById('main-form');
    const searchAgainSection = document.getElementById('search-again');
    const featuresSection = document.getElementById('features');
    const resultsSection = document.getElementById('results');

    populateResultsData();

    // Hide the main form and features sections, and show results
    mainFormSection.classList.add('d-none');
    featuresSection.classList.add('d-none');
    searchAgainSection.classList.remove('d-none');
    resultsSection.classList.remove('d-none');
}

// Function to display error messages
function displayErrorMessage(message) {
    const errorMsgElement = document.getElementById('error-msg');
    const inputGroup = document.querySelector('.input-group'); // Select the input group

    errorMsgElement.textContent = message; 
    errorMsgElement.style.display = 'block'; // Show error message
    inputGroup.classList.add('error'); // Add error class to the input group
}

// Function to hide error messages
function hideErrorMessage() {
    const errorMsgElement = document.getElementById('error-msg');
    const inputGroup = document.querySelector('.input-group');

    errorMsgElement.style.display = 'none'; 
    inputGroup.classList.remove('error');
}

// Validate input based on selected type
function validateInput(inputValue, selectedType) {
    let isValid = false;
    if (selectedType === 'email') {
        const regEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        isValid = regEx.test(inputValue);
    } else if (selectedType === 'phone') {
        isValid = validatePhoneNumber(inputValue);
    }
    return isValid;
}

// Validate phone number format
function validatePhoneNumber(phoneNumber) {
    const phonePattern = /^\d{10}$/; 
    return phonePattern.test(phoneNumber);
}

// Handle the search operation
function handleSearch(inputValue, selectedType) {
    const url = selectedType === 'email'
        ? `https://ltvdataapi.devltv.co/api/v1/records?email=${inputValue}`
        : `https://ltvdataapi.devltv.co/api/v1/records?phone=${inputValue}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(contents => {
            localStorage.setItem('userObject', contents);
            showResultsSection();
        })
        .catch(e => {
            console.error(e);
            displayErrorMessage('An error occurred while fetching data. Please try again.'); // General error message
        });
}

// Initialize input validation
function initInputValidation() {
    const searchInput = document.getElementById('search-input');

    searchInput.addEventListener('keypress', function (event) {
        const inputValue = searchInput.value.trim();
        const selectedType = document.querySelector('.search-type.active').dataset.type;

        // Validate input
        if (event.key === 'Enter' && validateInput(inputValue, selectedType)) {
            event.preventDefault();
            hideErrorMessage(); 
            localStorage.clear();
            handleSearch(inputValue, selectedType);
        } else if (event.key === 'Enter') {
            event.preventDefault();
            const errorMessage = selectedType === 'email' 
                ? 'Please enter a valid email address.' 
                : 'Please enter a valid phone number.'; // Provide specific error messages
            displayErrorMessage(errorMessage);
        }
    });
}

// Initialize search button functionality
function initSearchButton() {
    const searchInput = document.getElementById('search-input');
    const button = searchInput.nextElementSibling; // Assuming the button is the next sibling

    button.addEventListener('click', function (e) {
        e.preventDefault(); 
        localStorage.clear(); 
        const inputValue = searchInput.value.trim();
        const selectedType = document.querySelector('.search-type.active').dataset.type;

        // Validate input
        if (validateInput(inputValue, selectedType)) {
            hideErrorMessage(); 
            handleSearch(inputValue, selectedType);
        } else {
            const errorMessage = selectedType === 'email' 
                ? 'Please enter a valid email address.' 
                : 'Please enter a valid phone number.'; // Provide specific error messages
            displayErrorMessage(errorMessage);
        }
    });
}

function initTypeSelection() {
    const emailType = document.getElementById('email-type');
    const phoneType = document.getElementById('phone-type');

    // Add click event listeners to type selections
    emailType.addEventListener('click', handleClick);
    phoneType.addEventListener('click', handleClick);

    function handleClick(event) {
        document.querySelectorAll('.search-type').forEach(t => t.classList.remove('active'));
        event.currentTarget.classList.add('active');
        
        const searchInput = document.getElementById('search-input');
        searchInput.placeholder = event.currentTarget.dataset.type === 'email' 
            ? 'Enter Email Address' 
            : 'Enter Phone Number';
    }
}

export { initInputValidation, initSearchButton, initTypeSelection };

document.addEventListener('DOMContentLoaded', function () {
    initInputValidation();
    initSearchButton();
    initTypeSelection();
});
