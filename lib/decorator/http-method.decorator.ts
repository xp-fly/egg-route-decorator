import {
  ROUTE_HANDLE_METADATA, ROUTE_METHOD_METADATA, ROUTE_CONTROLLER_METADATA, ROUTE_URL_METADATA,
} from '../constant';
import {HttpMethodEnum} from '../enum';

const createHttpMethodDecorator = (methodtype) => {
  return (path: string = '') => {
    return (target: any, propertyKey: string) => {
      const handlers = Reflect.getMetadata(ROUTE_HANDLE_METADATA, target) || [];
      handlers.push(propertyKey);
      Reflect.defineMetadata(ROUTE_HANDLE_METADATA, handlers, target);
      // 设置方法
      Reflect.defineMetadata(ROUTE_METHOD_METADATA, methodtype, target, propertyKey);
      // 设置路由
      Reflect.defineMetadata(ROUTE_URL_METADATA, path, target, propertyKey);
    };
  };
};

export const Get = createHttpMethodDecorator(HttpMethodEnum.GET);
export const Post = createHttpMethodDecorator(HttpMethodEnum.POST);
export const Put = createHttpMethodDecorator(HttpMethodEnum.PUT);
export const Delete = createHttpMethodDecorator(HttpMethodEnum.DELETE);

// 设置控制器
export const HttpController = (prefix: string = '') => {
  return (target: any) => {
    Reflect.defineMetadata(ROUTE_CONTROLLER_METADATA, prefix, target);
  };
};
