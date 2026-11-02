const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const generosRouter = require('./routes/generos');
const directoresRouter = require('./routes/directores');
const productorasRouter = require('./routes/productoras');
const tiposRouter = require('./routes/tipos');
const mediasRouter = require('./routes/medias');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Ruta de salud
app.get('/', (req, res) => {
  res.json({
    ok: true,
    msg: 'API Películas IUDigital — funcionando',
    version: '1.0.0',
    endpoints: [
      'GET /api/generos',
      'GET /api/directores',
      'GET /api/productoras',
      'GET /api/tipos',
      'GET /api/medias'
    ],
    docs: 'Ver README.md para diseño de BD y ejemplos Postman'
  });
});

app.use('/api/generos', generosRouter);
app.use('/api/directores', directoresRouter);
app.use('/api/productoras', productorasRouter);
app.use('/api/tipos', tiposRouter);
app.use('/api/medias', mediasRouter);

// 404
app.use((req, res) => {
  res.status(404).json({ ok: false, msg: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});

module.exports = app;
