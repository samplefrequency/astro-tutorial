package com.mobify.astro.velo;

import android.os.Bundle;

import com.mobify.astro.AstroActivity;
import com.mobify.astro.plugins.AlertViewPlugin;
import com.mobify.astro.plugins.AnchoredLayoutPlugin;
import com.mobify.astro.plugins.AstroWorker;
import com.mobify.astro.plugins.ListSelectPlugin;
import com.mobify.astro.plugins.counterbadgeplugin.CounterBadgePlugin;
import com.mobify.astro.plugins.SecureStorePlugin;
import com.mobify.astro.plugins.SharingPlugin;
import com.mobify.astro.plugins.TabBarPlugin;
import com.mobify.astro.plugins.headerbarplugin.HeaderBarPlugin;
import com.mobify.astro.plugins.loaders.DefaultLoaderPlugin;
import com.mobify.astro.plugins.ImageViewPlugin;
import com.mobify.astro.plugins.ModalViewPlugin;
import com.mobify.astro.plugins.DrawerPlugin;
import com.mobify.astro.plugins.NavigationPlugin;
import com.mobify.astro.plugins.webviewplugin.WebViewPlugin;

import org.apache.cordova.CordovaWebView;

public class MainActivity extends AstroActivity {
    protected AstroWorker worker;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Register plugins.
        // TODO: In the future we probably want to load this from a configuration file.
        pluginManager.register(AlertViewPlugin.class);
        pluginManager.register(AnchoredLayoutPlugin.class);
        pluginManager.register(CounterBadgePlugin.class);
        pluginManager.register(DefaultLoaderPlugin.class);
        pluginManager.register(DrawerPlugin.class);
        pluginManager.register(HeaderBarPlugin.class);
        pluginManager.register(ImageViewPlugin.class);
        pluginManager.register(ListSelectPlugin.class);
        pluginManager.register(ModalViewPlugin.class);
        pluginManager.register(NavigationPlugin.class);
        pluginManager.register(SecureStorePlugin.class);
        pluginManager.register(TabBarPlugin.class);
        pluginManager.register(WebViewPlugin.class);
        pluginManager.register(SharingPlugin.class);

        // Create the initial worker.
        worker = new AstroWorker(this, pluginManager);

        // Enable Cordova plugins by associating the worker's Cordova webview with the activity.
        CordovaWebView webView = (CordovaWebView)worker.getView();
        setCordovaWebView(webView);
    }
}
