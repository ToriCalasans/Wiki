document.addEventListener('DOMContentLoaded', function () {
    // Este evento é acionado quando o DOM (Document Object Model) está completamente carregado e pronto para ser manipulado.

    const form = document.getElementById('form');
    const tbody = document.getElementById('tbody');
    const nomeInput = document.getElementById('nome');
    const tabela = document.getElementById('tabela');
    const gerarArquivoBtn = document.getElementById('gerarArquivoBtn');
    const modalParentesco = new bootstrap.Modal(document.getElementById('modalParentesco'));
    // Aqui, estamos selecionando os elementos HTML relevantes da página e armazenando-os em variáveis para facilitar o acesso posteriormente.
    // `form` é o formulário para cadastrar novas pessoas.
    // `tbody` é a tabela onde as pessoas cadastradas serão exibidas.
    // `nomeInput` é o campo de entrada onde o usuário digita o nome da pessoa a ser cadastrada.
    // `tabela` é a tabela onde as pessoas cadastradas serão exibidas.
    // `gerarArquivoBtn` é o botão que o usuário pode clicar para gerar um arquivo de texto com os dados das pessoas cadastradas.
    // `modalParentesco` é o modal usado para adicionar parentesco entre as pessoas.

    let pessoaSelecionada;
    let pessoas = [];
    let personagemSelecionado = '';
    // Aqui, estamos declarando algumas variáveis para armazenar os dados das pessoas e o personagem selecionado.

    // Função para adicionar uma pessoa ao array e à tabela
    function adicionarPessoa(nome) {
        const pessoa = { nome, parentesco: '' };
        // Aqui, criamos um objeto que representa uma pessoa com seu nome e parentesco inicialmente vazio.
        pessoas.push(pessoa);
        // Adicionamos a pessoa ao array `pessoas`.
        atualizarTabela();
        // Chamamos a função para atualizar a tabela com as pessoas cadastradas.
        atualizarSelectParente();
        // Chamamos a função para atualizar o select de parente com os nomes das pessoas cadastradas.
        salvarDadosLocalmente();
        // Chamamos a função para salvar os dados localmente.
    }

    // Função para carregar os dados salvos localmente
    function carregarDadosLocalmente() {
        const dadosSalvos = localStorage.getItem('pessoas');
        // Aqui, estamos recuperando os dados salvos localmente no localStorage.
        if (dadosSalvos) {
            pessoas = JSON.parse(dadosSalvos);
            // Se houver dados salvos, os convertemos de JSON para um array e os armazenamos na variável `pessoas`.
            atualizarTabela();
            // Chamamos a função para atualizar a tabela com as pessoas cadastradas.
            atualizarSelectParente();
            // Chamamos a função para atualizar o select de parente com os nomes das pessoas cadastradas.
        }
    }

    // Função para salvar os dados localmente
    function salvarDadosLocalmente() {
        localStorage.setItem('pessoas', JSON.stringify(pessoas));
        // Aqui, estamos salvando os dados das pessoas no localStorage, convertendo-os para JSON antes de salvar.
    }

    // Função para atualizar a tabela com as pessoas cadastradas
    function atualizarTabela() {
        tbody.innerHTML = '';
        // Aqui, estamos limpando o conteúdo da tabela.
        pessoas.forEach(pessoa => {
            // Para cada pessoa cadastrada, vamos criar uma linha na tabela.
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="nome" data-nome="${pessoa.nome}">${pessoa.nome}</td>
                <td>${pessoa.parentesco}</td>
                <td><button data-nome="${pessoa.nome}" class="adicionarParentescoBtn btn btn-primary">Adicionar Parentesco</button></td>
            `;
            // Aqui, estamos criando uma célula de tabela para o nome da pessoa, uma para o parentesco e uma com um botão para adicionar parentesco.
            tbody.appendChild(tr);
            // Aqui, estamos adicionando a linha à tabela.
        });
    }

    // Função para atualizar o select de parente com os nomes das pessoas cadastradas
    function atualizarSelectParente() {
        const parenteSelect = document.getElementById('parenteSelect');
        // Aqui, estamos selecionando o elemento select de parente.
        if (!parenteSelect) return;
        // Verificamos se o elemento foi encontrado.
        parenteSelect.innerHTML = '';
        // Aqui, estamos limpando as opções existentes no select.
        pessoas.forEach(p => {
            // Para cada pessoa cadastrada, vamos adicionar uma opção ao select de parente.
            if (!pessoaSelecionada || p.nome !== pessoaSelecionada.nome) {
                const option = document.createElement('option');
                option.textContent = p.nome;
                // Aqui, estamos criando uma nova opção no select com o nome da pessoa.
                parenteSelect.appendChild(option);
                // Aqui, estamos adicionando a opção ao select.
            }
        });
    }

    // Função para atualizar o select de personagem
    function atualizarSelectPersonagem() {
        const selectPersonagem = document.getElementById('selecionarPersonagem');
        // Aqui, estamos selecionando o elemento select de personagem.
        if (!selectPersonagem) return;
        // Verificamos se o elemento foi encontrado.
        selectPersonagem.innerHTML = '';
        // Aqui, estamos limpando as opções existentes no select.
        pessoas.forEach(p => {
            // Para cada pessoa cadastrada, vamos adicionar uma opção ao select de personagem.
            const option = document.createElement('option');
            option.textContent = p.nome;
            // Aqui, estamos criando uma nova opção no select com o nome da pessoa.
            selectPersonagem.appendChild(option);
            // Aqui, estamos adicionando a opção ao select.
        });
    }

    // Event listener para o formulário de cadastro
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        // Impedimos o comportamento padrão de envio do formulário.
        const nome = nomeInput.value;
        // Obtemos o valor digitado no campo de nome.
        adicionarPessoa(nome);
        // Chamamos a função para adicionar a pessoa com o nome informado.
        form.reset();
        // Limpa o formulário após adicionar a pessoa.
    });

    // Event listener para adicionar parentesco
    tabela.addEventListener('click', function (event) {
        if (event.target.classList.contains('adicionarParentescoBtn')) {
            // Verifica se o elemento clicado é um botão de adicionar parentesco.
            const nomeSelecionado = event.target.dataset.nome;
            // Obtém o nome da pessoa associada ao botão clicado.
            pessoaSelecionada = pessoas.find(p => p.nome === nomeSelecionado);
            // Encontra a pessoa correspondente com base no nome.
            atualizarSelectParente();
            // Chamamos a função para atualizar o select de parente com os nomes das pessoas cadastradas.
            atualizarSelectPersonagem();
            // Chamamos a função para atualizar o select de personagem com os nomes das pessoas cadastradas.
            modalParentesco.show();
            // Exibe o modal para adicionar parentesco.
        }
    });

    // Event listener para o botão "Salvar" no modal
    document.getElementById('salvarParentesco').addEventListener('click', function () {
        const parenteSelect = document.getElementById('parenteSelect');
        const parentescoSelect = document.getElementById('parentescoSelect');
        // Aqui, estamos obtendo os elementos select de parente e parentesco.
        const parenteSelecionado = parenteSelect.value;
        const parentescoSelecionado = parentescoSelect.value;
        // Aqui, estamos obtendo os valores selecionados nos selects.

        const pessoaParente = pessoas.find(p => p.nome === parenteSelecionado);
        // Aqui, estamos procurando a pessoa correspondente ao parente selecionado.
        if (pessoaParente) {
            pessoaParente.parentesco = `${parentescoSelecionado} de ${pessoaSelecionada.nome}`;
            // Atualizamos o parentesco da pessoa encontrada com o nome da pessoa selecionada e o parentesco selecionado.
            atualizarTabela();
            // Chamamos a função para atualizar a tabela com as pessoas cadastradas.
            salvarDadosLocalmente();
            // Chamamos a função para salvar os dados localmente.
        }

        modalParentesco.hide();
        // Ocultamos o modal após salvar o parentesco.
    });

    // Event listener para o botão "Gerar arquivo txt"
    gerarArquivoBtn.addEventListener('click', function () {
        const selectPersonagem = document.getElementById('selecionarPersonagem');
        const personagemSelecionado = selectPersonagem.value;
    
        let dados;
        if (personagemSelecionado) {
            dados = pessoas
                .filter(p => p.parentesco.includes(personagemSelecionado))
                .map(p => {
                    const parentescoIndex = p.parentesco.indexOf('(');
                    const parentesco = parentescoIndex !== -1 ? p.parentesco.slice(parentescoIndex + 1, -1).trim() : ''; // Verifica se existe o caractere ( na string parentesco, se existir, pega a substring entre ( e ), remove os espaços em branco extras
                    return `${p.nome} (${parentesco})`;
                })
                .join('\n');
        } else {
            dados = pessoas
                .map(p => {
                    const parentescoIndex = p.parentesco.indexOf('(');
                    const parentesco = parentescoIndex !== -1 ? p.parentesco.slice(parentescoIndex + 1, -1).trim() : ''; // Verifica se existe o caractere ( na string parentesco, se existir, pega a substring entre ( e ), remove os espaços em branco extras
                    return `${p.nome} (${parentesco})`;
                })
                .join('\n');
        }
    
        const blob = new Blob([dados], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'arvore_genealogica.txt';
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
    });
    

    carregarDadosLocalmente();
    // Chamamos a função para carregar os dados salvos localmente quando a página é carregada.
    atualizarSelectPersonagem();
    // Chamamos a função para atualizar o select de personagem quando a página é carregada.
});
