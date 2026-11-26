import { showToast } from "./toast.js";

const PONTOS_POR_COMPRA = 5;
const PONTOS_PARA_CUPOM = 10;
const VALOR_CUPOM_FRETE = 12;
let contadorCupons = Number(localStorage.getItem("rn_contadorCupons")) || 0;

// Recuperar usuário conectado
function obterUsuarioAtual() {

    try {
        return JSON.parse(localStorage.getItem("rn_usuario")) || null;
    } catch (error) {
        showToast("Usuário não encontrado!");
        return null;    }

}

// Atualizar usuário no localStorage
function atualizarUsuario(alteracoes) {

    const usuario = obterUsuarioAtual();

    if (!usuario) return false;

    const usuarios = JSON.parse(
        localStorage.getItem("rn_usuarios")
    ) || [];

    const indice = usuarios.findIndex(
        item => item.email === usuario.email
    );

    if (indice === -1) return false;

    Object.assign(usuarios[indice], alteracoes);

    localStorage.setItem(
        "rn_usuarios",
        JSON.stringify(usuarios)
    );

    localStorage.setItem(
        "rn_usuario",
        JSON.stringify(usuarios[indice])
    );

    return true;

}

// Adicionar pontos após uma compra
export function adicionarPontos() {

    const usuario = obterUsuarioAtual();

    if (!usuario) return false;

    const pontosAtuais = Number(usuario.pontos) || 0;

    const sucesso = atualizarUsuario({
        pontos: pontosAtuais + PONTOS_POR_COMPRA // pontos atuais + 5
    });

    if (sucesso) {
        atualizarClube();
        mostrarRecompensas()
    }

    return sucesso;

}

// Consultar saldo de pontos
export function consultarPontos() {

    const usuario = obterUsuarioAtual();

    return usuario ? Number(usuario.pontos) || 0 : 0;

}

// Verificar se existe cupom disponível
export function temCupomFrete() {

    const usuario = obterUsuarioAtual();

    return usuario?.cupomFrete === true;

}

// Resgatar cupom de frete grátis
export function resgatarCupomFrete() {

    const pontos = consultarPontos();

    if (pontos < PONTOS_PARA_CUPOM) {
        showToast("Você precisa de 10 pontos para resgatar.");
        return false;
    }

    if (temCupomFrete()) {
        showToast("Você já possui um cupom de frete grátis.");
        return false;
    }

    const sucesso = atualizarUsuario({
        pontos: pontos - PONTOS_PARA_CUPOM,
        cupomFrete: true
    });

    if (sucesso) {
        showToast("Cupom de frete grátis resgatado!");
        atualizarClube();
        contadorCupons++;
        localStorage.setItem("rn_contadorCupons", contadorCupons);
    }

    return sucesso;

}

// Consumir cupom após finalizar pedido
export function consumirCupomFrete() {

    if (!temCupomFrete()) return false;

    const sucesso = atualizarUsuario({
        cupomFrete: false
    });

    if (sucesso) {

        // Diminuir a quantidade de cupons disponíveis
        let contadorCupons = Number(
            localStorage.getItem("rn_contadorCupons")
        ) || 0;

        if (contadorCupons > 0) {
            contadorCupons--;

            localStorage.setItem(
                "rn_contadorCupons",
                contadorCupons
            );
        }

        atualizarClube();
    }

    return sucesso;
}

// Atualizar cartão de fidelidade no HTML
export function atualizarClube() {

    const balanco = document.getElementById("balancoPontos");
    const progresso = document.getElementById("trackProgresso");
    const dicas = document.getElementById("pontoDicas");

    if (!balanco || !progresso || !dicas) return;

    const usuario = obterUsuarioAtual();
    const pontos = consultarPontos();

    balanco.textContent = pontos;

    const porcentagem = Math.min(
        (pontos / PONTOS_PARA_CUPOM) * 100,
        100
    );

    progresso.style.width = `${porcentagem}%`;

    if (!usuario) {

        dicas.textContent = "Entre na sua conta para acumular pontos.";

    } else if (temCupomFrete()) {

        dicas.textContent = "Você possui um cupom de frete grátis disponível!";

    } else if (pontos >= PONTOS_PARA_CUPOM) {

        dicas.textContent = "Você já pode resgatar seu cupom de frete grátis!";

    } else {

        dicas.textContent = `Faltam ${PONTOS_PARA_CUPOM - pontos} pontos para sua recompensa.`;

    }

}

// Mostrar recompensas na página
export function mostrarRecompensas() {

    const usuario = obterUsuarioAtual();

    if (!usuario) {
        showToast("Entre na sua conta para acessar as recompensas.");
        document.getElementById("botaoConta")?.click();
        return;
    }

    const lista = document.getElementById("listaRecompensa");

    if (!lista) return;

    const possuiCupom = temCupomFrete();
    const podeResgatar = consultarPontos() >= PONTOS_PARA_CUPOM
        && !possuiCupom;

    lista.innerHTML = `
        <div class="recompensa-item">

            <div>
                <h3>Frete grátis</h3>
                <p>
                    Troque 10 pontos por um cupom de
                    R$ ${VALOR_CUPOM_FRETE.toFixed(2)} de desconto no frete.
                </p>
            </div>

            <button
                type="button"
                data-resgatar-cupom
                ${!podeResgatar ? "disabled" : ""}
            >
                ${
                    possuiCupom
                        ? "Cupom disponível"
                        : podeResgatar
                            ? "Resgatar Cupom"
                            : "10 pontos necessários"
                }
            </button>

        </div>
    `;

}
