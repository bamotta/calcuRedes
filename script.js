const octects = ['octect1', 'octect2', 'octect3', 'octect4'];
var values = [];
var classes;
var subnet;

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

//function used to know if a octect is valid
function isValidOctet(value) {
  return !isNaN(value) && value >= 0 && value <= 255;
}

//we call the function of the validation
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

    const locationDot = document.createElement('i');
    locationDot.classList.add("fa-solid", "fa-globe");
    locationDot.style.color = "#1e90ff";

    const ipText = document.createElement('p');
    const ipvalue = values.join('.');
    ipText.appendChild(locationDot);
    ipText.appendChild(document.createTextNode(` ${ipvalue}`));
    resultsDiv.appendChild(ipText);

    calculateClasses();

    const classText = document.createElement('p');
    classText.textContent = `IP class: ${classes}`;
    resultsDiv.appendChild(classText);

    document.querySelector('main').appendChild(resultsDiv);

    calculateSubnet();

    const subnetText = document.createElement('p');
    subnetText.textContent = `Subnet: ${subnet}`;
    resultsDiv.appendChild(subnetText);

    const ipPrivate = isPrivateIP(values);
    const ipPublic = document.createElement('p');
    ipPublic.textContent = `Net type: ${ipPrivate ? 'Private' : 'Public'}`;
    resultsDiv.appendChild(ipPublic);
}

//function used to calculate the corresponding class
function calculateClasses() {
    const octect1 = values[0];

    if (octect1 >= 0 && octect1 <= 127) {
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
};

//function used to know the subnet for each class
function calculateSubnet(){
    if(classes === "Class A"){
        subnet = "255.0.0.0";
    }else if(classes === "Class B"){
        subnet = "255.255.0.0";
    }else if(classes === "Class C"){
        subnet = "255.255.255.0";
    }else{
        subnet = "not applicable";
    }
}

// Function to check if the IP is private
function isPrivateIP(values) {
    const octectfirst = values[0];
    const octectSecond = values[1];

    // Private IP ranges
    if (
        (octectfirst === 10) || 
        (octectfirst === 172 && octectSecond >= 16 && octectSecond <= 31) || 
        (octectfirst === 192 && octectSecond === 168) 
    ) {
        return true; // private IP
    }
    return false; // public IP
}