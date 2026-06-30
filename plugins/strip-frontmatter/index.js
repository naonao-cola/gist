import { visit } from "unist-util-visit"
import YAML from "yaml"
import remarkFrontmatter from "remark-frontmatter"

// Properly handle YAML frontmatter (---...---) in markdown files.
// Uses remark-frontmatter to teach remark-parse that --- is frontmatter, not <hr/>.
// Extracts frontmatter data into vfile.data.frontmatter for other plugins to use.
// remark-rehype drops yaml nodes automatically, so no extra HTML stripping needed.
export default function () {
  return {
    name: "strip-frontmatter",
    markdownPlugins: () => [
      // tells remark-parse to recognize --- as YAML frontmatter
      remarkFrontmatter,
      // extracts YAML content into vfile.data.frontmatter
      () => (tree, file) => {
        visit(tree, "yaml", (node) => {
          try {
            const parsed = YAML.parse(node.value)
            file.data.frontmatter = { ...file.data.frontmatter, ...parsed }
          } catch {
            // YAML parse error, skip
          }
        })
      },
    ],
  }
}
