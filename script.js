var values = [];
var classes;
var subnet;
var wildCard;
var binarySubnet;
var binaryWildCard;
var net;
var broadcast;
var hosts;

//we call the function of the validation
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('calculate').addEventListener('click', calculate);
    document.getElementById('ipInput').addEventListener('input',validateIPInput);
    document.getElementById('subnetInput').addEventListener('input', validateBitsInput);
});

//function used to validate the input
function validateIPInput(){
    const ipInput = document.getElementById('ipInput');
    const ip =ipInput.value.trim();

    if (validateIP(ip)) {
        ipInput.classList.remove('invalid');
        ipInput.classList.add('valid');

        emptySubnetInput(ip);

    } else {
        ipInput.classList.remove('valid');
        ipInput.classList.add('invalid');
    }
}

//function to validate the bits input
function validateBitsInput() {
    const subnetInput = document.getElementById('subnetInput');
    const bitsValue = subnetInput.value.trim();
    const bits = parseInt(bitsValue);

    const ipInput = document.getElementById('ipInput').value.trim();
    if (validateIP(ipInput)) {
        values = parseIP(ipInput);
        calculateClasses(); 
    }

    if (bitsValue === "") {
        subnetInput.classList.remove('valid', 'invalid');
        return;
    }

    if (!isNaN(bits) && validateBits(bits)) {
        subnetInput.classList.remove('invalid');
        subnetInput.classList.add('valid');
    } else {
        subnetInput.classList.remove('valid');
        subnetInput.classList.add('invalid');
    }
}

//function used to add a default number of bits for each class
function emptySubnetInput(ip){
    const parsed = parseIP(ip);
    const firstOctet = parsed[0];

    if (firstOctet >= 0 && firstOctet <= 127) {
        subnetInput.value = "8";
    } else if (firstOctet >= 128 && firstOctet <= 191) {
        subnetInput.value = "16";
    } else if (firstOctet >= 192 && firstOctet <= 223) {
        subnetInput.value = "24";
    } else {
        subnetInput.value = "";
    }
}

//function used to validate the IP number
function validateIP(ip) {
    const regex = /^(25[0-5]|2[0-4][0-9]|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4][0-9]|1\d{2}|[1-9]?\d)){3}$/;
    return regex.test(ip);
}

//function used to separate the ip in octects
function parseIP(ip) {
    return ip.split('.').map(Number);
}

//function used to calculate the IP
function calculate(){
    values = [];

    const ipInput = document.getElementById('ipInput').value.trim();

    if(!validateIP(ipInput)){
        alert("Por favor, ingresa una IP válida.");
        return;
    }

    values = parseIP(ipInput);

    showResults();

}

//function used to show the results
function showResults(){

    let previousResult = document.getElementById('results');
    if (previousResult) {
        previousResult.remove();
    }

    calculateClasses();
    calculateSubnet();
    calculateWildCard();
    calculateNet();
    calculateBroadcast();

    const resultsDiv = document.createElement('div');
    resultsDiv.id = 'results';

    const intDiv = document.createElement('div');
    intDiv.id = 'intResults';

    const binaryDiv = document.createElement('div');
    binaryDiv.id = 'binaryResults';

    const locationDot = document.createElement('i');
    locationDot.classList.add("fa-solid", "fa-globe");
    locationDot.style.color = "#1e90ff";

    const ipText = document.createElement('p');
    const ipvalue = values.join('.');
    ipText.appendChild(locationDot);
    ipText.appendChild(document.createTextNode(` ${ipvalue}`));
    intDiv.appendChild(ipText);

    document.querySelector('main').appendChild(resultsDiv);

    const subnetText = document.createElement('p');
    subnetText.textContent = `Subnet: ${subnet}`;
    intDiv.appendChild(subnetText);

    const wildCarText = document.createElement('p');
    wildCarText.appendChild(document.createTextNode(`Wildcard: ${wildCard}`));
    intDiv.appendChild(wildCarText);

    const netText = document.createElement('p');
    netText.id = 'netDecimalText';
    netText.textContent = `Net: ${net}`;
    intDiv.appendChild(netText);

    const broadcastText = document.createElement('p');
    broadcastText.textContent = `Broadcast: ${broadcast}`;
    intDiv.appendChild(broadcastText);

    binarySubnet = changeToBinary(subnet);
    binaryWildCard = changeToBinary(wildCard)
    calculateHostsAvaiable();

    const hostsText = document.createElement('p');
    hostsText.appendChild(document.createTextNode(`Hosts: ${hosts}`));
    intDiv.appendChild(hostsText);

    const classText = document.createElement('p');
    classText.textContent = `IP class: ${classes}`;
    intDiv.appendChild(classText);

    const ipPrivate = isPrivateIP(values);
    const ipPublic = document.createElement('p');
    ipPublic.textContent = `Net type: ${ipPrivate ? 'Private' : 'Public'}`;
    intDiv.appendChild(ipPublic);

    const binaryIp = document.createElement('p');
    binaryIp.textContent = changeToBinary(ipvalue);
    binaryDiv.appendChild(binaryIp);

    const binarySubnetText = document.createElement('p');
    binarySubnetText.textContent = binarySubnet;

    const binaryWildcardText = document.createElement('p');
    binaryWildcardText.textContent = binaryWildCard;

    binaryDiv.append(binarySubnetText,binaryWildcardText);

    const binaryNetText = document.createElement('p');
    binaryNetText.id = 'netText';
    binaryNetText.textContent = changeToBinary(net);
    binaryDiv.appendChild(binaryNetText);

    const binaryBroadcastText = document.createElement('p');
    binaryBroadcastText.textContent = changeToBinary(broadcast);
    binaryDiv.appendChild(binaryBroadcastText);

    resultsDiv.append(intDiv,binaryDiv);

    colorizeNet();
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
    } else if (octect1 >= 240 && octect1 <= 255) {
        classes = "Class E";
    } else {
        classes = "Invalid IP class";
    }
};

//function used to know the subnet for each class
function calculateSubnet() {
    const subnetInput = document.getElementById('subnetInput');
    const bitsValue = subnetInput.value.trim();

    const bits = parseInt(bitsValue);

    if (!isNaN(bits) && validateBits(bits)) {
        subnet = bitsToSubnet(bits);
    } else {
        if (classes === "Class D" || classes === "Class E") {
            subnet = "not applicable";
            alert("Las clases D y E no están destinadas a subredes.");
        } else {
            alert("Por favor, ingresa un número de bits válido para la clase " + classes);
        }
    }
}

//function used to validate the bits
function validateBits(bits){
    if (isNaN(bits) || bits < 1 || bits > 30) {
        return false;
    }

    switch (classes) {
        case "Class A":
            return bits >= 8 && bits <= 30;
        case "Class B":
            return bits >= 16 && bits <= 30;
        case "Class C":
            return bits >= 24 && bits <= 30;
    }
}

//function used to transform the inputSubnet into a subnet
function bitsToSubnet(bits) {
    let mask = ''.padStart(bits, '1').padEnd(32, '0');
    const octets = mask.match(/.{1,8}/g).map(bin => parseInt(bin, 2));
    return octets.join('.');
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