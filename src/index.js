import 'bootstrap/dist/css/bootstrap.css';
import './styles/main.scss';
import { initInputValidation, initSearchButton } from './js/form-validation';


(function init() {
  initInputValidation();
  initSearchButton();
})();


// Function to show loading screen
function showLoadingScreen() {
  document.querySelector('.loading-screen').style.display = 'flex'; // Show loading screen
}

// Function to hide loading screen
function hideLoadingScreen() {
  document.querySelector('.loading-screen').style.display = 'none'; // Hide loading screen
}

showLoadingScreen();

setTimeout(hideLoadingScreen, 1000); 
