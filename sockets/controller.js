const ticketControl = require("../models/ticket-control");

const ticket = new ticketControl()

const socketController = (socket) => {

    socket.emit('ultimo-ticket', ticket.ultimo)

    socket.emit('ultimos-cuatro', ticket.ultimos4)

    socket.emit('tickets-cola', ticket.tickets.length)

    socket.on('siguiente-ticket', (payload, callback) => {

        const siguiente = ticket.siguiente()
        callback(siguiente)

        //TODO: notificar que hay un nuevo ticket pendiente de asignar
        socket.broadcast.emit('tickets-cola', ticket.tickets.length)

    })

    socket.on('atender-ticket', ({ escritorio }, callback) => {

        if (!escritorio) {
            return callback({
                ok: false,
                msg: 'El escritorio es obligatorio'
            })
        }

        const ticketAtender = ticket.atenderTicket(escritorio)

        socket.broadcast.emit('ultimos-cuatro', ticket.ultimos4)
        socket.emit('tickets-cola', ticket.tickets.length)
        socket.broadcast.emit('tickets-cola', ticket.tickets.length)

        if (!ticketAtender) {
            callback({
                ok: false,
                msg: 'Ya no hay tickets pendientes'
            })
        } else {
            callback({
                ok: true,
                ticketAtender
            })
        }



    })

}



module.exports = {
    socketController
}