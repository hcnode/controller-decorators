import 'reflect-metadata';
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
export declare function Controller(path?: string): (target: any) => void;
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
export declare function Use(...middlewares: any[]): (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => void;
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
export declare function Route(method: string, path?: string): (target: any, name: string, descriptor: TypedPropertyDescriptor<any>) => void;
export declare function View(path: string): (target: any, name: string, descriptor: TypedPropertyDescriptor<any>) => void;
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
export declare function Get(path?: string): (target: any, name: string, descriptor: TypedPropertyDescriptor<any>) => void;
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
export declare function Post(path?: string): (target: any, name: string, descriptor: TypedPropertyDescriptor<any>) => void;
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
export declare function Put(path?: string): (target: any, name: string, descriptor: TypedPropertyDescriptor<any>) => void;
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
export declare function Delete(path?: string): (target: any, name: string, descriptor: TypedPropertyDescriptor<any>) => void;
/**
 * Inject utility method
 *
 * @export
 * @param {any} fn
 * @returns
 */
export declare function Inject(fn: any): (target: any, name: string, index: number) => void;
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
export declare function Ctx(): (target: any, name: string, index: number) => void;
/**
 
 * @export
 * @returns
 */
export declare function Response(response: any): (target: any, name: string, index: number) => void;
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
export declare function Body(): (target: any, name: string, index: number) => void;
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
export declare function Fields(): (target: any, name: string, index: number) => void;
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
export declare function File(): (target: any, name: string, index: number) => void;
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
export declare function Files(): (target: any, name: string, index: number) => void;
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
export declare function QueryParam(prop?: any): (target: any, name: string, index: number) => void;
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
export declare function QueryParams(): (target: any, name: string, index: number) => void;
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
export declare function Param(prop?: any): (target: any, name: string, index: number) => void;
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
export declare function Params(): (target: any, name: string, index: number) => void;
