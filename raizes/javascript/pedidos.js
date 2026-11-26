const CHAVE_PEDIDOS = "rn_pedidos";

const etapas = [
    "Pedido realizado",
    "Pedido sendo preparado",
    "Pedido enviado",
    "Pedido entregue"
];

function obterPedidos() {
    return JSON.parse(localStorage.getItem(CHAVE_PEDIDOS) || "[]");
}

export function mostrarPedidos() {

    const listaOrdem = document.getElementById("listaOrdem");
    if (!listaOrdem) return;

    const pedidos = obterPedidos();

    // Se não existir nenhum pedido
    if (pedidos.length === 0) {
        listaOrdem.innerHTML = `
            <div class="estado-vazio">
                Você ainda não fez pedidos. Que tal escolher algo gostoso?
            </div>
        `;
        return;
    }

    const pedido = pedidos[pedidos.length - 1];

    listaOrdem.innerHTML = `
        <div class="pedido-acompanhamento">

            <div class="pedido-identificacao">
                <strong>Pedido #${pedido.id}</strong>
                <span>R$ ${pedido.total.toFixed(2)}</span>
            </div>

            <div class="pedido-etapas">

                ${etapas.map((etapa, indice) => `
                    <div class="pedido-etapa ${indice <= (pedido.etapa || 0) ? "concluida" : ""}">

                        <div class="etapa-indicador">
                            ${indice < (pedido.etapa || 0) ? "✓" : ""}
                        </div>

                        <div class="etapa-conteudo">
                            <strong>${etapa}</strong>
                            ${indice === pedido.etapa ? `
                                <small>Etapa atual do pedido</small>
                            ` : ""}
                        </div>

                    </div>
                `).join("")}

            </div>

        </div>
    `;
}

function atualizarEtapa(id, etapa) {

    const pedidos = obterPedidos();
    const pedido = pedidos.find(item => item.id === id);

    if (!pedido) return;

    pedido.etapa = etapa;

    localStorage.setItem(
        CHAVE_PEDIDOS,
        JSON.stringify(pedidos)
    );

    // Mostrar a etapa atual
    mostrarPedidos();

    // Quando chegar à entrega, reiniciar tudo
    if (etapa === 3) {

        setTimeout(() => {

            // Apagar todos os pedidos salvos
            localStorage.removeItem(CHAVE_PEDIDOS);

            // Restaurar a seção ao estado inicial
            const listaOrdem = document.getElementById("listaOrdem");

            listaOrdem.innerHTML = `
                <div class="estado-vazio">
                    Você ainda não fez pedidos. Que tal escolher algo gostoso?
                </div>
            `;

        }, 2500);
    }
 
}


        

 
export function iniciarEntrega(id) {

    const atrasos = [0, 4000, 9000, 14000];

    atrasos.forEach((tempo, indice) => {

        setTimeout(() => {
            atualizarEtapa(id, indice);
        }, tempo);

    });
}