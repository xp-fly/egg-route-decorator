import 'reflect-metadata';

import {ROUTE_ARGS_METADATA} from '../constant';
import {RouteParamtypesEnum} from '../enum';
import {PipeTransform} from '../feature';

export interface RouteParamMetadataInterface {
  [key: string]: {
    paramtype: number, // 参数类型 参见 RouteParamtypesEnum
    paramIndex: number, // 参数位置 在arguments中的位置
    propName: string, // 使用装饰器传入的属性值
    pipes: PipeTransform[], // 转换器
    type?: any, // 参数类型 例如 string、number。。。
  };
}

const assignMetadata = (args, paramtype, index, data, ...pipes: PipeTransform[]) => {
  return Object.assign({}, args, {
    [`${paramtype}:${index}`]: {
      paramtype,
      paramIndex: index,
      propName: data,
      pipes,
    },
  });
};

const createRouteParamDecorator = (paramtype) => {
  return (data?: any, ...pipes: PipeTransform[]) => (target, key, index) => {
    const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, target, key) || {};
    Reflect.defineMetadata(
      ROUTE_ARGS_METADATA,
      assignMetadata(args, paramtype, index, data, ...pipes),
      target,
      key,
    );
  };
};

export const Request = createRouteParamDecorator(RouteParamtypesEnum.REQUEST);
export const Response = createRouteParamDecorator(RouteParamtypesEnum.RESPONSE);
export const UploadFileStream = createRouteParamDecorator(RouteParamtypesEnum.FILE_STREAM);
export const Headers = createRouteParamDecorator(RouteParamtypesEnum.HEADERS);

export const Query = (property?: string, ...pipes: PipeTransform[]) => {
  return createRouteParamDecorator(RouteParamtypesEnum.QUERY)(property, ...pipes);
};

export const Body = (property?: string, ...pipes: PipeTransform[]) => {
  return createRouteParamDecorator(RouteParamtypesEnum.BODY)(property, ...pipes);
};

export const Param = (property?: string, ...pipes: PipeTransform[]) => {
  return createRouteParamDecorator(RouteParamtypesEnum.PARAM)(property, ...pipes);
};

export const Req = Request;
export const Res = Response;
