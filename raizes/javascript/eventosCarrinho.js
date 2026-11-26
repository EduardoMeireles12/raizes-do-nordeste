import {
    adicionarAoCarrinho,
    mostrarCarrinho,
    aumentarQuantidade,
    diminuirQuantidade,
    removerProduto,
    limparCarrinho,
    aplicarCupom,
    removerCupom,
    finalizarPedido
} from "./carrinho.js";
import { produtos, renderizarCardapio } from "./produtos.js";
import { showToast } from "./toast.js";

// Eventos para adicionar produtos
document.addEventListener("click", (event) => {
    const botaoAdicionar = event.target.closest("[data-adicionar]");

    if(!botaoAdicionar) return;

    const id = Number(botaoAdicionar.dataset.adicionar);

    const produto = produtos.find(item => item.id ===id);

    if(produto){
        adicionarAoCarrinho(produto);
    }

    
});


// Abrir o carrinho
const botaoCarrinho = document.getElementById("botao-carrinho");
const mobileCarrinho = document.getElementById("mobileCarrinho");
botaoCarrinho.addEventListener("click", ()=> {
    mostrarCarrinho();
});

mobileCarrinho.addEventListener("click", () => {
    mostrarCarrinho();
});



//Adicionar, diminuir, remover do carrinho

document.addEventListener("click", (event) => {

    const aumentar = event.target.closest("[data-aumentar]");
    const diminuir = event.target.closest("[data-diminuir]");
    const remover = event.target.closest("[data-remover]");
    const limpar = event.target.closest("[data-limpar-carrinho]");
    const aplicar = event.target.closest("[data-aplicar-cupom]");
    const removerCupomBotao = event.target.closest("[data-remover-cupom]");
    const finalizar = event.target.closest("[data-finalizar-pedido]");

    if(aumentar){
        aumentarQuantidade(Number(aumentar.dataset.aumentar));
    }

    if(diminuir){
        diminuirQuantidade(Number(diminuir.dataset.diminuir));
    }

    if(remover){
        removerProduto(Number(remover.dataset.remover));
    }

    if(limpar){
    limparCarrinho();
    }

    if (remover) removerProduto(Number(remover.dataset.remover));

    if (limpar) limparCarrinho();

    if (aplicar) aplicarCupom();

    if (removerCupomBotao) removerCupom();


    if (finalizar) {

    const aceitarTermos = document.getElementById("aceitarTermos");

    if (!aceitarTermos.checked) {
        showToast("Você precisar concordar para finalizar o pedido!");
        return;
    }

    finalizarPedido();

}
   


});

renderizarCardapio();