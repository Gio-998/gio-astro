package si.horoscop.app;

import android.content.res.Configuration;
import android.os.Bundle;
import android.webkit.WebSettings;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Local plugin: hands the home-screen widget its JSON snapshot (src/app-mode/widget.ts).
        registerPlugin(WidgetBridgePlugin.class);
        super.onCreate(savedInstanceState);
    }

    @Override
    public void onStart() {
        super.onStart();
        applySystemTextZoom();
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        applySystemTextZoom();
    }

    /** Follows the system font size (Settings, Display, Font size) via WebView textZoom. */
    private void applySystemTextZoom() {
        if (getBridge() == null || getBridge().getWebView() == null) return;
        WebSettings settings = getBridge().getWebView().getSettings();
        int zoom = Math.round(getResources().getConfiguration().fontScale * 100f);
        if (zoom < 85) zoom = 85;
        settings.setTextZoom(zoom);
    }
}
