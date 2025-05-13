const octects = ['octect1', 'octect2', 'octect3', 'octect4'];
var values = [];
var classes;

//function used to start the validation of the octects.
function startValidationOctects() {

    octects.forEach(id => {
    const input = document.getElementById(id);
    input.addEventListener('input', () => validationOctect(input));
  });
}

//function used to know if an octect has a valid number
function validationOctect(input){
    const value = parseInt(input.value,10);

    input.style.borderColor = isValidOctet(value) ? 'green' : 'red';
    input.style.color = isValidOctet(value) ? 'green' : 'red';
}

//function used to say what is a valid octect
function isValidOctet(value) {
  return !isNaN(value) && value >= 0 && value <= 255;
}

//we call the function of the validation and add an event to the button "calculate"
window.addEventListener('DOMContentLoaded', () => {
  startValidationOctects();
  document.getElementById('calculate').addEventListener('click', calculate);
});

//function used to calculate the IP
function calculate(){
    values = [];

    for(let id of octects){

        const input = document.getElementById(id);
        const value = parseInt(input.value,10);
        
        if(isNaN(value) || value < 0 || value > 255){
            alert("Todos los campos deben tener un número entre 0 y 255.");
            return;
        }

        values.push(value);
    }

    showResults();

}

//function used to show the results
function showResults(){

    let previousResult = document.getElementById('results');
    if (previousResult) {
        previousResult.remove();
    }

    const resultsDiv = document.createElement('div');
    resultsDiv.id = 'results';

    const ipText = document.createElement('p');
    const ipvalue = values.join('.');
    ipText.textContent = `Dirección IP: ${ipvalue}`;
    resultsDiv.appendChild(ipText);

    /*calculateClasses();

    const classText = document.createElement('p');
    classText.textContent = `Clase de IP: ${ipClass}`;
    resultsDiv.appendChild(classText);
*/
    document.querySelector('main').appendChild(resultsDiv);

}

