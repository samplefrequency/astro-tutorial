var express = require('express');
var exphbs  = require('express-handlebars');

var app = express();

app.engine('.hbs', exphbs({extname: '.hbs', defaultLayout: 'main'}));
app.set('view engine', '.hbs');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

// Root / PLP

app.get('/', function(request, response) {
    response.render('index.hbs', {
        bodyClass: 't-plp',
        styles: ['/css/templates/plp.css'],
        scripts: ['/js/cart-add.js']
    });
});

// Flyouts / Navigation Drawers

app.get('/account/', function(request, response) {
    response.render('account.hbs', {
        bodyClass: 't-account',
        styles: ['/css/templates/account.css']
    });
});

app.get('/cart/', function(request, response) {
    response.render('cart.hbs', {
        bodyClass: 't-cart c--empty',
        styles: ['/css/templates/cart.css'],
        scripts: ['/js/cart-actions.js', '/js/cart-state.js']
    });
});

// Account Pages

app.get('/details/', function(request, response) {
    response.render('details.hbs', {
        bodyClass: 't-account-page',
        styles: ['/css/templates/account-page.css']
    });
});

app.get('/orders/', function(request, response) {
    response.render('orders.hbs', {
        bodyClass: 't-account-page',
        styles: ['/css/templates/account-page.css'],
        scripts: ['/js/cart-actions.js']
    });
});

app.get('/credit-cards/', function(request, response) {
    response.render('credit-cards.hbs', {
        bodyClass: 't-account-page',
        styles: ['/css/templates/account-page.css']
    });
});

app.get('/notifications/', function(request, response) {
    response.render('notifications.hbs', {
        bodyClass: 't-account-page',
        styles: ['/css/templates/account-page.css']
    });
});

app.get('/help/', function(request, response) {
    response.render('help.hbs', {
        bodyClass: 't-account-page',
        styles: ['/css/templates/account-page.css']
    });
});

// PDP

app.get('/road-bike/', function(request, response) {
    response.render('road-bike.hbs', {
        bodyClass: 't-pdp',
        styles: ['/css/templates/pdp.css'],
        scripts: ['/js/cart-add.js']
    });
});

app.get('/commuter/', function(request, response) {
    response.render('commuter.hbs', {
        bodyClass: 't-pdp',
        styles: ['/css/templates/pdp.css'],
        scripts: ['/js/cart-add.js']
    });
});

app.get('/city-bike/', function(request, response) {
    response.render('city-bike.hbs', {
        bodyClass: 't-pdp',
        styles: ['/css/templates/pdp.css'],
        scripts: ['/js/cart-add.js']
    });
});

app.get('/mountain-bike/', function(request, response) {
    response.render('mountain-bike.hbs', {
        bodyClass: 't-pdp',
        styles: ['/css/templates/pdp.css'],
        scripts: ['/js/cart-add.js']
    });
});

app.get('/hybrid-bike/', function(request, response) {
    response.render('hybrid-bike.hbs', {
        bodyClass: 't-pdp',
        styles: ['/css/templates/pdp.css'],
        scripts: ['/js/cart-add.js']
    });
});

app.get('/fixie/', function(request, response) {
    response.render('fixie.hbs', {
        bodyClass: 't-pdp',
        styles: ['/css/templates/pdp.css'],
        scripts: ['/js/cart-add.js']
    });
});

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'));
});
