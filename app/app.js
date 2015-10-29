window.AstroMessages = []; // For debugging messages

window.run = function() {
    require([
        'astro-full',
        'bluebird',
        'application',
        'plugins/webViewPlugin',
        'plugins/anchoredLayoutPlugin',
        'plugins/navigationPlugin'
    ],
    function(
        Astro,
        Promise,
        Application,
        WebViewPlugin,
        AnchoredLayoutPlugin,
        NavigationPlugin
    ) {

        // Enter your site url here
        var baseUrl = 'http://<Your IP Address>:5000';

        // Initialize plugins
        var mainNavigationPromise = NavigationPlugin.init();
        var layoutPromise = AnchoredLayoutPlugin.init();

        // Start the app by navigating to the base url
        mainNavigationPromise.then(function(mainNavigationView){
            mainNavigationView.navigate(baseUrl);
        });

        // Use the mainNavigationView as the main content view for our layout
        Promise.join(layoutPromise, mainNavigationPromise, function(layout, mainNavigationView) {
            layout.setContentView(mainNavigationView);
        });

        // Set our layout as the main view of the app
        layoutPromise.then(function(layout){
            Application.setMainViewPlugin(layout);
        });

    }, undefined, true);
};
// Comment out next line for JS debugging
window.run();
