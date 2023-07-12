import {
  DetalleCompra,
  DetalleVenta,
  Inventario
} from '../models/index.js';

//cuando se elimina una venta
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
//cuando se elimina una compra
const restarInventarioCompra = async(options)=>{
  console.log(options);
  try {
    const detalle_compras = await DetalleCompra.findAll({
      where: {
        NotaCompraId: options.where.NotaCompraId
      }
    })
    if(detalle_compras.length > 0){
      for(const detalle of detalle_compras){
        const libroInventario = await Inventario.findByPk(detalle.libroId);
        const cantidad = libroInventario.cantidad - detalle.cantidad;
        if (cantidad < 0) {
          throw new Error(
            'No se puede borrar, no puede haber menos de 0 libros en el inventario.'
          );
        }
        await libroInventario.decrement('cantidad', {
          by: detalle.cantidad,
        });
      }
    }
  } catch (err) {
    console.log(err);
    throw new Error('ha ocurrido un error al eliminar la compra');
  }
}

export {
  sumarInventarioVenta,
  restarInventarioCompra
}