# Familia Finanças - PWA para Gerenciamento Financeiro

Um **Progressive Web App (PWA)** completo para gerenciamento de notas, custos, despesas e recebimentos. Funciona offline, é responsivo e pode ser instalado em qualquer dispositivo.

## 🚀 Funcionalidades

### 📝 Notas
- Crie, edite e exclua notas
- Organize por prioridade (Baixa, Média, Alta)
- Personalize com cores
- Pesquisa rápida

### 💰 Despesas
- Registre despesas com descrição, valor, categoria e data
- Filtros por categoria e mês
- Formas de pagamento (Dinheiro, Cartão, Pix, etc.)
- Observações adicionais

### 💵 Recebimentos
- Registre recebimentos com descrição, valor, categoria e data
- Filtros por categoria e mês
- Formas de recebimento
- Observações adicionais

### 📊 Dashboard
- Saldo atual (Recebimentos - Despesas)
- Gráfico de despesas por categoria
- Gráfico de recebimentos por categoria
- Atividade recente
- Filtro por período (Mês Atual, Mês Passado, Todo o Período)

### 🌓 Outras Funcionalidades
- **Tema Escuro/Claro**: Alternância fácil
- **PWA**: Instale no seu dispositivo e use offline
- **Responsivo**: Funciona em mobile, tablet e desktop
- **Sincronização**: Dados salvos localmente no browser
- **Notificações**: Toast notifications para feedback

## 📱 Como Usar

### Instalação

1. **Como PWA**:
   - Acesse o app pelo navegador
   - Clique em "Adicionar à tela inicial" (Chrome/Edge) ou "Instalar" (Firefox)
   - O app será instalado e poderá ser usado offline

2. **Como site normal**:
   - Basta abrir o `index.html` em qualquer navegador

### Navegação
- Use as abas no topo para alternar entre Notas, Despesas, Recebimentos e Dashboard
- Clique nos botões "Novo" para adicionar novos itens
- Clique em um item para editá-lo
- Use o ícone de lixeira para excluir

## 🛠 Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Estilização moderna com variáveis CSS
- **JavaScript (ES6+)** - Lógica da aplicação
- **Chart.js** - Gráficos interativos
- **Font Awesome** - Ícones
- **Service Worker** - Funcionalidade offline e cache
- **Web App Manifest** - Configuração PWA

## 📁 Estrutura do Projeto

```
familia-financas/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── app.js              # Lógica principal
├── service-worker.js   # Service Worker para PWA
├── manifest.json       # Manifest do PWA
└── README.md           # Documentação
```

## 🎨 Personalização

### Adicionar Novas Categorias

Edite os arrays de categorias em `app.js`:

```javascript
// Para despesas
const expenseCategories = ['Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Lazer', 'Educação', 'Outros'];

// Para recebimentos
const incomeCategories = ['Salário', 'Freelance', 'Investimentos', 'Presentes', 'Outros'];
```

### Adicionar Novas Cores para Notas

Edite o CSS em `styles.css`:

```css
:root {
    --note-colors: #ff6b6b, #4ecdc4, #45b7d1, #f9ca24, #6c5ce7, #a29bfe;
}
```

E atualize o color picker em `index.html`.

## 📊 Dados

Todos os dados são salvos localmente no **localStorage** do navegador. Isso significa:

- ✅ Dados persistem entre sessões
- ✅ Funciona offline
- ❌ Dados não são sincronizados entre dispositivos
- ❌ Limpeza do cache do navegador apaga os dados

### Backup dos Dados

Para fazer backup dos seus dados:

1. Abra o console do navegador (F12)
2. Execute:
   ```javascript
   // Para notas
   copy(JSON.stringify(JSON.parse(localStorage.getItem('familia_notes'))));
   
   // Para despesas
   copy(JSON.stringify(JSON.parse(localStorage.getItem('familia_expenses'))));
   
   // Para recebimentos
   copy(JSON.stringify(JSON.parse(localStorage.getItem('familia_incomes'))));
   ```
3. Cole em um arquivo de texto para guardar

Para restaurar:

```javascript
// Cole os dados copiados
localStorage.setItem('familia_notes', '[seus dados]');
localStorage.setItem('familia_expenses', '[seus dados]');
localStorage.setItem('familia_incomes', '[seus dados]');
// Recarregue a página
```

## 🌐 Hospedagem

Para hospedar o app:

1. **GitHub Pages**:
   - Crie um repositório no GitHub
   - Faça upload de todos os arquivos
   - Ative GitHub Pages nas configurações

2. **Netlify/Vercel**:
   - Faça upload da pasta
   - O app será automaticamente implantado

3. **Servidor próprio**:
   - Basta copiar os arquivos para o seu servidor web

## 🔧 Requisitos

- Navegador moderno (Chrome, Firefox, Edge, Safari)
- Suporte a Service Worker (para funcionalidade PWA)
- Suporte a localStorage

## 📝 Changelog

### v1.0.0 (2024)
- Lançamento inicial
- Funcionalidades completas de notas, despesas e recebimentos
- Dashboard com gráficos
- Tema escuro/claro
- PWA com service worker

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Reportar bugs
2. Sugerir novas funcionalidades
3. Enviar pull requests

## 📄 Licença

MIT License - Sinta-se à vontade para usar, modificar e distribuir.

---

**Criado com ❤️ para a Família**
