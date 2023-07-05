import {Libro, NotaVenta, Rol, TipoPago, Usuario ,Proveedor} from '../models/index.js';


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
const validarVenta = async(id=Number)=>{
    const ventaDB = await NotaVenta.findByPk(id);
    if(!ventaDB){
        throw new Error('La venta no existe en el sistema')
    }
}
const validarPago = async(id=Number)=>{
    const pagoDB = await TipoPago.findByPk(id);
    if(!pagoDB){
        throw new Error('No es un tipo de pago')
    }
}
const validarProveedor = async(id =Number)=>{
    const proveedor = await Proveedor.findByPk(id);
    if(!proveedor){
        throw new Error('No es un proveedor')
    }
} 
export {
    validarUser,
    validarRol,
    validarLibro,
    validarVenta,
    validarPago,
    validarProveedor
}