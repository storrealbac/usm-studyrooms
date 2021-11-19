// Conexión en tiempo real
const socket = io();
socket.on("connect", () => {
    console.log("Me conecté al server satisfactoriamente");
});

// Estado global (componente global)
const globalComponent = () => {
    return {
        show_spotifyplaylist: false
    }
}

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
        class="fixed bg-color-champagnepink z-10 rounded top-32 left-32"
        style="width:426px"
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
            width="426"
            height="246"
            src="https://www.youtube.com/embed/${video_id}?controls=2&mute=1"
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
            youtubeRoomAlert.fire({
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
            this.show_spotifyplaylist = !this.show_spotifyplaylist;

        },

        onPomodoroClick() {
            alert("Tocaste pomodoro")


        },

        onPendingClick() {
            alert("Tocaste pending")

        },

        onConfigClick() {
            configRoomAlert.fire({
                html: `
                
                <h1 class="font-staatliches text-3xl m-auto"> CONFIGURACIÓN </h1>
                <p class="font-staatliches text-lg m-auto mt-3 mb-3">Cambiar fondo: </p>
            <div class="flex"> 
                <div class="m-auto">
                    <div class="flex items-center space-x-1 flex m-auto">
                        <a href="#" class="px-4 py-2 text-color-xanadu bg-color-champagnepink rounded-md hover:bg-color-xanadu hover:text-color-champagnepink">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                            </svg>
                        </a>

                        <a href="#" class="px-4 py-2 text-color-xanadu bg-color-champagnepink rounded-md hover:bg-color-xanadu hover:text-color-champagnepink">
                            1
                        </a>
                        <a href="#" class="px-4 py-2 text-color-xanadu bg-color-champagnepink rounded-md hover:bg-color-xanadu hover:text-color-champagnepink">
                            2
                        </a>
                        <a href="#" class="px-4 py-2 text-color-xanadu bg-color-champagnepink rounded-md hover:bg-color-xanadu hover:text-color-champagnepink">
                            3
                        </a>
                        <a href="#" class="px-4 py-2 text-color-xanadu bg-color-champagnepink rounded-md hover:bg-color-xanadu hover:text-color-champagnepink">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </a>
                    </div>


                    <p class="font-staatliches text-lg m-auto mt-6 mb-3"> Cambiar cantidad de personas: </p>

                    <div class="relative inline-block text-left">
                        <div>
                            <button type="button" class="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-color-champagnepink text-sm font-medium text-color-xanadu hover:bg-color-xanadu hover:text-color-champagnepink focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500" id="menu-button" aria-expanded="true" aria-haspopup="true">
                            Cantidad
                            <svg class="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                            </svg>
                            </button>
                        </div>
                    </div>
                `,
            });
        }
    }
}


/* Drag elements */
dragElement(document.getElementById("spotify-dragdiv"))
dragElement(document.getElementById("pomodoro-dragdiv"))
dragElement(document.getElementById("pending-dragdiv"))



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