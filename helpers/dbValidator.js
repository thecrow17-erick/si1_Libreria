import {Libro, Rol, Usuario} from '../models/index.js';


const validarRol = async(rolId = Number)=>{
    const rol = await Rol.findByPk(rolId);
    if(!rol){
        throw new Error('El rol no es valido');
    }
}
const validarUser =async (id = Number)=>{
    const userDB = await Usuario.findByPk(id);
    if(!userDB){
        throw new Error('El usuario no existe en el sistema')
    }
}
const validarLibro = async(id = Number)=>{
    const libroDB = await Libro.findByPk(id);
    if(!libroDB){
        throw new Error('El usuario no existe en el sistema')
    }
}
export {
    validarUser,
    validarRol,
    validarLibro
}