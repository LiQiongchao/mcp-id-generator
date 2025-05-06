# ID Generator MCP

This is a Model Context Protocol (MCP) server that provides ID generation capabilities to AI assistants.

## Installation

The ID Generator MCP can be integrated with various AI assistant platforms. Below are instructions for different environments:

### Claude Code

To add the ID Generator MCP to Claude Code, run the following command:

```bash
claude mcp add id-generator npx @devstacks/id-generator-mcp
```

### Cursor, Winsurf, or Claude Desktop

To add the ID Generator MCP to Cursor, Winsurf, or Claude Desktop, add the following configuration to your MCP configuration file:

```json
{
  "mcpServers": {
    "id-generator": {
      "command": "npx",
      "args": ["@devstacks/id-generator-mcp"]
    }
  }
}
```

## Usage

Once installed, the ID Generator MCP can be used by the AI assistant to generate various types of IDs.

### Supported ID Algorithms

| Algorithm | Example | Description |
|-----------|---------|-------------|
| `uuid` | `123e4567-e89b-12d3-a456-426614174000` | UUID v4 - Universally Unique Identifier that uses random numbers to generate a 128-bit value with extremely low collision probability. Standardized format widely used across many systems. |
| `cuid2` | `clh3ppfqz0000jz0ggdlg7etk` | Collision-resistant IDs optimized for horizontal scaling and performance. Shorter than UUIDs while maintaining uniqueness. Designed to be secure, URL-safe, and sequential for database performance. |

## Features

- Generate UUIDs (v4)
- Create CUID2 IDs for collision-resistant identification
- Consistent ID generation across sessions
- Simple API integration

## License

MIT