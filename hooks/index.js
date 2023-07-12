import {
  restarInventarioVenta,
  totalVenta,
  totalCompra
} from './afterBulkCreate.js';

import {
  importeVenta,
  importeCompra
} from './beforeBulkCreate.js';
import {
  sumarInventarioVenta,
  restarInventarioCompra
} from './beforeBulkDestroy.js';


export {
  restarInventarioVenta,
  totalVenta,
  importeVenta,
  sumarInventarioVenta,
  importeCompra,
  totalCompra,
  restarInventarioCompra
}