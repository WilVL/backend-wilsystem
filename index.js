const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
const usersRoutes = require('./routes/users.routes');
const alumnosRoutes = require('./routes/alumnos.routes');
const justificantesRoutes = require('./routes/justificantes.routes');
const entradasSalidasRoutes = require('./routes/entradasSalidas.routes');

app.use('/api/users', usersRoutes);
app.use('/api/alumnos', alumnosRoutes);
app.use('/api/justificantes', justificantesRoutes);
app.use('/api/entradas-salidas', entradasSalidasRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
}); 