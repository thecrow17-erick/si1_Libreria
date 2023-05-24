import {Router} from 'express';
import { getUsuarios, postUsuarios,putUsuarios,deleteUsuarios } from '../controllers/userController.js';
import {check} from 'express-validator';
import { validorCampos } from '../middlewares/validarCampos.js';
import {validarRol,validarUser} from '../helpers/dbValidator.js';


const router = Router();


router.get('/' ,getUsuarios);
router.post('/',[
    check('nombre','El nombre es obligatorio').notEmpty(),
    check('password','La contraseña es obligatorio.').isLength({min : 8}).notEmpty(),
    check('correo', 'Ingrese un correo valido.').isEmail().notEmpty(),
    check('telefono','Ingrese un numero de telefono valido.').isLength({min: 8, max: 10 }).notEmpty().isNumeric(),
    validorCampos
], postUsuarios);
//privado - actualizar usuarios 
router.put('/:id',[
    check('nombre','El nombre es obligatorio').notEmpty(),
    check('correo', 'Ingrese un correo valido.').isEmail().notEmpty(),
    check('telefono','Ingrese un numero de telefono valido.').isLength({min: 8, max: 10 }).notEmpty().isNumeric(),
    check('rolId').custom(validarRol).notEmpty(),
    check('id').custom(validarUser).notEmpty(),
    validorCampos
],putUsuarios);

//privado - eliminar usuarios
router.delete('/:id',[
    check('id').custom(validarUser).notEmpty(),
    validorCampos
],deleteUsuarios)
export default router;