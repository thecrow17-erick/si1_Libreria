import {request,response} from 'express';
import { Proveedor } from '../models/index.js';


const getProveedores = async(req=request, res=response)=>{
  const {limit = 5 , offset = 0 } = req.query;
  try {
    const [total, proveedores] = await Promise.all([
      Proveedor.count(),
      Proveedor.findAll({
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
    const proveedor = await Proveedor.create(obj);
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
    const proveedor = await Proveedor.destroy({where: {id}})

    res.status(200).json({
      proveedor,
      msg: "Se ha eliminado correctamente"
    })
  } catch (err) {
    console.log(err);
    res.status(401).json("Ha ocurrido un error.")
  }
}
export {
  getProveedores,
  getProveedor,
  postProveedor,
  putProveedor,
  deleteProveedor
}