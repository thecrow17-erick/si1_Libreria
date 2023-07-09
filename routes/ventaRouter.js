import {getVentas, getVenta, postVenta, tiposPagos, deleteVenta, putVenta} from '../controllers/ventaController.js';
import {Router} from 'express';
import { check } from 'express-validator';

import { validarPago, validarVenta } from '../helpers/dbValidator.js';
import { validarCampos } from '../middlewares/validarCampos.js';
import { validarJwt } from '../middlewares/validarJwt.js';
import {validarDetalle } from '../helpers/objectValidator.js';



const router = Router();


//muestra todas las ventas
router.get('/', getVentas)

//muestra una venta en especifica
router.get('/:id',[
  check('id').custom(validarVenta),
  validarCampos
], getVenta);

//te crea una nueva venta
router.post('/', [
  validarJwt,
  check('cliente', 'No es nombre').notEmpty().isString(),
  check('detalles','Detalles no es un arreglo').notEmpty().isLength({min:1}).isArray() ,
  check('detalles.*','Los datos del arreglo detalle deben ser objetos').isObject().bail().custom(validarDetalle),
  check('pagoId').notEmpty().isNumeric().custom(validarPago),
  validarCampos
],postVenta)

//edita las ventas
router.put('',[
  
],putVenta)
//elimina una venta del registro
router.delete('/:id',[
  check('id').custom(validarVenta),
  check('correo','No es un correo').notEmpty().isEmail(),
  check('password', 'Ingrese una contraseña correcta').notEmpty().isString().isLength({min: 8}),
  validarCampos
],deleteVenta)
//los diferentes tipos de pagos
router.get('/pagos/tipos-pagos', tiposPagos)
export default router;
