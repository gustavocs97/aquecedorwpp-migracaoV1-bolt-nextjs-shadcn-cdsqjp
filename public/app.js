document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    const loginContainer = document.getElementById('login-container');
    const dashboardContainer = document.getElementById('dashboard-container');
    const navTabs = document.getElementById('nav-tabs');
    const logoutButton = document.getElementById('logoutButton');
    const tabContent = document.getElementById('tab-content');

    loginForm.addEventListener('submit', handleLogin);
    logoutButton.addEventListener('click', handleLogout);
    navTabs.addEventListener('click', handleTabNavigation);

    checkAuthentication();

    async function handleLogin(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('authToken', data.token);
                loginContainer.style.display = 'none';
                dashboardContainer.style.display = 'block';
                logoutButton.style.display = 'block';
                switchTab('overview');
            } else {
                loginError.textContent = data.message || 'Erro ao efetuar login';
            }
        } catch (error) {
            console.error('Erro ao efetuar login:', error);
            loginError.textContent = 'Erro ao efetuar login';
        }
    }

    async function handleLogout() {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            localStorage.removeItem('authToken');
            loginContainer.style.display = 'block';
            dashboardContainer.style.display = 'none';
            logoutButton.style.display = 'none';
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    }

    function handleTabNavigation(event) {
        if (event.target.tagName === 'A') {
            event.preventDefault();
            const tabName = event.target.getAttribute('data-tab');
            switchTab(tabName);
        }
    }

    function switchTab(tabName) {
        const links = navTabs.querySelectorAll('a');
        links.forEach(link => link.classList.remove('active'));

        const activeLink = navTabs.querySelector(`a[data-tab="${tabName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        loadTabContent(tabName);
    }

    async function loadTabContent(tabName) {
        tabContent.innerHTML = '<p>Carregando...</p>';

        try {
            let content = '';
            switch (tabName) {
                case 'overview':
                    content = await loadOverview();
                    break;
                case 'instances':
                    content = await loadInstances();
                    break;
                case 'history':
                    content = await loadHistory();
                    break;
                case 'flows':
                    content = await loadFlows();
                    break;
                case 'admin':
                    content = await loadAdmin();
                    break;
                default:
                    content = '<p>Conteúdo não disponível</p>';
            }
            tabContent.innerHTML = content;
        } catch (error) {
            console.error(`Erro ao carregar conteúdo da aba ${tabName}:`, error);
            tabContent.innerHTML = `<p>Erro ao carregar conteúdo: ${error.message}</p>`;
        }
    }

    async function loadOverview() {
        const response = await fetch('/api/dashboard/overview');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return `
            <h2>Visão Geral</h2>
            <div class="row">
                <div class="col-md-4">
                    <p><strong>Total de Instâncias:</strong> ${data.totalInstances}</p>
                    <p><strong>Conectadas:</strong> ${data.connected}</p>
                </div>
                <div class="col-md-4">
                    <p><strong>Desconectadas:</strong> ${data.disconnected}</p>
                    <p><strong>Total de Mensagens Enviadas:</strong> ${data.totalMessagesSent}</p>
                </div>
            </div>
        `;
    }

    async function loadInstances() {
        const response = await fetch('/api/instances');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const instances = await response.json();
        return `
            <h2>Instâncias</h2>
            <table class="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Telefone</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${instances.map(instance => `
                        <tr>
                            <td>${instance.id}</td>
                            <td>${instance.name}</td>
                            <td>${instance.phoneNumber}</td>
                            <td>${instance.status}</td>
                            <td>
                                <button class="btn btn-sm btn-primary edit-instance" data-id="${instance.id}">Editar</button>
                                <button class="btn btn-sm btn-danger delete-instance" data-id="${instance.id}">Excluir</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    async function loadHistory() {
        const response = await fetch('/api/history');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const history = await response.json();
        return `
            <h2>Histórico de Aquecimento</h2>
            <table class="table">
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Instância</th>
                        <th>Total de Mensagens</th>
                    </tr>
                </thead>
                <tbody>
                    ${history.map(entry => `
                        <tr>
                            <td>${entry.date}</td>
                            <td>${entry.instanceId}</td>
                            <td>${entry.totalMessages}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    async function loadFlows() {
        const response = await fetch('/api/flows');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const flows = await response.json();
        return `
            <h2>Fluxos</h2>
            <button id="addFlowButton" class="btn btn-success mb-3">Adicionar Fluxo</button>
            <div id="flowContainer">
                ${flows.map(flow => `
                    <div class="card mb-3">
                        <div class="card-body">
                            <h5 class="card-title">${flow.name}</h5>
                            <p class="card-text">Duração: ${flow.duration} minutos</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    async function loadAdmin() {
        const response = await fetch('/api/admin/users');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const users = await response.json();
        return `
            <h2>Administração de Usuários</h2>
            <button id="addUserButton" class="btn btn-success mb-3">Adicionar Novo Usuário</button>
            <table class="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Usuário</th>
                        <th>Papel</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${users.map(user => `
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.username}</td>
                            <td>${user.role}</td>
                            <td>
                                <button class="btn btn-sm btn-primary edit-user" data-id="${user.id}">Editar</button>
                                <button class="btn btn-sm btn-danger delete-user" data-id="${user.id}">Excluir</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    function checkAuthentication() {
        const token = localStorage.getItem('authToken');
        if (token) {
            loginContainer.style.display = 'none';
            dashboardContainer.style.display = 'block';
            logoutButton.style.display = 'block';
            switchTab('overview');
        } else {
            loginContainer.style.display = 'block';
            dashboardContainer.style.display = 'none';
            logoutButton.style.display = 'none';
        }
    }
});