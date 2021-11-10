// Chat component
const chatComponent = () => {
    return {
        textarea_message: "",
        messages: [],

        getChatTime(actual_date) {

            fecha = new Date;
            fecha.setTime(actual_date)

            let hour = String(fecha.getHours());
            let minutes = String(fecha.getMinutes());

            // Caso hora
            if (Number(hour) < 10)
                hour = `0${hour}`;

            // Caso hora
            if (Number(minutes) < 10)
                minutes = `0${minutes}`

            return `${hour}:${minutes}`;
        },

        send() {

            // Si el mensaje está vacio, ignorar
            if (this.textarea_message == "")
                return;

            // Si solo contiene espacios, tabs, etc
            if (!this.textarea_message.replace(/\s/g, '').length)
                return;


            this.debug()

            // Agremos al final de la lista
            this.messages.push(
                {
                    username: "Juan Perez",
                    text: this.textarea_message,
                    time: this.getChatTime(Date.now())
                }
            );

            this.textarea_message = ""
        },

        scrollBottom() {
            let chat = document.getElementById("chat");
            chat.scrollTop = chat.scrollHeight - chat.clientHeight;
        },
        debug() {
            console.log(this.textarea_message);
        }
    }
}

const botonToggleChat = () => {
    return {
        not_seen_messages: 0,
        toggleChat() {
            this.not_seen_messages = 0;
            this.show_chat = true;
        },

        debug() {
            console.log(not_seen_messages);
        }

    }
}