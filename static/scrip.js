const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');

// Função para ativar/desativar o botão
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

// Validação de email
function validarEmail(email) {
const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
return regex.test(email);
}

// Clique no botão de login
loginBtn.addEventListener('click', async function() {
if (!this.classList.contains('active')) {
    alert("Preencha todos os campos!");
    return;
}

const email = emailInput.value.trim();
const password = passwordInput.value.trim();

if (!validarEmail(email)) {
    alert("Digite um e-mail válido!");
    return;
}

// Monta o JSON
const data = { email, password };

try {
    const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    const result = await response.json();
    alert(result.message);
} catch (error) {
    alert("Credenciais inválidas");
    console.error(error);
}
});
