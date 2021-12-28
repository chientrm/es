# escript - scripting language run on top of JavaScript

<p align="center">
    <img src="logo.png"
        height="130">
</p>

[![Contributors](https://img.shields.io/github/contributors/chientrm/es)](https://github.com/chientrm/es/graphs/contributors)
[![Contributors](https://img.shields.io/github/package-json/v/chientrm/es)](https://github.com/chientrm/es)
[![Contributors](https://img.shields.io/github/commit-activity/m/chientrm/es)](https://img.shields.io/github/commit-activity/m/chientrm/es)
[![Check](https://img.shields.io/github/checks-status/chientrm/es/main)](https://github.com/chientrm/es/pulls)
[![Build Status](https://img.shields.io/github/workflow/status/chientrm/es/Node.js%20CI)](https://github.com/chientrm/es/actions/workflows/node.js.yml)
[![Coverage](https://img.shields.io/nycrc/chientrm/es?config=.nycrc&preferredThreshold=lines)](https://github.com/chientrm/es)
[![Languages](https://img.shields.io/github/languages/top/chientrm/es)](https://github.com/trending/javascript)
[![Dependencies](https://img.shields.io/depfu/chientrm/es)](https://depfu.com/repos/github/chientrm/es)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/579fa15f5c4d431fb77c089edd849e4e)](https://www.codacy.com/gh/chientrm/es/dashboard?utm_source=github.com&utm_medium=referral&utm_content=chientrm/es&utm_campaign=Badge_Grade)
[![Discord](https://img.shields.io/discord/925391810472329276?logo=discord)](https://discord.gg/465qH6x6)

## Why escript?

### Zero learning curve

- No predefined keywords
- No features assumptions
- Only binary operators are allowed
- Everything except expressions and function invokes are ignored

### JavaScript compatible

- Run directly on top of JavaScript
- No Virtual Machine
- No Transpilation
- Native escript-JavaScript communication

## Installing

```
npm install @chientrm/es
```

## Usage

`index.js`

```
import { readFileSync } from "fs";
import { e_eval } from "es";

const text = readFileSync("main.es");
e_eval([{log: console.log}], "main.es", text);
```

`main.es`

```
log('Hello World!')
```

`Output`

```
Hello World!
```

## Contritute

There are many ways to contribute to escript.

- Submit issues and help us verify fixes.
- Contribute bug fixes.
- Review the source code changes.
- Answer question about escript on StackOverflow.
- Check out our Community Discord.
- Share escript to your friends via Facebook, Twitter, ...

## Documentation

Coming soon...

## Building

```
npm run build
```

## Roadmap

Coming soon...
