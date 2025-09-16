// Elementos DOM
const viewMode = document.getElementById('view-mode');
const editMode = document.getElementById('edit-mode');
const editBtn = document.getElementById('edit-btn');
const cancelEditBtn = document.getElementById('cancel-edit-btn');
const updateForm = document.getElementById('update-form');
const deleteBtn = document.getElementById('delete-btn');
const deleteModal = document.getElementById('delete-modal');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
const deleteForm = document.getElementById('delete-form');
const alertContainer = document.getElementById('alert-container');

// URLs da API
const UPDATE_URL = "/api/user/update";
const DELETE_URL = "/api/user/delete";
const USER_INFO_URL = "/api/user";

// Função para mostrar alertas (mesmo padrão do login)
function showAlert(message, type) {
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; color: white; font-size: 1.2rem; cursor: pointer; margin-left: 10px;">&times;</button>
    `;

    document.body.appendChild(alertDiv);

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

// Função para validar email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Alternar para modo de edição
editBtn.addEventListener('click', () => {
    viewMode.classList.add('hidden');
    editMode.classList.remove('hidden');
});

// Cancelar edição
cancelEditBtn.addEventListener('click', () => {
    editMode.classList.add('hidden');
    viewMode.classList.remove('hidden');
    updateForm.reset();
    // Restaurar valor original do email
    document.getElementById('new-email').value = document.getElementById('display-email').textContent;
});

// Atualizar usuário
updateForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newEmail = document.getElementById('new-email').value.trim();
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;

    // Validações
    if (!validarEmail(newEmail)) {
        showAlert("Digite um e-mail válido!", "error");
        return;
    }

    // Se está tentando alterar senha, senha atual é obrigatória
    if (newPassword && !currentPassword) {
        showAlert("Senha atual é obrigatória para alterar a senha!", "error");
        return;
    }

    const formData = {
        email: newEmail,
        current_password: currentPassword,
        new_password: newPassword
    };

    try {
        const response = await fetch(UPDATE_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            showAlert(data.message || "Perfil atualizado com sucesso!", "success");

            // Atualizar display
            document.getElementById('display-email').textContent = data.user.email;
            document.getElementById('user-email').textContent = data.user.email;

            // Voltar para modo visualização
            editMode.classList.add('hidden');
            viewMode.classList.remove('hidden');
            updateForm.reset();
        } else {
            showAlert(data.message || "Erro ao atualizar perfil", "error");
        }
    } catch (error) {
        console.error("Erro:", error);
        showAlert("Erro de conexão com o servidor", "error");
    }
});

// Mostrar modal de deletar
deleteBtn.addEventListener('click', () => {
    deleteModal.classList.remove('hidden');
    document.getElementById('delete-password').focus();
});

// Esconder modal de deletar
cancelDeleteBtn.addEventListener('click', () => {
    deleteModal.classList.add('hidden');
    document.getElementById('delete-password').value = '';
});

// Fechar modal clicando fora
deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
        deleteModal.classList.add('hidden');
        document.getElementById('delete-password').value = '';
    }
});

// Confirmar deleção
confirmDeleteBtn.addEventListener('click', async () => {
    const password = document.getElementById('delete-password').value;

    if (!password) {
        showAlert("Digite sua senha para confirmar a exclusão!", "error");
        return;
    }

    // Confirmação extra
    if (!confirm("Tem certeza absoluta que deseja deletar sua conta? Esta ação é irreversível!")) {
        return;
    }

    try {
        const response = await fetch(DELETE_URL, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password })
        });

        const data = await response.json();

        if (response.ok) {
            showAlert(data.message || "Conta deletada com sucesso!", "success");
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        } else {
            showAlert(data.message || "Erro ao deletar conta", "error");
        }
    } catch (error) {
        console.error("Erro:", error);
        showAlert("Erro de conexão com o servidor", "error");
    }
});

// Atualizar informações do usuário
document.getElementById('refresh-info-btn').addEventListener('click', async () => {
    try {
        const response = await fetch(USER_INFO_URL);
        const data = await response.json();

        if (response.ok) {
            showAlert("Informações atualizadas com sucesso!", "success");
            // Poderia atualizar mais campos aqui se necessário
        } else {
            showAlert(data.message || "Erro ao atualizar informações", "error");
        }
    } catch (error) {
        console.error("Erro:", error);
        showAlert("Erro de conexão com o servidor", "error");
    }
});

// Botão alterar senha (shortcut para modo edição)
document.getElementById('change-password-btn').addEventListener('click', () => {
    viewMode.classList.add('hidden');
    editMode.classList.remove('hidden');
    document.getElementById('current-password').focus();
});

// Botão baixar dados (simulado)
document.getElementById('download-data-btn').addEventListener('click', () => {
    const userData = {
        email: document.getElementById('display-email').textContent,
        downloadDate: new Date().toISOString(),
        note: "Dados exportados do sistema de usuários"
    };

    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'meus_dados.json';
    link.click();

    showAlert("Dados baixados com sucesso!", "success");
});

// Atualizar timestamp do último login
document.getElementById('last-login').textContent = new Date().toLocaleString('pt-BR');

// Teclas de atalho
document.addEventListener('keydown', (e) => {
    // ESC para fechar modal
    if (e.key === 'Escape') {
        if (!deleteModal.classList.contains('hidden')) {
            deleteModal.classList.add('hidden');
            document.getElementById('delete-password').value = '';
        }

        // Cancelar edição se estiver editando
        if (!editMode.classList.contains('hidden')) {
            cancelEditBtn.click();
        }
    }

    // Ctrl+E para editar
    if (e.ctrlKey && e.key === 'e' && !editMode.classList.contains('hidden') === false) {
        e.preventDefault();
        editBtn.click();
    }

    // Ctrl+S para salvar (apenas se estiver no modo edição)
    if (e.ctrlKey && e.key === 's' && !editMode.classList.contains('hidden')) {
        e.preventDefault();
        updateForm.dispatchEvent(new Event('submit'));
    }
});

// Animação de loading para botões
function addLoadingToButton(button, originalText) {
    button.disabled = true;
    button.innerHTML = `<span class="loading"></span> Processando...`;

    return () => {
        button.disabled = false;
        button.innerHTML = originalText;
    };
}

// Melhorar UX dos botões com loading
const originalSubmitHandler = updateForm.onsubmit;
updateForm.addEventListener('submit', (e) => {
    const submitBtn = updateForm.querySelector('button[type="submit"]');
    const resetLoading = addLoadingToButton(submitBtn, 'Salvar');

    // Resetar loading após um tempo (o fetch já vai lidar com isso)
    setTimeout(resetLoading, 5000);
});

const originalDeleteHandler = confirmDeleteBtn.onclick;
confirmDeleteBtn.addEventListener('click', (e) => {
    const resetLoading = addLoadingToButton(confirmDeleteBtn, 'Deletar Conta');

    // Resetar loading após um tempo
    setTimeout(resetLoading, 5000);
});

// Validação em tempo real do email
document.getElementById('new-email').addEventListener('input', (e) => {
    const email = e.target.value.trim();
    const emailField = e.target;

    if (email && !validarEmail(email)) {
        emailField.style.borderColor = '#f44336';
        emailField.style.boxShadow = '0 0 10px rgba(244, 67, 54, 0.3)';
    } else {
        emailField.style.borderColor = '';
        emailField.style.boxShadow = '';
    }
});

// Animação inicial da página
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 150);
    });
});

// Auto-hide alerts quando nova ação é executada
const originalFetch = window.fetch;
window.fetch = function(...args) {
    // Esconder alertas existentes antes de nova requisição
    hideAlert();
    return originalFetch.apply(this, args);
};

console.log('Dashboard carregado com sucesso!');
