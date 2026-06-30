#!/usr/bin/env node
// Minimal plugin installer for CI - reads YAML config, installs plugins,
// regenerates .quartz/plugins/index.ts, WITHOUT loading the full Quartz config.
import fs from "fs"
import path from "path"
import YAML from "yaml"

const CONFIG_PATH = path.join(process.cwd(), "quartz.config.default.yaml")
const raw = fs.readFileSync(CONFIG_PATH, "utf-8")
const config = YAML.parse(raw)

const githubSources = config.plugins
  .filter((p) => typeof p.source === "string" && p.source.startsWith("github:"))
  .map((p) => p.source)

if (githubSources.length === 0) {
  console.log("No GitHub plugins to install.")
  process.exit(0)
}

// Dynamically import the git loader
const { installPlugins, parsePluginSource, updatePlugins } = await import(
  "../quartz/plugins/loader/gitLoader.js"
)

const specs = githubSources.map((s) => parsePluginSource(s))
console.log(`Installing ${specs.length} plugin(s) from Git...`)

const installed = await installPlugins(specs, { verbose: true })

if (installed.size === githubSources.length) {
  console.log("✓ All plugins installed successfully")
} else {
  console.log(`⚠ Only ${installed.size}/${githubSources.length} plugins installed`)
}

console.log("Regenerating plugin index...")
await updatePlugins({ verbose: true })
console.log("Done.")
