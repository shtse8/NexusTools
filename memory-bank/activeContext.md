# Active Context: NexusTools Refactor (v0.1.0 - In Progress)

## 1. Current Work Focus

Refactoring the previous `filesystem-mcp` project into the new "NexusTools" core
toolkit MCP server. This involves renaming, adjusting the toolset, updating
code, documentation, and configuration according to the plan in
`memory-bank/refactor-plan-nexus-tools.md`.

## 2. Recent Changes/Decisions

- **Project Renaming:** Project officially renamed to "NexusTools".
- **Toolset Defined:** Core toolset finalized
  (list/stat/read(partial)/write/replace/create/delete/move/copy), removing
  `chmod`/`chown`.
- **Plan Documented:** Refactor plan saved to
  `memory-bank/refactor-plan-nexus-tools.md`.
- **Configuration Updates:**
  - `package.json`: Updated `name` (@shtse8/nexus-tools), `description`,
    `version` (0.1.0), `bin` (nexus-tools).
  - Git: Removed old `origin` remote pointing to local path.
- **Code Refactoring:**
  - Deleted handler files: `src/handlers/chmodItems.ts`,
    `src/handlers/chownItems.ts`.
  - Updated `src/handlers/index.ts`: Removed references to deleted handlers.
  - Updated `src/handlers/readContent.ts`: Added support for partial reads via
    `start_line`/`end_line`.
  - Updated `src/index.ts`: Changed server name, version, description, and log
    messages to "NexusTools".
- **Dependency Management:** Ran `npm install` to ensure dependencies are
  correctly installed.
- **Documentation Updates:**
  - Rewrote `README.md` for NexusTools.
  - Updated `memory-bank/projectbrief.md`.
  - Updated `memory-bank/productContext.md`.

## 3. Next Steps / Considerations

- **Update Remaining Memory Bank:**
  - Update `memory-bank/systemPatterns.md`.
  - Update `memory-bank/techContext.md`.
  - Reset/Update `memory-bank/progress.md`.
- **Update CI/CD:** Modify `.github/workflows/publish.yml` for the new
  package/Docker names.
- **Commit Changes:** Stage and commit all refactoring changes locally.
- **New Repository (Optional):** Create a new remote repository (e.g., on
  GitHub) for NexusTools.
- **Push to New Remote (Optional):** Add the new remote and push the changes.
- **Testing:** Thoroughly test all NexusTools functionalities, especially the
  modified `read_content` tool.

## 4. Active Decisions

- Project name is "NexusTools".
- Core toolset is defined as per the plan.
- Refactoring is proceeding based on `memory-bank/refactor-plan-nexus-tools.md`.
- Version reset to `0.1.0`.
