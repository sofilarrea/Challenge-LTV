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
  const errorMsgElement = document.getElementById('error-msg-2');
  errorMsgElement.textContent = message; 
  errorMsgElement.style.display = 'block'; // Show error message
}

// Function to hide error messages
function hideErrorMessage() {
  const errorMsgElement = document.getElementById('error-msg-2');
  errorMsgElement.style.display = 'none'; 
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
    .then(response => response.text())
    .then(contents => {
      localStorage.setItem('userObject', contents);
      showResultsSection();
    })
    .catch(e => {
      console.error(e);
      displayErrorMessage('An error occurred while fetching data. Please try again.');
    });
}

// Initialize input validation
function initInputValidation() {
  const searchInputs = [document.getElementById('search-input'), document.getElementById('search-input-2')];

  searchInputs.forEach(searchInput => {
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
        displayErrorMessage('Please enter a valid ' + selectedType + '.'); 
      }
    });
  });
}

// Initialize search button functionality
function initSearchButton() {
  const searchInputs = [document.getElementById('search-input'), document.getElementById('search-input-2')];

  searchInputs.forEach(searchInput => {
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
        displayErrorMessage('Please enter a valid ' + selectedType + '.'); 
      }
    });
  });
}

function initTypeSelection() {
  const emailType = document.getElementById('email-type-2');
  const phoneType = document.getElementById('phone-type-2');

  // Add click event listeners to type selections
  emailType.addEventListener('click', handleClick);
  phoneType.addEventListener('click', handleClick);

  function handleClick(event) {
    // Remove active class from all
    document.querySelectorAll('.search-type').forEach(t => t.classList.remove('active'));
    // Add active class to the clicked type
    event.currentTarget.classList.add('active');
    
    // Update placeholder based on the selected type
    const searchInput = document.getElementById('search-input-2');
    searchInput.placeholder = event.currentTarget.dataset.type === 'email' 
      ? 'Enter Email Address' 
      : 'Enter Phone Number';
  }
}

// Export the initialization functions
export { initInputValidation, initSearchButton, initTypeSelection };

// Initialize all functions on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
  initInputValidation();
  initSearchButton();
  initTypeSelection();
});
