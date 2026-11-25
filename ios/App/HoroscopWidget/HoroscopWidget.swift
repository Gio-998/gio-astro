import WidgetKit
import SwiftUI

/// Home-screen widget. Reads the snapshot the app writes through WidgetBridgePlugin into the App Group
/// "group.si.horoscop.app" (today + 6 days), so it shows the right day even when the app was not opened that morning.
/// "Today" is the Europe/Skopje date, the same as in the app.

struct DayEntry: Decodable {
    let sign: String; let signName: String; let glyph: String
    let headline: String; let overview: String; let moonLine: String
    let luckyNumber: Int; let luckyColor: String; let deepLink: String
}
struct Snapshot: Decodable { let version: Int; let lang: String; let empty: String; let days: [String: DayEntry] }

struct HoroEntry: TimelineEntry { let date: Date; let day: DayEntry?; let empty: String }

private let skopje = TimeZone(identifier: "Europe/Skopje") ?? .current
private func isoDay(_ d: Date) -> String {
    let f = DateFormatter(); f.calendar = Calendar(identifier: .gregorian); f.timeZone = skopje; f.locale = Locale(identifier: "en_US_POSIX"); f.dateFormat = "yyyy-MM-dd"
    return f.string(from: d)
}
private func loadSnapshot() -> Snapshot? {
    guard let json = UserDefaults(suiteName: "group.si.horoscop.app")?.string(forKey: "snapshot"), let data = json.data(using: .utf8) else { return nil }
    return try? JSONDecoder().decode(Snapshot.self, from: data)
}

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> HoroEntry { HoroEntry(date: Date(), day: nil, empty: "Horoscop") }
    func getSnapshot(in context: Context, completion: @escaping (HoroEntry) -> Void) { completion(entry(for: Date())) }
    func getTimeline(in context: Context, completion: @escaping (Timeline<HoroEntry>) -> Void) {
        // One entry per Skopje midnight for the days in the snapshot, then ask again.
        var cal = Calendar(identifier: .gregorian); cal.timeZone = skopje
        let start = Date(); var entries = [entry(for: start)]
        var next = cal.startOfDay(for: start)
        for _ in 0..<6 { next = cal.date(byAdding: .day, value: 1, to: next)!; entries.append(entry(for: next)) }
        completion(Timeline(entries: entries, policy: .atEnd))
    }
    private func entry(for date: Date) -> HoroEntry {
        let snap = loadSnapshot()
        return HoroEntry(date: date, day: snap?.days[isoDay(date)], empty: snap?.empty ?? "Horoscop")
    }
}

struct HoroscopWidgetView: View {
    var entry: HoroEntry
    @Environment(\.widgetFamily) var family
    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            if let d = entry.day {
                Text("\(d.glyph) \(d.signName)").font(.caption).bold().foregroundColor(Color(red: 0.91, green: 0.78, blue: 0.54)).lineLimit(1)
                Text(d.headline).font(family == .systemSmall ? .footnote : .subheadline).foregroundColor(Color(red: 0.96, green: 0.95, blue: 1.0)).lineLimit(family == .systemSmall ? 4 : 3)
                if family != .systemSmall { Text(d.overview).font(.caption2).foregroundColor(Color(red: 0.73, green: 0.70, blue: 0.85)).lineLimit(2) }
                Spacer(minLength: 0)
                Text(d.moonLine).font(.caption2).foregroundColor(Color(red: 0.73, green: 0.70, blue: 0.85)).lineLimit(1)
            } else {
                Text("Horoscop").font(.caption).bold().foregroundColor(Color(red: 0.91, green: 0.78, blue: 0.54))
                Text(entry.empty).font(.footnote).foregroundColor(.white).lineLimit(4)
                Spacer(minLength: 0)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
        .widgetURL(URL(string: entry.day?.deepLink ?? "si.horoscop.app://today"))
        .modifier(WidgetBackground())
    }
}

private struct WidgetBackground: ViewModifier {
    let gradient = LinearGradient(colors: [Color(red: 0.11, green: 0.09, blue: 0.27), Color(red: 0.07, green: 0.06, blue: 0.18)], startPoint: .top, endPoint: .bottom)
    func body(content: Content) -> some View {
        if #available(iOS 17.0, *) { content.containerBackground(for: .widget) { gradient } }
        else { content.padding().background(gradient) }
    }
}

@main
struct HoroscopWidget: Widget {
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: "HoroscopWidget", provider: Provider()) { entry in HoroscopWidgetView(entry: entry) }
            .configurationDisplayName("Horoscop")
            .supportedFamilies([.systemSmall, .systemMedium])
    }
}
