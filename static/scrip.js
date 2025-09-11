const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const confirmPassword = document.getElementById('confirm_password');

const LOGIN_URL = "/api/login";
const REGISTER_URL = "/api/register";

// Determinar se estamos na página de login ou registro
const isRegisterPage = window.location.pathname.includes('register');

// Função para mostrar alertas
function showAlert(message, type) {
    // Remove alertas anteriores
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;

    // Adiciona estilos básicos
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        ${type === 'success' ? 'background-color: #4CAF50;' : 'background-color: #f44336;'}
    `;

    document.body.appendChild(alertDiv);

    // Remove o alerta após 5 segundos
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.parentNode.removeChild(alertDiv);
        }
    }, 5000);
}

function hideAlert() {
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
}

function checkInputs() {
    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value.trim();

    if (emailValue !== '' && passwordValue !== '') {
        loginBtn.classList.add('active');
    } else {
        loginBtn.classList.remove('active');
    }
}

function checkPasswords() {
    if (!isRegisterPage || !confirmPassword) {
        return true;
    }

    const passwordValue = passwordInput.value.trim();
    const confirmValue = confirmPassword.value.trim();

    if (confirmValue !== passwordValue) {
        showAlert("As senhas não coincidem", "error");
        return false;
    }
    return true;
}

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Event listeners
emailInput.addEventListener('input', checkInputs);
passwordInput.addEventListener('input', checkInputs);
if (confirmPassword) {
    confirmPassword.addEventListener('input', checkInputs);
}

loginBtn.addEventListener('click', async function() {
    if (!this.classList.contains('active')) {
        showAlert("Preencha todos os campos!", "error");
        return;
    }

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!validarEmail(email)) {
        showAlert("Digite um e-mail válido!", "error");
        return;
    }

    // Para registro, verificar se as senhas coincidem
    if (isRegisterPage && !checkPasswords()) {
        return;
    }

    // Monta o JSON
    const data = { email, password };

    try {
        const url = isRegisterPage ? REGISTER_URL : LOGIN_URL;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            showAlert(result.message || (isRegisterPage ? "Conta criada com sucesso!" : "Login realizado com sucesso!"), "success");

            // Redirecionar após sucesso
            if (isRegisterPage) {
                // Após registro bem-sucedido, redirecionar para login
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else {
                // Após login bem-sucedido, redirecionar para dashboard
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 1500);
            }
        } else {
            showAlert(result.message || "Erro ao processar solicitação", "error");
        }
    } catch (error) {
        console.error("Erro:", error);
        showAlert("Erro de conexão com o servidor", "error");
    }
});

// Inicializar verificação de inputs
checkInputs();
