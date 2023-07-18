import {Router} from 'express';
import {check} from 'express-validator';
import {deleteLibro, getLibro, getLibros, postLibro, putLibro} from '../controllers/libroController.js';
import { validarCampos } from '../middlewares/validarCampos.js';
import { validarLibro } from '../helpers/dbValidator.js';
import { validarAutores, validarEditorial } from '../middlewares/validarDB.js';

const router = Router();

//publico - cantidad - paginado 
router.get('/',getLibros);

//publico libro por id
router.get('/:id',[
    check('id').custom(validarLibro),
    validarCampos
],getLibro)

//privado - para crear libros
router.post('/',[
    check('titulo','Ponga un nombre valido').notEmpty().isString(),
    check('precio','Ponga un numero razonable').notEmpty().isDecimal({decimal_digits: 2}),
    check('categoriaId', 'Debe ser una categoria valida').notEmpty().isNumeric(),
    check('fecha_publicacion', 'Ponga una fecha valida').notEmpty().isDate({format: 'YYYY-MM-DD'}),
    validarAutores,
    validarEditorial,
    validarCampos
],postLibro);
//privado- para actualizar libros
router.put('/:id',[
    check('titulo','El libro tiene que tener un titulo valido').notEmpty().isLength({min: 5}),
    check('precio','El precio tiene que ser valido').notEmpty().isNumeric(),
    check('fecha_publicacion', 'La fecha no es valida').notEmpty().isDate({format: 'YYYY-MM-DD'}),
    check('categoria','ponga el nombre de la categoria').notEmpty().isLength({min: 5}),
    check('autor','ponga el nombre de la autor').notEmpty().isLength({min: 5}),
    check('editorial','ponga el nombre de la editorial').notEmpty().isLength({min: 5}),
    validarCampos
],putLibro);
//privado para eliminar libros
router.delete('/:id',[
    check('id').custom(validarLibro),
    validarCampos
],deleteLibro);

export default router;