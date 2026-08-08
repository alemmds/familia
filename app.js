// ===== App Configuration =====
const APP_NAME = 'Familia Finanças';
const STORAGE_KEYS = {
    NOTES: 'familia_notes',
    EXPENSES: 'familia_expenses',
    INCOMES: 'familia_incomes',
    THEME: 'familia_theme',
    LAST_SYNC: 'familia_last_sync'
};

// ===== State =====
let state = {
    notes: [],
    expenses: [],
    incomes: [],
    currentTheme: 'light',
    currentNoteId: null,
    currentExpenseId: null,
    currentIncomeId: null,
    charts: {}
};

// ===== DOM Elements =====
const elements = {
    // Tabs
    tabs: document.querySelectorAll('.nav-tab'),
    tabContents: document.querySelectorAll('.tab-content'),
    
    // Notes
    notesGrid: document.getElementById('notesGrid'),
    addNoteBtn: document.getElementById('addNoteBtn'),
    noteSearch: document.getElementById('noteSearch'),
    noteModal: document.getElementById('noteModal'),
    noteForm: document.getElementById('noteForm'),
    noteModalTitle: document.getElementById('noteModalTitle'),
    closeNoteModal: document.getElementById('closeNoteModal'),
    cancelNoteBtn: document.getElementById('cancelNoteBtn'),
    
    // Expenses
    expensesList: document.getElementById('expensesList'),
    addExpenseBtn: document.getElementById('addExpenseBtn'),
    expenseCategoryFilter: document.getElementById('expenseCategoryFilter'),
    expenseMonthFilter: document.getElementById('expenseMonthFilter'),
    expenseModal: document.getElementById('expenseModal'),
    expenseForm: document.getElementById('expenseForm'),
    expenseModalTitle: document.getElementById('expenseModalTitle'),
    closeExpenseModal: document.getElementById('closeExpenseModal'),
    cancelExpenseBtn: document.getElementById('cancelExpenseBtn'),
    
    // Incomes
    incomesList: document.getElementById('incomesList'),
    addIncomeBtn: document.getElementById('addIncomeBtn'),
    incomeCategoryFilter: document.getElementById('incomeCategoryFilter'),
    incomeMonthFilter: document.getElementById('incomeMonthFilter'),
    incomeModal: document.getElementById('incomeModal'),
    incomeForm: document.getElementById('incomeForm'),
    incomeModalTitle: document.getElementById('incomeModalTitle'),
    closeIncomeModal: document.getElementById('closeIncomeModal'),
    cancelIncomeBtn: document.getElementById('cancelIncomeBtn'),
    
    // Dashboard
    currentBalance: document.getElementById('currentBalance'),
    totalIncome: document.getElementById('totalIncome'),
    totalExpense: document.getElementById('totalExpense'),
    expensesChart: document.getElementById('expensesChart'),
    incomesChart: document.getElementById('incomesChart'),
    dashboardMonth: document.getElementById('dashboardMonth'),
    recentActivity: document.getElementById('recentActivity'),
    
    // Confirmation Modal
    confirmModal: document.getElementById('confirmModal'),
    confirmMessage: document.getElementById('confirmMessage'),
    closeConfirmModal: document.getElementById('closeConfirmModal'),
    cancelConfirmBtn: document.getElementById('cancelConfirmBtn'),
    confirmBtn: document.getElementById('confirmBtn'),
    
    // Toast
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toastMessage'),
    
    // Theme
    themeToggle: document.getElementById('themeToggle'),
    syncBtn: document.getElementById('syncBtn'),
    currentYear: document.getElementById('currentYear')
};

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    // Set current year
    elements.currentYear.textContent = new Date().getFullYear();
    
    // Load data
    loadData();
    
    // Load theme
    loadTheme();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize charts
    initCharts();
    
    // Populate month filters
    populateMonthFilters();
    
    // Render initial data
    renderAll();
}

// ===== Data Loading =====
function loadData() {
    state.notes = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTES)) || [];
    state.expenses = JSON.parse(localStorage.getItem(STORAGE_KEYS.EXPENSES)) || [];
    state.incomes = JSON.parse(localStorage.getItem(STORAGE_KEYS.INCOMES)) || [];
}

function saveData() {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(state.notes));
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(state.expenses));
    localStorage.setItem(STORAGE_KEYS.INCOMES, JSON.stringify(state.incomes));
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
}

// ===== Theme Management =====
function loadTheme() {
    state.currentTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
    document.documentElement.setAttribute('data-theme', state.currentTheme);
    updateThemeIcon();
}

function toggleTheme() {
    state.currentTheme = state.currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', state.currentTheme);
    localStorage.setItem(STORAGE_KEYS.THEME, state.currentTheme);
    updateThemeIcon();
    showToast(`Tema alterado para ${state.currentTheme === 'dark' ? 'Escuro' : 'Claro'}`);
}

function updateThemeIcon() {
    const icon = elements.themeToggle.querySelector('i');
    icon.className = state.currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// ===== Event Listeners =====
function setupEventListeners() {
    // Tab navigation
    elements.tabs.forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });
    
    // Theme toggle
    elements.themeToggle.addEventListener('click', toggleTheme);
    
    // Sync button
    elements.syncBtn.addEventListener('click', syncData);
    
    // Notes
    elements.addNoteBtn.addEventListener('click', () => openNoteModal());
    elements.closeNoteModal.addEventListener('click', closeNoteModal);
    elements.cancelNoteBtn.addEventListener('click', closeNoteModal);
    elements.noteForm.addEventListener('submit', saveNote);
    elements.noteSearch.addEventListener('input', (e) => {
        filterNotes(e.target.value);
    });
    
    // Expenses
    elements.addExpenseBtn.addEventListener('click', () => openExpenseModal());
    elements.closeExpenseModal.addEventListener('click', closeExpenseModal);
    elements.cancelExpenseBtn.addEventListener('click', closeExpenseModal);
    elements.expenseForm.addEventListener('submit', saveExpense);
    elements.expenseCategoryFilter.addEventListener('change', renderExpenses);
    elements.expenseMonthFilter.addEventListener('change', renderExpenses);
    
    // Incomes
    elements.addIncomeBtn.addEventListener('click', () => openIncomeModal());
    elements.closeIncomeModal.addEventListener('click', closeIncomeModal);
    elements.cancelIncomeBtn.addEventListener('click', closeIncomeModal);
    elements.incomeForm.addEventListener('submit', saveIncome);
    elements.incomeCategoryFilter.addEventListener('change', renderIncomes);
    elements.incomeMonthFilter.addEventListener('change', renderIncomes);
    
    // Dashboard
    elements.dashboardMonth.addEventListener('change', renderDashboard);
    
    // Confirmation Modal
    elements.closeConfirmModal.addEventListener('click', closeConfirmModal);
    elements.cancelConfirmBtn.addEventListener('click', closeConfirmModal);
    elements.confirmBtn.addEventListener('click', confirmAction);
    
    // Close modals on outside click
    document.addEventListener('click', (e) => {
        if (e.target === elements.noteModal) closeNoteModal();
        if (e.target === elements.expenseModal) closeExpenseModal();
        if (e.target === elements.incomeModal) closeIncomeModal();
        if (e.target === elements.confirmModal) closeConfirmModal();
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

// ===== Tab Navigation =====
function switchTab(tabId) {
    elements.tabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabId);
    });
    
    elements.tabContents.forEach(content => {
        content.classList.toggle('active', content.id === tabId);
    });
    
    // Render content for the selected tab
    switch (tabId) {
        case 'notes':
            renderNotes();
            break;
        case 'expenses':
            renderExpenses();
            break;
        case 'incomes':
            renderIncomes();
            break;
        case 'dashboard':
            renderDashboard();
            break;
    }
}

// ===== Notes Management =====
function openNoteModal(note = null) {
    if (note) {
        elements.noteModalTitle.textContent = 'Editar Nota';
        document.getElementById('noteTitle').value = note.title;
        document.getElementById('noteContent').value = note.content;
        document.getElementById('noteId').value = note.id;
        document.getElementById('notePriority').value = note.priority || 'medium';
        
        // Set color
        const colorOptions = document.querySelectorAll('.color-option');
        colorOptions.forEach(option => {
            option.classList.toggle('active', option.dataset.color === note.color);
        });
        
        state.currentNoteId = note.id;
    } else {
        elements.noteModalTitle.textContent = 'Nova Nota';
        elements.noteForm.reset();
        document.getElementById('noteId').value = '';
        
        // Reset color picker
        const colorOptions = document.querySelectorAll('.color-option');
        colorOptions.forEach(option => {
            option.classList.remove('active');
        });
        document.querySelector('.color-option[data-color="#a29bfe"]').classList.add('active');
        
        state.currentNoteId = null;
    }
    
    elements.noteModal.classList.add('active');
}

function closeNoteModal() {
    elements.noteModal.classList.remove('active');
    state.currentNoteId = null;
}

function saveNote(e) {
    e.preventDefault();
    
    const title = document.getElementById('noteTitle').value.trim();
    const content = document.getElementById('noteContent').value.trim();
    const color = document.querySelector('.color-option.active').dataset.color;
    const priority = document.getElementById('notePriority').value;
    const id = document.getElementById('noteId').value || generateId();
    
    if (!title) {
        showToast('Por favor, insira um título', true);
        return;
    }
    
    const note = {
        id,
        title,
        content,
        color,
        priority,
        createdAt: state.currentNoteId ? state.notes.find(n => n.id === state.currentNoteId)?.createdAt || new Date().toISOString() : new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    if (state.currentNoteId) {
        const index = state.notes.findIndex(n => n.id === state.currentNoteId);
        state.notes[index] = note;
        showToast('Nota atualizada com sucesso!');
    } else {
        state.notes.push(note);
        showToast('Nota criada com sucesso!');
    }
    
    saveData();
    closeNoteModal();
    renderNotes();
}

function deleteNote(id) {
    state.currentNoteId = id;
    elements.confirmMessage.textContent = 'Tem certeza que deseja excluir esta nota?';
    elements.confirmModal.classList.add('active');
}

function filterNotes(searchTerm) {
    const filteredNotes = state.notes.filter(note => 
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    renderNotes(filteredNotes);
}

function renderNotes(notes = state.notes) {
    if (notes.length === 0) {
        elements.notesGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-sticky-note"></i>
                <p>Nenhuma nota encontrada</p>
                <button onclick="openNoteModal()" class="btn btn-primary">
                    <i class="fas fa-plus"></i> Criar Nota
                </button>
            </div>
        `;
        return;
    }
    
    elements.notesGrid.innerHTML = notes.map(note => `
        <div class="note-card" style="border-left-color: ${note.color}" onclick="openNoteModal(${JSON.stringify(note).replace(/"/g, '&quot;')})">
            <div class="note-card-header">
                <div class="note-card-title">${escapeHtml(note.title)}</div>
                <span class="note-card-priority ${note.priority}">${getPriorityLabel(note.priority)}</span>
            </div>
            <div class="note-card-content">${escapeHtml(note.content.substring(0, 100))}${note.content.length > 100 ? '...' : ''}</div>
            <div class="note-card-meta">
                <span>${formatDate(note.updatedAt)}</span>
                <div class="note-card-actions">
                    <button onclick="event.stopPropagation(); deleteNote('${note.id}')" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// ===== Expenses Management =====
function openExpenseModal(expense = null) {
    if (expense) {
        elements.expenseModalTitle.textContent = 'Editar Despesa';
        document.getElementById('expenseDescription').value = expense.description;
        document.getElementById('expenseAmount').value = expense.amount;
        document.getElementById('expenseCategory').value = expense.category;
        document.getElementById('expenseDate').value = expense.date;
        document.getElementById('expensePaymentMethod').value = expense.paymentMethod || 'Dinheiro';
        document.getElementById('expenseNotes').value = expense.notes || '';
        document.getElementById('expenseId').value = expense.id;
        
        state.currentExpenseId = expense.id;
    } else {
        elements.expenseModalTitle.textContent = 'Nova Despesa';
        elements.expenseForm.reset();
        document.getElementById('expenseId').value = '';
        document.getElementById('expenseDate').value = new Date().toISOString().split('T')[0];
        
        state.currentExpenseId = null;
    }
    
    elements.expenseModal.classList.add('active');
}

function closeExpenseModal() {
    elements.expenseModal.classList.remove('active');
    state.currentExpenseId = null;
}

function saveExpense(e) {
    e.preventDefault();
    
    const description = document.getElementById('expenseDescription').value.trim();
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const category = document.getElementById('expenseCategory').value;
    const date = document.getElementById('expenseDate').value;
    const paymentMethod = document.getElementById('expensePaymentMethod').value;
    const notes = document.getElementById('expenseNotes').value.trim();
    const id = document.getElementById('expenseId').value || generateId();
    
    if (!description || isNaN(amount) || amount <= 0 || !date) {
        showToast('Por favor, preencha todos os campos obrigatórios', true);
        return;
    }
    
    const expense = {
        id,
        description,
        amount,
        category,
        date,
        paymentMethod,
        notes,
        createdAt: state.currentExpenseId ? state.expenses.find(e => e.id === state.currentExpenseId)?.createdAt || new Date().toISOString() : new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    if (state.currentExpenseId) {
        const index = state.expenses.findIndex(e => e.id === state.currentExpenseId);
        state.expenses[index] = expense;
        showToast('Despesa atualizada com sucesso!');
    } else {
        state.expenses.push(expense);
        showToast('Despesa criada com sucesso!');
    }
    
    saveData();
    closeExpenseModal();
    renderExpenses();
    renderDashboard();
}

function deleteExpense(id) {
    state.currentExpenseId = id;
    elements.confirmMessage.textContent = 'Tem certeza que deseja excluir esta despesa?';
    elements.confirmModal.classList.add('active');
}

function renderExpenses() {
    const categoryFilter = elements.expenseCategoryFilter.value;
    const monthFilter = elements.expenseMonthFilter.value;
    
    let filteredExpenses = state.expenses.filter(expense => {
        const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
        const matchesMonth = monthFilter === 'all' || getMonthYear(expense.date) === monthFilter;
        return matchesCategory && matchesMonth;
    });
    
    // Sort by date (newest first)
    filteredExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (filteredExpenses.length === 0) {
        elements.expensesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-money-bill-wave"></i>
                <p>Nenhuma despesa encontrada</p>
                <button onclick="openExpenseModal()" class="btn btn-primary">
                    <i class="fas fa-plus"></i> Adicionar Despesa
                </button>
            </div>
        `;
        return;
    }
    
    elements.expensesList.innerHTML = filteredExpenses.map(expense => `
        <div class="transaction-card" onclick="openExpenseModal(${JSON.stringify(expense).replace(/"/g, '&quot;')})">
            <div class="transaction-info">
                <div class="transaction-description">${escapeHtml(expense.description)}</div>
                <div class="transaction-meta">
                    <span class="transaction-category">
                        <i class="fas fa-tag"></i> ${expense.category}
                    </span>
                    <span>
                        <i class="fas fa-calendar"></i> ${formatDate(expense.date)}
                    </span>
                    <span>
                        <i class="fas fa-credit-card"></i> ${expense.paymentMethod}
                    </span>
                </div>
            </div>
            <div class="transaction-amount expense">- R$ ${formatCurrency(expense.amount)}</div>
            <div class="transaction-actions">
                <button onclick="event.stopPropagation(); deleteExpense('${expense.id}')" title="Excluir">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// ===== Incomes Management =====
function openIncomeModal(income = null) {
    if (income) {
        elements.incomeModalTitle.textContent = 'Editar Recebimento';
        document.getElementById('incomeDescription').value = income.description;
        document.getElementById('incomeAmount').value = income.amount;
        document.getElementById('incomeCategory').value = income.category;
        document.getElementById('incomeDate').value = income.date;
        document.getElementById('incomePaymentMethod').value = income.paymentMethod || 'Dinheiro';
        document.getElementById('incomeNotes').value = income.notes || '';
        document.getElementById('incomeId').value = income.id;
        
        state.currentIncomeId = income.id;
    } else {
        elements.incomeModalTitle.textContent = 'Novo Recebimento';
        elements.incomeForm.reset();
        document.getElementById('incomeId').value = '';
        document.getElementById('incomeDate').value = new Date().toISOString().split('T')[0];
        
        state.currentIncomeId = null;
    }
    
    elements.incomeModal.classList.add('active');
}

function closeIncomeModal() {
    elements.incomeModal.classList.remove('active');
    state.currentIncomeId = null;
}

function saveIncome(e) {
    e.preventDefault();
    
    const description = document.getElementById('incomeDescription').value.trim();
    const amount = parseFloat(document.getElementById('incomeAmount').value);
    const category = document.getElementById('incomeCategory').value;
    const date = document.getElementById('incomeDate').value;
    const paymentMethod = document.getElementById('incomePaymentMethod').value;
    const notes = document.getElementById('incomeNotes').value.trim();
    const id = document.getElementById('incomeId').value || generateId();
    
    if (!description || isNaN(amount) || amount <= 0 || !date) {
        showToast('Por favor, preencha todos os campos obrigatórios', true);
        return;
    }
    
    const income = {
        id,
        description,
        amount,
        category,
        date,
        paymentMethod,
        notes,
        createdAt: state.currentIncomeId ? state.incomes.find(i => i.id === state.currentIncomeId)?.createdAt || new Date().toISOString() : new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    if (state.currentIncomeId) {
        const index = state.incomes.findIndex(i => i.id === state.currentIncomeId);
        state.incomes[index] = income;
        showToast('Recebimento atualizado com sucesso!');
    } else {
        state.incomes.push(income);
        showToast('Recebimento criado com sucesso!');
    }
    
    saveData();
    closeIncomeModal();
    renderIncomes();
    renderDashboard();
}

function deleteIncome(id) {
    state.currentIncomeId = id;
    elements.confirmMessage.textContent = 'Tem certeza que deseja excluir este recebimento?';
    elements.confirmModal.classList.add('active');
}

function renderIncomes() {
    const categoryFilter = elements.incomeCategoryFilter.value;
    const monthFilter = elements.incomeMonthFilter.value;
    
    let filteredIncomes = state.incomes.filter(income => {
        const matchesCategory = categoryFilter === 'all' || income.category === categoryFilter;
        const matchesMonth = monthFilter === 'all' || getMonthYear(income.date) === monthFilter;
        return matchesCategory && matchesMonth;
    });
    
    // Sort by date (newest first)
    filteredIncomes.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (filteredIncomes.length === 0) {
        elements.incomesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-hand-holding-usd"></i>
                <p>Nenhum recebimento encontrado</p>
                <button onclick="openIncomeModal()" class="btn btn-primary">
                    <i class="fas fa-plus"></i> Adicionar Recebimento
                </button>
            </div>
        `;
        return;
    }
    
    elements.incomesList.innerHTML = filteredIncomes.map(income => `
        <div class="transaction-card" onclick="openIncomeModal(${JSON.stringify(income).replace(/"/g, '&quot;')})">
            <div class="transaction-info">
                <div class="transaction-description">${escapeHtml(income.description)}</div>
                <div class="transaction-meta">
                    <span class="transaction-category">
                        <i class="fas fa-tag"></i> ${income.category}
                    </span>
                    <span>
                        <i class="fas fa-calendar"></i> ${formatDate(income.date)}
                    </span>
                    <span>
                        <i class="fas fa-credit-card"></i> ${income.paymentMethod}
                    </span>
                </div>
            </div>
            <div class="transaction-amount income">+ R$ ${formatCurrency(income.amount)}</div>
            <div class="transaction-actions">
                <button onclick="event.stopPropagation(); deleteIncome('${income.id}')" title="Excluir">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// ===== Dashboard =====
function renderDashboard() {
    const monthFilter = elements.dashboardMonth.value;
    
    // Filter data based on month
    let filteredExpenses = state.expenses;
    let filteredIncomes = state.incomes;
    
    if (monthFilter === 'current') {
        const currentMonth = getMonthYear(new Date().toISOString().split('T')[0]);
        filteredExpenses = state.expenses.filter(e => getMonthYear(e.date) === currentMonth);
        filteredIncomes = state.incomes.filter(i => getMonthYear(i.date) === currentMonth);
    } else if (monthFilter === 'last') {
        const lastMonth = getLastMonth();
        filteredExpenses = state.expenses.filter(e => getMonthYear(e.date) === lastMonth);
        filteredIncomes = state.incomes.filter(i => getMonthYear(i.date) === lastMonth);
    }
    
    // Calculate totals
    const totalIncome = filteredIncomes.reduce((sum, i) => sum + i.amount, 0);
    const totalExpense = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
    const balance = totalIncome - totalExpense;
    
    // Update balance cards
    elements.currentBalance.textContent = formatCurrency(balance);
    elements.totalIncome.textContent = `+ R$ ${formatCurrency(totalIncome)}`;
    elements.totalExpense.textContent = `- R$ ${formatCurrency(totalExpense)}`;
    
    // Update charts
    updateCharts(filteredExpenses, filteredIncomes);
    
    // Update recent activity
    updateRecentActivity();
}

function updateCharts(expenses, incomes) {
    // Expenses by category
    const expenseCategories = {};
    expenses.forEach(e => {
        expenseCategories[e.category] = (expenseCategories[e.category] || 0) + e.amount;
    });
    
    const expenseLabels = Object.keys(expenseCategories);
    const expenseData = Object.values(expenseCategories);
    
    // Incomes by category
    const incomeCategories = {};
    incomes.forEach(i => {
        incomeCategories[i.category] = (incomeCategories[i.category] || 0) + i.amount;
    });
    
    const incomeLabels = Object.keys(incomeCategories);
    const incomeData = Object.values(incomeCategories);
    
    // Destroy existing charts
    if (state.charts.expenses) state.charts.expenses.destroy();
    if (state.charts.incomes) state.charts.incomes.destroy();
    
    // Create expense chart
    const expenseCtx = elements.expensesChart.getContext('2d');
    state.charts.expenses = new Chart(expenseCtx, {
        type: 'bar',
        data: {
            labels: expenseLabels.length > 0 ? expenseLabels : ['Nenhuma despesa'],
            datasets: [{
                label: 'Despesas por Categoria (R$)',
                data: expenseData.length > 0 ? expenseData : [0],
                backgroundColor: [
                    '#e74c3c', '#3498db', '#2ecc71', '#f39c12', 
                    '#9b59b6', '#1abc9c', '#e67e22', '#34495e'
                ],
                borderColor: '#fff',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: (value) => `R$ ${formatCurrency(value)}`
                    }
                }
            }
        }
    });
    
    // Create income chart
    const incomeCtx = elements.incomesChart.getContext('2d');
    state.charts.incomes = new Chart(incomeCtx, {
        type: 'pie',
        data: {
            labels: incomeLabels.length > 0 ? incomeLabels : ['Nenhum recebimento'],
            datasets: [{
                label: 'Recebimentos por Categoria (R$)',
                data: incomeData.length > 0 ? incomeData : [0],
                backgroundColor: [
                    '#2ecc71', '#3498db', '#9b59b6', '#f39c12',
                    '#e74c3c', '#1abc9c', '#e67e22', '#34495e'
                ],
                borderColor: '#fff',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: (context) => `${context.label}: R$ ${formatCurrency(context.raw)}`
                    }
                }
            }
        }
    });
}

function updateRecentActivity() {
    // Combine and sort all transactions
    const allTransactions = [
        ...state.expenses.map(e => ({ ...e, type: 'expense', amount: -e.amount })),
        ...state.incomes.map(i => ({ ...i, type: 'income', amount: i.amount }))
    ];
    
    // Sort by date (newest first)
    allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Take first 5
    const recentTransactions = allTransactions.slice(0, 5);
    
    if (recentTransactions.length === 0) {
        elements.recentActivity.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-clock"></i>
                <p>Nenhuma atividade recente</p>
            </div>
        `;
        return;
    }
    
    elements.recentActivity.innerHTML = recentTransactions.map(t => `
        <div class="activity-item">
            <i class="fas fa-${t.type === 'expense' ? 'minus-circle' : 'plus-circle'} ${t.type}"></i>
            <span class="activity-type">${t.description}</span>
            <span class="activity-amount ${t.amount >= 0 ? 'positive' : 'negative'}">
                ${t.amount >= 0 ? '+' : ''} R$ ${formatCurrency(Math.abs(t.amount))}
            </span>
            <span class="activity-date">${formatDate(t.date)}</span>
        </div>
    `).join('');
}

function initCharts() {
    // Initialize empty charts
    const expenseCtx = elements.expensesChart.getContext('2d');
    state.charts.expenses = new Chart(expenseCtx, {
        type: 'bar',
        data: {
            labels: ['Nenhuma despesa'],
            datasets: [{
                label: 'Despesas por Categoria (R$)',
                data: [0],
                backgroundColor: ['#e74c3c'],
                borderColor: '#fff',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: (value) => `R$ ${formatCurrency(value)}`
                    }
                }
            }
        }
    });
    
    const incomeCtx = elements.incomesChart.getContext('2d');
    state.charts.incomes = new Chart(incomeCtx, {
        type: 'pie',
        data: {
            labels: ['Nenhum recebimento'],
            datasets: [{
                label: 'Recebimentos por Categoria (R$)',
                data: [0],
                backgroundColor: ['#2ecc71'],
                borderColor: '#fff',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// ===== Confirmation Modal =====
let confirmActionCallback = null;

function closeConfirmModal() {
    elements.confirmModal.classList.remove('active');
    confirmActionCallback = null;
}

function confirmAction() {
    if (confirmActionCallback) {
        confirmActionCallback();
        confirmActionCallback = null;
    }
    closeConfirmModal();
}

// ===== Delete Functions =====
function confirmDeleteNote() {
    const id = state.currentNoteId;
    state.notes = state.notes.filter(n => n.id !== id);
    saveData();
    renderNotes();
    showToast('Nota excluída com sucesso!');
}

function confirmDeleteExpense() {
    const id = state.currentExpenseId;
    state.expenses = state.expenses.filter(e => e.id !== id);
    saveData();
    renderExpenses();
    renderDashboard();
    showToast('Despesa excluída com sucesso!');
}

function confirmDeleteIncome() {
    const id = state.currentIncomeId;
    state.incomes = state.incomes.filter(i => i.id !== id);
    saveData();
    renderIncomes();
    renderDashboard();
    showToast('Recebimento excluído com sucesso!');
}

// ===== Sync Data =====
function syncData() {
    // In a real app, this would sync with a server
    // For now, just show a toast
    showToast('Dados sincronizados localmente!');
    
    // Force re-render
    renderAll();
}

// ===== Helper Functions =====
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function formatCurrency(value) {
    return value.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function getPriorityLabel(priority) {
    const labels = {
        low: 'Baixa',
        medium: 'Média',
        high: 'Alta'
    };
    return labels[priority] || 'Média';
}

function getMonthYear(dateString) {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function getLastMonth() {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showToast(message, isError = false) {
    elements.toastMessage.textContent = message;
    elements.toast.classList.toggle('error', isError);
    elements.toast.classList.add('show');
    
    setTimeout(() => {
        elements.toast.classList.remove('show');
    }, 3000);
}

function closeAllModals() {
    closeNoteModal();
    closeExpenseModal();
    closeIncomeModal();
    closeConfirmModal();
}

function renderAll() {
    renderNotes();
    renderExpenses();
    renderIncomes();
    renderDashboard();
}

function populateMonthFilters() {
    // Get all unique months from expenses and incomes
    const allMonths = new Set();
    
    state.expenses.forEach(e => {
        allMonths.add(getMonthYear(e.date));
    });
    
    state.incomes.forEach(i => {
        allMonths.add(getMonthYear(i.date));
    });
    
    // Add current month
    allMonths.add(getMonthYear(new Date().toISOString().split('T')[0]));
    
    // Convert to array and sort
    const sortedMonths = Array.from(allMonths).sort((a, b) => b.localeCompare(a));
    
    // Update expense month filter
    const expenseMonthFilter = elements.expenseMonthFilter;
    expenseMonthFilter.innerHTML = '<option value="all">Todos os meses</option>';
    sortedMonths.forEach(month => {
        const option = document.createElement('option');
        option.value = month;
        option.textContent = formatMonthYear(month);
        expenseMonthFilter.appendChild(option);
    });
    
    // Update income month filter
    const incomeMonthFilter = elements.incomeMonthFilter;
    incomeMonthFilter.innerHTML = '<option value="all">Todos os meses</option>';
    sortedMonths.forEach(month => {
        const option = document.createElement('option');
        option.value = month;
        option.textContent = formatMonthYear(month);
        incomeMonthFilter.appendChild(option);
    });
}

function formatMonthYear(monthYear) {
    const [year, month] = monthYear.split('-');
    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
}

// ===== Color Picker =====
document.querySelectorAll('.color-option').forEach(option => {
    option.addEventListener('click', () => {
        document.querySelectorAll('.color-option').forEach(o => o.classList.remove('active'));
        option.classList.add('active');
    });
});

// ===== Make functions globally available =====
window.openNoteModal = openNoteModal;
window.deleteNote = deleteNote;
window.openExpenseModal = openExpenseModal;
window.deleteExpense = deleteExpense;
window.openIncomeModal = openIncomeModal;
window.deleteIncome = deleteIncome;

// ===== Confirmation Modal Setup =====
function setupConfirmModal(actionType) {
    switch (actionType) {
        case 'note':
            confirmActionCallback = confirmDeleteNote;
            break;
        case 'expense':
            confirmActionCallback = confirmDeleteExpense;
            break;
        case 'income':
            confirmActionCallback = confirmDeleteIncome;
            break;
    }
}

// Update delete functions to set callback
deleteNote = function(id) {
    state.currentNoteId = id;
    elements.confirmMessage.textContent = 'Tem certeza que deseja excluir esta nota?';
    setupConfirmModal('note');
    elements.confirmModal.classList.add('active');
};

deleteExpense = function(id) {
    state.currentExpenseId = id;
    elements.confirmMessage.textContent = 'Tem certeza que deseja excluir esta despesa?';
    setupConfirmModal('expense');
    elements.confirmModal.classList.add('active');
};

deleteIncome = function(id) {
    state.currentIncomeId = id;
    elements.confirmMessage.textContent = 'Tem certeza que deseja excluir este recebimento?';
    setupConfirmModal('income');
    elements.confirmModal.classList.add('active');
};
