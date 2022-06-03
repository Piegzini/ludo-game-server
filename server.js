const app = require('./src/app');
const { server } = require('./src/sockets');

const PORT = process.env.PORT || 4000;

app.set('port', PORT);

server.listen(app.get('port'), () => {
  console.log(`Serwer is running on ${PORT} port`);
});
