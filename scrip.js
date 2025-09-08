
document.addEventListener('DOMContentLoaded', function() {
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');

function checkInputs() {
    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value.trim();
    
    if (emailValue !== '' && passwordValue !== '') {
        loginBtn.classList.add('active');
    } else {
        loginBtn.classList.remove('active');
    }
}


emailInput.addEventListener('input', checkInputs);
passwordInput.addEventListener('input', checkInputs);


loginBtn.addEventListener('click', function() {
    if (this.classList.contains('active')) {
        alert('Login realizado com sucesso!');
        
    }
});
});