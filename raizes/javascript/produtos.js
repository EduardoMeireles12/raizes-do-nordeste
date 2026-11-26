
//FORMATAR PREÇO

export function formatarPreco(preco) {

    return preco.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

}

// PRODUTOS NO CARDÁPIO

export const produtos = [{
    id: 1,
    nome: "Tapioca",
    categoria: "Comidas",
    descricao: "Tapioca feita com fécula hidratada da mandioca, preparada em uma frigideira até formar uma massa macia e levemente crocante.",
    imagem: "../img/tapioca.jpg",
    preco: 9.00
    
},
{
    id: 2,
    nome: "Cuscuz",
    categoria: "Comidas",
    descricao: "Cuscuz tradicional feito com flocos de milho hidratados e cozidos no vapor, com textura macia e sabor característico do milho",
    imagem: "../img/cuscuz.jpg",
    preco: 13.50
    
},
{
    id: 3,
    nome: "Acarajé",
    categoria: "Comidas",
    descricao: "Bolinho típico da culinária baiana, feito com massa de feijão-fradinho, cebola e sal, frito no azeite de dendê e recheado com vatapá e camarão",
    imagem: "../img/acaraje.jpg",
    preco: 17.50
    
},

{
    id: 4,
    nome: "Buchada",
    categoria: "Comidas",
    descricao: "Prato tradicional nordestino preparado com vísceras de bode temperadas com ervas, cebola, alho e especiarias, cozidas lentamente até ficarem macias e saborosas",
    imagem: "../img/buchada.jpg",
    preco: 40.00
    
},

{
    id: 5,
    nome: "Canjica",
    categoria: "Comidas",
    descricao: "Sobremesa cremosa feita com milho-branco cozido no leite, leite condensado, açúcar e leite de coco, finalizada com canela",
    imagem: "../img/canjica.jpg",
    preco: 15.20
    
},

{
    id: 6,
    nome: "Moqueca",
    categoria: "Comidas",
    descricao: "Prato típico brasileiro preparado com peixe cozido lentamente em leite de coco, azeite de dendê, tomate, cebola, pimentão e temperos frescos.",
    imagem: "../img/moqueca.jpg",
    preco: 55.00
    
},

{
    id: 7,
    nome: "Carne de Sol",
    categoria: "Comidas",
    descricao: "Carne bovina levemente salgada e curada, preparada na chapa ou na manteiga de garrafa, servida com temperos e acompanhamentos típicos nordestinos",
    imagem: "../img/carne-de-sol.jpg",
    preco: 42.25
    
},

{
    id: 8,
    nome: "Vatapa",
    categoria: "Comidas",
    descricao: "Prato tradicional da culinária baiana, preparado com pão ou farinha, leite de coco, azeite de dendê, camarão, amendoim e castanha de caju, formando um creme encorpado e saboroso.",
    imagem: "../img/vatapa.jpg",
    preco: 22.15
    
},

{
    id: 9,
    nome: "Caruru",
    categoria: "Comidas",
    descricao: "Prato típico da culinária baiana feito com quiabo cozido, camarão seco, azeite de dendê, amendoim, castanha de caju e temperos, formando um creme saboroso.",
    imagem: "../img/caruru.jpg",
    preco: 24.00 
    
},

{
    id: 10,
    nome: "Panelada",
    categoria: "Comidas",
    descricao: "Prato tradicional nordestino preparado com bucho e tripas bovinas, cozidos lentamente com tomate, cebola, pimentão, alho e temperos regionais.",
    imagem: "../img/panelada.jpg",
    preco: 38.45 
    
},

{
    id: 11,
    nome: "Cajuína",
    categoria: "Bebidas",
    descricao: "Bebida típica nordestina feita a partir do suco de caju clarificado e filtrado, com sabor suave, levemente adocicado e refrescante",
    imagem: "../img/cajuina.jpg",
    preco: 7.00
    
},

{
    id: 12,
    nome: "Garapa",
    categoria: "Bebidas",
    descricao: "Bebida natural feita a partir da cana-de-açúcar moída na hora, com sabor doce e refrescante, podendo ser servida gelada com limão.",
    imagem: "../img/garapa.jpg",
    preco: 6.35
    
},

{
    id: 13,
    nome: "Aluá",
    categoria: "Bebidas",
    descricao: "Bebida fermentada tradicional nordestina, preparada com cascas de abacaxi, água, açúcar e especiarias, resultando em um sabor levemente adocicado e refrescante.",
    imagem: "../img/alua.jpg",
    preco: 8.50
    
},

{
    id: 14,
    nome: "Tiquira",
    categoria: "Bebidas",
    descricao: "Bebida alcoólica tradicional do Maranhão, produzida a partir da fermentação e destilação da mandioca, com sabor marcante e coloração geralmente azulada ou arroxeada.",
    imagem: "../img/tiquira.jpg",
    preco: 15.00
    
}

];

// RENDERIZAR PRODUTOS NO CARDÁPIO

export function renderizarCardapio(categoria = "Todos") {
    const produtoGrid = document.getElementById("produtoGrid");

    // Filtrar os produtos de acordo com a categoria
    const produtosFiltrados = categoria === "Todos"
        ? produtos
        : produtos.filter(produto => produto.categoria === categoria);

    // Criar os cards
    produtoGrid.innerHTML = produtosFiltrados.map(produto => `

        <article class="produto-cartao">

            <div class="produto-arte">

                <img
                    src="${produto.imagem}"
                    alt="${produto.nome}"
                >

            </div>

            <div class="produto-corpo">

                <h3>${produto.nome}</h3>

                <p class="produto-descricao">${produto.descricao}</p>

                <div class="produto-rodape">

                    <strong class="preco">
                        ${formatarPreco(produto.preco)}
                    </strong>

                    <button
                        class="add-botao"
                        data-adicionar="${produto.id}"
                    >
                        + Adicionar
                    </button>

                </div>

            </div>

        </article>

    `).join("");
}