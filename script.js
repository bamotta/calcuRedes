var classes;

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



