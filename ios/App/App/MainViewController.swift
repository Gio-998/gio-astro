import UIKit
import Capacitor

/// Bridge view controller (set in Main.storyboard) that registers the app's local plugins.
class MainViewController: CAPBridgeViewController {
    override open func capacitorDidLoad() {
        bridge?.registerPluginInstance(WidgetBridgePlugin())
    }
}
