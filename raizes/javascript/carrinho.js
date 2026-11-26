import { showLogin } from "./conta.js";
import { showToast } from "./toast.js";
import { openModal, closeModal } from "./modal.js";
import {
    adicionarPontos,
    temCupomFrete,
    consumirCupomFrete, 
} from "./recompensas.js";
import { iniciarEntrega } from "./pedidos.js";

const CHAVE_CARRINHO = "rn_carrinho";
const VALOR_FRETE = 12;

let cupomAplicado = false;
let pedidoEmFinalizacao = false;

// Carrinho carregado do localStorage
let carrinho = JSON.parse(
    localStorage.getItem(CHAVE_CARRINHO) || "[]"
);

// Salvar carrinho
function salvarCarrinho() {

    localStorage.setItem(
        CHAVE_CARRINHO,
        JSON.stringify(carrinho)
    );

}

// Verificar se existe usuário logado

function usuarioLogado(){
    const usuario = localStorage.getItem("rn_usuario");

    return usuario !== null;
}

// Adicionar produto ao carrinho

export function adicionarAoCarrinho(produto){
    // Verifica se o usuario está logado

    if(!usuarioLogado()){
        showToast("Log-in ou registre-se para poder comprar!");
        showLogin();
        return;
    }

    //Verificar se o produto já existe
    const produtoExiste = carrinho.find(item => item.id ===produto.id);

    if(produtoExiste){
        produtoExiste.quantidade++;
    } else {
        carrinho.push({...produto, quantidade: 1});

        salvarCarrinho();
        console.log(carrinho);
    }

    showToast(`${produto.nome} adicionado ao carrinho!`);
    salvarCarrinho();
    atualizarContadorCarrinho();
}

// Atualiza o carrinho desktop e o carrinho mobile
export function atualizarContadorCarrinho() {

    const contadorCarrinho = document.getElementById("contadorCarrinho");
    const contadorMobile = document.getElementById("contador-mobile");

    const quantidade = carrinho.reduce((total, item) => {
        return total + item.quantidade;
    }, 0);

    if (contadorCarrinho) {
        contadorCarrinho.textContent = quantidade;
    }

    if (contadorMobile) {
        contadorMobile.textContent = quantidade;
    }
}

// Mostra o carrinho modal
export function mostrarCarrinho(){
       if(!usuarioLogado()){
        showToast("Log-in ou registre-se para ter acesso ao carrinho");
        showLogin();
        return;
    }
    renderizarCarrinho();
    openModal();
}

// Aplicar cupom de frete grátis
export function aplicarCupom() {

    if (!temCupomFrete()) {
        showToast("Você não possui um cupom disponível.");
        return;
    }

    cupomAplicado = true;

    showToast("Cupom de frete grátis aplicado!");

    renderizarCarrinho();
}

// Remover cupom aplicado
export function removerCupom() {

    cupomAplicado = false;
    renderizarCarrinho();
}

// Calcular total incluindo frete
export function calcularTotalFinal() {

    const subtotal = calcularTotal();

    const frete = cupomAplicado ? 0 : VALOR_FRETE;

    return subtotal + frete;
}

// Renderiza o carrinho no innerHTML da página
export function renderizarCarrinho(){

    const modalConteudo = document.getElementById("modalConteudo");

    modalConteudo.innerHTML = `
        <div  class="cabecalho-carrinho">
        <h2 id="modalTitle">Meu carrinho</h2>
          ${carrinho.length > 0 ? `
                <button data-limpar-carrinho>
                    Limpar carrinho
                </button>
            ` : ""}
            </div>
    `;

    if(carrinho.length === 0){
        modalConteudo.innerHTML += `
            <p>Seu carrinho está vazio.</p>
        `;
        return;
    }

    carrinho.forEach(item => {

        modalConteudo.innerHTML += `
            <div class="item-carrinho">

                <h3>${item.nome}</h3>

                <p>Preço: R$ ${item.preco.toFixed(2)}</p>

                <div class="controle-quantidade">

                    <button data-diminuir="${item.id}">−</button>

                    <span>${item.quantidade}</span>

                    <button data-aumentar="${item.id}">+</button>

                </div>

                <button data-remover="${item.id}">
                    Remover
                </button>

            </div>
        `;


    });

    // Exibir total da compra
const subtotal = calcularTotal();
const frete = VALOR_FRETE;
const totalFinal = calcularTotalFinal();

modalConteudo.innerHTML += `

    <div class="resumo-carrinho">

        <div class="linha-resumo">
            <span>Subtotal</span>
            <span>R$ ${subtotal.toFixed(2)}</span>
        </div>

        <div class="linha-resumo">
            <span>Frete</span>
            <span>
                ${
                    cupomAplicado
                        ? `<del>R$ ${frete.toFixed(2)}</del> Grátis`
                        : `R$ ${frete.toFixed(2)}`
                }
            </span>
        </div>

        <div class="total-carrinho">
            <h3>Total: R$ ${totalFinal.toFixed(2)}</h3>
        </div>

    </div>

`;

// Área do cupom
if (cupomAplicado) {

    modalConteudo.innerHTML += `
        <div class="cupom-carrinho">
            <p>Cupom de frete grátis aplicado!</p>

            <button type="button" data-remover-cupom>
                Remover cupom
            </button>
        </div>
    `;

} else if (temCupomFrete()) {

    modalConteudo.innerHTML += `
        <div class="cupom-carrinho">
            <p>Você possui um cupom de frete grátis!</p>

            <button type="button" data-aplicar-cupom>
                Aplicar cupom
            </button>
        </div>
    `;

}
    

// Fazer pagamento
modalConteudo.innerHTML += `

     <div class="pagamento-carrinho">

        <h3>Forma de pagamento</h3>

        <label>
            <input type="radio" name="pagamento" value="pix" checked>
            Pix
        </label>

        <label>
            <input type="radio" name="pagamento" value="cartao">
            Cartão
        </label>



    </div>

     <div class="consentimento-pagamento">

        <label>
            <input
                type="checkbox"
                id="aceitarTermos"
                required
            >

           <p> Concordo em fornecer as informações básicas necessárias
            para processar meu pedido e realizar a transação.</p>
        </label>

    </div>

    <button type="button" data-finalizar-pedido>
        Finalizar pedido
    </button>
`;

}

export function limparCarrinho(){

    carrinho = [];
    cupomAplicado = false;

    salvarCarrinho();

    atualizarContadorCarrinho();

     renderizarCarrinho();

}

// Aumentar quantidade
export function aumentarQuantidade(id){

    const produto = carrinho.find(item => item.id === id);

    if(produto){
        produto.quantidade++;
    }

    salvarCarrinho();
    atualizarContadorCarrinho();
    renderizarCarrinho();
}

// Diminuir quantidade
export function diminuirQuantidade(id){

    const produto = carrinho.find(item => item.id === id);

    if(produto){
        produto.quantidade--;

        if(produto.quantidade <= 0){
            carrinho = carrinho.filter(item => item.id !== id);
        }
    }

    salvarCarrinho();
    atualizarContadorCarrinho();
    renderizarCarrinho();
}

// Remover produto
export function removerProduto(id){

    carrinho = carrinho.filter(item => item.id !== id);

    salvarCarrinho();
    atualizarContadorCarrinho();
    renderizarCarrinho();
}

//Calcular total da compra

export function calcularTotal(){

    return carrinho.reduce((total, item) => {
        return total + (item.preco * item.quantidade);
    }, 0);

}

// Finalizar pedido
export function finalizarPedido() {

    if (pedidoEmFinalizacao) return;

    if (carrinho.length === 0) {
        showToast("Seu carrinho está vazio.");
        return;
    }

    const pagamentoSelecionado = document.querySelector(
        'input[name="pagamento"]:checked'
    );

    if (!pagamentoSelecionado) {
        showToast("Selecione uma forma de pagamento.");
        return;
    }

    pedidoEmFinalizacao = true;

    const subtotal = calcularTotal();
    const frete = cupomAplicado ? 0 : VALOR_FRETE;
    const total = subtotal + frete;
    const pagamento = pagamentoSelecionado.value;

    // Registrar pedido no histórico
    const pedidos = JSON.parse(
        localStorage.getItem("rn_pedidos") || "[]"
    );

    const pedido = {
        id: Math.floor(100000 + Math.random() * 900000),
        produtos: [...carrinho],
        subtotal: subtotal,
        frete: frete,
        total: total,
        pagamento: pagamento,
        data: new Date().toISOString()
    };

    pedidos.push(pedido);

    localStorage.setItem(
        "rn_pedidos",
        JSON.stringify(pedidos)
    );

    // Consumir cupom, se utilizado
    if (cupomAplicado) {

        if (!consumirCupomFrete()) {
            pedidos.pop();

            localStorage.setItem(
                "rn_pedidos",
                JSON.stringify(pedidos)
            );

            pedidoEmFinalizacao = false;
            showToast("Não foi possível utilizar o cupom.");
            return;
        }
        consumirCupomFrete();

    }

    // Conceder 5 pontos pela compra
    adicionarPontos();

    // Limpar carrinho
    carrinho = [];
    cupomAplicado = false;

    salvarCarrinho();
    atualizarContadorCarrinho();

    pedidoEmFinalizacao = false;

    closeModal();

    showToast(
        `Pedido finalizado! Total: R$ ${total.toFixed(2)}. Você ganhou 5 pontos!`
    );

    document.getElementById("secaoPedidos").scrollIntoView({
    behavior: "smooth" });
    iniciarEntrega(pedido.id);


}

atualizarContadorCarrinho();