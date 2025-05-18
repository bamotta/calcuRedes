var values = [];
var classes;
var subnet;
var wildCard;
var binarySubnet;
var binaryWildCard;
var net;
var broadcast;
var hosts;
var subnetNumber;
var calculatedSubnets;

//we charge the DOM before doing this actions
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('calculate').addEventListener('click', calculate);
    document.getElementById('ipInput').addEventListener('input',validateIPInput);
    document.getElementById('subnetInput').addEventListener('input', validateBitsInput);
    
    fetch("https://api64.ipify.org?format=json")
    .then(response => response.json())
    .then(data => {
        const ipInput = document.getElementById("ipInput");
        if (ipInput && data.ip) {
            ipInput.value = data.ip;
            validateIPInput();
        }
    })
    .catch(error => {
        console.error("No se pudo obtener la IP pública:", error);
    });
});

//function used to validate the subnet mask
function validateSubnetMask(mask){
    const parts = mask.split('.').map(Number);
    if (parts.length !== 4 || parts.some(p => p < 0 || p > 255)) return false;
    let binary = parts.map(p => p.toString(2).padStart(8, '0')).join('');
    return /^1*0*$/.test(binary);
}

//function used to know the number of bits from a mask
function maskToCIDR(mask) {
    return mask.split('.')
        .map(octet => parseInt(octet).toString(2))
        .join('')
        .split('1').length - 1;
}

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
function calculate() {
    values = [];

    const ipInput = document.getElementById('ipInput').value.trim();
    const bitsValue = document.getElementById('subnetInput').value.trim();
    const maskValue = document.getElementById('maskInput').value.trim();

    if (!validateIP(ipInput)) {
        alert("Por favor, ingresa una IP válida.");
        return;
    }

    values = parseIP(ipInput);

    calculateClasses();
    const isClassDE = (classes === "Class D" || classes === "Class E");
    if (isClassDE) {
        alert("Las clases D y E no están destinadas a subredes. Se mostrará información limitada.");
        subnet = "no aplicable";
        wildCard = "no aplicable";
        net = "no aplicable";
        broadcast = "no aplicable";
        hosts = "no aplicable";
        subnetNumber = "no aplicable";
        calculatedSubnets = [];

        const oldDiv = document.getElementById('subnetSummary');
        if (oldDiv) {
            oldDiv.remove();
        }

        showResults();
        return;
    }


    const hasBits = bitsValue !== "";
    const hasMask = maskValue !== "";

    let bits = null;
    let mask = null;

    //both
    if (hasBits && hasMask) {
        bits = parseInt(bitsValue);
        if (!validateBits(bits)) {
            alert("Bits inválidos para la clase " + classes);
            return;
        }
        if (!validateSubnetMask(maskValue)) {
            alert("Máscara no válida.");
            return;
        }
        const maskBits = maskToCIDR(maskValue);
        if (maskBits !== bits) {
            alert("Los bits y la máscara no coinciden.");
            return;
        }
        subnet = maskValue;
    }

    // only bits
    else if (hasBits) {
        bits = parseInt(bitsValue);
        if (!validateBits(bits)) {
            alert("Bits inválidos para la clase " + classes);
            return;
        }
        subnet = bitsToSubnet(bits);
    }

    // only mask
    else if (hasMask) {
        if (!validateSubnetMask(maskValue)) {
            alert("Máscara no válida.");
            return;
        }
        bits = maskToCIDR(maskValue);
        if (!validateBits(bits)) {
            alert("La máscara no es válida para la clase " + classes);
            return;
        }
        subnet = maskValue;
    }

    //empty
    else {
        alert("Debes introducir bits o una máscara válida.");
        return;
    }

    calculatedSubnets = calculateSubnets(ipInput, subnet);
    showResults();
    displaySubnets(calculatedSubnets);


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
    calculateSubnetNumber();

    const hostMin = calculateHostMin();
    const hostMax = calculateHostMax();

    const resultsDiv = document.createElement('div');
    resultsDiv.id = 'results';

    document.querySelector('main').appendChild(resultsDiv);

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


    const subnetText = document.createElement('p');
    subnetText.innerHTML = `<strong>Subnet:</strong> ${subnet}`;
    intDiv.appendChild(subnetText);

    const wildCarText = document.createElement('p');
    wildCarText.innerHTML = `<strong>Wildcard:</strong> ${wildCard}`;
    intDiv.appendChild(wildCarText);

    const netText = document.createElement('p');
    netText.id = 'netDecimalText';
    netText.innerHTML = `<strong>Net:</strong> ${net}`;
    intDiv.appendChild(netText);

    const broadcastText = document.createElement('p');
    broadcastText.innerHTML = `<strong>Broadcast:</strong> ${broadcast}`;
    intDiv.appendChild(broadcastText);

    binarySubnet = changeToBinary(subnet);
    binaryWildCard = changeToBinary(wildCard)
    calculateHostsAvaiable();

    const hostMinText = document.createElement('p');
    hostMinText.innerHTML = `<strong>minHost:</strong> ${hostMin}`;
    intDiv.appendChild(hostMinText);

    const hostMaxText = document.createElement('p');
    hostMaxText.innerHTML = `<strong>maxHost:</strong> ${hostMax}`;
    intDiv.appendChild(hostMaxText);

    const hostsText = document.createElement('p');
    hostsText.innerHTML = `<strong>Hosts:</strong> ${hosts}`;
    intDiv.appendChild(hostsText);

    const subnetNumberText = document.createElement('p');
    subnetNumberText.innerHTML = `<strong>Number of Subnets:</strong> ${subnetNumber}`;
    intDiv.appendChild(subnetNumberText);

    const classText = document.createElement('p');
    classText.innerHTML = `<strong>IP class:</strong> ${classes}`;
    intDiv.appendChild(classText);

    const hexIp = changeToHex(ipvalue);
    const hexIpText = document.createElement('p');
    hexIpText.innerHTML = `<strong>Hex IP:</strong> ${hexIp}`;
    intDiv.appendChild(hexIpText);

    const ipPrivate = isPrivateIP(values);
    const ipPublic = document.createElement('p');
    ipPublic.innerHTML = `<strong>Net type:</strong> ${ipPrivate ? 'Private' : 'Public'}`;
    intDiv.appendChild(ipPublic);

    const binaryIpText = document.createElement('p');
    const binaryIp = changeToBinary(ipvalue);
    const bitsInput = document.getElementById('subnetInput').value.trim();
    let inputBits = parseInt(bitsInput);
    if (isNaN(inputBits)) {
        inputBits = maskToCIDR(subnet);
    }
    const defaultBits = getBits();
    binaryIpText.innerHTML = `${colorizeBinaryIP(binaryIp, {
        red: defaultBits,
        subred: inputBits - defaultBits
    })}`;


    binaryDiv.appendChild(binaryIpText);

    binarySubnet = subnet !== "not applicable" ? changeToBinary(subnet) : "not applicable";
    binaryWildCard = wildCard !== "not applicable" ? changeToBinary(wildCard) : "not applicable";

    const binarySubnetText = document.createElement('p');
    binarySubnetText.textContent = `${binarySubnet}`;

    const binaryWildcardText = document.createElement('p');
    binaryWildcardText.textContent = `${binaryWildCard}`;

    binaryDiv.append(binarySubnetText, binaryWildcardText);

    const binaryNetText = document.createElement('p');
    binaryNetText.id = 'netText';
    const binaryNet = net !== "not applicable" ? changeToBinary(net) : "not applicable";
    binaryNetText.textContent = `${binaryNet}`;
    binaryDiv.appendChild(binaryNetText);

    const binaryBroadcastText = document.createElement('p');
    const binaryBroadcast = broadcast !== "not applicable" ? changeToBinary(broadcast) : "not applicable";
    binaryBroadcastText.textContent = `${binaryBroadcast}`;
    binaryDiv.appendChild(binaryBroadcastText);

    resultsDiv.append(intDiv, binaryDiv);

    colorizeNet();
}

//function used to show the info of the subnet
function displaySubnets(subnets) {
    if (!Array.isArray(subnets) || subnets.length === 0) {
    subnetDiv.innerHTML = "<p>No hay subredes para mostrar.</p>";
    return;
    }

    let oldDiv = document.getElementById('subnetSummary');
    if (oldDiv) {
        oldDiv.remove();
    }
    const subnetDiv = document.createElement('div');
    subnetDiv.id = 'subnetSummary';
    document.querySelector('main').appendChild(subnetDiv);
    subnetDiv.innerHTML = "";

    if (!Array.isArray(subnets)) return;

    const maxToShow = 8;
    const totalSubnets = subnets.length;

    subnets.slice(0,maxToShow).forEach((s, i) => {
        subnetDiv.innerHTML += `
            <div class="subnet">
                <h3><i class="fa-solid fa-globe"></i> Subred ${i + 1}</h3>
                    <p><strong>Dirección de red:</strong> ${s.network}</p>
                    <p><strong>Máscara:</strong> ${s.mask}</p>
                    <p><strong>Wildcard:</strong> ${s.wildcard}</p>
                    <p><strong>Broadcast:</strong> ${s.broadcast}</p>
                    <p><strong>Host Mínimo:</strong> ${s.hostMin}</p>
                    <p><strong>Host Máximo:</strong> ${s.hostMax}</p>
                    <p><strong>Nº de Hosts:</strong> ${s.hosts}</p>

            </div>
        `;
    });

    if (totalSubnets > maxToShow) {
        const restantes = totalSubnets - maxToShow;
        subnetDiv.innerHTML += `<p><em>And ${restantes} more subnets...</em></p>`;
    }

}


//function used to calculate the info of the subnets
function calculateSubnets(ip, mask) {
    const ipParts = ip.split('.').map(Number);
    const maskParts = mask.split('.').map(Number);
    const cidr = maskToCIDR(mask);
    const totalHosts = Math.pow(2, 32 - cidr);
    const hostsPerSubnet = totalHosts - 2;

    const subnets = [];

    const increment = totalHosts;
    let current = (ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3];

    calculateSubnetNumber()
    const numberOfSubnets = subnetNumber;

    for (let i = 0; i < numberOfSubnets; i++) {
        const network = current;
        const broadcast = current + increment - 1;
        const hostMin = network + 1;
        const hostMax = broadcast - 1;

        subnets.push({
            network: intToIP(network),
            broadcast: intToIP(broadcast),
            hostMin: intToIP(hostMin),
            hostMax: intToIP(hostMax),
            mask: mask,
            wildcard: calculateWildcardFromMask(mask),
            hosts: hostsPerSubnet
        });

        current += increment;
    }

    return subnets;
}

//function used to transform an int into a IP format number
function intToIP(int) {
    return [
        (int >> 24) & 255,
        (int >> 16) & 255,
        (int >> 8) & 255,
        int & 255
    ].join('.');
}

//function used to calculate the wild card from the mask
function calculateWildcardFromMask(mask) {
    return mask.split('.')
        .map(o => 255 - parseInt(o))
        .join('.');
}


//function used to calculate the corresponding class
function calculateClasses() {
    const octect1 = values[0];

    if (classes === "Class D" || classes === "Class E") {
        return;
    }

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
        subnet = "not applicable"; 
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
        default: return false;
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

//function used to change decimal numbers into hexadecimal
function changeToHex(chain) {
    if (!validateIP(chain)) return null;
    return chain
        .split('.')
        .map(octet => parseInt(octet, 10).toString(16).padStart(2, '0').toUpperCase())
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

//function used to calculate the number of subnets

function calculateSubnetNumber() {
    const bits = maskToCIDR(subnet);
    const defaultBits = getBits();
    subnetNumber = Math.pow(2, bits - defaultBits);
    return subnetNumber;
}


//function used to know the default number of bits for each class
function getBits(){
    switch (classes) {
        case "Class A":
            return 8;
        case "Class B":
            return 16;
        case "Class C":
            return 24;
        default: return 0;
    }
}

//function used to calculate the minimun host
function calculateHostMin() {
    if (net === "not applicable") {
        return "not applicable";
    }

    const netParts = net.split('.').map(Number);
    netParts[3] += 1; 
    return netParts.join('.');
}

//function used to calculate the maximun hosts
function calculateHostMax() {
    if (broadcast === "not applicable") {
        return "not applicable";
    }

    const broadcastParts = broadcast.split('.').map(Number);
    broadcastParts[3] -= 1;
    return broadcastParts.join('.');
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
        netDecimalElement.innerHTML = `<strong>Net:</strong> ${coloredDecimalNet}`;
    }
    const netTextElement = document.querySelector('#netText');
    if (netTextElement) {
        netTextElement.innerHTML = `${coloredBinaryNet}`;
    }
}

//function used to colorize the binary ip depending on each part
function colorizeBinaryIP(binaryIP, bits) {
  const totalBits = 32;

  // Define number of bits for each part
  const redBits = bits?.red || 0;
  const subredBits = bits?.subred || 0;
  const hostBits = totalBits - redBits - subredBits;

  // Remove dots to get a plain binary string
  const binary = binaryIP.replace(/\./g, '');

  // Create a color map for each bit
  const colorMap = [];
  for (let i = 0; i < redBits; i++) colorMap.push('red');
  for (let i = 0; i < subredBits; i++) colorMap.push('orange');
  for (let i = 0; i < hostBits; i++) colorMap.push('green');

  // Build colored binary string with dots between octets
  let result = '';
  let currentColor = '';
  for (let i = 0; i < binary.length; i++) {
    // Insert dot every 8 bits (i > 0 to avoid leading dot)
    if (i > 0 && i % 8 === 0) {
      result += '</span>.'; // Close current span before the dot
      currentColor = '';    // Force span to reopen after dot
    }

    // Change span if color is different
    const bitColor = colorMap[i];
    if (bitColor !== currentColor) {
      if (currentColor !== '') {
        result += '</span>';
      }
      result += `<span style="color:${bitColor}">`;
      currentColor = bitColor;
    }

    // Add the current bit
    result += binary[i];
  }

  // Close the last open span
  result += '</span>';
  return result;
}


