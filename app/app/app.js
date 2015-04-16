require([
    'astro',
    'bluebird',
    'plugins/applicationPlugin',
    'plugins/webViewPlugin',
    'plugins/anchoredLayoutPlugin',
    'plugins/headerBarPlugin'
],
function(
     Astro,
     Promise,
     ApplicationPlugin,
     WebViewPlugin,
     AnchoredLayoutPlugin,
     HeaderBarPlugin
) {

    // Enter your site url here
    var baseUrl = '';

    // Initialize plugins
    var applicationPromise = ApplicationPlugin.init();
    var mainWebViewPromise = WebViewPlugin.init();
    var layoutPromise = AnchoredLayoutPlugin.init();
    var headerPromise = HeaderBarPlugin.init();

    // Start the app at the base url
    mainWebViewPromise.then(function(mainWebView) {
        mainWebView.navigate(baseUrl);
    });

    // Use the mainWebView as the main content view for our layout
    Promise.join(layoutPromise, mainWebViewPromise, function(layout, mainWebView) {
        layout.setContentView(mainWebView.address);
    });

    // Route all unhandled key presses to the mainWebView
    Promise.join(applicationPromise, mainWebViewPromise, function(application, mainWebView){
        application.setMainInputPlugin(mainWebView.address);
    });

    Promise.join(applicationPromise, layoutPromise, function(application, layout) {
        application.setMainViewPlugin(layout.address);
    });

    // When the header bar is ready, load its icons.
    headerPromise.then(function(headerBar){
        headerBar.setRightIcon(baseUrl + "images/bag.png");
        headerBar.setCenterIcon(baseUrl + "images/logo.png");
        headerBar.setBackgroundColor("#FFFFFF");
    });

    Promise.join(layoutPromise, headerPromise, function(layout, headerBar) {
        layout.addTopView(headerBar.address);
        headerBar.show();
    });


}, undefined, true);
