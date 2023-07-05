import {request, response} from 'express';

import {
  NotaVenta,
  DetalleVenta,
  Usuario,
  TipoPago,
  Libro,
  Rol,
} from '../models/index.js';
import { 
  fechaActual, 
  horaActual 
} from '../helpers/FechaHora.js';


//muestra todas las ventas
const getVentas = async(req= request, res=response)=>{
  const { limit = 5, offset = 0} = req.query;
  try {
    const [total, ventas] = await Promise.all([
      NotaVenta.count(),
      NotaVenta.findAll({
        limit,
        offset,
        attributes: ['id', 'fecha','hora','total'],
        include: [
          {
            model: TipoPago,
            attributes: ['id', 'nombre']
          },
          {
            model: Usuario,
            as: 'cliente',
            attributes: ['id', 'nombre']
          },
          {
            model: Usuario,
            as: 'vendedor',
            attributes: ['id', 'nombre']
          }
        ]
      })
    ]);
    res.status(200).json({
      total,
      ventas,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      msg: 'Ha ocurrido un error inesperado'
    })
  }
}
//muestra una sola venta
const getVenta = async(req=request, res= response)=>{
  const {id} = req.params;
  try {
    const notaVenta =  await NotaVenta.findByPk(id, {
      attributes: ['id', 'fecha','hora', 'total'],
      include: [
        {
          model: Usuario,
          as: 'vendedor',
          attributes: ['nombre']
        },
        {
          model: Usuario,
          as: 'cliente',
          attributes: ['nombre', 'correo','telefono']
        },
        {
          model: Libro,
          attributes: ['id','titulo','precio'],
          through: {
            attributes: ['cantidad','descuento','importe']
          }
        }
      ]
    });
    res.status(200).json({
      notaVenta
    })

  } catch (err) {
    console.log(err);
    res.status(400).json({
      msg: 'Ha ocurrido un error'
    })    
  }
  
}
//crea una nuevaa venta
const postVenta =async(req=request,res= response)=>{
  const {detalles = [], cliente, pagoId} = req.body;
  const vendedor = req.usuario;
  try {
    const rol = vendedor.role.dataValues.nombre;
    if(rol !== "Administrador" && rol !== "Empleado"){
      res.status(401).json({
        msg: "el usuario no es vendedor"
      })
    }
    const clienteDB = await Usuario.findOne({
      where: {
        nombre: cliente,
        estado: true
      }, 
      include: [
        {
          model: Rol,
          where: {
            nombre: 'Cliente'
          }
        }
      ]
    });
    if(!clienteDB){
      return res.status(401).json('El cliente no esta en el sistema')
    };
    const obj = {
      vendedorId: vendedor.id,
      clienteId: clienteDB.id,
      fecha: fechaActual,
      hora: horaActual,
      tipoPagoId: pagoId
    };
    if(detalles.length === 0){
      return res.status(401).json('No hay prodcutos que se puedan vender.')
    }
    const notaVenta = await NotaVenta.create(obj);
    detalles.forEach((objeto) => {
      objeto.notaVentaId = notaVenta.id;
    });
    const detalleVenta = await DetalleVenta.bulkCreate(detalles);

    res.status(200).json({
      notaVenta,
      detalleVenta,
      msg: "Se ha realizado con exito la funcion"
    })

  } catch (err) {
    console.log(err);
    res.status(400).json({
      msg: "Ha ocurrido un error inesperado"
    })
  }
}
//editar  la venta 
const putVenta = async(req = request, res = response)=>{

}
//elimina una venta y sus detalles,
const deleteVenta = async(req=request,res=response)=>{
  const {correo, password} = req.body;
  const {id} = req.params;
  try {
    const adminDB = await Usuario.findOne({where: {correo , estado: true},include:[{
      model: Rol,
      where: {
        nombre: 'Administrador'
      } 
    }]});
    if(!adminDB){
      return res.status(401).json({
        msg: "El usuario no es administrador"
      })
    }
    const validarPassword = await adminDB.verificarPassword(password);
    if(!validarPassword){
      return res.status(401).json('El password es incorrecto')
    }
    //elimino tanto de detalles y despues de notas
    await Promise.all([
      DetalleVenta.destroy({where:{
        notaVentaId: id
      }}),
      NotaVenta.destroy({
        where: {id}
      })
    ]);
    res.status(200).json("Se ha eliminado correctamente la venta.")
  } catch (err) {
    console.log(err);
    res.status(400).json("Ha ocurrido un error")    
  }

}
const tiposPagos = async(req, res= response)=>{
  try {
    const pagosDB = await TipoPago.findAll();
    res.status(200).json({
      pagosDB
    })
  } catch (err) {
    console.log(err);
    res.status(401).json({
      msg: 'Ha ocurrido un error inesperado'
    })
  }
}
export {
  getVentas,
  getVenta,
  postVenta,
  putVenta,
  tiposPagos,
  deleteVenta
}