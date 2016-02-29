window.AstroMessages = [];

require([
    'astro-full',
    'bluebird',
    'application',
    'plugins/webViewPlugin',
    'plugins/anchoredLayoutPlugin',
    'plugins/navigationPlugin',
    'plugins/headerBarPlugin',
    'plugins/drawerPlugin',
    'plugins/mobifyPreviewPlugin'
],
function(
    Astro,
    Promise,
    Application,
    WebViewPlugin,
    AnchoredLayoutPlugin,
    NavigationPlugin,
    HeaderBarPlugin,
    DrawerPlugin,
    MobifyPreviewPlugin
) {

    // Enter your site url here
    var baseUrl = 'http://www.burlingtoncoatfactory.com/babydepot/';

    // Initialize plugins
    var mainNavigationPromise = NavigationPlugin.init();
    var layoutPromise = AnchoredLayoutPlugin.init();
    var headerPromise = HeaderBarPlugin.init();
    var drawerPromise = DrawerPlugin.init();
    var cartWebViewPromise = WebViewPlugin.init();
    var navWebViewPromise = WebViewPlugin.init();

    var defaultHeaderOptions = {header: {
        leftIcon: {
            id: 'menu',
            imageUrl: 'file:///menu.png'
        },
        centerIcon: {
            id: 'logo',
            imageUrl: 'file:///logo.png'
        },
        rightIcon: {
            id: 'cart',
            imageUrl: 'file:///cart.png'
        }
    }
  }
var run = function(){
    // Start the app by navigating to the base url
    Promise.join(mainNavigationPromise, headerPromise, function(mainNavigationView, headerBar) {
        // Now, let's hook up the main navigation to the header bar
        mainNavigationView.setHeaderBar(headerBar);

        // Navigate to the base url and set the icons


        // When the back button is pressed navigate back
        headerBar.on('click:back', function() {
            mainNavigationView.back();
        });

        headerBar.on('click:barcodeScanner', function() {


        });
    });

    // Use the mainNavigationView as the main content view for our layout
    Promise.join(layoutPromise, mainNavigationPromise, function(layout, mainNavigationView) {
        layout.setContentView(mainNavigationView);
    });

    // Add the header bar once `layoutPromise` and `headerPromise` are fulfilled.
    Promise.join(layoutPromise, headerPromise, function(layout, headerBar) {
        // Set up the header bar
        headerBar.setBackgroundColor("#0070b6");
        headerBar.setTextColor("#ffffff");

        layout.addTopView(headerBar);
    });

    // Set the drawer's content area once `drawerPromise` and `layoutPromise` are fulfilled.
    Promise.join(drawerPromise, layoutPromise, function(drawer, layout) {
        drawer.setContentView(layout);
    });

    // Set our layout as the main view of the app
    drawerPromise.then(function(drawer) {
        Application.setMainViewPlugin(drawer);
    });

    // Navigate the cart webview to the right url
    cartWebViewPromise.then(function(webView) {
        webView.navigate(baseUrl + "/ShoppingCart.aspx");
        webView.setBackgroundColor("#FFFFFF");
        // Don't navigate when links are pressed
        webView.disableDefaultNavigationHandler();
    });

    //Navigate to menu to left nav
    navWebViewPromise.then(function(webView) {
        webView.navigate("file:///local_www/left_menu.html");
        webView.setBackgroundColor("#FFFFFF");
        // Don't navigate when links are pressed
        webView.disableDefaultNavigationHandler();
    });

    // Set the right drawer view to the cart web view instance once the promises have been fulfilled.
    var rightDrawerPromise = Promise.join(cartWebViewPromise, drawerPromise, function(cartWebView, drawer) {
        var rightDrawer = drawer.initRightMenu(cartWebView);
        // We want the right drawer later, so we will return it
        return rightDrawer;
    });

    // Set the right drawer view to the cart web view instance once the promises have been fulfilled.
    var leftDrawerPromise = Promise.join(navWebViewPromise, drawerPromise, function(navWebView, drawer) {
        var leftDrawer = drawer.initLeftMenu(navWebView);
        // We want the right drawer later, so we will return it
        return leftDrawer;
    });

    // Bind the `rightIconClick` event once the promises have been fulfilled.
    Promise.join(rightDrawerPromise, headerPromise,cartWebViewPromise, function(rightDrawer, header, cartWebView) {
        header.on('click:cart', function() {
            rightDrawer.toggle();
        });
    });

    // Bind the `rightIconClick` event once the promises have been fulfilled.
    Promise.join(leftDrawerPromise, headerPromise, function(leftDrawer, header) {
        header.on('click:menu', function() {
            leftDrawer.toggle();
        });
    });

    // Add a handler on the main web view to open drawer when 'addToCartClicked' event happens.
    Promise.join(mainNavigationPromise,
                    rightDrawerPromise,
                    cartWebViewPromise,
                    function(mainNavigationView, rightDrawer, cartWebView) {
        mainNavigationView.on('addToCartClicked', function() {
            // Open the right drawer
            rightDrawer.open();
            // Let the cart view know that something has been added
            cartWebView.reload();
            cartWebView.trigger('cartUpdated');
        });
    });


    Promise.join(leftDrawerPromise,mainNavigationPromise,navWebViewPromise, function(leftDrawer,mainWebView,navWebView) {
      navWebView.on('navLinkClick',function (data) {
        mainWebView.navigate(data.url)
        leftDrawer.toggle();
      })
    })
    // bar code scanner click
    Promise.join(leftDrawerPromise,navWebViewPromise, function(leftDrawer,navWebView) {
      navWebView.on('barcodeScannerClicked',function() {
        leftDrawer.toggle();
        window.cordova.plugins.barcodeScanner.scan(function(result) {
            if (result.cancelled) {
                return;
            }

            var barcodeMapping = {
                'notfound': '/city-bike/',
                '9781472322531': '/road-bike/',
                '011091212197'  : '/commuter/',
                '5024095212198': '/road-bike/'
            };

            var resultURL = baseUrl + (result.text in barcodeMapping ? barcodeMapping[result.text] : barcodeMapping['notfound']);

            console.log('We got a barcode\n' +
                'Result: ' + result.text + '\n' +
                'Format: ' + result.format + '\n' +
                'Cancelled: ' + result.cancelled);
        }, function(error) {
            console.log('Scanning failed: ' + error);
        });

      })
  })
}

  Promise.join(mainNavigationPromise, function(mainWebView) {
    mainWebView.defaultWebViewPluginOptions ={
      manuallyShowPageForHost : [['www.burlingtoncoatfactory.com']]
    };
    MobifyPreviewPlugin.init().then(function(mobifyPreviewPlugin){
      mobifyPreviewPlugin.preview(
          'http://www.burlingtoncoatfactory.com/babydepot/Default.aspx',
          'http://localhost:8080'
      ).then(function(previewedUrl) {
          mainWebView.navigate(previewedUrl, defaultHeaderOptions);
          run()
      });
    });
  })




}, undefined, true);
