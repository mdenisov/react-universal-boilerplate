# React Universal Boilerplate 😎

[![Build Status](https://travis-ci.org/mdenisov/react-universal-boilerplate.svg?branch=master)](https://travis-ci.org/mdenisov/react-universal-boilerplate)
[![dependencies Status](https://david-dm.org/mdenisov/react-universal-boilerplate/status.svg)](https://david-dm.org/mdenisov/react-universal-boilerplate)

A simple but feature rich starter boilerplate for creating your own [universal](https://medium.com/@mjackson/universal-javascript-4761051b7ae9) app. It built on the top of [Node.js](https://nodejs.org/en/), [Koa](http://koajs.com/), [React](https://facebook.github.io/react/), [Redux](https://github.com/reactjs/redux) and [React Router v4](https://reacttraining.com/react-router/). Includes all the hot stuff and modern web development tools such as [Webpack 3](https://webpack.js.org/), [Babel](https://babeljs.io/), [PostCSS](https://github.com/postcss/postcss-loader), [Jest](https://facebook.github.io/jest/) and [Redux Devtools Extension](https://github.com/zalmoxisus/redux-devtools-extension). See the [**“Features”**](#features) section for other awesome features you can expect.

I will maintain the starter boilerplate and keep all of the technologies on trend. Welcome to join me if you want. Hope you guys love it 🤩

## Features

Really cool starter boilerplate with the most popular technologies:


* [Universal](https://medium.com/@mjackson/universal-javascript-4761051b7ae9) rendering with async data fetching.
* [React](https://facebook.github.io/react/) as the view.
* [React Router v4](https://reacttraining.com/react-router/) as the router.
* [Redux](https://github.com/reactjs/redux)'s futuristic [Flux](https://facebook.github.io/react/blog/2014/05/06/flux.html) implementation.
* [Koa](http://koajs.com/) server.
* [Webpack 3](https://webpack.js.org/) for bundling and [**"Tree-Shaking"**](https://webpack.js.org/guides/tree-shaking/) support.
* [Babel](https://babeljs.io/) for ES6 and ES7 transpiling.
* [nodemon](https://nodemon.io/) to monitor for any changes in your node.js application and automatically restart the server.
* [redux-thunk](https://github.com/gaearon/redux-thunk) as the middleware to deal with asynchronous action.
* [react-router-redux](https://github.com/reactjs/react-router-redux) to keep your router in sync with Redux state.
* [react-helmet](https://github.com/nfl/react-helmet) to manage title, meta, styles and scripts tags on both server and client.
* [Webpack Dev Middleware](https://github.com/webpack/webpack-dev-middleware) serves the files emitted from webpack over the Express server.
* [Webpack Hot Middleware](https://github.com/glenjamin/webpack-hot-middleware) allows you to add hot reloading into the Express server.
* [css-modules-require-hook](https://github.com/css-modules/css-modules-require-hook) compiles CSS Modules in runtime for SSR.
* [assets-webpack-plugin](https://github.com/kossnocorp/assets-webpack-plugin#why-is-this-useful) generates assets with hash so you can use them for SSR.
* [Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer) creates a visualize size of webpack output files with an interactive zoomable treemap.
* [Redux Devtools Extension](https://github.com/zalmoxisus/redux-devtools-extension) for next generation developer experience.
* [ESLint](http://eslint.org/) to maintain a consistent javascript code style (Airbnb + Prettier).
* [StyleLint](http://stylelint.io/) to maintain a consistent css/scss code style.
* CSS support with [PostCSS](https://github.com/postcss/postcss-loader) for advanced transformations (e.g. autoprefixer, cssnext etc.). [CSS modules](https://github.com/css-Modules/css-Modules) enabled.
* Image (with [image-webpack-loader](https://github.com/tcoopman/image-webpack-loader) for optimizing) and Font support.
* Split vendor's libraries from client bundle.
* No other view engines, just javascript based HTML rendering component.
* Shared app config between development and production.
* 404 error page and redirect handling.
* Integrate [Jest](https://facebook.github.io/jest/) with [enzyme](https://github.com/airbnb/enzyme) as the solution for writing unit tests with code coverage support.
* [Yarn](https://yarnpkg.com/lang/en/) as the package manager.

## Getting Started

**1. You can start by cloning the repository on your local machine by running:**

```bash
git clone https://github.com/mdenisov/react-universal-boilerplate.git
cd react-universal-boilerplate
```

**2. Install all of the dependencies:**

```bash
yarn
```

**3. Build it:**

```bash
yarn build:dev    # Building bundle
```


**3. Start to run it:**

```bash
yarn start:dev    # Running dev server
```

Now the app should be running at [http://localhost:8000/](http://localhost:8000/)

> Note: You can change the port that you want from `./package.json`.

## NPM Script Commands

I use [better-npm-run](https://github.com/benoror/better-npm-run) to manage the scripts in a better way, which also provides the compatibility of cross-platform. All of the scripts are listed as following:

| `yarn <script>`    | Description                                                                                |
| ------------------ | ------------------------------------------------------------------------------------------ |
| `start:dev`        | Run your app on the development server at `localhost:8000`. HMR will be enabled.           |
| `start:prod`       | Run your app on the production server only at `localhost:8000`.                            |
| `build:dev`        | Remove the previous bundled files and bundle it to `./public/assets`.                      |
| `build:prod`       | Remove the previous bundled files and bundle it to `./public/assets`.                      |
| `lint:js`          | Lint all `.js` files (Use `--fix` to auto fix eslint errors).                              |
| `lint:css`         | Lint all `.css` files (Use `--fix` to auto fix stylelint errors).                          |
| `test`             | Run testing once (with code coverage reports).                                             |
