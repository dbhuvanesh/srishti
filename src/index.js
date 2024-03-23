#!/usr/bin/env node

import fs from "node:fs";
import chalk from "chalk";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
const rl = readline.createInterface({ input, output });

const project = await rl.question(
  chalk.bold.whiteBright("Your project name : ")
);
const author = await rl.question(chalk.bold.whiteBright("Your name : "));

(() => {
  fs.mkdir(project, (err) => {
    if (err) {
      console.log(err);
    }
    process.chdir(project);
    fs.mkdirSync("public", { recursive: true });
    fs.writeFileSync(
      "public/index.html",
      `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${project}</title></head><body><div class="root"></div></body></html>`
    );
    fs.mkdirSync("src", { recursive: true });
    fs.writeFileSync(
      "src/index.js",
      `import React from "react";
      import "medhya/css/medhya.css";
      import { createRoot } from "react-dom/client";
      const container = document.querySelector(".root");
      const root = createRoot(container);
      root.render(
        <>
          <h1 className="title">${project}</h1>
        </>
      );
      `
    );
    fs.writeFileSync(".gitignore", "/node_modules");
    fs.writeFileSync(
      ".babelrc",
      `{"presets": ["@babel/preset-env","@babel/preset-react"]}`
    );
    fs.writeFileSync(
      "package.json",
      `
        {
          "name": "${project}",
          "version": "1.0.0",
          "main": "./src/index.js",
          "scripts": {
            "build": "webpack",
            "start": "webpack-dev-server"
          },
          "keywords": [
            "react",
            "application"
          ],
          "author": "${author}",
          "license": "ISC",
          "description": "",
          "dependencies": {
            "react": "^18.2.0",
            "medhya":"^1.0.130",
            "react-dom": "^18.2.0",
            "react-router-dom": "^6.19.0"
          },
          "devDependencies": {
            "@babel/preset-env": "^7.23.3",
            "@babel/preset-react": "^7.23.3",
            "babel-loader": "^9.1.3",
            "css-loader": "^6.8.1",
            "html-webpack-plugin": "^5.5.3",
            "style-loader": "^3.3.3",
            "webpack": "^5.89.0",
            "webpack-cli": "^5.1.4",
            "webpack-dev-server": "^4.15.1"
          }
        }
        
        `
    );
    fs.writeFileSync(
      "webpack.config.js",
      `
      const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  entry: "./src/index.js",
  mode: "development",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  devServer: {
    open: true,
    port: 5000,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /.(js|jsx)$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /.css$/,
        use: ["style-loader", "css-loader"],
        exclude: /.module.css$/,
      },
      {
        test: /.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: true,
            },
          },
        ],
        include: /.module.css$/,
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin({ template: "./public/index.html" })],
};
      `
    );
  });
})();

rl.close();
