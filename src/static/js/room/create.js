
// Alpine Component
const creacionSala = () => {
    return {
        nombre_sala: "",
        nombre_usuario: "",
        password_sala: "",
        cantidad_maxima: 0,
        duracion_desconexion: 0,

        cantidad_maxima_str: "Seleccione la cantidad máxima",
        mostrar_dropdown: false,

        debugLog() {
            console.log("DATOS DE VALIDACIÓN");
            console.log("-----------------------------------------------");
            console.log("Nombre sala:", this.nombre_sala);
            console.log("Nombre usuario:", this.nombre_usuario);
            console.log("Password sala:", this.password_sala);
            console.log("Cantidad maxima:", this.cantidad_maxima);
            console.log("Duracion desconexion:", this.duracion_desconexion, typeof(this.duracion_desconexion));
            console.log("-----------------------------------------------");
        },

        cambiarCantidadMaxima(cantidad_clickeada) {
            this.cantidad_maxima = Number(cantidad_clickeada);
            //console.log(this.cantidad_maxima);
            this.cantidad_maxima_str = `${String(cantidad_clickeada)} personas`;
            this.cambiarEstadoDropdown();
        },

        cambiarEstadoDropdown() {
            this.mostrar_dropdown = !this.mostrar_dropdown;
        },

        

        validar() {
            this.duracion_desconexion = Number(this.duracion_desconexion);


            // En caso de que quieran buguear con strings
            if (isNaN(this.duracion_desconexion))
                this.duracion_desconexion = 0;

            const cantidades_permitidas = [3, 5, 7, 10]
            
            // Lista de todos los datos invalidos
            let datos_invalidos = []

            // Validar el nombre de la sala
            if (this.nombre_sala.length < 3 || this.nombre_sala.length > 16 && typeof(this.nombre_sala) == "string")
                datos_invalidos.push("El nombre de la sala es muy corto");

            // Validar el nombre del usuario
            if (this.nombre_usuario.length < 3 || this.nombre_usuario.length > 16 && typeof(this.nombre_usuario) == "string")
                datos_invalidos.push("El nombre de usuario es muy corto")

            if (this.password_sala.length < 3 || this.password_sala.length > 16 && typeof(this.password_sala) == "string")
                datos_invalidos.push("La contraseña es muy corta")
            
            if (this.duracion_desconexion < 3 || this.duracion_desconexion > 99 && typeof(this.duracion_desconexion) == "number")
                datos_invalidos.push("Los minutos no pueden ser menores a 3");

            if (cantidades_permitidas.indexOf(this.cantidad_maxima) == -1) {
                datos_invalidos.push("Seleccione una cantidad máxima de personas");
            }

            if (datos_invalidos.length == 0) {
                // Todos los datos son validos
                alert("Todos los datos son validados correctamente")
            } else {    

                // Algun dato está mal puesto
                createRoomAlert.fire({
                    imageUrl: "/static/img/error.png",
                    imageHeight: 250,
                    title: "La vizcacha se aburre...",
                    text: "No todos los valores dados son correctos",
                    footer: datos_invalidos.join("</br>"),
                    confirmButtonText: "Aceptar"
                });

                //console.table(datos_invalidos);
            }

            this.debugLog();
        }

    }
}

const isNumberKey = (evt) => {
    let charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && charCode < 48 || charCode > 57)
        return false;
    return true;
}

