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
});

//function used to validate the input
function validateIPInput(){
    const ipInput = document.getElementById('ipInput');
    const ip =ipInput.value.trim();

        if (validateIP(ip)) {
        ipInput.classList.remove('invalid');
        ipInput.classList.add('valid');
    } else {
        ipInput.classList.remove('valid');
        ipInput.classList.add('invalid');
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

    calculateClasses();
    calculateSubnet();

    const subnetText = document.createElement('p');
    subnetText.textContent = `Subnet: ${subnet}`;
    intDiv.appendChild(subnetText);

    calculateWildCard();

    const wildCarText = document.createElement('p');
    wildCarText.appendChild(document.createTextNode(`Wildcard: ${wildCard}`));
    intDiv.appendChild(wildCarText);

    calculateNet();

    const netText = document.createElement('p');
    netText.textContent = `Net: ${net}`;
    intDiv.appendChild(netText);

    calculateBroadcast();

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
    binaryNetText.textContent = changeToBinary(net);
    binaryDiv.appendChild(binaryNetText);

    const binaryBroadcastText = document.createElement('p');
    binaryBroadcastText.textContent = changeToBinary(broadcast);
    binaryDiv.appendChild(binaryBroadcastText);

    resultsDiv.append(intDiv,binaryDiv);
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
    const hostsBits = 32 -maskBits;
    hosts = Math.pow(2,hostsBits)-2;
}

//function used to change chains to binary
function changeToBinary(chain){
    if (!validateIP(chain)) return null;

    return chain
        .split('.')
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