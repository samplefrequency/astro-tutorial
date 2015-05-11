var express = require('express');
var app = express();

app.engine('html', require('ejs').renderFile);

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

// Root / PLP

app.get('/', function(request, response) {
    response.render('index.html');
});

// Flyouts

app.get('/account/', function(request, response) {
    response.render('account.html');
});

app.get('/cart/', function(request, response) {
    response.render('cart.html');
});

// Account

app.get('/details/', function(request, response) {
    response.render('details.html');
});

app.get('/orders/', function(request, response) {
    response.render('orders.html');
});

app.get('/credit-cards/', function(request, response) {
    response.render('credit-cards.html');
});

app.get('/notifications/', function(request, response) {
    response.render('notifications.html');
});

app.get('/help/', function(request, response) {
    response.render('help.html');
});

// PDP

app.get('/road-bike/', function(request, response) {
    response.render('road-bike.html');
});

app.get('/commuter/', function(request, response) {
    response.render('commuter.html');
});

app.get('/city-bike/', function(request, response) {
    response.render('city-bike.html');
});

app.get('/mountain-bike/', function(request, response) {
    response.render('mountain-bike.html');
});

app.get('/hybrid-bike/', function(request, response) {
    response.render('hybrid-bike.html');
});

app.get('/fixie/', function(request, response) {
    response.render('fixie.html');
});

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'));
});
