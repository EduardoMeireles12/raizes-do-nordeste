import { mostrarConta } from "./conta.js";
import { closeModal } from "./modal.js";
import "./eventosConta.js";
import { renderizarCardapio } from "./produtos.js";
import "./eventosCarrinho.js";


// Elementos HTML

const abrirLogin = document.getElementById("botaoConta");
const modalClose = document.getElementById("modalClose");
const und = document.getElementById("selecaoUnd");
const indicadorUnd = document.getElementById("headerUnit");


// Eventos permanentes

abrirLogin.addEventListener("click", () => {
    mostrarConta();
});

modalClose.addEventListener("click", () => {
    closeModal();
});

// Indicador de unidade
und.addEventListener("change", ()=>{
    indicadorUnd.textContent = und.options[und.selectedIndex].text;
})

// Filtrar produtos por categoria

document.addEventListener("click", (event) => {

    const botaoCategoria = event.target.closest("[data-category]");

    if (!botaoCategoria) return;

    const categoria = botaoCategoria.dataset.category;

    renderizarCardapio(categoria);

    // Atualizar botão ativo
    document.querySelectorAll("[data-category]").forEach(botao => {
        botao.classList.remove("ativo");
    });

    botaoCategoria.classList.add("ativo");

});

document.querySelectorAll('.produto-descricao').forEach(descricao => {
    descricao.addEventListener('click', (e) => {
        e.stopPropagation();

        descricao.classList.toggle('aberto');
    });
});

document.addEventListener('click', () => {
    document.querySelectorAll('.produto-descricao.aberto')
        .forEach(descricao => {
            descricao.classList.remove('aberto');
        });
});