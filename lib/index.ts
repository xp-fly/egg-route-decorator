import {RouteParamtypesEnum} from './enum';
import {Application, Context} from 'egg';
import * as fs from 'fs';
import * as path from 'path';
import {plainToClass} from 'class-transformer';
import {validate} from 'class-validator';
import {HttpException} from './exception';
import {exploreController, RouteHandlerInterface} from './explor-controller';
import {RouteParamMetadataInterface} from './decorator';
import {HttpStatus} from './enum';

export interface RouteMetadataInterface {
  filePath: string; // 文件路径
  url: string; // 路由地址
  handler: RouteHandlerInterface; // 路由handler
  ctrlPrefix: string; // 控制器前缀
}

export class RouteDecorator {
  app: Application;
  // 全局路由前缀
  _prefix: string = '';

  // 路由Map
  _routes: Map<string, RouteMetadataInterface> = new Map();

  setPrefix(prefix: string) {
    this._prefix = prefix;
  }

  remove(src: string, st: string) {
    const index = src.indexOf(st);
    if (index >= 0) {
      return src.substring(0, index);
    }
    return src;
  }

  scanDir(dir: string = '') {
    const appDir = this.remove(__dirname, 'app');

    if (!path.isAbsolute(dir)) {
      dir = path.join(appDir, 'app/controller', dir);
    }

    if (!fs.existsSync(dir)) {
      console.error(`Can not find directory: ${dir}`);
    }

    const files = fs.readdirSync(dir);
    let result: string[] = [];
    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        result = [...result, ...this.scanDir(filePath)];
      } else if (stat.isFile()) { // 是否为文件
        if (this.app.config.env !== 'local' && /.js/.test(filePath)) {
          result.push(filePath);
        } else if (this.app.config.env === 'local') {
          result.push(filePath);
        }
      }
    });
    return result;
  }

  /**
   * 加载路由
   * @param {"egg".Application} app egg应用实例
   * @param {string} dirPath 路由文件目录
   * @param {string} prefix 路由前缀
   * @param {string} middleware 中间件
   */
  scanController(app: Application, dirPath = '', prefix = '', middleware = []) {
    this.app = app;
    const files = this.scanDir(dirPath);
    const routePrefix = prefix ? `/${prefix}` : this._prefix || '';
    files.map((file) => {
      const controller = require(file).default;
      const exploreCtrl = exploreController(controller);
      const {handlers, ctrlPrefix} = exploreCtrl;
      // 将:param的参数的路由放在最后面
      const sortHandlers = handlers
        .sort((prev, next) => {
          const reg = new RegExp('[\\s\\S]*:[\\s\\S]*', 'g');
          return (+reg.test(prev.urlPath)) - (+reg.test(next.urlPath));
        });
      sortHandlers.forEach((handler) => {
        const {
          methodName,
          httpMethod,
          urlPath,
          handlerArgs,
        } = handler;
        const urls = [routePrefix || '', ctrlPrefix, urlPath];
        const url = urls.filter((item, index) => item || index === 0).join('/');
        this.logRouter(app, httpMethod, url, file, methodName, handler, ctrlPrefix);
        app.router[httpMethod](url, ...middleware, async (ctx: Context) => {
          const instance = new controller(ctx);
          const params: any[] = await this.getRouteParams(ctx, handlerArgs);
          const result = await instance[methodName](...params);
          if (ctx.body === undefined && result !== undefined) {
            ctx.body = result;
          }
        });
      });
    });
  }

  /**
   * 打印路由日志
   * @param {"egg".Application} app
   * @param httpMethod 请求方法
   * @param url 路由地址
   * @param file 控制器文件路径
   * @param methodName 方法名
   * @param handler 解析controller获取的数据
   * @param ctrlPrefix 控制器前缀
   */
  logRouter(app: Application, httpMethod, url, file, methodName, handler, ctrlPrefix) {
    const routeKey = `[${httpMethod}]:${url}`;
    if (this._routes.has(routeKey)) {
      // 路由重复
      console.error(`[route]${routeKey} already exists.`);
    }
    this._routes.set(routeKey, {
      filePath: file,
      url,
      handler,
      ctrlPrefix,
    });
    // 打印路由日志
    app.logger.info(`[route]${routeKey} >>> ${file}#${methodName}`);
  }

  /**
   * 获取路由的处理handler
   * @param {"egg".Context} ctx
   * @param {RouteParamMetadataInterface} handlerArgs
   */
  async getRouteParams(ctx: Context, handlerArgs: RouteParamMetadataInterface) {
    const params: any[] = [];
    // 是否需要校验
    for (const key of Object.keys(handlerArgs)) {
      const {
        paramIndex,
        paramtype,
        propName,
        pipes,
        type,
      } = handlerArgs[key];
      let param: any;
      switch (paramtype) {
        case RouteParamtypesEnum.REQUEST:
          param = ctx.request;
          break;
        case RouteParamtypesEnum.RESPONSE:
          param = ctx.response;
          break;
        case RouteParamtypesEnum.BODY:
          param = propName ? ctx.request.body[propName] : ctx.request.body;
          break;
        case RouteParamtypesEnum.QUERY:
          param = propName ? ctx.request.query[propName] : ctx.request.query;
          break;
        case RouteParamtypesEnum.PARAM:
          param = propName ? ctx.params[propName] : ctx.params;
          break;
        case RouteParamtypesEnum.HEADERS:
          param = propName ? ctx.request.headers[propName] : ctx.request.headers;
          break;
        case RouteParamtypesEnum.FILE_STREAM:
          const fileStream = await ctx.getFileStream();
          param = fileStream;
          break;
        default:
          break;
      }
      let clsObj = param;
      // 只对param、query、body的数据进行校验
      if (
        paramtype === RouteParamtypesEnum.PARAM
        || paramtype === RouteParamtypesEnum.QUERY
        || paramtype === RouteParamtypesEnum.BODY
      ) {
        // 转换器
        for (const pipe of pipes) {
          param = await pipe.transform(param);
        }
        clsObj = plainToClass(type, param);
        // 校验
        const errors = await validate(clsObj);
        if (errors && errors.length) {
          throw new HttpException('Validate Failed', HttpStatus.BAD_REQUEST, errors);
        }
      }
      params[paramIndex] = clsObj;
    }
    return params;
  }
}
