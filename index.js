//Stock Market Portfolio APP By Pierre Junior

const express = require('express');
const app = express();
// DEPRECATED DOESN'T WORK ANYMORE const exphbs = require('express-handlebars'); //we need to require the 'express-handlebars' module to use Handlebars as our templating engine.
const { engine } = require('express-handlebars'); //we need to require the 'engine' function from the 'express-handlebars' module to use Handlebars as our templating engine.
const path = require('path'); //we need to require the 'path' module to work with file and directory paths.
const { got } = require('got'); //we need to require the 'got' module to make HTTP requests to external APIs, since the "request" module is deprecated. It must be { got } because "got" exports an object with a property called "got". If we dont use {}, we will get an error saying "got is not a function".

const PORT = process.env.PORT || 5000; //we need to set up a port for our server. || means OR. process.env.PORT is for when we deploy our app to a hosting service like Heroku. They will set up the port for us. If we are running the app locally, we will use port 5000.





//Public Stock API Request Example - using "got" module instead of "request" module which is deprecated

/* create call_api function to call the API - It hasnt worked because its assync and we need to use async/await or .then() to handle the promise.
function call_api() {
//we are gonna wrap the API call in a function so we can call it whenever we want.
got('https://brapi.dev/api/quote/list', { responseType: 'json' })
  .then(response => {
    console.log(response.body);
  })
  .catch(err => {
    console.error(err);
  });
  return got.body; //lets return the body of the response so we can use it later.
}//end of wrapping everything in a function. Now let's call the function inside handlebars homepage route so we can see the data on the homepage.
*/
async function call_api() {
  try {
    const response = await got('https://brapi.dev/api/quote/list', { responseType: 'json' });
    return response.body;
  } catch (err) {
    console.error(err);
    return null;
  }
}






/*DEPRECATED Set Handlebars Middleware IT DOESN'T WORK ANYMORE
app.engine('handlebars', exphbs()); //this line of code sets up Handlebars as the templating engine for our Express app. The first argument is the file extension we want to use for our Handlebars files. The second argument is the function that will be used to render the Handlebars files.
app.set('view engine', 'handlebars'); //this line of code tells our Express app to use Handlebars as the default templating engine. Now we can render Handlebars files without having to specify the file extension.
*/
// ✅ Configura o Handlebars corretamente - Middleware atualizado
app.engine('handlebars', engine()); // 👈 Usa 'engine()' ao invés de 'exphbs()'
app.set('view engine', 'handlebars');// 👈 Define Handlebars como o motor de visualização padrão
app.set('views', path.join(__dirname, 'views')); // 👈 Garante que a pasta 'views' seja usada




/*Set handlebars routes - express doesn't need it, but we need to set up routes to render our Handlebars files. I need to change it to async function because call_api is async. The page must wait the function to finish before rendering the page.
app.get('/', function(req, res){
        res.render('home', {
            stuff: 'This is some stuff I am passing to the homepage', //pass the data to the Handlebars file. Now we can use {{stuff}} in our Handlebars file to access the data.
            stock: call_api() //pass the data to the Handlebars file. Now we can use {{stock}} in our Handlebars file to access the data.       
    });
});
*/
//This is the corrected version with async/await
app.get('/', async function(req, res) {
  const stockData = await call_api();
  res.render('home', {
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

//so far we've already got our server set up and running.