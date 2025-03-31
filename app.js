const express = require('express');
const routes = require('./routes');
const morgan = require('morgan');
const path = require('path');
const express_layout = require('express-ejs-layouts');
const sequelize = require('./db/database');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

// Configuración
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/layout');

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));
app.use(morgan('dev'));
app.use(methodOverride('_method'));

// Configuración de sesiones
app.use(session({
  secret: 'miproy123', 
  resave: false,
  saveUninitialized: true
}));

// Se habilitar connect-flash**
app.use(flash());

// Middleware para hacer los mensajes flash disponibles en todas las vistas
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success');
  res.locals.error_msg = req.flash('error');
  next();
});

app.use(express_layout);

// Rutas
app.use('/', routes);
const librosRouter = require('./routes/home');
app.use('/', librosRouter);

// Iniciar servidor
app.listen(3000, () => console.log('Servidor en :  http://localhost:3000'));
