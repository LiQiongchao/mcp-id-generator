# ID Generator MCP

This is a Model Context Protocol (MCP) server that provides ID generation capabilities to AI assistants, including support for Snowflake algorithm compatible with MyBatis-Plus.

## Installation

The ID Generator MCP can be integrated with various AI assistant platforms. Below are instructions for different environments:

### Installing via npm

To install the ID Generator MCP via npm:

```bash
npm install -g @clancy_lee/mcp-id-generator
```

### Local Installation

For local development or testing:

```bash
git clone https://github.com/liqiongchao/mcp-id-generator.git
cd mcp-id-generator
npm install
npm run build
```

### Installing via Smithery

To install ID Generator MCP for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@devstacks-software-engineering/id-generator-mcp):

```bash
npx -y @smithery/cli install @devstacks-software-engineering/id-generator-mcp --client claude
```

### Claude Code

To add the ID Generator MCP to Claude Code, run the following command:

```bash
claude mcp add id-generator npx @clancy_lee/mcp-id-generator
```

### MCP Client Configuration

To add the ID Generator MCP to your MCP client, add the following configuration:

#### Global Installation
```json
{
  "mcpServers": {
    "id-generator": {
      "command": "id-generator",
      "args": []
    }
  }
}
```

#### NPX Installation  
```json
{
  "mcpServers": {
    "id-generator": {
      "command": "npx",
      "args": ["@clancy_lee/mcp-id-generator"]
    }
  }
}
```

#### Local Development
```json
{
  "mcpServers": {
    "id-generator": {
      "command": "node",
      "args": ["/path/to/mcp-id-generator/build/index.js"]
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
| `nanoid` | `V1StGXR8_Z5jdHi6B-myT` | Small, secure, URL-friendly unique string ID generator. Creates compact, non-sequential, URL-safe identifiers that are highly collision-resistant. Default length is 21 characters. |
| `ulid` | `01ARZ3NDEKTSV4RRFFQ69G5FAV` | Universally Unique Lexicographically Sortable Identifier. Combines time-ordered uniqueness with random uniqueness. 26 characters, crockford base32 encoded (no special characters), URL-safe, and lexicographically sortable. |
| `snowflake` | `1970773878481358848` | Snowflake algorithm ID - 64-bit integer providing global uniqueness with time-ordering. Designed for distributed systems, offers high performance and guaranteed uniqueness. Compatible with MyBatis-Plus using epoch starting from 2010-11-04. |

## Features

- Generate UUIDs (v4)
- Create CUID2 IDs for collision-resistant identification
- Generate Nanoid for compact, URL-friendly identifiers
- Create ULIDs for time-ordered, sortable identifiers
- Generate Snowflake IDs for distributed systems (MyBatis-Plus compatible)
- Consistent ID generation across sessions
- Simple API integration
- Support for generating multiple IDs at once

## License

MIT
