import {Router} from 'express';
import { getUsuarios, postUsuarios } from '../controllers/userController.js';
import {check} from 'express-validator';
import { validorCampos } from '../middlewares/validarCampos.js';



const router = Router();


router.get('/' ,getUsuarios);
router.post('/',[
    check('nombre','El nombre es obligatorio').notEmpty(),
    check('password','La contraseña es obligatorio.').isLength({min : 8}).notEmpty(),
    check('correo', 'Ingrese un correo valido.').isEmail().notEmpty(),
    check('telefono','Ingrese un numero de telefono valido.').isLength({min: 8, max: 10 }).notEmpty().isNumeric(),
    validorCampos
], postUsuarios);

export default router;