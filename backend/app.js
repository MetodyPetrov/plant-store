const express = require('express');
const cors = require('cors');

const routes = require('./routes');
const { auth } = require('./middlewares/auth');
const { connectToMongoDB } = require('./utils/utils');

const app = express();
const port = 3000; 

app.use(express.json());
app.use(cors());

app.use(auth);
app.use(routes);

connectToMongoDB();

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});