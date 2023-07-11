import {
  Libro,
} from '../models/index.js';

const importeVenta = async(instancia = [])=>{
  try {
    for (const detalle_venta of instancia) {
      const libro = await Libro.findByPk(detalle_venta.libroId);
      detalle_venta.precio = libro.precio;
      const total = detalle_venta.precio * detalle_venta.cantidad;
      detalle_venta.importe = total - (total * detalle_venta.descuento)       
    }
  } catch (err) {
    console.log(err);
    throw new Error('Error al crear el detalle de venta')    
  }
}

export{
  importeVenta
}