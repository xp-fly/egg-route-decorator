import {
    ROUTE_ARGS_METADATA, ROUTE_CONTROLLER_METADATA, ROUTE_HANDLE_METADATA, ROUTE_METHOD_METADATA,
    ROUTE_URL_METADATA,
} from './constant';
import {ReflectDefaultMetadata} from './enum';
import {RouteParamMetadataInterface} from './decorator';

export interface RouteHandlerInterface {
    methodName: string; // 方法名
    httpMethod: string; // 请求类型
    urlPath: string; // 路由地址
    handlerArgs: RouteParamMetadataInterface; // 方法参数数据
}

/**
 * 解析controller 获取
 * @param controller
 */
export function exploreController(controller: any) {
    // 原型
    const prototype = controller.prototype;
    // 构造函数
    const constructor = prototype.constructor;
    // 函数 方法、属性装饰器，传入原型
    const methodNames = Reflect.getMetadata(ROUTE_HANDLE_METADATA, prototype) || [];
    // 控制器前缀 类装饰器，传入的是构造函数
    const ctrlPrefix = Reflect.getMetadata(ROUTE_CONTROLLER_METADATA, constructor) || '';
    const handlers: RouteHandlerInterface[] = [];
    methodNames.forEach((methodName) => {
        // http方法
        const httpMethod: string = Reflect.getMetadata(ROUTE_METHOD_METADATA, prototype, methodName);
        // 方法装饰器声明的路由
        const urlPath: string = Reflect.getMetadata(ROUTE_URL_METADATA, prototype, methodName) || '';
        // handler的参数
        const handlerArgs: RouteParamMetadataInterface = Reflect.getMetadata(
            ROUTE_ARGS_METADATA,
            prototype,
            methodName,
        ) || {};
        // handlerArgs的参数类型
        const handlerArgsTypes: any[] = Reflect.getMetadata(
            ReflectDefaultMetadata.DESGIN_PARAMTYPES,
            prototype,
            methodName,
        );
        for (const key of Object.keys(handlerArgs)) {
            const { paramIndex } = handlerArgs[key];
            // 相应位置的参数类型。类型声明
            handlerArgs[key].type = handlerArgsTypes[paramIndex];
        }
        handlers.push({
            urlPath,
            httpMethod,
            methodName,
            handlerArgs,
        });
    });
    return {
        handlers,
        ctrlPrefix,
    };
}
