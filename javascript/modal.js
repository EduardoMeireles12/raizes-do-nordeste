// Fecha e abre o modal

const modalBackdrop = document.getElementById("modalBackdrop");

export function openModal(){
    modalBackdrop.classList.remove("escondido");

}

export function closeModal(){
    modalBackdrop.classList.add("escondido");
}