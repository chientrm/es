# escript - :pray: a scripting language run on top of JavaScript :pray:

<p align="center">
    <img src="https://raw.githubusercontent.com/chientrm/es/main/logo.png"
        height="130">
</p>

[![Check](https://img.shields.io/github/checks-status/chientrm/es/main)](https://github.com/chientrm/es/pulls)
[![Build Status](https://img.shields.io/github/workflow/status/chientrm/es/Node.js%20CI)](https://github.com/chientrm/es/actions/workflows/node.js.yml)
[![Commit](https://img.shields.io/github/commit-activity/m/chientrm/es)](https://img.shields.io/github/commit-activity/m/chientrm/es)
[![Coverage](https://img.shields.io/nycrc/chientrm/es?config=.nycrc&preferredThreshold=lines)](https://github.com/chientrm/es)
[![Languages](https://img.shields.io/github/languages/top/chientrm/es)](https://github.com/trending/javascript)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/579fa15f5c4d431fb77c089edd849e4e)](https://www.codacy.com/gh/chientrm/es/dashboard?utm_source=github.com&utm_medium=referral&utm_content=chientrm/es&utm_campaign=Badge_Grade)
[![Discord](https://img.shields.io/discord/925391810472329276?logo=discord)](https://discord.gg/465qH6x6)
[![Dependencies](https://img.shields.io/depfu/chientrm/es)](https://depfu.com/repos/github/chientrm/es)
[![Dev Dependencies](https://img.shields.io/github/package-json/dependency-version/chientrm/es/dev/rollup/main)](https://github.com/chientrm/es/blob/main/package.json)
[![Repo size](https://img.shields.io/github/repo-size/chientrm/es)](https://github.com/chientrm/es)
[![Download](https://img.shields.io/npm/dt/@chientrm/es)](https://www.npmjs.com/package/@chientrm/es)
[![Sponsors](https://img.shields.io/github/sponsors/chientrm)](https://github.com/chientrm)
[![Issues](https://img.shields.io/github/issues/chientrm/es)](https://github.com/chientrm/es/issues)
[![License](https://img.shields.io/npm/l/@chientrm/es)](https://github.com/chientrm/es/blob/main/LICENSE)
[![Version](https://img.shields.io/github/package-json/v/chientrm/es)](https://github.com/chientrm/es)
[![Contributors](https://img.shields.io/github/contributors/chientrm/es)](https://github.com/chientrm/es/graphs/contributors)

## Why escript:question:

### :point_right: Zero learning curve :innocent:

- No predefined keywords
- No features assumptions
- Only binary operators are allowed
- Everything except expressions and function invokes are ignored

### :point_right: JavaScript compatible :family:

- Run directly on top of JavaScript
- No Virtual Machine
- No Transpilation
- Native escript-JavaScript communication

## Installing

```
npm install @chientrm/es
```

## Usage

:page_facing_up: index.js

```
import { readFileSync } from "fs";
import { e_eval } from "es";

const text = readFileSync("main.es", { encoding: "utf8", flag: "r" });
e_eval([{log: console.log}], "main.es", text);
```

:page_facing_up: main.es

```
log('Hello World!')
```

:tv: Output

```
Hello World!
```

## Contritute :muscle:

There are many ways to contribute to escript.

- Submit issues and help us verify fixes.
- Contribute bug fixes.
- Review the source code changes.
- Answer question about escript on StackOverflow.
- Check out our Discord [![Discord](https://img.shields.io/discord/925391810472329276?logo=discord)](https://discord.gg/465qH6x6)
- Share escript to your friends :grin:
  <a target="_blank" href="https://twitter.com/intent/tweet?text=escript%20-%20scripting%20language%20run%20on%20top%20of%20JavaScript&url=https://github.com/chientrm/es&via=TWITTER-HANDLE">Tweet</a>, <a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https://github.com/chientrm/es">Share on Facebook</a>, <a target="_blank" href="http://www.reddit.com/submit?url=https://github.com/chientrm/es&title=escript%20-%20scripting%20language%20run%20on%20top%20of%20JavaScript">Share on Reddit</a>

## Examples :green_book:

[Examples](https://github.com/chientrm/es/tree/main/examples)

## Documentation :green_book:

Coming soon... :construction_worker:

## Building :hammer:

```
npm run build
```

## Roadmap :partly_sunny:

Coming soon... :construction_worker:
