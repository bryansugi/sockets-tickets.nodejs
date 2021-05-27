const lblEscritorio = document.querySelector('h1')
const btnAtender = document.querySelector('button')
const lblTicket = document.querySelector('small')
const divAlerta = document.querySelector('.alert')
const lblPendientes = document.querySelector('#lblPendientes')

const serchParams = new URLSearchParams(window.location.search)

if (!serchParams.has('escritorio')) {
    window.location = 'index.html'
    throw new Error('El escritorio es obligatorio')
}

const escritorio = serchParams.get('escritorio')
lblEscritorio.innerText = escritorio

divAlerta.style.display = 'none'

const socket = io();

socket.on('connect', () => {
    // console.log('Conectado');
    btnAtender.disabled = false
});

socket.on('disconnect', () => {
    // console.log('Desconectado del servidor');
    btnAtender.disabled = true
});

socket.on('tickets-cola', (respuesta) => {
    lblPendientes.innerText = respuesta
})


btnAtender.addEventListener('click', () => {

    socket.emit('atender-ticket', { escritorio }, ({ ok, ticketAtender }) => {
        if (!ok) {
            lblTicket.innerText = 'Ninguno'
            return divAlerta.style.display = ''
        }

        lblTicket.innerText = `El ticket ${ticketAtender.numero}`
    });

});