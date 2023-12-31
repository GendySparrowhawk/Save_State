const express = require('express');
const { engine } = require('express-handlebars');
const session = require('express-session');
const db = require('./config/connection')
const PORT = process.env.PORT || 3333;
const path = require('path');
const methodOverride = require('method-override');
require('dotenv').config(path.join(__dirname, '../.env'));


const view_routes = require('./controllers/view_routes');
const user_routes = require('./controllers/user_routes')
const game_routes = require('./controllers/game_routes')
const review_routes = require('./controllers/review_routes')

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// handlebar middleware
app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true
    }
}));

app.use(express.static('./public'));
app.use(methodOverride('_method'));

app.use('/', [view_routes, game_routes, review_routes]);
app.use('/auth', user_routes);

db.sync({force: false})
.then(() => {
    app.listen(PORT, () => console.log(`happy surfing on ${PORT}`));
});  
