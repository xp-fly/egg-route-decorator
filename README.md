# egg-route-decorator

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-route-decrator.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-route-decrator
[travis-image]: https://img.shields.io/travis/eggjs/egg-route-decrator.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-route-decrator
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/egg-route-decrator.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/egg-route-decrator?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-route-decrator.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-route-decrator
[snyk-image]: https://snyk.io/test/npm/egg-route-decrator/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-route-decrator
[download-image]: https://img.shields.io/npm/dm/egg-route-decrator.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-route-decrator

<!--
Description here.
-->

## Install

```bash
$ npm i egg-route-decorator --save
```

## Usage & Configuration
- Enable plugin in `config/plugin.js`
```js
exports.routeDecorator = {
  enable: true,
  package: 'egg-route-decorator',
};
```
- Edit your own configurations in `conif/config.{env}.js`
```js
exports.routeDecorator = {
};
```

- see [config/config.default.js](config/config.default.js) for more detail.

## Example

<!-- example here -->
### HttpController
@HttpController(path?: string) 用于装饰控制器，表示当前路由控制器的公共前缀
### Get
@Get(path?: string) 装饰get请求
### Post
@Post(path?: string) 装饰post请求
### Put
@Put(path?: string) 装饰put请求
### Delete
@Delete(path: string) 装饰Delete请求
### 参数校验
### Full Example

## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg/issues).

## License

[MIT](LICENSE)
