import {
    showLogin,
    mostrarRegistro,
    registrar,
    login,
    logout
} from "./conta.js";
import { mostrarRecompensas, resgatarCupomFrete, atualizarClube } from "./recompensas.js";

// Abre e fecha login/cadastro

document.addEventListener("click", (event) => {

    if (event.target.closest("#cadastrar")) {
        mostrarRegistro();
    }

    if (event.target.closest("#showLogin")) {
        showLogin();
    }

    if (event.target.closest("#logoutBotao")) {
        logout();
        atualizarClube();
    }

    // Abrir recompensas
    if (event.target.closest("#botaoRecompensas")) {
        mostrarRecompensas();
    }

    // Resgatar cupom
    if (event.target.closest("[data-resgatar-cupom]")) {

        if (resgatarCupomFrete()) {
            mostrarRecompensas();
        }
    }

});

// Autentifica email
document.addEventListener("input", (event) => {

    if (event.target.id === "registrarEmail") {

        const email = event.target;

        if (email.validity.typeMismatch) {

            email.setCustomValidity("Por favor, digite um e-mail válido.");

        } else {

            email.setCustomValidity("");

        }

    }

});

// Registra usuario/faz login
document.addEventListener("submit", (event) => {

    if (event.target.id === "registerForm") {
        event.preventDefault();

        const nome = document.getElementById("registrarNome").value;
        const email = document.getElementById("registrarEmail").value;
        const senha = document.getElementById("registrarSenha").value;
        const mail = document.getElementById("registrarEmail");



        registrar(nome, email, senha);
    }

    if (event.target.id === "loginForm") {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value;
        const senha = document.getElementById("loginPassword").value;

        login(email, senha);
        atualizarClube();

    }

});

atualizarClube();