// Toast responsavel pelas notificações da tela

const toast = document.getElementById("toast");

let toastTimeout;

export function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimeout);

    toastTimeout = setTimeout(() =>{
        toast.classList.remove("show");
    }, 3000);

}

