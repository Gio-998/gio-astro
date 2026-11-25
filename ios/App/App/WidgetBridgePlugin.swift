import Foundation
import Capacitor
#if canImport(WidgetKit)
import WidgetKit
#endif

/// Hands the home-screen widget its JSON snapshot (today + 6 days, written by src/app-mode/widget.ts).
/// Shared through the App Group "group.si.horoscop.app"; without the App Group (widget not set up yet) the data simply stays unused.
@objc(WidgetBridgePlugin)
public class WidgetBridgePlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "WidgetBridgePlugin"
    public let jsName = "WidgetBridge"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "saveSnapshot", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "clear", returnType: CAPPluginReturnPromise),
    ]
    static let suite = "group.si.horoscop.app"
    static let key = "snapshot"

    @objc func saveSnapshot(_ call: CAPPluginCall) {
        guard let json = call.getString("json") else { call.reject("missing json"); return }
        UserDefaults(suiteName: Self.suite)?.set(json, forKey: Self.key)
        reload()
        call.resolve()
    }

    @objc func clear(_ call: CAPPluginCall) {
        UserDefaults(suiteName: Self.suite)?.removeObject(forKey: Self.key)
        reload()
        call.resolve()
    }

    private func reload() {
        #if canImport(WidgetKit)
        if #available(iOS 14.0, *) { WidgetCenter.shared.reloadAllTimelines() }
        #endif
    }
}
