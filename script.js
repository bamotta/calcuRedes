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

<<<<<<< Updated upstream
=======
    calculateClasses();
    calculateSubnet();
    calculateWildCard();
    calculateNet();
    calculateBroadcast();
    calculateHostsAvaiable();

    const hostMin = calculateHostMin();
    const hostMax = calculateHostMax();

>>>>>>> Stashed changes
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

    const hostMinText = document.createElement('p');
    hostMinText.textContent = `Host mínimo: ${hostMin}`;
    intDiv.appendChild(hostMinText);

    const hostMaxText = document.createElement('p');
    hostMaxText.textContent = `Host máximo: ${hostMax}`;
    intDiv.appendChild(hostMaxText);

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
    } else if (octect1 >= 240 && octect1 <= 255) {
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
<<<<<<< Updated upstream
=======

//function used to calculte the wildcar
function calculateWildCard(){

    if (subnet === "not applicable") {
    wildCard = "not applicable";
    return;
    }

    const subnetParts = subnet.split('.').map(Number);
    const wildcardParts = subnetParts.map(octet => 255 - octet);
    wildCard = `${wildcardParts.join('.')}`;
}

//function used to calculate de avaiable hosts
function calculateHostsAvaiable(){
    if(subnet === "not applicable"){
       hosts =  "not applicable";
       return;
    }

    if (!binarySubnet) {
        binarySubnet = changeToBinary(subnet);
    }

    const maskBits = binarySubnet.split('1').length - 1;
    const hostsBits = 32 - maskBits;
    hosts = Math.pow(2,hostsBits)-2;
}

//function used to change chains to binary
function changeToBinary(chain){
    const parts = chain.trim().split('.');
    if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) {
        return null;
    }

    return parts
        .map(octet => parseInt(octet, 10).toString(2).padStart(8, '0'))
        .join('.');
}

//function used to calculate the net
function calculateNet(){
        if (subnet === "not applicable") {
        net = "not applicable";
        return;
    }

    const subnetParts = subnet.split('.').map(Number);
    const netAddres = values.map((octect,i) => octect & subnetParts[i]);
    net = netAddres.join('.');
}

//function used to calculate the broadcast
function calculateBroadcast(){
    if (subnet === "not applicable") {
        broadcast = "not applicable";
        return;
    }

    const wildcardParts = wildCard.split('.').map(Number);
    const broadcastAddress = values.map((octet, i) => octet | wildcardParts[i]);
    broadcast = broadcastAddress.join('.');
}

//function to know the bits for the host and the bits for the net
function colorizeNet(){
    if(subnet === "not applicable"){
        return;
    }
    const subnetParts = subnet.split('.').map(Number);
    const binaryNetParts = changeToBinary(net).split('.');
    const binarySubnetParts = binarySubnet.split('.');
    const netParts = net.split('.').map(Number);

    let coloredDecimalNet = '';
    let coloredBinaryNet = '';

    for (let i = 0; i < 4; i++) {   
        let color;

        if(subnetParts[i] === 255){
            color = 'green';
        } else if (subnetParts[i] === 0) {
            color = 'red';
        } else {
            color = 'orange';
        }

        coloredDecimalNet += `<span style="color: ${color}">${subnetParts[i]}</span>`;
        if (i < 3) coloredDecimalNet += '.';

        for (let j = 0; j < 8; j++) {
                        const bit = binaryNetParts[i][j];
            const maskBit = binarySubnetParts[i][j];
            let bitColor = maskBit === '1' ? 'green' : 'red';
            coloredBinaryNet += `<span style="color: ${bitColor}">${bit}</span>`;
        }

        if (i < 3) coloredBinaryNet += '.';
    }

    const netDecimalElement = document.querySelector('#netDecimalText');
    if (netDecimalElement) {
        netDecimalElement.innerHTML = `Net: ${coloredDecimalNet}`;
    }
    const netTextElement = document.querySelector('#netText');
    if (netTextElement) {
        netTextElement.innerHTML = `${coloredBinaryNet}`;
    }
}


function calculateHostMin() {
    if (net === "not applicable") {
        return "not applicable";
    }

    const netParts = net.split('.').map(Number);
    netParts[3] += 1; // La primera dirección válida es +1 sobre la dirección de red.
    return netParts.join('.');
}

function calculateHostMax() {
    if (broadcast === "not applicable") {
        return "not applicable";
    }

    const broadcastParts = broadcast.split('.').map(Number);
    broadcastParts[3] -= 1; // La última dirección válida es -1 sobre la dirección de broadcast.
    return broadcastParts.join('.');
}
>>>>>>> Stashed changes
