#!/usr/bin/env ruby
# Idempotent: adds the home-screen widget (WidgetKit extension "HoroscopWidget", bundle id si.horoscop.app.HoroscopWidget) to
# ios/App/App.xcodeproj and the App Group group.si.horoscop.app to both entitlements.
#
# Not applied in the committed project on purpose: the App Group must first be registered in the Apple Developer account and enabled on
# BOTH identifiers (si.horoscop.app and si.horoscop.app.HoroscopWidget), otherwise signing of the whole app fails.
# codemagic.yaml runs this script when the environment variable IOS_WIDGET=1 (docs/MOBILE.md). Needs: gem install xcodeproj
require "xcodeproj"

root = File.expand_path("../App", __dir__)
project = Xcodeproj::Project.open(File.join(root, "App.xcodeproj"))
app = project.targets.find { |t| t.name == "App" } or abort("App target not found")
NAME = "HoroscopWidget"
GROUP_ID = "group.si.horoscop.app"

if project.targets.any? { |t| t.name == NAME }
  puts "#{NAME} target already present"
else
  app_settings = app.build_configurations.first.build_settings
  widget = project.new_target(:app_extension, NAME, :ios, "15.0", nil, :swift)
  group = project.main_group.find_subpath(NAME, true)
  group.set_source_tree("<group>"); group.set_path(NAME)
  widget.add_file_references([group.new_reference("HoroscopWidget.swift")])
  group.new_reference("Info.plist"); group.new_reference("HoroscopWidget.entitlements")
  %w[WidgetKit SwiftUI].each { |fw| widget.add_system_framework(fw) }
  widget.build_configurations.each do |c|
    s = c.build_settings
    s["PRODUCT_BUNDLE_IDENTIFIER"] = "si.horoscop.app.#{NAME}"
    s["PRODUCT_NAME"] = "$(TARGET_NAME)"
    s["INFOPLIST_FILE"] = "#{NAME}/Info.plist"
    s["CODE_SIGN_ENTITLEMENTS"] = "#{NAME}/#{NAME}.entitlements"
    s["CODE_SIGN_STYLE"] = app_settings["CODE_SIGN_STYLE"] || "Automatic"
    s["SWIFT_VERSION"] = "5.0"
    s["TARGETED_DEVICE_FAMILY"] = "1,2"
    s["IPHONEOS_DEPLOYMENT_TARGET"] = "15.0"
    s["SKIP_INSTALL"] = "YES"
    s["GENERATE_INFOPLIST_FILE"] = "NO"
    s["MARKETING_VERSION"] = app_settings["MARKETING_VERSION"] || "1.0"
    s["CURRENT_PROJECT_VERSION"] = app_settings["CURRENT_PROJECT_VERSION"] || "1"
    s["LD_RUNPATH_SEARCH_PATHS"] = ["$(inherited)", "@executable_path/Frameworks", "@executable_path/../../Frameworks"]
  end
  app.add_dependency(widget)
  embed = app.copy_files_build_phases.find { |p| p.name == "Embed Foundation Extensions" } || app.new_copy_files_build_phase("Embed Foundation Extensions")
  embed.symbol_dst_subfolder_spec = :plug_ins
  build_file = embed.add_file_reference(widget.product_reference, true)
  build_file.settings = { "ATTRIBUTES" => ["RemoveHeadersOnCopy"] }
  puts "added #{NAME} target"
end
project.save

# App Group on the app itself, so WidgetBridgePlugin writes where the widget reads.
ent = File.join(root, "App", "App.entitlements")
plist = Xcodeproj::Plist.read_from_path(ent)
groups = plist["com.apple.security.application-groups"] ||= []
groups << GROUP_ID unless groups.include?(GROUP_ID)
Xcodeproj::Plist.write_to_path(plist, ent)
puts "App Group #{GROUP_ID} on App"
