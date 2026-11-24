import { openModal, closeModal } from "./modal.js";
import { showToast } from "./toast.js";
import { limparCarrinho } from "./carrinho.js";

const modalConteudo = document.getElementById("modalConteudo");

// Dados do Usuário

let users = [];

// procura usuarios no localStorage
try {
    users = JSON.parse(localStorage.getItem("rn_usuarios")) || [];
} catch(error){
    users = [];
}

// Recupera o usuário conectado.

let user = null;

try {
    user = JSON.parse(localStorage.getItem("rn_usuario")) || null;
} catch (error){
    user = null;
}

// TELA DE LOGIN

export function showLogin() {

    modalConteudo.innerHTML = `

        <h2 id="modalTitle">Entrar na conta</h2>

        <form class="formulario" id="loginForm">

            <div class="form-grupo">

                <label for="loginEmail">E-mail</label>

                <input
                    type="email"
                    id="loginEmail"
                    name="email"
                    placeholder="exemplo@gmail.com"
                    required
                >

            </div>


            <div class="form-grupo">

                <label for="loginPassword">Senha</label>

                <input
                    type="password"
                    id="loginPassword"
                    name="password"
                    placeholder="Digite sua senha"
                    required
                >

            </div>


            <button type="submit" class="botao-primario">
                Entrar
            </button>

        </form>


        <p>
            Ainda não tem uma conta?

            <button class="botao-luz" type="button" id="cadastrar">
                Cadastre-se
            </button>
        </p>

    `;

    openModal();

}

// Tela de Cadastro 

export function mostrarRegistro() {

    modalConteudo.innerHTML = `

        <h2 id="modalTitle">Criar uma conta</h2>

        <form class="formulario" id="registerForm">

            <div class="form-grupo">

                <label for="registrarNome">Nome</label>

                <input
                    type="text"
                    id="registrarNome"
                    name="name"
                    placeholder="Seu nome"
                    required
                >

            </div>


            <div class="form-grupo">

                <label for="registrarEmail">E-mail</label>

                <input
                    type="email"
                    id="registrarEmail"
                    name="email"
                    placeholder="exemplo@gmail.com"
                    required
                >

            </div>


            <div class="form-grupo">

                <label for="registrarSenha">Senha</label>

                <input
                    type="password"
                    id="registrarSenha"
                    name="password"
                    placeholder="Crie uma senha"
                    minlength="4"
                    required
                >

            </div>

                <label for="aceitarTermos">    
                <input type="checkbox" id="aceitarTermos" required>
                Li e concordo com os Termos de Uso e Política de Privacidade.
                 </label>

        <details>
                        <summary>Consultar Termos de Uso e Política de Privacidade</summary>
                         
            <div class="termos-conteudo">
                 <h4>Aceitação dos Termos</h4>
                    <p>
                Ao acessar e utilizar a plataforma Raízes do Nordeste, o usuário
                declara estar ciente e de acordo com os presentes
                Termos de Uso e Política de Privacidade. Caso não
                concorde com alguma das condições estabelecidas,
                deverá interromper a utilização dos serviços.
                  </p>
            </div>
         </details>


            <button type="submit" class="botao-primario">
                Cadastrar
            </button>

        </form>


        <p>
            Já possui uma conta?

            <button class="botao-luz" type="button" id="showLogin">
                Fazer login
            </button>
        </p>

    `;

    openModal();

}

//Cadastrar usuario

export function registrar(nome, email, senha){

    users = JSON.parse(localStorage.getItem("rn_usuarios")) || [];
    // verifica se o email já esta cadastrado
    const usuarioExiste = users.find(user => user.email.toLowerCase() === email.toLowerCase());

    if(usuarioExiste){
        showToast("Este e-mail já está cadastrado.");
        return;
    }

        // Cria um novo usuário.

        const newUser = {
        nome: nome,
        email: email,
        senha: senha,
        pontos: 0,
        cupomFrete: false
    };

        // Adiciona ao array.
        users.push(newUser);

        // Salva aos usuários

        localStorage.setItem("rn_usuarios", JSON.stringify(users));

        showToast("Cadastro realizado com sucesso!");

        // Volta para a tela de login
        showLogin();

}

// Fazer login

export function login(email, senha){

    const usuariosSalvos = JSON.parse(
        localStorage.getItem("rn_usuarios")
    ) || [];

    console.log("Email recebido:", email);
    console.log("Senha recebida:", senha);
    console.log("Usuários salvos:", usuariosSalvos);

    const usuarioEncontrado = usuariosSalvos.find(
        usuario =>
            usuario.email.trim().toLowerCase() === email.trim().toLowerCase() &&
            usuario.senha === senha
    );

    if(!usuarioEncontrado){
        showToast("Email ou senha incorretos");
        return;
    }

    user = {
        nome: usuarioEncontrado.nome,
        email: usuarioEncontrado.email,
        pontos: usuarioEncontrado.pontos,
        cupomFrete: usuarioEncontrado.cupomFrete || false
    };

    localStorage.setItem("rn_usuario", JSON.stringify(user));

    closeModal();
    showToast("Login realizado com sucesso!");
}

//MOSTRAR CONTA

export function mostrarConta() {
    // Recupera os dados atualizados do usuário
    user = JSON.parse(localStorage.getItem("rn_usuario")) || null;

    // Se não estiver conectado, mostra o login.

    if (!user) {

        showLogin();

        return;

    }


    modalConteudo.innerHTML = `

        <h2 id="modalTitle">Minha conta</h2>

        <div class="conta-info">

            <p>
                Nome:
                <strong id="contaNome"></strong>
            </p>

            <p>
                E-mail:
                <strong id="contaEmail"></strong>
            </p>

            <p>
                Pontos:
                <strong id="contaPontos"></strong>
            </p>
            <p>
              Cupons resgatados:
             <strong id="contaCupons"></strong>
             </p>

        </div>


        <button
            type="button"
            id="logoutBotao"
            class="botao-primario"
        >
            Sair da conta
        </button>

    `;


    // Preenche os dados do usuário.

    document.getElementById("contaNome").textContent = user.nome;

    document.getElementById("contaEmail").textContent = user.email;

    document.getElementById("contaPontos").textContent = user.pontos;

    document.getElementById("contaCupons").textContent =
    localStorage.getItem("rn_contadorCupons") || 0;


    openModal();

}

// Fazer Logout

export function logout(){
    user = null;
    localStorage.removeItem("rn_usuario");
    limparCarrinho();
    closeModal();
    showToast("Você saiu da sua conta.");
}

// Verificar se está conectado

export function isLoggedIn() {
    return user !== null;
}