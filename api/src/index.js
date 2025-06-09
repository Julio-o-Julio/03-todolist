const app = require('./app');
const expressListEndpoints = require('express-list-endpoints');

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server up in route: ${PORT}`);

  const endpoints = expressListEndpoints(app);
  console.table(endpoints);
});
