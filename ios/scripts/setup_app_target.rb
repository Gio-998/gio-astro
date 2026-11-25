#!/usr/bin/env ruby
# Idempotent: adds the app's own Swift files and entitlements to the App target of ios/App/App.xcodeproj.
# Already applied and committed; re-run after regenerating the iOS project (`npx cap add ios`). Needs: gem install xcodeproj
require "xcodeproj"

root = File.expand_path("../App", __dir__)
project = Xcodeproj::Project.open(File.join(root, "App.xcodeproj"))
app = project.targets.find { |t| t.name == "App" } or abort("App target not found")
group = project.main_group.find_subpath("App", false) or abort("App group not found")

%w[MainViewController.swift WidgetBridgePlugin.swift].each do |name|
  next if group.files.any? { |f| f.path == name }
  ref = group.new_reference(name)
  app.add_file_references([ref])
  puts "added #{name}"
end
unless group.files.any? { |f| f.path == "App.entitlements" }
  group.new_reference("App.entitlements")
  puts "added App.entitlements"
end
app.build_configurations.each { |c| c.build_settings["CODE_SIGN_ENTITLEMENTS"] = "App/App.entitlements" }
project.save
puts "App target ready"
