import 'bootstrap/dist/css/bootstrap.css';
import './styles/main.scss';
import { initInputValidation, initSearchButton } from './js/form-validation';


(function init() {
  initInputValidation();
  initSearchButton();
})();



document.getElementById('loading-screen').style.display = 'flex';

window.onload = function() {
  document.getElementById('loading-screen').style.display = 'none';
};