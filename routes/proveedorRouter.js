import {Router} from 'express';
import {deleteProveedor, getProveedor, getProveedores, postProveedor, putProveedor} from '../controllers/proveedorController.js';
import { check } from 'express-validator';
import { validarProveedor } from '../helpers/dbValidator.js';
import { validarCampos } from '../middlewares/validarCampos.js';

const router = Router();

//publico - limite y offset - muestra todos los proveedores
router.get('/',getProveedores);

//publico - muestra un proveedor
router.get('/:id', [
  check('id').custom(validarProveedor),
  validarCampos
], getProveedor)

//privado - crea un proveedor
router.post('/',[
  check('nombre','El nombre es obligatorio').notEmpty(),
  check('correo', 'Ingrese un correo valido.').isEmail().notEmpty(),
  check('telefono','Ingrese un numero de telefono valido.').isLength({min: 8, max: 10 }).notEmpty().isNumeric(),
  check('correo', 'Ingrese un correo valido.').isString().notEmpty(),
  validarCampos
], postProveedor);

//privado - actualizar 
router.put('/:id',[
  check('id').custom(validarProveedor),
  validarCampos
],putProveedor);

//privado - eliminar
router.delete('/:id',[
  check('id').custom(validarProveedor),
  validarCampos
],deleteProveedor)

export default router;
