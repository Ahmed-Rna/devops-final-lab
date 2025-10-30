require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');
const connectDB = require('./config/db/mongodb');

const pagesRoutes = require('./routes/pages');
const medicinesRoutes = require('./routes/medicines');
const ordersRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', pagesRoutes);
app.use('/api/medicines', medicinesRoutes);
app.use('/api/orders', ordersRoutes);

app.use(errorHandler);

connectDB().then(() => {
 app.listen(process.env.PORT || 3000, '0.0.0.0');

});
