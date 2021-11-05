// Componente del dropdown
const menuPersonas = () => {
    return {
        show: false,
        cantidad: 0,
        cantidad_str: "Seleccione cantidad",

        mostrarCantidad(cantidad_clickeada) {
            this.cantidad_str = `${String(cantidad_clickeada)} personas`;
        },

        cambiarEstado() {
            this.show = !this.show;
        }
    }
}

const isNumberKey = (evt) => {
    let charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && charCode < 48 || charCode > 57)
        return false;
    return true;
}