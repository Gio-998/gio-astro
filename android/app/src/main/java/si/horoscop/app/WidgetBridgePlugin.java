package si.horoscop.app;

import android.content.Context;
import android.content.SharedPreferences;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/** Stores the widget snapshot (today + 6 days, written by the web layer) and refreshes the widgets. */
@CapacitorPlugin(name = "WidgetBridge")
public class WidgetBridgePlugin extends Plugin {
    static final String PREFS = "horoscop_widget";
    static final String KEY = "snapshot";

    @PluginMethod
    public void saveSnapshot(PluginCall call) {
        String json = call.getString("json");
        if (json == null) { call.reject("missing json"); return; }
        Context ctx = getContext();
        prefs(ctx).edit().putString(KEY, json).apply();
        HoroscopWidgetProvider.updateAll(ctx);
        call.resolve(new JSObject());
    }

    @PluginMethod
    public void clear(PluginCall call) {
        Context ctx = getContext();
        prefs(ctx).edit().remove(KEY).apply();
        HoroscopWidgetProvider.updateAll(ctx);
        call.resolve(new JSObject());
    }

    static SharedPreferences prefs(Context ctx) { return ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE); }
}
