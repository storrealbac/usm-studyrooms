const joinComponent = () => {
    return {
        join_roomid: "",
        async verify(room_id) {

            if (await existRoom(room_id)) {

                joinRoomAlert.fire({
                    title: "Ingresar a la sala",
                    html: `
                        <h1 class="m-5">Se ha encontrado la sala, por favor, rellene los datos faltantes</h1>
                        
                        <h1 class="mt-5">Nombre del usuario</h1>
                        <input 
                            maxlength="16"
                            placeholder="Ingrese su nombre de usuario"
                            id="join_username"
                            class="
                                bg-color-xanadu
                                text-center
                                px-4
                                focus:bg-color-sonicsilver
                                focus:placeholder-opacity-0
                                text-white 
                                py-2 rounded
                                placeholder-white
                                mt-3
                                mb-3
                            ">
                        <h1 class="mt-5">Contraseña de la sala</h1>
                        <input
                            type="password"
                            maxlength="16"
                            placeholder="Contraseña de la sala"
                            id="join_password"
                            class="
                                bg-color-xanadu
                                text-center
                                px-4
                                focus:bg-color-sonicsilver
                                focus:placeholder-opacity-0
                                text-white 
                                py-2 rounded
                                placeholder-white
                                mt-3
                                mb-3
                        ">
                    `,
                    confirmButtonText: "Aceptar",
                    preConfirm: async () => {
                        // Al darle al botón
                        const username = document.getElementById("join_username").value;
                        const password = document.getElementById("join_password").value;

                        let url_request = "/api/join?";
                        url_request += `username=${username}`;
                        url_request += `&room_id=${room_id}`;
                        url_request += `&room_password=${password}`

                        const response = await fetch(url_request, {
                            method: "POST"
                        });

                        const json_response = await response.json();

                        if (json_response.status_code == 401) {
                            errorAlert.fire({
                                imageUrl: "/static/img/error.png",
                                imageHeight: 250,
                                title: "La vizcacha se aburre...",
                                text: json_response.error,
                                confirmButtonText: "Aceptar"
                            });

                        } else {
                            // Si todo fue bien
                            window.location.href = "room"
                        }
                    }
                });

            } else {
                errorAlert.fire({
                    imageUrl: "/static/img/error.png",
                    imageHeight: 250,
                    title: "La vizcacha se aburre...",
                    text: "La sala indicada no existe",
                    confirmButtonText: "Aceptar"
                });
            }

        }, 
        join() {
            console.log("El código de la sala es", this.join_roomid);
            this.verify(this.join_roomid);
            this.join_roomid = "";
        }
    }
}

const existRoom = async (room_id) => {
    let url_request = "/api/exist?"
    url_request += `room_id=${room_id}`

    const response = await fetch(url_request, {
        method: "GET"
    });

    const json_response = await response.json();

    if (json_response.status_code == 400)
        return false;

    return true;
}

const joinRoomRequest = async (username, room_id, room_password) => {

    // Request data
    let url_request = "/api/join?"
    url_request += `username=${username}`
    url_request += `&room_id=${room_id}`
    url_request += `&room_password=${room_password}`

    return await fetch(url_request, {
        method: "POST"
    });
  

}