require.config({
    baseUrl: '.',
    paths: {
    	'astro': '../node_modules/astro-sdk/js/src/astro',
        'app': '../node_modules/astro-sdk/js/src/app',
        'bluebird': 'node_modules/bluebird/js/browser/bluebird',
    	'plugin-manager': '../node_modules/astro-sdk/js/src/plugin-manager',
    	'plugins': '../node_modules/astro-sdk/js/src/plugins',
        'vendor/backbone-events': '../node_modules/astro-sdk/js/vendor/backbone-events',
        'worker': '../node_modules/astro-sdk/js/worker'
    }
});
