// Prueba sin base de datos: verifica rutas, validaciones y esquemas.
// Uso: npm test
const request = require('supertest');
const app = require('./app');
const Genero = require('./models/Genero');
const Media = require('./models/Media');

(async () => {
  let fail = 0;
  const check = (nombre, cond) => {
    console.log(`${cond ? '✅' : '❌'} ${nombre}`);
    if (!cond) fail++;
  };

  // 1. Salud
  let r = await request(app).get('/');
  check('GET / responde 200', r.status === 200 && r.body.ok === true);

  // 2. Validación género vacío -> 400
  r = await request(app).post('/api/generos').send({});
  check('POST /api/generos vacío -> 400', r.status === 400);

  // 3. Validación media incompleta -> 400
  r = await request(app).post('/api/medias').send({ titulo: 'x' });
  check('POST /api/medias incompleta -> 400', r.status === 400);

  // 4. ID inválido -> 400
  r = await request(app).get('/api/medias/123');
  check('GET /api/medias/123 -> 400', r.status === 400);

  // 5. Ruta inexistente -> 404
  r = await request(app).get('/api/no-existe');
  check('GET ruta inexistente -> 404', r.status === 404);

  // 6. Esquemas Mongoose
  const gMal = new Genero({ estado: 'Mal' });
  check('Esquema Genero rechaza estado inválido', !!gMal.validateSync());
  const mMal = new Media({ serial: 'A' });
  check('Esquema Media exige campos obligatorios', !!mMal.validateSync());

  console.log(fail === 0 ? '✅ TODAS LAS PRUEBAS PASARON' : `❌ ${fail} FALLARON`);
  process.exit(fail === 0 ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(1); });
