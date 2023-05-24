import {request,response} from 'express';
import {Rol, Usuario} from '../models/index.js';

const getUsuarios = async(req = request,res= response)=>{
    const { limit = 5, offset = 0} = req.query;
    const [total , usuarios] = await Promise.all([
        Usuario.count(),
        Usuario.findAll({limit, 
            offset,
            attributes: ['id', 'nombre', 'correo','telefono'],
            include: {
                model: Rol,
                attributes: ['id', 'nombre']
            },
            where: {estado: true}})
    ]); 
    return res.status(200).json({
        total,
        usuarios
    });
}
const postUsuarios = async (req = request,res= response)=>{
    const {nombre, correo, password, telefono} = req.body;
    const usuarioDB = await Usuario.findOne({where: {nombre } || {correo}});
    if(usuarioDB){
        return res.status(400).json({
            error : true,
            msg: `La cuenta ${nombre} o ${correo} ya existe en el sistema`
        })
    };
    const rol = await Rol.findOne({where : {nombre: 'CLIENT_ROL'}})
    const data = {
        nombre,
        correo,
        password,
        telefono,
        rolId: rol.id
    }
    try {
        const usuario  = await Usuario.create(data)
        usuario.save();
        return res.status(200).json({
            usuario,
            msg: `El usuario ${nombre} ha sido registrado con exito`
        })
    } catch (error) {
        console.log('ha ocurrido un error inesperado',error);
        res.status(401).json({
            error: true,
            msg: 'Ha ocurrido un error'
        })
    }
}
const putUsuarios = async(req = request, res = response)=>{

}
export {
    getUsuarios,
    postUsuarios,
    putUsuarios
}