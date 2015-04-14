(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['astro', 'worker', 'vendor/backbone-events'], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory('./astro', './worker', './vendor/backbone-events');
    } else {
        // Browser globals (root is window)
        factory(window.Astro, window.Worker, window.BackboneEvents);
    }
}(this, function (Astro, Worker, BackboneEvents) {
    var PluginManager = {};

    PluginManager.address = 'PluginManager:0';

    /**
     * Instantiates a plugin by messaging the PluginManager in the native layer.
     * The callback will be passed an address in its arguments
     * once the instantiation of the plugin is complete.
     *
     * After the object has finished being instantiated in the native side and
     * after the address is received, a representation of that plugin
     * is created in JS land using the constructor passed from the `init`
     * method inside the plugin itself.
     */
    var createPluginRpcMethod = Astro.nativeRpcMethod('createPlugin', ['pluginName']);
    PluginManager.createPlugin = function(pluginConstructor, callback) {
        var instantiatePluginInstanceWithAddress = function(err, address) {
                // Creates an instance of a plugin
                var pluginInstance = new pluginConstructor();

                // Set the address on that plugin instance
                pluginInstance.address = address;

                // Tells the worker to subscribe to events for this
                Worker.subscribeToEventsForPlugin(pluginInstance.address);

                // Subscribes this instance to any events coming from that webview.
                Astro.events.on(pluginInstance.address, function(data){
                    pluginInstance.trigger(data.payload.eventName, data.payload.params);
                });

                // Add eventing to the plugin instance
                Astro.Utils.extend(pluginInstance, BackboneEvents);

                // Execute the callback to give the instance back who whoever called
                // `createPlugin`.
                callback(pluginInstance);
        };
        // Execute the RPC method
        createPluginRpcMethod.call(this, pluginConstructor.pluginName, instantiatePluginInstanceWithAddress);
    };

    return PluginManager;

}));
