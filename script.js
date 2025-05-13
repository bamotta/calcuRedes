
function startValidationOctects() {
  const octetos = ['octect1', 'octect2', 'octect3', 'octect4'];
  octetos.forEach(id => {
    const input = document.getElementById(id);
    input.addEventListener('input', () => validationOctect(input));
  });
}

function validationOctect(input){
    const valor = parseInt(input.value,10);
    input.style.borderColor = (!isNaN(valor) && valor >= 0 && valor <= 255) ? 'green' : 'red';
}

window.addEventListener('DOMContentLoaded', startValidationOctects);

function calculate(){

}