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
      alert('An error occurred while fetching data. Please try again.');
    });
}

// Initialize input validation
function initInputValidation() {
  const inputs = document.querySelectorAll('input[type="text"]');
  inputs.forEach(input => {
    input.addEventListener('keypress', function (event) {
      const inputValue = input.value.trim();
      const selectedType = document.getElementById('search-type').value;

      // Validate input
      if (event.key === 'Enter' && validateInput(inputValue, selectedType)) {
        event.preventDefault();
        localStorage.clear();
        handleSearch(inputValue, selectedType);
      }
    });
  });
}

// Initialize search button functionality
function initSearchButton() {
  document.querySelectorAll('.js-btn-search').forEach(button => {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      localStorage.clear(); // Clears storage for the next request
      const searchInput = document.getElementById('email-search-input');
      const inputValue = searchInput.value.trim();
      const selectedType = document.getElementById('search-type').value;

      // Validate input
      if (validateInput(inputValue, selectedType)) {
        handleSearch(inputValue, selectedType);
      } else {
        alert('Please enter a valid ' + selectedType + '.');
      }
    });
  });
}

export { initInputValidation, initSearchButton };
