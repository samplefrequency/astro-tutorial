require([
    'astro',
    'bluebird',
    'application',
    'plugins/webViewPlugin',
    'plugins/anchoredLayoutPlugin'
],
function(
    Astro,
    Promise,
    Application,
    WebViewPlugin,
    AnchoredLayoutPlugin
) {

    // Enter your site url here
    var BASE_URL = 'http://<Your IP Address>:5000/';

    // Initialize plugins
    var mainWebViewPromise = WebViewPlugin.init();
    var layoutPromise = AnchoredLayoutPlugin.init();

    // Start the app at the base url
    mainWebViewPromise.then(function(mainWebView) {
        mainWebView.navigate(BASE_URL);
    });

    // Use mainWebView as the main content view for our layout
    Promise.join(layoutPromise, mainWebViewPromise, function(layout, mainWebView) {
        layout.setContentView(mainWebView);
    });

    // Route all unhandled key presses to mainWebView
    mainWebViewPromise.then(function(mainWebView) {
        Application.setMainInputPlugin(mainWebView);
    });

    layoutPromise.then(function(layout) {
        Application.setMainViewPlugin(layout);
    });

}, undefined, true);
