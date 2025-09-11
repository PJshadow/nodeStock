const express = require('express');
const app = express();
// DEPRECATED DOESN'T WORK ANYMORE const exphbs = require('express-handlebars'); //we need to require the 'express-handlebars' module to use Handlebars as our templating engine.
const { engine } = require('express-handlebars'); //we need to require the 'engine' function from the 'express-handlebars' module to use Handlebars as our templating engine.
const path = require('path'); //we need to require the 'path' module to work with file and directory paths.

const PORT = process.env.PORT || 5000; //we need to set up a port for our server. || means OR. process.env.PORT is for when we deploy our app to a hosting service like Heroku. They will set up the port for us. If we are running the app locally, we will use port 5000.



/*DEPRECATED Set Handlebars Middleware IT DOESN'T WORK ANYMORE
app.engine('handlebars', exphbs()); //this line of code sets up Handlebars as the templating engine for our Express app. The first argument is the file extension we want to use for our Handlebars files. The second argument is the function that will be used to render the Handlebars files.
app.set('view engine', 'handlebars'); //this line of code tells our Express app to use Handlebars as the default templating engine. Now we can render Handlebars files without having to specify the file extension.
*/

// ✅ Configura o Handlebars corretamente - Middleware atualizado
app.engine('handlebars', engine()); // 👈 Usa 'engine()' ao invés de 'exphbs()'
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views')); // 👈 Garante que a pasta 'views' seja usada

const otherStuff = "This is some other stuff"; //this is just a variable to demonstrate how we can pass data to our Handlebars files.

//Set handlebars routes - express doesn't need it, but we need to set up routes to render our Handlebars files.
app.get('/', function(req, res){
    //res.render('home'); //this line of code tells our server to render the 'home' Handlebars file when the root route is accessed. We don't need to specify the file extension because we set up Handlebars as the default templating engine. Now let's improve it:
    res.render('home', {
        stuff: "This is some stuff",
        moreStuff: otherStuff
    });
});




//Set static folder
app.use(express.static(path.join(__dirname, 'public'))); //this line of code tells our server to serve static files from the 'public' folder. __dirname is a global variable that gives us the directory name of the current module. path.join() is used to join the directory name with the 'public' folder. We need to require the 'path' module at the top of the file for this to work.

app.listen(PORT, () => console.log('Server listening on port ' + PORT)) //this line of code starts the server and listens for incoming requests on the specified port. The callback function is executed once the server is up and running.

//so far we've already got our server set up and running.