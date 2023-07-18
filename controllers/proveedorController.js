import {request,response} from 'express';
import { Proveedor } from '../models/index.js';


const getProveedores = async(req=request, res=response)=>{
  let {limit = 10 , offset = 0 } = req.query;
  limit=parseInt(limit);
  offset=parseInt(offset)
  try {
    const [total, proveedores] = await Promise.all([
      Proveedor.count({where: {estado: true}}),
      Proveedor.findAll({
        where: {
          estado: true
        },
        limit,
        offset,
        attributes: ['id','nombre', 'correo', 'telefono', 'direccion'],
      })
    ])
    res.status(200).json({
      total,
      proveedores
    })
  } catch (err) {
    console.log(err);
    res.status(401).json('Ha ocurrido un error inesperado')   
  }
}
const getProveedor = async(req=request, res=response)=>{
  const {id} = req.params;
  try {
    const proveedor = await Proveedor.findByPk(id,{
      attributes: ['id','nombre', 'correo', 'telefono', 'direccion']
    });
    res.status(200).json({
      proveedor
    })
 } catch (err) {
    console.log(err);
    res.status(401).json("Ha ocurrido un error inesperado")
  }
}
const postProveedor = async(req=request, res=response)=>{
  const {nombre, correo, direccion, telefono} = req.body;
  try {
    const obj = {
      nombre, 
      correo,
      direccion,
      telefono
    };
    const proveedor = await Proveedor.create(obj,{
      usuario: 'Erick'
    });
    res.status(200).json({
      proveedor,
      msg: "Se ha creado correctamente un proveedor"
    })
  } catch (err) {
    console.log(err);
    res.status(401).json("Ha ocurrido un error inesperado")
  }
}
const putProveedor = async(req=request, res=response)=>{
  const {id} = req.params;
  const obj = req.body;
  try {
    const proveedor = await Proveedor.findByPk(id);

    //actualiza al proveedor
    await proveedor.update(obj);

    res.status(200).json({
      proveedor,
      msg: "Se ha actualizado correctamente"
    })
  } catch (err) {
    console.log(err);
    res.status(401).json("Ha ocurrido un error inesperado.")
  }
}
const deleteProveedor = async(req=request, res=response)=>{
  const {id} = req.params;
  try {
    const proveedor = await Proveedor.findByPk(id,{});
    if (proveedor) {
      return res.status(400).json("El proveedor no se encuentra en el sistema.");
    }
    await proveedor.update({
      estado: false
    })
    res.status(200).json("Se ha eliminado el proveedor correctamente")
  } catch (err) {
    console.log(err);
    res.status(401).json("Ha ocurrido un error inesperado.")
  }
}
export {
  getProveedores,
  getProveedor,
  postProveedor,
  putProveedor,
  deleteProveedor
}