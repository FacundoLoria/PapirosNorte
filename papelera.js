class Producto {
    constructor(id, nombre, precio, stock, img, descripcion, alt) {
        this.id = id
        this.nombre = nombre
        this.cantidad = 1
        this.precio = precio
        this.stock = stock
        this.img = img
        this.descripcion = descripcion
        this.alt = alt
    }
}

class ProductoController {
    constructor() {
        this.listaProductos = []
        this.contenedor_productos = document.getElementById("contenedor_productos")
    }

    levantarProductos() {
        this.listaProductos = [
            new Producto(1, "Vaso plastico", 2750, 15, "./img/vaso300.jpg", "Tamaño 300cc x100u", "Vaso plastico 300cc"),
            new Producto(2, "Vaso termico 180", 2500, 15, "./img/vasotermico180.jpg", "Tamaño 180cc x100u", "Vaso termico 240cc"),
            new Producto(3, "Vaso termico 240", 3000, 15, "./img/vasotermico240.jpg", "Tamaño 240cc x100u", "Vaso termico 300cc"),
            ]
    }

    mostrarEnDOM() {
        //Mostramos los productos en DOM de manera dinamica
        this.listaProductos.forEach(producto => {
            this.contenedor_productos.innerHTML += `
            <div class="card border-primary" style="width: 18rem;">
                <img src="${producto.img}" class="card-img-top" alt="${producto.alt}">
                <div class="card-body">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text">${producto.descripcion}</p>
                    <p class="card-text">Precio: $${producto.precio}</p>
                    <a href="#" id="cpu-${producto.id}" class="btn btn-primary">Añadir al carrito</a>
                </div>
            </div>`
        })
    }

    darEventoClickAProductos(controladorCarrito) {
        this.listaProductos.forEach(producto => {
            const btnAP = document.getElementById(`cpu-${producto.id}`)
            btnAP.addEventListener("click", () => {

                controladorCarrito.agregar(producto)
                controladorCarrito.guardarEnStorage()
                controladorCarrito.mostrarEnDOM(contenedor_carrito)

                Toastify({
                    text: `${producto.nombre} agregado al carrito!`,
                    duration: 1500,
                    
                    gravity: "bottom", // `top` or `bottom`
                    position: "right", //`left` or `right`
            
                    style: {
                        background: "linear-gradient(to left, black, gray)",
                    }
                }).showToast();
            })
        })
    }
}

class CarritoController {
    constructor() {
        this.listaCarrito = []
        this.contenedor_carrito = document.getElementById("contenedor_carrito")
    }

    agregar(producto) {
        this.listaCarrito.push(producto)
    }

    limpiarCarritoEnStorage(){
        localStorage.removeItem("listaCarrito")
    }

    guardarEnStorage() {
        let listaCarritoJSON = JSON.stringify(this.listaCarrito)
        localStorage.setItem("listaCarrito", listaCarritoJSON)
    }

    verificarExistenciaEnStorage() {
        this.listaCarrito = JSON.parse(localStorage.getItem('listaCarrito')) || []
        if (this.listaCarrito.length > 0) {
            this.mostrarEnDOM()
        }
    }

    limpiarContenedor_Carrito() {
        this.contenedor_carrito.innerHTML = ""
    }

    mostrarEnDOM() {
        this.limpiarContenedor_Carrito()
        this.listaCarrito.forEach(producto => {
            this.contenedor_carrito.innerHTML +=
                `<div class="card mb-3" style="max-width: 540px;">
                <div class="row g-0">
                    <div class="col-md-4">
                    <img src="${producto.img}" class="img-fluid rounded-start" alt="${producto.alt}">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${producto.nombre}</h5>
                            <p class="card-text">Descripcion: ${producto.descripcion}</p>
                            <p class="card-text">Precio: $${producto.precio}</p>
                            <p class="card-text">Cantidad: ${producto.cantidad}</p>
                        </div>
                    </div>
                </div>
            </div>`
        })
    }
}

const controladorProductos = new ProductoController()
controladorProductos.levantarProductos()

const controladorCarrito = new CarritoController()

//Verifica en STORAGE y muestra en DOM si hay algo.
controladorCarrito.verificarExistenciaEnStorage()

//DOM
controladorProductos.mostrarEnDOM()

//EVENTOS
controladorProductos.darEventoClickAProductos(controladorCarrito)

const finalizar_compra = document.getElementById("finalizar_compra")
finalizar_compra.addEventListener("click", () => {
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Compra realizada con éxito!',
        showConfirmButton: false,
        timer: 2000
    })

    //está en DOM
    controladorCarrito.limpiarContenedor_Carrito()
    //está en localStorage
    controladorCarrito.limpiarCarritoEnStorage()
    //está en listaCarrito
    controladorCarrito.listaCarrito = []
})