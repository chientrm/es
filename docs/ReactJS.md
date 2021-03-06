# :bullettrain_side: escript and ReactJS

`escript` is compatible with any node modules included ReactJS.

## Init project

```sh
npm init
```

## Install dependencies

```
npm i @chientrm/es react react-dom
npm i html-webpack-plugin webpack-cli webpack-dev-server --save-dev
```

## Source code

### index.js

```js
import React from "react";
import ReactDOM from "react-dom";
import { eEval } from "@chientrm/es";
import app from "./App.e";

const App = eEval(
  [{ createElement: React.createElement, useState: React.useState }],
  "App.e",
  app
);

const root = document.createElement("div");
document.body.appendChild(root);
ReactDOM.render(React.createElement(App), root);
```

### App.e

```lua
Label = props =>
    createElement("span", null, "You clicked " + props.value + " times!")

App = _ => (
    countState = useState(0)
    count = countState[0]
    setCount = countState[1]

    buttonClick = _ => setCount(count + 1)

    result = createElement("div", null,
        createElement(Label, {value = count}, null)
        createElement("button", {onClick = buttonClick}, "Click!")
    )
)
```

### webpack.config.js

```js
const path = require("path");
const HtmlPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "index_bundle.js",
  },
  mode: "development",
  devtool: "eval",
  module: {
    rules: [
      {
        test: /\.e/,
        exclude: /node_modules/,
        type: "asset/source",
      },
    ],
  },
  plugins: [new HtmlPlugin()],
};
```

## Execution

```sh
npx webpack serve
```

## Output

![Output](reactjs.png)

## Discussion

- `escript` is fully compatible with React Hook but not React class component because `escript` does not support the class declaration.
- The syntax is quite inconvenient for now compared to JSX.

## Conclusion

To practically implement ReactJS with `escript`, there must be a `jsx` equivalent in the future.
