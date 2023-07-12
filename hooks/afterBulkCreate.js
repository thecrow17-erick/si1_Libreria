import {
  Inventario,
  NotaVenta
} from '../models/index.js';

//pone el total del importe de los detalles de venta en la nota de venta
const totalVenta = async(instancia = [])=>{
  try {
    for(const detalle_venta of instancia){
      await NotaVenta.increment('total', {
        by: parseFloat(detalle_venta.importe),
        where: { id: detalle_venta.notaVentaId }
      });
    }
  } catch (err) {
    console.log(err);
    throw new Error('Ha ocurrido un error en el total de la venta')
  }
}
//resta los libros del inventario, si el libro no tiene suficiente stock manda un error
const restarInventarioVenta = async(instancia = [])=>{
  try {
    for (const detalle_venta of instancia){
      //busco el inventario del libro
      const libroInventario = await Inventario.findByPk(detalle_venta.libroId);
      //pregunto si hay  suficiente stock para la venta
      const cantidadStock = libroInventario.cantidad;
      if(cantidadStock < detalle_venta.cantidad){
        throw new Error('No hay suficiente stock')
      }
      await libroInventario.decrement('cantidad', {
        by: detalle_venta.cantidad
      });
    }
  } catch (err) {
    console.log(err);
    throw new Error('Ha ocurrido un error en restar el inventario')
  }
}


export {
  totalVenta,
  restarInventarioVenta,
}