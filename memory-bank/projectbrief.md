# Project Brief: NexusTools Core Toolkit MCP Server

## 1. Project Goal

The primary goal of this project is to create a Model Context Protocol (MCP)
server named "NexusTools". This server aims to be an **"all-in-one" core
toolkit**, providing AI agents (like Cline) with a **foundational set of
essential, efficient, and secure tools** spanning common interaction domains
like **filesystem operations, basic web requests, structured data handling, and
utility functions**. The focus is on maximizing AI productivity, reducing
execution time, and minimizing token costs through smart design (e.g., batch
operations, partial reads, optimized interfaces), while maintaining robust
security, especially for filesystem and network access relative to a defined
project root directory.

## 2. Core Requirements

- **MCP Compliance:** The server must adhere to the Model Context Protocol
  specifications for communication.
- **Relative Pathing:** All filesystem operations must be strictly relative to
  the project root directory. Absolute paths should be disallowed, and path
  traversal attempts must be prevented.
- **Core Essential Tools:** Implement an efficient and expanding set of tools
  for common AI agent tasks, aiming for an "all-in-one" foundational toolkit.
  Initial focus remains on filesystem tools, with planned expansion:
  - `list_files`: List files/directories within a specified directory
    (potentially simplified options compared to a full `glob` wrapper).
  - `stat_items`: Get detailed status information for multiple specified paths.
  - `read_content`: Read content from multiple specified files, **supporting
    partial reads via optional `start_line` and `end_line` parameters**.
  - `write_content`: Write or append content to multiple specified files
    (creating directories if needed).
  - `delete_items`: Delete multiple specified files or directories.
  - `create_directories`: Create multiple specified directories (including
    intermediate ones).
  - `move_items`: Move or rename multiple specified files/directories.
  - `copy_items`: Copy multiple specified files/directories.
  - `search_files`: Search for regex patterns within files in a specified
    directory.
  - `replace_content`: Search and replace content within files across multiple
    specified paths.
    - **Future Categories (Planned):**
      - _Basic Web Requests:_ Secure, simple fetch capabilities (e.g., GET/POST
        text/JSON).
      - _Structured Data Handling:_ Tools for efficient reading/writing/updating
        of JSON/YAML.
      - _Utility Functions:_ Basic helpers like time/OS info, UUID generation,
        data transformations.
      - _Advanced Filesystem:_ Tools like `apply_diff`, `get_directory_tree`.
- **Technology Stack:** Use Node.js and TypeScript. Leverage the
  `@modelcontextprotocol/sdk` for MCP implementation. Use `fs` and `path`
  modules. `glob` may be used for searching/listing if necessary.
- **Efficiency:** Tools should be implemented efficiently, supporting batch
  operations where applicable and optimizing for reduced token usage (e.g.,
  partial reads).
- **Security:** Robust path resolution and validation are critical to prevent
  access outside the designated project root.

## 3. Scope

- **In Scope:** Implementation of the NexusTools MCP server logic, definition of
  tool schemas (starting with filesystem, expanding to other core areas like
  basic fetch, structured data, utilities), handling requests, performing
  operations via Node.js modules, robust security checks (especially path and
  network safety), and basic error handling.
- **Out of Scope:** Arbitrary command execution (`execute_command`), complex
  browser automation (JS rendering - rely on Playwright MCP), advanced file
  watching/streaming, complex permission management (beyond basic OS checks),
  integration with version control systems (beyond reading `.gitignore`), or
  tools requiring heavy external dependencies not central to the core toolkit
  vision.

## 4. Success Criteria

- The server compiles successfully using TypeScript.
- The server connects and responds to MCP requests (e.g., `list_tools`)
  identifying itself as "NexusTools".
- All implemented core tools function correctly according to their descriptions,
  respecting relative path constraints.
- The `read_content` tool correctly handles full and partial reads based on
  `start_line`/`end_line` parameters.
- Path traversal attempts are correctly blocked.
- The server handles basic errors gracefully (e.g., file not found).
- Removed tools (`chmod_items`, `chown_items`) are no longer available.
