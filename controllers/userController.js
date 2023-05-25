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
    const {nombre, correo, password, telefono, rolId} = req.body;
    const usuarioDB = await Usuario.findOne({where: {nombre } || {correo}});
    if(usuarioDB){
        return res.status(400).json({
            error : true,
            msg: `La cuenta ${nombre} o ${correo} ya existe en el sistema`
        })
    };
    const data = {
        nombre,
        correo,
        password,
        telefono,
        rolId
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
    const {id} = req.params;
    const {nombre, correo, telefono,rolId} = req.body;
    try {
        const user = await Usuario.findByPk(id, {
            attributes: ['id','nombre','correo','telefono']
        });
        user.nombre = nombre;
        user.correo = correo;
        user.rolId = rolId;
        user.telefono = telefono
        await user.save()
        return res.status(200).json({
            user,
            msg: "Se ha cambiado correctamente los datos"
        })
    } catch (err) {
        console.log('Ha ocurrido un error inesperado', err);
        return res.status(400).json({
            error: true,
            msg: "Ha ocurrido un error, intente otra vez"
        })
    }
}
const deleteUsuarios = async(req = request, res = response)=>{
    const {id} = req.params;
    try {
        const user = await Usuario.findByPk(id,{
            attributes: ['id','nombre','correo','telefono']
        })
        user.estado = false;
        await user.save();
        return res.status(200).json({
            user,
            msg: "El usuario ha sido eliminado"
        });
    } catch (err) {
        console.log("Ha ocurrido un error inesperado", err);
        return res.status(400).json({
            error: true,
            msg: "Ha ocurrido inesperado, intente otra vez"
        })
    } 
}
const mostrarRoles = async(req, res= response)=>{
    const roles = await Rol.findAll({
        attributes: ['id','nombre']
    });
    res.status(200).json({
        roles
    })  
}
export {
    getUsuarios,
    postUsuarios,
    putUsuarios,
    deleteUsuarios,
    mostrarRoles
}
