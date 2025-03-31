//Funciona como un intermediario entre los controlladores y el modelo de sequelize
const Libro = require('../models/libro')
const {Op} = require('sequelize');
const paginacion = require('./utils');
//Contiene metodos para operaciones crud
const libroService = {
  //Metogo [GET]
  getDataHome: async (query) => {
    try {
      const data = await paginacion(Libro, query); //llama a la paginacion
      return { msg: null, data };
    } catch (error) {
      //Manejo de errores
      console.error('Error en getDataHome:', error);
      return { msg: 'Error al obtener los datos', data: null };
    }
  },
  //Metodo [GET]
  getLibroById: async (id) => {
    try {
      const libro = await Libro.findByPk(id); // busca por ID
      return { msg: null, data: libro };
    } catch (error) {
      return { msg: error.message, data: null };
    }
  },
  //crea un nuevo registro de libro
  crearLibro: async (nuevoLibro) => {
    try {
      const libro = await Libro.create(nuevoLibro); // Crea un nuevo registro
      return { msg: null, data: libro };
    } catch (error) {
      return { msg: error.message, data: null };
    }
  },
  //Actualiza un libro existente
  updateLibro: async (id, nuevoLibro) => {
    try {
      const libroActualizado = await Libro.update(nuevoLibro, { where: { id } });//se filtra por el id
      return { msg: null, data: libroActualizado };
    } catch (error) {
      return { msg: error.message, data: null };
    }
  },
  //elimina un libro
  deleteLibro: async (id) => {
    try {
      const numFilasEliminadas = await Libro.destroy({//elimina el libro
        where: { id }
      });

      if (numFilasEliminadas === 0) {//si no hay libro
        return { success: false, msg: 'No se encontró el libro para eliminar' };
      }
      //Mensaje de exito
      return { success: true, msg: 'Libro eliminado correctamente' };
    } catch (error) {
      return { success: false, msg: error.message };
    }
  },
  //Obtener libros con paginacion
  obtenerLibros(filtro, { pagina = 1, itemsPorPagina = 10 } = {}) {
    const offset = (pagina - 1) * itemsPorPagina; //Salta los primeros 10 items
    //Clausula de where
    //Es un objeto que se utiliza en el ORM para condiciones de where de una consulta sql
    let whereClause = {}; 
    
    if (filtro) {
      whereClause = {
        [Op.or]: [ //Se usa el operador or
          { titulo: { [Op.like]: `%${filtro}%` } },//busca en el  titulo
          { autor: { [Op.like]: `%${filtro}%` } }//busca en el autor
        ]
      };
    }
    //Ejecuta una consulta con los flitros que se le indican
    //Retorna la consulta
    return Libro.findAndCountAll({
      //El filtrado
      where: whereClause,
      //Obtenemos el limite
      limit: itemsPorPagina,
      offset //salta los primeros 10 libros
    })
    //Si todo salio bien
    .then(({ count, rows }) => ({
      success: true,
      data: {//contiene
        libros: rows,//los resultados de la primer pagina 
        total: count, //cuantos libros 
        totalPaginas: Math.ceil(count / itemsPorPagina), //cuantas paginas 
        pagina: parseInt(pagina)//Convertir a numero
      }
    }))
    .catch(error => ({ success: false, message: error.message }));//Manejar errores si ocurren 
  }

}

module.exports = libroService;