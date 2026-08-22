 
const botaoEnviar = document.getElementById('botaoEnviar');
const mural = document.getElementById('mural');

botaoEnviar.addEventListener('click', function(evento) {
    evento.preventDefault(); 

    const nomeDigitado = document.getElementById('nome').value;
    const textoDigitado = document.getElementById('textoCauso').value;

    if (textoDigitado.trim() === "") {
        alert("Escreva alguma coisa no seu causo antes de publicar!");
        return;
    }

    const autor = nomeDigitado.trim() === "" ? "anônimo" : nomeDigitado;

     
    const cartao = document.createElement('div');
    cartao.classList.add('cartao-causo');  

     
    cartao.innerHTML = `
        <p class="texto-causo">"${textoDigitado}"</p>
        <div class="rodape-cartao">
            <span class="autor-causo">${autor}</span>
            <span class="data-causo">hoje</span>
        </div>
        <button class="botao-apagar">Apagar</button>
    `;

   
    const botaoApagar = cartao.querySelector('.botao-apagar');
    botaoApagar.addEventListener('click', function() {
        cartao.remove(); // Tira o cartão da tela
    });

    
    mural.prepend(cartao);

     
    document.getElementById('nome').value = '';
    document.getElementById('textoCauso').value = '';
    document.getElementById('caixaFormulario').classList.add('escondido');
});