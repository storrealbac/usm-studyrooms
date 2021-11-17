// Conexión en tiempo real
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
            });
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

// Barra superior
const existYoutubeVideo = async (url) => {
    const regexp_youtube_url = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/gi;

    if (!regexp_youtube_url.test(url))
        return false;

    //ejemplo → https://www.youtube.com/watch?v=RfcLP-bvebI
    const video_id = url.split("v=")[1]

    let thumbnail = new Image();
    thumbnail.src = `http://img.youtube.com/vi/${video_id}/mqdefault.jpg`;

    const verifier = new Promise ( (resolve, reject) => {
        thumbnail.onload = function() {
            resolve(this.width != 120)
        }
    });

    return verifier;
}

const spawnYoutubeComponent = (youtube_url) => {
    const video_id = youtube_url.split("v=")[1]
    const element_id = `youtube_${video_id}`;

    const html_code = `
    <div 
        id=${element_id}
        class="fixed bg-color-champagnepink h-72 w-72 z-10 rounded top-32 left-32"
    >
        <div class="w-full bg-color-xanadu rounded-t">
            <h1 class="font-staatliches text-xl text-white m-auto text-center">
                VIDEO
            </h1>

            <!-- Cerrar -->
            <button class="absolute top-1 right-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white m-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <iframe 
            width="288"
            height="260"
            src="https://www.youtube.com/embed/${video_id}?controls=1&mute=1"
            frameborder="0"
            allowfullscreen
            class="rounded-b"
        >
        </iframe> 
    </div>
    `;

    // Add element to the DOM
    document.body.insertAdjacentHTML('beforeend', html_code);
    dragElement(document.getElementById(element_id))
}

const barraSuperiorComponent = () =>  {
    return {
        spotify_playlist: "",
        youtube_video: "",
        
        onYoutubeClick() {
            spotifyRoomAlert.fire({
                html: `
                
                <h1 class="font-staatliches text-3xl m-auto"> Ingrese la URL del video </h1>
                <p> Recuerde que tiene que ser un video de Youtube o no será válido</p>

                <input
                type="text"
                placeholder="URL del video"
                id="youtubeURL"
                class="
                    bg-color-xanadu
                    text-center
                    px-4
                    w-11/12
                    focus:bg-color-sonicsilver
                    focus:placeholder-opacity-0
                    text-white 
                    py-2 rounded
                    placeholder-white
                    mt-3
                    mb-2
                ">

                <p class="italic text-center text-sm"> La URL tiene que comenzar con www.youtube.com</p>
                
                `,
                confirmButtonText: "Aceptar",
                preConfirm: async () => {
                    const youtubeurl_input = document.getElementById("youtubeURL");

                    // Si no es válido
                    if ( !await existYoutubeVideo(youtubeurl_input.value) ) {
                        errorAlert.fire({
                            imageUrl: "/static/img/error.png",
                            imageHeight: 250,
                            title: "La vizcacha se aburre...",
                            text: "El video indicado no existe o no es válido (recuerda que tiene que ser un video de Youtube)",
                            confirmButtonText: "Aceptar"
                        });
                    } else {
                        // Si existe el video
                        spawnYoutubeComponent(youtubeurl_input.value)
                    }

                }
            });
        },

        onSpotifyClick() {
            alert("Tocaste spotify")

        },

        onPomodoroClick() {
            alert("Tocaste pomodoro")

        },

        onPendingClick() {
            alert("Tocaste pending")

        }

    }
}


/* Drag elements */
dragElement(document.getElementById("dragdiv"))

function dragElement(elmnt) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

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