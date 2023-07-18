import {
  restarInventarioVenta,
  totalVenta,
  sumarInventarioCompra,
  totalCompra
} from './afterBulkCreate.js';

import {
  importeVenta,
  importeCompra
} from './beforeBulkCreate.js';
import {
  sumarInventarioVenta,
  eliminarDetallesVenta,
  restarInventarioCompra,
  eliminarDetallesCompra
} from './beforeDestroy.js';


export {
  restarInventarioVenta,
  eliminarDetallesCompra,
  totalVenta,
  importeVenta,
  sumarInventarioVenta,
  eliminarDetallesVenta,
  importeCompra,
  totalCompra,
  restarInventarioCompra,
  sumarInventarioCompra
}