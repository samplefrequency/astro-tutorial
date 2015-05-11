require([
    'astro',
    'bluebird',
    'plugins/applicationPlugin',
    'plugins/webViewPlugin',
    'plugins/anchoredLayoutPlugin',
    'plugins/headerBarPlugin',
    'plugins/drawerPlugin'
],
function(
     Astro,
     Promise,
     ApplicationPlugin,
     WebViewPlugin,
     AnchoredLayoutPlugin,
     HeaderBarPlugin,
     DrawerPlugin
) {

    // Enter your site url here
    var baseUrl = "http://10.10.1.190:5000/";

    // Initialize plugins
    var applicationPromise = ApplicationPlugin.init();
    var mainWebViewPromise = WebViewPlugin.init();
    var layoutPromise = AnchoredLayoutPlugin.init();
    var headerPromise = HeaderBarPlugin.init();
    var drawerPromise = DrawerPlugin.init();
    var cartWebViewPromise = WebViewPlugin.init();
    var accountWebViewPromise = WebViewPlugin.init();


    // Start the app at the base url
    mainWebViewPromise.then(function(mainWebView) {
        mainWebView.navigate(baseUrl);
    });

    accountWebViewPromise.then(function(accountWebView) {
        accountWebView.navigate(baseUrl + 'menu');
    });

    // Use the mainWebView as the main content view for our layout
    Promise.join(layoutPromise, mainWebViewPromise, function(layout, mainWebView) {
        layout.setContentView(mainWebView.address);
    });

    // Route all unhandled key presses to the mainWebView
    Promise.join(applicationPromise, mainWebViewPromise, function(application, mainWebView){
        application.setMainInputPlugin(mainWebView.address);
    });

    // Create a new promise for when icons have been loaded into the header bar
    var loadIconPromise = headerPromise.then(function(headerBar){
        return Promise.join(
            headerBar.setLeftIcon(baseUrl + "/images/account.png"),
            headerBar.setRightIcon(baseUrl + "/images/cart.png"),
            headerBar.setCenterIcon(baseUrl + "/images/velo.png"),
            headerBar.setBackgroundColor("#FFFFFF")
        );
    });

    // Add the header bar to the top of the layout
    Promise.join(layoutPromise, headerPromise, loadIconPromise, function(layout, headerBar) {
        layout.addTopView(headerBar.address);
        headerBar.show();
    });

    // Set the layout plugin as the main content view of the drawer
    Promise.join(drawerPromise, layoutPromise, function(drawer, layout) {
        drawer.setContentView(layout.address);
    });

    Promise.join(drawerPromise, applicationPromise, function(drawer, application) {
        application.setMainViewPlugin(drawer.address);
    });

    cartWebViewPromise.then(function(webView) {
        webView.navigate(baseUrl + "cart/")
    });

    // Add the cart web view to the right drawer
    var rightDrawerPromise = Promise.join(cartWebViewPromise, drawerPromise, function(cartWebView, drawer) {
        var rightDrawer = drawer.initRightMenu(cartWebView.address);
        return rightDrawer;
    });

    // Add the account web view to the left drawer
    var leftDrawerPromise = Promise.join(accountWebViewPromise, drawerPromise, function(accountWebView, drawer) {
        var leftDrawer = drawer.initLeftMenu(accountWebView.address);
        return leftDrawer;
    });

    Promise.join(rightDrawerPromise, headerPromise, function(rightDrawer, header) {
        header.on('rightIconClick', function() {
            rightDrawer.toggle();
        });
    });

    Promise.join(leftDrawerPromise, headerPromise, function(leftDrawer, header) {
        header.on('leftIconClick', function() {
            leftDrawer.toggle();
        });
    });

    Promise.join(mainWebViewPromise, rightDrawerPromise, function(mainWebView, rightDrawer) {
        mainWebView.on('addToCartClicked', function() {
            rightDrawer.open();
        });
    });

}, undefined, true);
