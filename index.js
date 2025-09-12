//Stock Market Portfolio APP By Pierre Junior

const express = require('express');
const app = express();
// DEPRECATED DOESN'T WORK ANYMORE const exphbs = require('express-handlebars'); //we need to require the 'express-handlebars' module to use Handlebars as our templating engine.
const { engine } = require('express-handlebars'); //we need to require the 'engine' function from the 'express-handlebars' module to use Handlebars as our templating engine.
const path = require('path'); //we need to require the 'path' module to work with file and directory paths.
const { got } = require('got'); //we need to require the 'got' module to make HTTP requests to external APIs, since the "request" module is deprecated. It must be { got } because "got" exports an object with a property called "got". If we dont use {}, we will get an error saying "got is not a function".
const bodyParser = require('body-parser'); //we need to require the 'body-parser' module to parse incoming request bodies in a middleware before your handlers, available under the req.body property.

const PORT = process.env.PORT || 5000; //we need to set up a port for our server. || means OR. process.env.PORT is for when we deploy our app to a hosting service like Heroku. They will set up the port for us. If we are running the app locally, we will use port 5000.

//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false })); //this line of code tells our server to use the body-parser middleware to parse incoming request bodies. extended: false means that we are not using the extended version of the body-parser middleware. We need to set this to false if we want to parse URL-encoded data with the querystring library. If we set it to true, it will use the qs library which allows for rich objects and arrays to be encoded into the URL-encoded format, allowing for a JSON-like experience with URL-encoded. But for our app, we don't need that, so we set it to false.





// create call_api function to call the API 
async function call_api(ticker) {
  try {
    const response = await got('https://brapi.dev/api/quote/' + ticker, { responseType: 'json' });  //ticker var is part of URL to create right endpoint
    return response.body;
  } catch (err) {
    console.error(err);
    return null;
  }
}




/*Set Handlebars Middleware IT DOESN'T WORK ANYMORE - DEPRECATED!!
app.engine('handlebars', exphbs()); //this line of code sets up Handlebars as the templating engine for our Express app. The first argument is the file extension we want to use for our Handlebars files. The second argument is the function that will be used to render the Handlebars files.
app.set('view engine', 'handlebars'); //this line of code tells our Express app to use Handlebars as the default templating engine. Now we can render Handlebars files without having to specify the file extension.
*/
// ✅ Configura o Handlebars corretamente - Middleware atualizado
app.engine('handlebars', engine()); // 👈 Usa 'engine()' ao invés de 'exphbs()'
app.set('view engine', 'handlebars');// 👈 Define Handlebars como o motor de visualização padrão
app.set('views', path.join(__dirname, 'views')); // 👈 Garante que a pasta 'views' seja usada





/*SET HANDLEBAR ROUTES 
express doesn't need it, but we need to set up routes to render our Handlebars files. I need to change it to async function because call_api is async. The page must wait the function to finish before rendering the page.
app.get('/', function(req, res){
        res.render('home', {
            stuff: 'This is some stuff I am passing to the homepage', //pass the data to the Handlebars file. Now we can use {{stuff}} in our Handlebars file to access the data.
            stock: call_api() //pass the data to the Handlebars file. Now we can use {{stock}} in our Handlebars file to access the data.       
    });
});
*/
//SET HANDLEBAR INDEX GET METHOD ROUTE. This is the corrected version with async/await. 
app.get('/', async function(req, res) {
  const defaultTicker = 'PETR4';
  const stockData = await call_api(defaultTicker);
  res.render('home', {
    stuff: 'This is some stuff I am passing to the homepage. It could be a variable or anything',
    stock: stockData
  });
});


//SET HANDLEBAR INDEX POST METHOD ROUTE
app.post('/', async function(req, res) {
  const ticker = req.body.stock_ticker; // Captura o ticker do formulário
  const stockData = await call_api(ticker); // Passa o ticker para a função
  res.render('home', {
    posted_stuff: ticker,
    stuff: 'This is some stuff I am passing to the homepage. It could be a variable or anything',
    stock: stockData
  });
});


//Create about page route
app.get('/about', function(req, res){
    res.render('about');
});





//Set static folder
app.use(express.static(path.join(__dirname, 'public'))); //this line of code tells our server to serve static files from the 'public' folder. __dirname is a global variable that gives us the directory name of the current module. path.join() is used to join the directory name with the 'public' folder. We need to require the 'path' module at the top of the file for this to work.


app.listen(PORT, () => console.log('Server listening on port ' + PORT)) //this line of code starts the server and listens for incoming requests on the specified port. The callback function is executed once the server is up and running.