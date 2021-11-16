const socket = io();
socket.on("connect", () => {
    console.log("Me conecté al server satisfactoriamente");
});

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

        receive() {
            socket.on("chat", (data) => {
                console.log(data);
                this.messages.push(data);
                if (!this.show_chat)
                    this.not_seen_messages += 1
            })
        }, 
        
        send() {

            // Si el mensaje está vacio, ignorar
            if (this.textarea_message == "")
                return;

            // Si solo contiene espacios, tabs, etc
            if (!this.textarea_message.replace(/\s/g, '').length)
                return;


            this.debug()

            message_data = {
                username: window.room_settings.username,
                text: this.textarea_message,
                time: this.getChatTime(Date.now())
            }

            socket.emit("chat", message_data)
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
        toggleChat() {
            this.not_seen_messages = 0;
            this.show_chat = true;
        },

        debug() {
            console.log(not_seen_messages);
        }

    }
}

dragElement(document.getElementById("dragdiv"))
dragElement(document.getElementById("dragdiv2"))


function dragElement(elmnt) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    /*
    if (document.getElementById(elmnt.id + "header"))
      document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    else 
    */
    
    elmnt.onmousedown = dragMouseDown;
  
    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();

        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
      
        document.onmousemove = elementDrag;
    }
  
    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();

        const screen_width = document.body.clientWidth;
        const screen_height = document.body.clientHeight;

        if (e.clientX <= 0 || e.clientX >= screen_width)
            return;
        if (e.clientY <= 0 || e.clientY >= screen_height)
            return;


        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;


        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
  
    function closeDragElement() {   
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
  }