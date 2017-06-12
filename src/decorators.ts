import 'reflect-metadata';
import { ROUTE_PREFIX, MW_PREFIX, PARAMS_PREFIX, ACTION_TYPES, VIEW, RESPONSE } from './constants';

/**
 * Class decorator for controller declaration
 *
 * Example:
 *
 *    @Controller('/profile')
 *    export class ProfileController {
 *      ...
 *    }
 *
 * @export
 * @param {string} [path='']
 * @returns
 */
export function Controller(path: string = '') {
  return function(target) {
    const proto = target.prototype;

    // get middlewares
    const mws = Reflect.getMetadata(MW_PREFIX, target) || [];

    // get routes
    const routeDefs = Reflect.getMetadata(ROUTE_PREFIX, proto) || [];
    const routes = [];

    for(const route of routeDefs) {
      const fnMws = Reflect.getMetadata(`${MW_PREFIX}_${route.name}`, proto) || [];
      const params = Reflect.getMetadata(`${PARAMS_PREFIX}_${route.name}`, proto) || [];
      const view = Reflect.getMetadata(`${VIEW}_${route.name}`, proto);
      const response = Reflect.getMetadata(`${RESPONSE}_${route.name}`, proto);

      routes.push({
        method: route.method,
        url: path + route.path,
        middleware: [...mws, ...fnMws],
        name: route.name,
        params,
        view,
        response
      });
    }

    Reflect.defineMetadata(ROUTE_PREFIX, routes, target);
  };
};

/**
 * Middleware(s) decorator
 *
 * Example:
 *
 *    @Controller()
 *    @Use(myMiddleware)
 *    export class MyController {
 *
 *      @Get()
 *      @Use(myMiddleware2)
 *      get() { ... }
 *
 *    }
 *
 * @export
 * @param {...any[]} middlewares
 * @returns
 */
export function Use(...middlewares: any[]) {
  return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
    if(!propertyKey) {
      propertyKey = '';
    } else {
      propertyKey = '_' + propertyKey;
    }

    Reflect.defineMetadata(`${MW_PREFIX}${propertyKey}`, middlewares, target);
  };
}

/**
 * Route method decorator
 *
 * Example:
 *
 *    @Controller()
 *    export class MyController {
 *      @Route('get')
 *      get() { ... }
 *    }
 *
 * @export
 * @param {string} method
 * @param {string} [path='']
 * @returns
 */
export function Route(method: string, path: string = '') {
  return (target: any, name: string, descriptor: TypedPropertyDescriptor<any>) => {
    const meta = Reflect.getMetadata(ROUTE_PREFIX, target) || [];
    meta.push({ method, path, name });
    Reflect.defineMetadata(ROUTE_PREFIX, meta, target);
  };
};

export function View(path: string) {
  return (target: any, name: string, descriptor: TypedPropertyDescriptor<any>) => {
    Reflect.defineMetadata(VIEW + '_' + name, path, target);
  };
};


/**
 * Get method decorator
 *
 * Example:
 *
 *    @Controller()
 *    export class MyController {
 *      @Get()
 *      get() { ... }
 *    }
 *
 */
export function Get(path?: string) {
  return Route(ACTION_TYPES.GET, path);
};

/**
 * Post method decorator
 *
 * Example:
 *
 *    @Controller()
 *    export class MyController {
 *      @Post()
 *      post() { ... }
 *    }
 *
 */
export function Post(path?: string) {
  return Route(ACTION_TYPES.POST, path);
};

/**
 * Put method decorator
 *
 * Example:
 *
 *    @Controller()
 *    export class MyController {
 *      @Put()
 *      put() { ... }
 *    }
 *
 */
export function Put(path?: string) {
  return Route(ACTION_TYPES.PUT, path);
};

/**
 * Delete method decorator
 *
 * Example:
 *
 *    @Controller()
 *    export class MyController {
 *      @Delete()
 *      delete() { ... }
 *    }
 *
 */
export function Delete(path?: string) {
  return Route(ACTION_TYPES.DELETE, path);
};

/**
 * Inject utility method
 *
 * @export
 * @param {any} fn
 * @returns
 */
export function Inject(fn) {
  return function(target: any, name: string, index: number) {
    const meta = Reflect.getMetadata(`${PARAMS_PREFIX}_${name}`, target) || [];
    meta.push({ index, name, fn });
    Reflect.defineMetadata(`${PARAMS_PREFIX}_${name}`, meta, target);
  };
}

/**
 * KOA context constructor decorator
 *
 * Example:
 *
 *    @Controller()
 *    export class MyController {
 *      @Post()
 *      post(@Ctx() ctx) { ... }
 *    }
 *
 * @export
 * @returns
 */
export function Ctx() {
  return Inject((ctx) => ctx);
}



/**
 
 * @export
 * @returns
 */
export function Response(response) {
  return function(target: any, name: string, index: number) {
    Reflect.defineMetadata(`${RESPONSE}_${name}`, response, target);
  };
}

/**
 * Body constructor decorator
 *
 * Example:
 *
 *    @Controller()
 *    export class MyController {
 *      @Post()
 *      post(@Body() myBody) { ... }
 *    }
 *
 * @export
 * @returns
 */
export function Body() {
  return Inject((ctx) => ctx.request.body);
}

/**
 * Fields constructor decorator
 *
 * Example:
 *
 *    @Controller()
 *    export class MyController {
 *      @Post()
 *      post(@Fields() myFields) { ... }
 *    }
 *
 * @export
 * @returns
 */
export function Fields() {
  return Inject((ctx) => ctx.request.fields);
}

/**
 * File object constructor decorator. This is a
 * shortcut for `ctx.req.files[0]`.
 *
 * Example:
 *
 *    @Controller()
 *    export class MyController {
 *      @Post()
 *      post(@File() myFile) { ... }
 *    }
 *
 * @export
 * @returns
 */
export function File() {
  return Inject((ctx) => {
    if(ctx.request.files.length) return ctx.request.files[0];
    return ctx.request.files;
  });
}

/**
 * File object constructor decorator. This is a
 * shortcut for `ctx.req.files`.
 *
 * Example:
 *
 *    @Controller()
 *    export class MyController {
 *      @Post()
 *      post(@Files() files) { ... }
 *    }
 *
 * @export
 * @returns
 */
export function Files() {
  return Inject((ctx) => ctx.request.files);
}

/**
 * Query param constructor decorator. This is a
 * shortcut for example: `ctx.query['id']`.
 *
 * Example:
 *
 *    @Controller()
 *    export class MyController {
 *      @Post()
 *      post(@QueryParam('id') id) { ... }
 *    }
 *
 * @export
 * @returns
 */
export function QueryParam(prop?) {
  return Inject((ctx) => {
    if(!prop) return ctx.query;
    return ctx.query[prop];
  });
}

/**
 * Query params constructor decorator. This is a
 * shortcut for example: `ctx.query`.
 *
 * Example:
 *
 *    @Controller()
 *    export class MyController {
 *      @Post()
 *      post(@QueryParams() allParams) { ... }
 *    }
 *
 * @export
 * @returns
 */
export function QueryParams() {
  return QueryParam();
}

/**
 * Query param constructor decorator. This is a
 * shortcut for example: `ctx.params[myvar]`.
 *
 * Example:
 *
 *    @Controller()
 *    export class MyController {
 *      @Post(':id')
 *      post(@Param('id') id) { ... }
 *    }
 *
 * @export
 * @returns
 */
export function Param(prop?) {
  return Inject((ctx) => {
    if(!prop) return ctx.params;
    return ctx.params[prop];
  });
}

/**
 * Query params constructor decorator. This is a
 * shortcut for example: `ctx.params`.
 *
 * Example:
 *
 *    @Controller()
 *    export class MyController {
 *      @Post(':id/:name')
 *      post(@Params() obj) { ... }
 *    }
 *
 * @export
 * @returns
 */
export function Params() {
  return Param();
}
