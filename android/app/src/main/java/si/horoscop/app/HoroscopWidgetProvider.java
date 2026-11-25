package si.horoscop.app;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.widget.RemoteViews;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;
import org.json.JSONObject;

/**
 * Home-screen widget: shows today's entry of the snapshot written by WidgetBridgePlugin. The snapshot holds 7 days,
 * so the widget shows the right day even when the app was not opened that morning. "Today" is the Europe/Skopje date, like the app.
 */
public class HoroscopWidgetProvider extends AppWidgetProvider {

    @Override
    public void onUpdate(Context ctx, AppWidgetManager mgr, int[] ids) {
        for (int id : ids) mgr.updateAppWidget(id, render(ctx));
    }

    static void updateAll(Context ctx) {
        AppWidgetManager mgr = AppWidgetManager.getInstance(ctx);
        int[] ids = mgr.getAppWidgetIds(new ComponentName(ctx, HoroscopWidgetProvider.class));
        for (int id : ids) mgr.updateAppWidget(id, render(ctx));
    }

    static String today() {
        SimpleDateFormat f = new SimpleDateFormat("yyyy-MM-dd", Locale.US);
        f.setTimeZone(TimeZone.getTimeZone("Europe/Skopje"));
        return f.format(new Date());
    }

    static RemoteViews render(Context ctx) {
        RemoteViews v = new RemoteViews(ctx.getPackageName(), R.layout.widget_horoscop);
        String link = null;
        try {
            String raw = WidgetBridgePlugin.prefs(ctx).getString(WidgetBridgePlugin.KEY, null);
            JSONObject snap = raw == null ? null : new JSONObject(raw);
            JSONObject day = snap == null ? null : snap.optJSONObject("days") == null ? null : snap.getJSONObject("days").optJSONObject(today());
            if (day != null) {
                v.setTextViewText(R.id.widget_sign, day.optString("glyph") + " " + day.optString("signName"));
                v.setTextViewText(R.id.widget_headline, day.optString("headline"));
                v.setTextViewText(R.id.widget_moon, day.optString("moonLine"));
                link = day.optString("deepLink", null);
            } else {
                v.setTextViewText(R.id.widget_sign, "Horoscop");
                v.setTextViewText(R.id.widget_headline, snap != null ? snap.optString("empty") : ctx.getString(R.string.widget_empty));
                v.setTextViewText(R.id.widget_moon, "");
            }
        } catch (Exception e) {
            v.setTextViewText(R.id.widget_sign, "Horoscop");
            v.setTextViewText(R.id.widget_headline, ctx.getString(R.string.widget_empty));
        }
        Intent open = link != null ? new Intent(Intent.ACTION_VIEW, Uri.parse(link)) : new Intent(ctx, MainActivity.class);
        open.setPackage(ctx.getPackageName());
        open.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        PendingIntent pi = PendingIntent.getActivity(ctx, 0, open, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        v.setOnClickPendingIntent(R.id.widget_root, pi);
        return v;
    }
}
