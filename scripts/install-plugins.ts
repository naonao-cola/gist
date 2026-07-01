#!/usr/bin/env npx tsx
// Install Quartz plugins from YAML config, without loading the full Quartz engine.
// CI needs this so .quartz/plugins/index.ts exists before esbuild bundles Head.tsx
import fs from "fs"
import path from "path"
import YAML from "yaml"
import { installPlugins, parsePluginSource, updatePlugins } from "../quartz/plugins/loader/gitLoader.js"

const CONFIG_PATH = path.join(process.cwd(), "quartz.config.default.yaml")
const raw = fs.readFileSync(CONFIG_PATH, "utf-8")
const config = YAML.parse(raw)

const githubSources = config.plugins
  .filter((p: any) => typeof p.source === "string" && p.source.startsWith("github:"))
  .map((p: any) => p.source)

if (githubSources.length === 0) {
  console.log("No GitHub plugins to install.")
  process.exit(0)
}

const specs = githubSources.map((s: string) => parsePluginSource(s))
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
