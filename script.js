document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('resultado');
    const botoes = document.querySelectorAll('.calculadora button');

    let stringCalculo = '';
    let ultimoDigitoFoiOperador = false; // Flag para evitar operadores duplos

    // Função para atualizar o display
    function atualizarDisplay(valor) {
        // Garante que '0' seja o default se estiver vazio, ou a string atual
        display.value = valor === '' ? '0' : valor;
    }

    // Função para tratar o clique nos botões
    botoes.forEach(botao => {
        botao.addEventListener('click', () => {
            const valorBotao = botao.textContent;

            // 1. Botão Limpar (C)
            if (botao.classList.contains('btn-limpar')) {
                stringCalculo = '';
                ultimoDigitoFoiOperador = false;
                atualizarDisplay(stringCalculo);
                return;
            }

            // 2. Botão Deletar (DEL)
            if (botao.classList.contains('btn-deletar')) {
                stringCalculo = stringCalculo.slice(0, -1);
                ultimoDigitoFoiOperador = isNaN(stringCalculo.slice(-1));
                atualizarDisplay(stringCalculo);
                return;
            }

            // 3. Botão Igual (=)
            if (botao.classList.contains('btn-igual')) {
                try {
                    // Substitui 'x' e '÷' pelos operadores JS
                    const expressaoSegura = stringCalculo
                        .replace(/x/g, '*')
                        .replace(/÷/g, '/');
                    
                    // Avalia a expressão. Usar eval() é arriscado, mas comum em projetos básicos.
                    // Para um projeto de produção, use uma biblioteca ou um parser próprio.
                    let resultado = eval(expressaoSegura);

                    // Formatação para evitar resultados com muitas casas decimais
                    if (resultado !== undefined && typeof resultado === 'number' && !Number.isInteger(resultado)) {
                        resultado = resultado.toFixed(5).replace(/\.?0+$/, ""); // Limita casas e remove zeros no final
                    }
                    
                    stringCalculo = resultado.toString();
                    atualizarDisplay(stringCalculo);
                    ultimoDigitoFoiOperador = false;

                } catch (e) {
                    stringCalculo = 'Erro';
                    atualizarDisplay(stringCalculo);
                    stringCalculo = ''; // Reseta para o próximo cálculo
                }
                return;
            }

            // 4. Botões de Operadores (+, -, x, ÷)
            if (botao.classList.contains('operador')) {
                // Evita colocar um operador logo após outro
                if (ultimoDigitoFoiOperador && ['+', '-', 'x', '÷'].includes(valorBotao)) {
                    // Substitui o último operador pelo novo
                    stringCalculo = stringCalculo.slice(0, -1) + valorBotao;
                } else {
                    stringCalculo += valorBotao;
                    ultimoDigitoFoiOperador = true;
                }
            }
            // 5. Botões de Números e Ponto (.)
            else {
                stringCalculo += valorBotao;
                ultimoDigitoFoiOperador = false;
            }
            
            // Atualiza o display após a concatenação
            atualizarDisplay(stringCalculo);
        });
    });

    // Bônus: Suporte para entrada via teclado
    document.addEventListener('keydown', (e) => {
        const key = e.key;

        if (/[0-9]/.test(key) || key === '.') {
            // Números e ponto
            document.querySelector(`button.numero:nth-child(${key === '.' ? '15' : parseInt(key) === 0 ? '16' : 10 - parseInt(key)})`).click(); // Clicar nos números
        } else if (['+', '-', '/', '*'].includes(key)) {
            // Operadores (traduzindo '*' para 'x' e '/' para '÷' visualmente, se necessário)
            const btn = document.querySelector(`button:contains("${key === '*' ? 'x' : key === '/' ? '÷' : key}")`);
            if(btn) btn.click();
        } else if (key === 'Enter' || key === '=') {
            // Igual
            document.querySelector('.btn-igual').click();
            e.preventDefault(); // Evita que o 'Enter' submeta formulários
        } else if (key === 'Backspace') {
            // Deletar
            document.querySelector('.btn-deletar').click();
        } else if (key === 'c' || key === 'C') {
            // Limpar
            document.querySelector('.btn-limpar').click();
        }
    });

});