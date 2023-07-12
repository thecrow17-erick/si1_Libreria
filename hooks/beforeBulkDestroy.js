import {
  DetalleVenta,
  Inventario
} from '../models/index.js';

const sumarInventarioVenta =async(options)=>{
  try {
    const detalles_ventas = await DetalleVenta.findAll({
      where: {
        notaVentaId: options.where.notaVentaId
      }
    })
    if (detalles_ventas) {
      for(const detalle of detalles_ventas){
        await Inventario.increment('cantidad',{
          by: detalle.cantidad,
          where: {
            libroId: detalle.libroId
          }
        })
      }
    }
  } catch (err) {
    console.log(err);
    throw new Error('Ha ocurrido un error al eliminar el detalle de venta')
  }
}


export {
  sumarInventarioVenta
}