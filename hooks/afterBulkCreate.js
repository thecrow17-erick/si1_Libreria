import {
  NotaVenta
} from '../models/index.js';

const totalVenta = async(instancia = [])=>{
  try {
    for(const detalle_venta of instancia){
      await NotaVenta.increment('total', {
        by: parseFloat(detalle_venta.importe),
        where: { id: detalle_venta.notaVentaId }
      });
    }
  } catch (err) {
    throw new Error('Ha ocurrido un error')
  }
}


export {
  totalVenta
}