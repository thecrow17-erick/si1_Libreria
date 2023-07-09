import {request,response} from 'express';
import { Libro, NotaCompra, Proveedor, Usuario } from '../models/index.js';



//te da todas las compras - paginacion - totales - publico
const getCompras = async(req=request, res=response)=>{
  let {limit = 5, offset = 0} = req.query;
  limit = parseInt(limit);
  offset = parseInt(offset);
  try {
    //consigo cuantas compras en total hay y como vendran cada una
    const [total, compras] = await Promise.all([
      NotaCompra.count(),
      NotaCompra.findAll({
        offset,
        limit,
        attributes: ['id','fecha','hora','total'],
        include: [
          {
            model: Proveedor,
            attributes: ['id','nombre']
          },
          {
            model: Usuario,
            attributes: ['id','nombre']
          }
        ]
      })
    ]);
    res.status(200).json({
      total,
      compras
    })
  } catch (err) {
    console.log(err);
    res.status(401).json("Ha ocurrido un error");   
  }
}

//te da una compra especifica por su id - publico
const getCompra = async(req=request, res=response)=>{
  const {id} = req.params;
  try {
    const notaCompra = await NotaCompra.findByPk(id, {
      attributes: ['id','fecha', 'hora', 'total'],
      include: [
        {
          model: Usuario,
          as: 'Comprador',
          attributes: ['id','nombre']
        },{
          model: Proveedor,
          attributes: ['id','nombre', 'telefono', 'correo']
        },
        {
          model: Libro,
          attributes: ['nombre', 'id'],
          through: {
            attributes: ['cantidad', 'precio', 'importe']
          }
        }
      ]
    });
    res.status(200).json({
      notaCompra
    })
  } catch (err) {
    console.log(err);
    res.status(401).json("Ha ocurrido un error inesperado");
  }
}

//crea una nota de venta - publico
const postCompra = async(req=request, res=response)=>{
  const {proveedor, detalles = []} = req.body;
  const {usuario} = req;
}
export {
  getCompras,
  getCompra,
  postCompra
}