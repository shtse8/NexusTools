# NexusTools Future Features Plan (Post v0.1.0)

This document outlines the planned features for NexusTools beyond the initial
v0.1.0 refactoring, based on the "all-in-one" core toolkit vision. Features are
grouped into phases, but priorities might be adjusted based on feedback and
development progress.

## Phase 1: Consolidate Core & Finalize Refactor (v0.1.0 Completion)

**Goal:** Ensure the foundational filesystem tools are stable and the project
vision is documented.

1. **Complete Testing:** Thoroughly test all existing v0.1.0 tools, especially
   `read_content` partial reads and edge cases for all filesystem operations.
2. **Evaluate `list_files`:** Review the current `glob`-based implementation for
   potential simplification or necessary fixes.
3. **Update CI/CD:** Modify `.github/workflows/publish.yml` for correct
   package/Docker naming (`@shtse8/nexus-tools`, `shtse8/nexus-tools`).
4. **Commit & Push:** Finalize and commit all v0.1.0 refactoring changes.
5. **Memory Bank Vision Update:** Ensure `projectbrief.md` and
   `productContext.md` accurately reflect the expanded "all-in-one" core toolkit
   vision. (Completed)

## Phase 2: High-Impact Core Tools (v0.2.0+)

**Goal:** Introduce tools with the most significant impact on AI agent
productivity and efficiency.

6. **`apply_diff` (Multi-Hunk):**
   - **Description:** Apply standard multi-hunk diff patches to files.
   - **Value:** High efficiency for code modification, token saving.
7. **`get_directory_tree`:**
   - **Description:** Get a JSON representation of directory structure
     (controllable depth, include metadata).
   - **Value:** Faster project structure analysis for agents.
8. **Structured Data Tools (`read/write/update_json`, `read/write_yaml`):**
   - **Description:** Dedicated tools for parsing, serializing, and potentially
     updating JSON/YAML files (e.g., using JSONPath for updates).
   - **Value:** Extremely efficient for configuration file handling. High
     complexity.
9. **`fetch` (Basic & Secure Web Request):**
   - **Description:** Basic GET/POST requests for text/JSON content.
   - **Value:** Covers common web data retrieval needs, reduces external
     dependencies/calls.
   - **Security:** MUST include timeout, size limits, restricted IP checks
     (prevent SSRF). No JS rendering.

## Phase 3: Utilities & Enhancements (v0.3.0+)

**Goal:** Add useful utilities and further enhance existing tools.

10. **`search_files` (Context Control):**
    - **Description:** Add `context_before`/`after` parameters.
    - **Value:** Reduce need for follow-up `read_content` calls.
11. **`create_temp_file` / `create_temp_dir`:**
    - **Description:** Securely create temporary files/directories within the
      project root.
    - **Value:** Smoother agent workflows for intermediate data.
12. **`read_gitignore`:**
    - **Description:** Parse `.gitignore` and return a clean list of rules.
    - **Value:** Provides useful context to agents, simplifies rule parsing.
13. **`calculate_checksum`:**
    - **Description:** Calculate file checksum (e.g., SHA-256).
    - **Value:** Verify file integrity/changes efficiently.
14. **`get_current_time`:**
    - **Description:** Get the current server time (ISO format).
    - **Value:** Basic, useful utility for logging/scheduling.
15. **`get_os_info`:**
    - **Description:** Get basic OS info (platform, arch, type).
    - **Value:** Provides environmental context to agents.
16. **`get_environment_variable` (Read-only):**
    - **Description:** Read specified environment variables accessible to the
      server process.
    - **Value:** Allows agents to access configuration/secrets securely (if
      passed via env).
17. **`generate_uuid`:**
    - **Description:** Generate a standard UUID.
    - **Value:** Simple utility for creating unique identifiers.
18. **Basic Data Transformations (`base64_encode`/`decode`,
    `json_parse`/`stringify`):**
    - **Description:** Common data encoding/decoding/parsing utilities.
    - **Value:** Reduces agent-side boilerplate for basic data manipulation.

## Considered but Excluded (For Now)

- **`execute_command`:** High security risk, out of scope for a "core toolkit".
- **JS Rendering / Full Browser Automation:** High complexity,
  resource-intensive, security risks, overlaps with dedicated Playwright MCP.
  Rely on Playwright MCP instead.
- **`set_environment_variable`:** Potential side effects and scope issues.
- **`archive/extract`:** Adds significant dependencies, lower priority than
  other core tools.
- **`read_content` (PDF etc.):** Adds dependencies, lower priority.
- **`list_files` (Advanced Filtering/Sorting):** Lower priority enhancement.
