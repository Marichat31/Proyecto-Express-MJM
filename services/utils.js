//Se importa Op de sequelize  para poder usar el operador Or para nuestras consultas
const { Op } = require('sequelize');

//Se define una funcion asincrona que recibe el modelo : libro,el objeto con los paramtros a consultar,cuantos items 
const paginacion = async (model, query, librosPorPagina = 15) => {
  
  try {
    //Se establecen valores por defecto
    const { pagina = 1, q = '' } = query;
    //Calcula el desplazamiento para la pagina 
    const offset = (pagina - 1) * librosPorPagina;
    //Se verifica si q tiene valor y se revisa si tiene titulo o autor
    const whereClause = q ? {
      [Op.or]: [
        { titulo: { [Op.iLike]: `%${q}%` } },
        { autor: { [Op.iLike]: `%${q}%` } }
      ]
    } : {};//si no,entonces es un objeto vacio
    //Se realiza la consulta a la base de datos

    const { count: totalLibros, rows: libros } = await model.findAndCountAll({
      where: whereClause, //Busca si existen
      limit: librosPorPagina, //cantidad maxima de resultados
      offset: offset,//donde inicia la paginacion
    });

    //retorna un objeto con los resultados 
    return {
      libros,
      pagina: parseInt(pagina),
      totalPaginas: Math.ceil(totalLibros / librosPorPagina),
      totalLibros,
      q,
    };

  } catch (error) {
    console.error('Error en paginate:', error); //
    throw new Error('Error al realizar la paginación');
  }
};

module.exports = paginacion;