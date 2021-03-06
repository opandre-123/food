import { useContext, useState } from 'react'
import context from '../context/context'

export function useCarrito() {

  const { values } = useContext(context)
  const { carrito, setCarrito, } = values


  const [alertaAddProducto, setAlertaAddProducto] = useState(false)

  const [alertaDeleteProducto, setAlertaDeleteProducto] = useState(false)

  const formateoCantidad = (num) => {
    return parseFloat(`${num.toFixed(2)}`)
  }

  const addProCarrito = (producto, cantidad, sum) => {
    //si desea reemplazar la cantidad de un registro 
    //envie el producto y la cantidad 

    //Si desea sumarle una cantidad 
    // a un registro  envie 
    //el producto  la cantidad y un true en ese orden
    let productoActual = {
      ...producto,
      total: parseFloat(producto.price),
      cantidad: cantidad ? parseFloat(cantidad) : 1,
      precio: parseFloat(producto.price),
    }

    if (carrito.length !== 0) {

      let productoEncontrado = false;

      carrito.forEach((productoEnCarro) => {


        if (productoEnCarro.id === productoActual.id) {

          productoEncontrado = true;

          let totalActual = productoEnCarro.total + (productoEnCarro.precio * productoActual.cantidad),
            totalCantidad = sum ? productoActual.cantidad + productoEnCarro.cantidad
              : cantidad ? cantidad : productoEnCarro.cantidad + 1

          const cambioDelRegistro = {
            ...productoEnCarro,
            total: formateoCantidad(totalActual),
            cantidad: totalCantidad,
          }
          const registroActualizado = carrito.map((registroEnCarro) => registroEnCarro.id === productoActual.id ? cambioDelRegistro
            : registroEnCarro)
          setCarrito(registroActualizado)
          localStorage.setItem('carro', JSON.stringify(registroActualizado))
          setAlertaAddProducto(true)
        }

      })

      if (!productoEncontrado) {
        const registroActualizado = [...carrito, productoActual]
        setCarrito(registroActualizado)
        localStorage.setItem('carro', JSON.stringify(registroActualizado))
        setAlertaAddProducto(true)
      }

    } else {
      const registroActualizado = [...carrito, productoActual]
      setCarrito(registroActualizado)
      localStorage.setItem('carro', JSON.stringify(registroActualizado))
      setAlertaAddProducto(true)
    }
  }

  const vaciarCarrito = () => {
    setCarrito([])
    localStorage.removeItem('carro')
  }

  const eliminarProCarrito = (producto, cantidad) => {

    //Si desea reemplazar una cantidad  del registro de un producto 
    //pase el producto seguido de la cantidad 

    let cantidadRecibida = cantidad ? cantidad : cantidad === 0 ? producto.cantidad : 1

    if (producto.cantidad > cantidadRecibida) {

      carrito.forEach((productoEnCarro) => {

        if (productoEnCarro.id === producto.id) {
          const cambioDelRegistro = {
            ...productoEnCarro,
            total: cantidad ? producto.precio * cantidadRecibida : productoEnCarro.total - (producto.precio * cantidadRecibida),
            cantidad: cantidad ? cantidadRecibida : producto.cantidad - cantidadRecibida,
          }
          const registroActualizado = carrito.map((registroEnCarro) => registroEnCarro.id === producto.id ? cambioDelRegistro : registroEnCarro)
          setCarrito(registroActualizado)
          localStorage.setItem('carro', JSON.stringify(registroActualizado))
          setAlertaDeleteProducto(true)
        }
      })
    } else {
      const registroActualizado = carrito.filter((registroEnCarro) => registroEnCarro.id !== producto.id)
      setCarrito(registroActualizado)
      localStorage.setItem('carro', JSON.stringify(registroActualizado))
      setAlertaDeleteProducto(true)
    }
  }

  const cerrarAlertaAddProducto = () => {
    setAlertaAddProducto(false)
  }

  const cerrarAlertaDeleteProducto = () => {
    setAlertaDeleteProducto(false)
  }

  const nCantidad = Object.values(carrito).reduce(
    (acc, { cantidad }) => acc + cantidad,
    0
  )

  const nPrecio = formateoCantidad(Object.values(carrito).reduce(
    (acc, { cantidad, precio }) => acc + cantidad * precio,
    0
  ))

  const enviarPedidoaWhatsapp = ({ cell }) => {

    if (carrito.length > 0) {
      const array = [];
      carrito.forEach((doc) => {
        array.push(
          JSON.stringify(
            doc.producto +
            " - " +
            doc.precio +
            "$ x " +
            doc.cantidad +
            " uni = " +
            doc.total +
            "$" +
            "%3A%0A"
          )
        )
      })

      window.open(
        `https://api.whatsapp.com/send?phone=${cell}&text=Hola+requiero+este+pedido%3A%0A%0A${array.toString()}%3A%0A%0ACantidad+de+Articulos%3A${nCantidad}+%2C%0ATotal%3A${nPrecio}$+%0A`,
        "_blank"
      );
    }
    vaciarCarrito();
  }


  return {
    carrito,
    setCarrito,
    addProCarrito,
    eliminarProCarrito,
    vaciarCarrito,
    alertaAddProducto,
    cerrarAlertaAddProducto,
    nCantidad,
    nPrecio,
    alertaDeleteProducto,
    cerrarAlertaDeleteProducto,
    enviarPedidoaWhatsapp,
    formateoCantidad
  }

}

