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


// Saving pomodoro component data
let all_pomodoros = []


class PomodoroComponent {

    constructor(id) {
        this.id = id;

        this.work_time = 1500; // seconds
        this.short_time = 300; // seconds
        this.long_time = 600;  // seconds

        this.actual_time = 1500;
        
        this.running_time = false;
        this.timerRunner();

        this.finished_audio = new Audio("http://www.sonidosmp3gratis.com/sounds/SD_ALERT_8.mp3");
        this.finished_audio.volume = 0.1;
    }

    getTime() {
        let minutes = String(Math.floor(this.actual_time / 60));
        let seconds = String(this.actual_time - minutes * 60);
        
        if (seconds.length == 1)
            seconds = `0${seconds}`;

        return `${minutes}:${seconds}`
    }

    setTime(time) {

        switch(time) {
            case "work":
                this.actual_time = this.work_time;
                break;

            case "short":
                this.actual_time = this.short_time;
                break;

            case "long":
                this.actual_time = this.long_time;
                break;
        }
        this.changeState(false);
        this.update();
    }

    changeState(new_state) {
        this.running_time = new_state;
        this.update();
    }

    stateString() {
        if (!this.running_time) {
            return "Iniciar";
        }
        return "Pausar"
    }

    timerRunner() {
        setInterval( () => {
            if (this.running_time) {
                if (this.actual_time == 0) {
                    this.changeState(false);
                    this.finished_audio.play();
                } else this.actual_time -= 1;

                this.update();
            }
        }, 1000);
    }

    update() {
        const timer = document.getElementById(`pomodoro-timer-id-${this.id}`);
        timer.innerHTML = this.getTime();

        const state = document.getElementById(`pomodoro-state-id-${this.id}`);
        state.innerHTML = this.stateString();
    }

}

// Pomodoro manager
let pomodoro_ids = 1;

const changePomodoroTime = (id, state) => {
    all_pomodoros[id-1].setTime(state);
}

const changePomodoroState = (id) => {
    all_pomodoros[id-1].changeState(!all_pomodoros[id-1].running_time);
}

const deletePomodoro = (id) => {
    all_pomodoros.splice(id-1, 1)
    document.getElementById(`pomodoro-id-${id}`).remove();
}

const openPomodoroConfig = (id) => {
    configRoomAlert.fire({
        html: `
        
        <h1 class="font-staatliches text-3xl m-auto"> CONFIGURACIÓN POMODORO </h1>
        <p class="font-staatliches text-lg m-auto mt-3 mb-3">Editar tiempos. </p>
        <div class="grid grid-cols-3">
            <div>
                <p class="font-staatliches text-lg m-auto mt-3 mb-3">Work Time</p>
                <div class="custom-number-input h-10 w-32">
                    <div class="flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1">
                        
                        <button data-action="decrement" class=" bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer outline-none">
                            <span class="m-auto text-2xl font-thin">−</span>
                        </button>
                        
                        <input type="text" 
                            class="outline-none focus:outline-none text-center w-full bg-gray-300 font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center text-gray-700  outline-none" name="custom-input-number" value="0">
                        </input>
                        
                        <button data-action="increment" class="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer">
                            <span class="m-auto text-2xl font-thin">+</span>
                        </button>
                    </div>
                </div>
            </div> 

            <div>
                <p class="font-staatliches text-lg m-auto mt-3 mb-3">Short Break</p>
                <div class="custom-number-input h-10 w-32">
                    <div class="flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1">
                        
                        <button data-action="decrement" class=" bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer outline-none">
                            <span class="m-auto text-2xl font-thin">−</span>
                        </button>
                        
                        <input type="text" 
                            class="outline-none focus:outline-none text-center w-full bg-gray-300 font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center text-gray-700  outline-none" name="custom-input-number" value="0">
                        </input>
                        
                        <button data-action="increment" class="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer">
                            <span class="m-auto text-2xl font-thin">+</span>
                        </button>
                    </div>
                </div>
            </div>

            <div>
                <p class="font-staatliches text-lg m-auto mt-3 mb-3">Long Break</p>
                <div class="custom-number-input h-10 w-32">
                    <div class="flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1">
                        
                        <button data-action="decrement" class=" bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer outline-none">
                            <span class="m-auto text-2xl font-thin">−</span>
                        </button>
                        
                        <input type="text" 
                            class="outline-none focus:outline-none text-center w-full bg-gray-300 font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center text-gray-700  outline-none" name="custom-input-number" value="0">
                        </input>
                        
                        <button data-action="increment" class="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer">
                            <span class="m-auto text-2xl font-thin">+</span>
                        </button>
                    </div>
                </div>
            </div>

            
        </div>

        <label for="toggle-example" class="flex items-center cursor-pointer relative mb-4">
        <input type="checkbox" id="toggle-example" class="sr-only">
        <div class="toggle-bg bg-gray-200 border-2 border-gray-200 h-6 w-11 rounded-full"></div>
        <span class="ml-3 text-gray-900 text-sm font-medium">Toggle me</span>
        </label>
        `,
    });
}

const createPomodoro = () => {
    const p_id = pomodoro_ids;

    const html_code = `
    <!-- Draggable div (Pomodoro) -->
    <div 
        class="fixed bg-color-champagnepink pb-2 w-96 z-10 rounded top-1/2 left-1/3"
        id="pomodoro-id-${p_id}"
    >
        <div class="w-full bg-color-xanadu rounded-t">
            <h1 class="font-staatliches text-xl text-white m-auto text-center">
                Pomodoro
            </h1>

            <!-- Cerrar -->
            <button onclick="deletePomodoro(${p_id})" class="absolute top-1 right-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white m-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <div class="flex">
            <div class="m-auto">
                <!-- Options -->
                <div class="grid grid-cols-3 gap-1 mt-2">
                    <button onclick="changePomodoroTime(${p_id}, 'work')" class="text-2xl bg-color-xanadu font-staatliches pl-7 pr-7 rounded text-white"> Work </button>
                    <button onclick="changePomodoroTime(${p_id}, 'short')" class="text-2xl bg-color-xanadu font-staatliches pl-7 pr-7 rounded text-white"> Short </button>
                    <button onclick="changePomodoroTime(${p_id}, 'long')" class="text-2xl bg-color-xanadu font-staatliches pl-7 pr-7 rounded text-white"> Long </button>
                </div>

                <!-- Timer -->
                <div class="m-auto">
                    <h1 class="text-8xl text-center font-staatliches text-color-xanadu"
                        id="pomodoro-timer-id-${p_id}"> 25:00 </h1>
                </div>
                <!-- Button -->
                <div class="grid grid-cols-12">
                    <button 
                        class="text-2xl bg-color-xanadu font-staatliches text-white rounded col-span-10"
                        id="pomodoro-state-id-${p_id}"
                        onclick="changePomodoroState(${p_id})"
                    > INICIAR </button>
                    <button onclick="openPomodoroConfig(${p_id})" class="col-span-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto text-color-xanadu" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html_code);
    all_pomodoros.push(new PomodoroComponent(p_id));
    dragElement(document.getElementById(`pomodoro-id-${p_id}`))

    pomodoro_ids += 1
}



// Video manager
const changeVideo = (video_number) => {

    if (video_number < 0 || video_number > videos_fondo.length)
        return false;

    document.getElementById("background-video").src = videos_fondo[video_number-1];
    return true;
}

let background_video_number = 1;

const videos_fondo = [
    "https://external-preview.redd.it/aawTtrfaSsZ4vyF1zNgTLvhku-R3YPjm_7cDxY2kLmI.gif?format=mp4&s=a748600c54293d8be47583bf588d9d37d840a859",
    "https://vod-progressive.akamaized.net/exp=1637691232~acl=%2Fvimeo-prod-skyfire-std-us%2F01%2F1889%2F12%2F309448537%2F1190035294.mp4~hmac=faa75c30cde15aae861c232368856924845351e8b99ce0663023d579af0d5504/vimeo-prod-skyfire-std-us/01/1889/12/309448537/1190035294.mp4?download=1&filename=Pexels+Videos+1757800.mp4",
    "https://vod-progressive.akamaized.net/exp=1637691318~acl=%2Fvimeo-prod-skyfire-std-us%2F01%2F685%2F13%2F328427476%2F1287380090.mp4~hmac=e6e50a3feb15d98016ab7efe99aaff13777d1a05c4cb8a18e3486ab63cad34a4/vimeo-prod-skyfire-std-us/01/685/13/328427476/1287380090.mp4?download=1&filename=Pexels+Videos+2098988.mp4",
    "https://vod-progressive.akamaized.net/exp=1637691340~acl=%2Fvimeo-prod-skyfire-std-us%2F01%2F4098%2F12%2F320492528%2F1242956976.mp4~hmac=2ceda64368a915d541e85bfb6cb047a879ee0441cbaece10ea2efc1252e5c351/vimeo-prod-skyfire-std-us/01/4098/12/320492528/1242956976.mp4?download=1&filename=Pexels+Videos+1970045.mp4"
];

const moveBackgroundVideo = (move) => {

    if (background_video_number == 1 && move == -1)
        background_video_number = 4;
    else if (background_video_number == videos_fondo.length && move == 1)
        background_video_number = 1;
    else background_video_number += move;
    changeVideo(background_video_number);
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
            createPomodoro();
            youtubeRoomAlert.fire({
                html: `
                
                <h1 class="font-staatliches text-3xl m-auto"> SELECCIONES TIPO </h1>
                <p> Debe seleccionar si quiere que el pomodoro sea personal o compartido.</p>
                <div class="grid grid-cols-2 mt-3 mb-3">    
                    <div>
                        <p class="text-lg font-bold">Individual</p>
                        <input 
                            type="checkbox"
                            class="m-auto">
                        </input>
                    </div>
                    <div>
                        <p class="text-lg font-bold">Compartido</p>
                        <input 
                            type="checkbox"
                            class="m-auto">
                        </input>
                    </div>
                </div>

                <p class="italic text-center text-sm">Por defecto será individual.</p>                
                `,
                confirmButtonText: "Aceptar",
            });
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
                        <button onclick="moveBackgroundVideo(-1)" class="px-4 py-2 text-color-xanadu bg-color-champagnepink rounded-md hover:bg-color-xanadu hover:text-color-champagnepink">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                            </svg>
                        </button>

                        <button onclick="changeVideo(1)" class="px-4 py-2 text-color-xanadu bg-color-champagnepink rounded-md hover:bg-color-xanadu hover:text-color-champagnepink">
                            1
                        </button>
                        <button onclick="changeVideo(2)" class="px-4 py-2 text-color-xanadu bg-color-champagnepink rounded-md hover:bg-color-xanadu hover:text-color-champagnepink">
                            2
                        </button>
                        <button onclick="changeVideo(3)" class="px-4 py-2 text-color-xanadu bg-color-champagnepink rounded-md hover:bg-color-xanadu hover:text-color-champagnepink">
                            3
                        </button>
                        <button onclick="changeVideo(4)" class="px-4 py-2 text-color-xanadu bg-color-champagnepink rounded-md hover:bg-color-xanadu hover:text-color-champagnepink">
                            4
                        </button>
                        <button onclick="moveBackgroundVideo(1)" class="px-4 py-2 text-color-xanadu bg-color-champagnepink rounded-md hover:bg-color-xanadu hover:text-color-champagnepink">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>
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