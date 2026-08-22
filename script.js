const SUPABASE_URL = 'https://gkvfxmuhoqkvmxpyoqrd.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Vryk6FbOTyTwLCqMkK8hFQ_-WQSz_uN';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const botaoEnviar = document.getElementById('botaoEnviar');
const mural = document.getElementById('mural');

// Função para buscar e desenhar todos os causos do banco na tela
async function carregarCausos() {
    mural.innerHTML = '<p>Carregando causos...</p>';

    // Pega os dados da tabela 'causos' sem ordenar por id
    const { data: causos, error } = await supabaseClient
        .from('causos')
        .select('*');

    if (error) {
        console.error('Erro detalhado do Supabase:', JSON.stringify(error, null, 2));
        mural.innerHTML = '<p>Erro ao carregar os causos.</p>';
        return;
    }

    mural.innerHTML = ''; 

    if (causos.length === 0) {
        mural.innerHTML = '<p>Ainda não há causos publicados. Seja o primeiro!</p>';
        return;
    }

    // Desenha cada causo na tela
    causos.forEach(causo => {
        criarCartaoNaTela(causo.autor, causo.text);
    });
}

// Função auxiliar para desenhar o HTML do cartão
function criarCartaoNaTela(autor, text) {
    const cartao = document.createElement('div');
    cartao.classList.add('cartao-causo');  

    cartao.innerHTML = `
        <p class="texto-causo">"${text}"</p>
        <div class="rodape-cartao">
            <span class="autor-causo">${autor}</span>
            <span class="data-causo">hoje</span>
        </div>
        <button class="botao-apagar">Apagar</button>
    `;

    // Lógica para apagar o causo do banco de dados pelo texto exato
    const botaoApagar = cartao.querySelector('.botao-apagar');
    botaoApagar.addEventListener('click', async function() {
        const { error } = await supabaseClient
            .from('causos')
            .delete()
            .eq('text', text);

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

    // Salva no Supabase
    const { data, error } = await supabaseClient
        .from('causos')
        .insert([{ autor: autor, text: textoDigitado }])
        .select();

    if (error) {
        console.error('Erro ao salvar:', JSON.stringify(error, null, 2));
        alert('Erro ao publicar o causo.');
        return;
    }

    document.getElementById('nome').value = '';
    document.getElementById('textoCauso').value = '';
    document.getElementById('caixaFormulario').classList.add('escondido');

    carregarCausos();
});

// Quando a página abrir, carrega os causos salvos
carregarCausos();
