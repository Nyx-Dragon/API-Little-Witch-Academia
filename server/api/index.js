const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8000;

// Servir frontend desde /client
app.use(express.static(path.join(__dirname, '../client')));

// Endpoint para cada index.json
app.get('/api/:section', (req, res) => {
  const section = req.params.section;
  res.sendFile(path.join(__dirname, `api/${section}/index.json`));
});

// Endpoint para vistas HTML de cada sección de API (opcional)
app.get('/api/:section/view', (req, res) => {
  const section = req.params.section;
  res.sendFile(path.join(__dirname, `api/${section}/index.html`));
});

// Fallback para SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
