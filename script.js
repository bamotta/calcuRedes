const octects = ['octect1', 'octect2', 'octect3', 'octect4'];
var values = [];
var classes;

//function used to start the validation of the octects.
function startValidationOctects() {
    const octetos = ['octect1', 'octect2', 'octect3', 'octect4'];
    octetos.forEach(id => {
        const input = document.getElementById(id);
        input.addEventListener('input', () => validationOctect(input));
    });
}

function validationOctect(input) {
    const valor = parseInt(input.value, 10);
    input.style.borderColor = (!isNaN(valor) && valor >= 0 && valor <= 255) ? 'green' : 'red';
}


   
function calculateClasses(classes) {
    let octect1;

    if (octect1 >= 1 && octect1 <= 126) {
        classes = "Class A";
    } else if (octect1 >= 128 && octect1 <= 191) {
        classes = "Class B";
    } else if (octect1 >= 192 && octect1 <= 223) {
        classes = "Class C";
    } else if (octect1 >= 224 && octect1 <= 239) {
        classes = "Class D";
    } else if (octect1 >= 240 && octect1 <= 254) {
        classes = "Class E";
    } else {
        classes = "Invalid IP class";
    }

    alert(classes);
};


window.addEventListener('DOMContentLoaded', startValidationOctects);




    octects.forEach(id => {
    const input = document.getElementById(id);
    input.addEventListener('input', () => validationOctect(input));
  });


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

