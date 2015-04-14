(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['vendor/backbone-events'], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory('./vendor/backbone-events');
    } else {
        // Browser globals (root is window)
        factory(window.BackboneEvents);
    }
}(this, function (BackboneEvents) {
    // Astro should already be defined due to us exposing it with
    // the Javascript Interface on the Native side. This will have to
    // change when we start working on the iOS side of things.
    var Astro = window.Astro || {
        exec: function(){
            // TODO: For iOS, this function will have to navigate
            //       an iframe to communicate to the native layer.
            console.log('This should not get called');
            return;
        }
    };

    // This method is for doing feature detection within a website
    // for augmenting behaviour in the app.
    Astro.isRunningInApp = function(){
        // if window.Astro isn't defined, that means we are't running
        // within the context of the app, because our WebViews should
        // expose it.
        // TODO: For iOS, this will not work, we'll have to come up
        //       with something else.
        return !!window.Astro;
    };

    // This method is for doing feature detection within a website
    // for making Android-specific augmentations in the app.
    Astro.isRunningInAndroidApp = function(){
        return Astro.isRunningInApp() && /android/i.test(navigator.userAgent);
    };

    Astro.Utils = {
        // https://github.com/mobify/mobifyjs-utils/blob/master/utils.js#L22
        extend: function(target){
            [].slice.call(arguments, 1).forEach(function(source) {
                for (var key in source)
                    if (source[key] !== undefined)
                        target[key] = source[key];
            });
            return target;
        }
    };

    Astro.postMessage = function(address, payload) {
        // We need to always pass params, even if it's empty
        if (!payload.params) {
            payload.params = {};
        }

        var data = {
            payload: payload
        };

        Astro.exec(address, JSON.stringify(data));
    };

    var curCallId = 0;
    var callHandlers = {};

    /**
     * Constructs an RPCRequest and sends it to the native layer.
     *
     *    address  (required) - Where the message is gettings sent
     *    payload  (required) - The body of the request
     *    options  (optional)
     *        options.headers - Additional headers that
     *        options.callback - Function to run when a response comes back
     */
    Astro._postRpcRequest = function(address, payload, options) {
        options = options || {};

        var request = Astro._buildRpcMessage(payload, options.headers);

        if (options.callback) {
            callHandlers[request.id] = options.callback;
        }

        Astro.exec(address, JSON.stringify(request));
    };

    Astro._buildRpcMessage = function(payload, headers) {
        headers = headers || {};
        payload.params = payload.params || {};

        // If the headers don't have an id, this is a new RPC message
        // and we must attach the current call ID.
        if (!headers.id) {
            headers.id = curCallId;
            curCallId++;
        }

        var request = {
            payload: payload
        };
        Astro.Utils.extend(request, headers)

        return request;
    }

    Astro._postRpcResponse = function(address, callID, payload) {
        var response = _buildRpcMessage(payload, {id: callId});

        Astro.exec(address, JSON.stringify(response));
    }

    Astro._getCallHandlers = function(){
        return callHandlers;
    };

    Astro._getCurCallId = function(){
        return curCallId;
    };

    var registeredMethods = {};

    Astro.receiveMessage = function(data) {
        data = JSON.parse(data);

        // The message is an RPC Request.
        // Handle it, sending a response at the same time
        if (data.isJsRpc) {
            Astro._handleRpcRequest(data);
            return;
        }

        // The message is from an event.
        if (data.payload && data.payload.eventName) {
            Astro.events.trigger(data.senderAddress, data);
            return;
        }

        // Otherwise the message is an RPC Response.
        // If there is no callId then there are no callbacks to fire.
        var callId = data.id;
        if (!callId) {
            return;
        }

        var callback = callHandlers[callId];
        delete callHandlers[callId];

        if (callback) {
            callback(data.payload.error, data.payload.result);
        }
    };

    /**
     * Invokes the method from an RpcRequest and sends a response
     */
    Astro._handleRpcRequest = function(request) {
        var rpcResponse = Astro._createRpcResponseForRequest(request);

        var methodName = request.payload.method;
        var method = registeredMethods[methodName];

        try {
            var unpackedArguments = Astro._unpackArgsForMethod(request.payload.params, method);

            // The response is always passed as the first argument so we can
            // send the response whenever we want.
            var methodArguments = [rpcResponse].concat(unpackedArguments);

            method.implementation.apply(this, methodArguments);
        } catch(err) {
            rpcResponse.send(err.message, null);
        }
    }

    Astro._createRpcResponseForRequest = function(request) {
        return {
            id: request.id,
            send: function (error, result) {
                var payload = {
                    error: error,
                    result: result
                };
                Astro._postRpcResponse(request.senderAddress, this.id, payload);
            }
        };
    }

    Astro._unpackArgsForMethod = function(args, method) {
        var methodArgs = method.methodArgs;
        var argValues = [];
        var arg;
        var name;

        for (i = 0; i < methodArgs.length; i++) {
            name = methodArgs[i];
            arg = args[name];
            if (arg === undefined) {
                throw new Error("Error unpacking argument for method " + method.methodName +
                ". methodArgs with name " + name + " not found.");
            }
            argValues.push(arg);
        }
        return argValues;
    }

    Astro.registerRpcMethod = function(methodName, methodArgs, implementation) {
        registeredMethods[methodName] = {
            methodName: methodName,
            methodArgs: methodArgs,
            implementation: implementation
        };
    };

    /**
     * A factory method for creaing RPC Methods. Allows for reduced
     * Boilerplate by removing the need for developers to construct
     * payloads and call `Astro.postRpcMessage`.
     *
     * methodName - Name of the method that corresponds
     * with the associated Astro plugin.
     *
     * methodArgs - An array of arguments that an SDK user would have
     * to provide when calling the method.
     *
     * An SDK Plugin Developer would create RPC methods like so:
     * `WebViewPlugin.prototype.navigate = Astro.nativeRpcMethod('navigate', ['url']);`
     *
     * An SDK User would call the above method like so:
     * `webView.navigate('http://www.mobify.com', callback)`
     */
     Astro.nativeRpcMethod = function(methodName, methodArgs) {
         return Astro._rpcMethod(methodName, methodArgs);
     };

     Astro.jsRpcMethod = function(methodName, methodArgs) {
         return Astro._rpcMethod(methodName, methodArgs, "AstroWorkerPlugin:0", {isJsRpc: true});
     };

     // return a method that will be called by the user
     Astro._rpcMethod = function(methodName, methodArgs, address, headers) {
         // if optional `methodArgs` isn't set, make it so.
         methodArgs = methodArgs || [];
         return function() {
             // convert the arguments into an array because arguments
             // is an array-like object.
             var args = Array.prototype.slice.call(arguments);

             // if the last argument is a function, then it's a callback
             // that the user can pass in for completion of the async
             // method call.
             var lastArg = args[args.length-1];
             var callback = undefined;
             if (lastArg && (typeof lastArg === 'function')) {
                 // set the callback and remove that argument from the args array
                 callback = args.pop();
             }

             // if the user calling the rpc method passes in more arguments
             // then defined in the `methodArgs` object, then they must have
             // called it incorrectly.
             // TODO: Figure out how we want to bubble errors to the user.
             if (args.length - 1 > methodArgs.length) {
                 console.error('Too many arguments passed');
                 return;
             }

             // create the payload
             var payload = {method: methodName, params: {}};

             // pass the keys (the arguments defined in methodArgs)
             // and the values (the values in the args array) into the
             // params object of the payload.
             methodArgs.forEach(function(methodArg, index) {
                 payload['params'][methodArg] = args[index];
             });

             var options = {
                 callback: callback
             };

             if (headers) {
                 message.headers = headers;
             }

             // If no address is specified, send the request to itself
             var destinationAddress = address || this.address;

             // Send this message
             Astro._postRpcRequest(destinationAddress, payload, options);
         };
     };

    Astro.events = Astro.Utils.extend({}, BackboneEvents);

    /**
     * Triggers an event, which gets post-messaged to the native
     * event emitter where callbacks that have been registered are called.
     */
    Astro.trigger = function(eventName, params) {
        var payload = {
            eventName: eventName,
            params: params
        };
        Astro.postMessage('self:events', payload);
    };
    window.Astro = Astro;
    return Astro;
}));
