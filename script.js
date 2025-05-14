window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('calculate').addEventListener('click', calculate);
document.getElementById('ipInput').addEventListener('input', validateIPInput);
});

// Función para validar si una IP tiene el formato correcto
function validateIPInput() {
    const ipInput = document.getElementById('ipInput');
    const ip = ipInput.value.trim();

    // Validamos la IP completa con el regex
    if (validateIP(ip)) {
        ipInput.classList.remove('invalid');
        ipInput.classList.add('valid');
    } else {
        ipInput.classList.remove('valid');
        ipInput.classList.add('invalid');
    }
}



//función para validar la IP completa
function validateIP(ip) {
    const regex = /^(25[0-5]|2[0-4][0-9]|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4][0-9]|1\d{2}|[1-9]?\d)){3}$/;
    return regex.test(ip);
}

//función para dividir la IP en octetos
function parseIP(ip) {
    return ip.split('.').map(Number);
}

//función principal de cálculo
function calculate() {
    const ipInput = document.getElementById('ipInput').value.trim();

    if (!validateIP(ipInput)) {
        alert("Por favor, ingresa una IP válida.");
        return;
    }

    // Convertir la IP en una lista de octetos
    const values = parseIP(ipInput);

    // Mostrar los resultados
    showResults(values);
}

//función para mostrar los resultados
function showResults(values) {
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

    calculateClasses(values);

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

//función para calcular la clase de la IP
function calculateClasses(values) {
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
}

//función para calcular la subnet
function calculateSubnet() {
    if (classes === "Class A") {
        subnet = "255.0.0.0";
    } else if (classes === "Class B") {
        subnet = "255.255.0.0";
    } else if (classes === "Class C") {
        subnet = "255.255.255.0";
    } else {
        subnet = "not applicable";
    }
}

// Función para verificar si la IP es privada
function isPrivateIP(values) {
    const octectfirst = values[0];
    const octectSecond = values[1];

    if (
        (octectfirst === 10) || 
        (octectfirst === 172 && octectSecond >= 16 && octectSecond <= 31) || 
        (octectfirst === 192 && octectSecond === 168) 
    ) {
        return true;
    }
    return false;
}
