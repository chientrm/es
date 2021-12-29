# :bullettrain_side: Get Started

`escript` is available via both `npmjs` repository and CDN. It is compatible with both NodeJS and the browser environment.

## Init project

```sh
npm init
```

Config package.json

```json
{
  ...
  "type": "module",
  ...
  "scripts": {
    "start": "node index.js"
  },
}
```

## Install dependencies

```
npm i @chientrm/es fs prompt
```

## Source code

### index.js

```js
import { e_eval } from "@chientrm/es";
import { readFileSync } from "fs";
import prompt from "prompt";

const text = readFileSync("main.es", { encoding: "utf8", flag: "r" });
e_eval([{ prompt, console }], "main.es", text);
```

### main.es

```lua
Create shorthand log = console.log

Init prompt via prompt.start()

Define sum = [a b] => (a + b)

prompt.get(['firstNumber' 'secondNumber'] [err result] => (
    err && log(err)
    err || log(
            "Sum of" result.firstNumber
            "and" result.secondNumber
            "is" sum(result.firstNumber * 1 result.secondNumber * 1)
        )
    )
)
```

## Execution

```sh
npm start
```

## Output

```sh
prompt: firstNumber:  1
prompt: secondNumber:  2.34
Sum of 1 and 2.34 is 12.34
```

## Discussion

- `escript` is fully compatible with JavaScript modules.
- `escript` is smart enough to skip non-expression inside the script. Ex: `Shorthand log`, `Init prompt via`, `Define function`
- All characters included in `\r\n\t\f ;,:?\\#@$` are considered `space` and got skipped by `escript` so that you can either insert them or not.

## Conclusion

Developers are free to define their coding syntax and linting with `escript`.
