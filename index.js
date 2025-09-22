//Stock Market Portfolio APP By Pierre Junior

const express = require('express');//we need to require the 'express' module to create our server.
const app = express(); //app const receives the result of the express() function, which is an object that represents our Express application.
const { engine } = require('express-handlebars');//we need to require the 'express-handlebars' module to use Handlebars as our templating engine. We use { engine } because express-handlebars exports an object with a property called "engine". If we dont use {}, we will get an error saying "exphbs is not a function".
const path = require('path'); //we need to require the 'path' module to work with file and directory paths.
const { got } = require('got'); //we need to require the 'got' module to make HTTP requests to external APIs, since the "request" module is deprecated. It must be { got } because "got" exports an object with a property called "got". If we dont use {}, we will get an error saying "got is not a function".
const bodyParser = require('body-parser'); //we need to require the 'body-parser' module to parse incoming request bodies in a middleware before your handlers, available under the req.body property.

const PORT = process.env.PORT || 5000; //we need to set up a port for our server. || means OR. process.env.PORT is for when we deploy our app to a hosting service like Heroku. They will set up the port for us. If we are running the app locally, we will use port 5000.

//BODY PARSER MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: false })); //this line of code tells our server to use the body-parser middleware to parse incoming request bodies. extended: false means that we are not using the extended version of the body-parser middleware. We need to set this to false if we want to parse URL-encoded data with the querystring library. If we set it to true, it will use the qs library which allows for rich objects and arrays to be encoded into the URL-encoded format, allowing for a JSON-like experience with URL-encoded. But for our app, we don't need that, so we set it to false.





// create call_api function to call the API 
async function call_api(ticker) {
  try {
    const response = await got('https://brapi.dev/api/quote/' + ticker, { responseType: 'json' });  //ticker var is part of URL to create right endpoint. Await pauses execution until the response is received.
    return response.body;
  } catch (err) {
    console.error(err);
    return null;
  }
}




// ✅ Configura o Handlebars corretamente - Middleware atualizado
app.engine('handlebars', engine()); // Sets up Handlebars engine
app.set('view engine', 'handlebars');// Sets Handlebars as the default view engine
app.set('views', path.join(__dirname, 'views')); // Makes sure Express knows where to find the Handlebars files. __dirname is a global variable that gives us the directory name of the current module. path.join() is used to join the directory name with the 'views' folder. We need to require the 'path' module at the top of the file for this to work.





//Sets handlebar index GET method route
app.get('/', async function(req, res) {//explanation: when a user visits the root URL of our app ("/"), this function will be executed. The function takes two parameters: req (the request object) and res (the response object). The function is marked as async because we will be using the await keyword inside it to wait for the call_api function to complete before sending the response back to the user.
  const defaultTicker = 'PETR4';//default ticker symbol to display when the page loads for the first time
  const stockData = await call_api(defaultTicker);//we call the call_api function with the default ticker symbol and wait for it to complete. The result is stored in the stockData variable.
  res.render('home', {//we use the res.render() method to render the 'home' template and pass some data to it. The data is passed as an object with two properties: stuff and stock. The stuff property is a string that we are passing to the template, and the stock property is the stockData variable that we got from the call_api function.
    //stuff: 'This is some stuff I am passing to the homepage. It could be a variable or anything',
    stock: stockData
  });
});

//Sets handlebar index POST method route
app.post('/', async function(req, res) {
  const ticker = req.body.stock_ticker; // Get the ticker symbol from the form submission
  console.log("The user has typed " + ticker);
  const stockData = await call_api(ticker); // Call the API with the provided ticker symbol, await the result
  res.render('home', {// Render the 'home' template with the fetched stock data
    posted_stuff: ticker,//this is just to show that we can pass the ticker symbol that the user submitted back to the template. We can use this to display the ticker symbol on the page.
    stock: stockData//this is the stock data that we got from the call_api function. We can use this to display the stock information on the page.
  });
});

//New route to show list of stocks
app.get('/acoes', async (req, res) => {
  try {
    const response = await got('https://brapi.dev/api/quote/list', { responseType: 'json' });
    const acoes = response.body.stocks.map(function(acao) {
      return {
        stock: acao.stock,
        name: acao.name
      };
    });
    res.render('acoes', { acoes });// Render the 'acoes' template with the list of stocks
  } catch (error) {
    console.error('Erro ao buscar ações:', error.message);
    res.status(500).send('Erro ao carregar lista de ações');
  }
});

// Middleware para processar dados do formulário
app.use(express.urlencoded({ extended: true })); // para processar dados do formulário

// Route to deal with selected stock action
app.post('/acao-selecionada', async function(req, res) {
  const ticker = req.body.acao;
  console.log("The user has selected " + ticker);
  const stockData = await call_api(ticker); // Call the API with the provided ticker symbol, await the result
  res.render('home', {// Render the 'home' template with the fetched stock data
    posted_stuff: ticker,//this is just to show that we can pass the ticker symbol that the user submitted back to the template. We can use this to display the ticker symbol on the page.
    stock: stockData//this is the stock data that we got from the call_api function. We can use this to display the stock information on the page.
  });
});



//Create about page route
app.get('/about', function(req, res){
    res.render('about');
});





//Set static folder
app.use(express.static(path.join(__dirname, 'public'))); //this line of code tells our server to serve static files from the 'public' folder. __dirname is a global variable that gives us the directory name of the current module. path.join() is used to join the directory name with the 'public' folder. We need to require the 'path' module at the top of the file for this to work.




app.listen(PORT, () => console.log('Server listening on port ' + PORT)) //this line of code starts the server and listens for incoming requests on the specified port. The callback function is executed once the server is up and running.

