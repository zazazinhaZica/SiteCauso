// 1. Conexão com o Supabase (Cole suas credenciais aqui)
const SUPABASE_URL = 'https://gkvfxmuhoqkvmxpyoqrd.supabase.com';
const SUPABASE_KEY = 'sb_publishable_Vryk6FbOTyTwLCqMkK8hFQ_-WQSz_uN';

// Inicializa o cliente do Supabase
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const botaoEnviar = document.getElementById('botaoEnviar');
const mural = document.getElementById('mural');

// Função para buscar e desenhar todos os causos do banco na tela
async function carregarCausos() {
    mural.innerHTML = '<p>Carregando causos...</p>';

    // Pega os dados da tabela 'causos', ordenados do mais recente para o mais antigo
    const { data: causos, error } = await supabaseClient
        .from('causos')
        .select('*')
        .order('id', { ascending: false }); // Se preferir por ID decrescente

    if (error) {
        console.error('Erro ao carregar:', error);
        mural.innerHTML = '<p>Erro ao carregar os causos.</p>';
        return;
    }

    mural.innerHTML = ''; // Limpa o "Carregando..."

    // Desenha cada causo na tela
    causos.forEach(causo => {
        criarCartaoNaTela(causo.id, causo.autor, causo.texto);
    });
}

// Função auxiliar para desenhar o HTML do cartão
function criarCartaoNaTela(id, autor, texto) {
    const cartao = document.createElement('div');
    cartao.classList.add('cartao-causo');  

    cartao.innerHTML = `
        <p class="texto-causo">"${texto}"</p>
        <div class="rodape-cartao">
            <span class="autor-causo">${autor}</span>
            <span class="data-causo">hoje</span>
        </div>
        <button class="botao-apagar" data-id="${id}">Apagar</button>
    `;

    // Lógica para apagar o causo do banco de dados e da tela
    const botaoApagar = cartao.querySelector('.botao-apagar');
    botaoApagar.addEventListener('click', async function() {
        const { error } = await supabaseClient
            .from('causos')
            .delete()
            .eq('id', id);

        if (!error) {
            cartao.remove();
        } else {
            alert('Erro ao apagar o causo.');
        }
    });

    mural.prepend(cartao);
}

// 2. Evento de Enviar Novo Causo
botaoEnviar.addEventListener('click', async function(evento) {
    evento.preventDefault(); 

    const nomeDigitado = document.getElementById('nome').value;
    const textoDigitado = document.getElementById('textoCauso').value;

    if (textoDigitado.trim() === "") {
        alert("Escreva alguma coisa no seu causo antes de publicar!");
        return;
    }

    const autor = nomeDigitado.trim() === "" ? "anônimo" : nomeDigitado;

    // Salva lá no Banco de Dados do Supabase
    const { data, error } = await supabaseClient
        .from('causos')
        .insert([{ autor: autor, texto: textoDigitado }])
        .select();

    if (error) {
        console.error('Erro ao salvar:', error);
        alert('Erro ao publicar o causo.');
        return;
    }

    // Se salvou com sucesso, limpa os campos e recarrega o mural
    document.getElementById('nome').value = '';
    document.getElementById('textoCauso').value = '';
    document.getElementById('caixaFormulario').classList.add('escondido');

    // Recarrega os causos para o novo aparecer na hora
    carregarCausos();
});

// Quando a página abrir, carrega os causos salvos
carregarCausos();
