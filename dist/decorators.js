"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const constants_1 = require("./constants");
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
function Controller(path = '') {
    return function (target) {
        const proto = target.prototype;
        // get middlewares
        const mws = Reflect.getMetadata(constants_1.MW_PREFIX, target) || [];
        // get routes
        const routeDefs = Reflect.getMetadata(constants_1.ROUTE_PREFIX, proto) || [];
        const routes = [];
        for (const route of routeDefs) {
            const fnMws = Reflect.getMetadata(`${constants_1.MW_PREFIX}_${route.name}`, proto) || [];
            const params = Reflect.getMetadata(`${constants_1.PARAMS_PREFIX}_${route.name}`, proto) || [];
            const view = Reflect.getMetadata(`${constants_1.VIEW}_${route.name}`, proto);
            routes.push({
                method: route.method,
                url: path + route.path,
                middleware: [...mws, ...fnMws],
                name: route.name,
                params,
                view
            });
        }
        Reflect.defineMetadata(constants_1.ROUTE_PREFIX, routes, target);
    };
}
exports.Controller = Controller;
;
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
function Use(...middlewares) {
    return (target, propertyKey, descriptor) => {
        if (!propertyKey) {
            propertyKey = '';
        }
        else {
            propertyKey = '_' + propertyKey;
        }
        Reflect.defineMetadata(`${constants_1.MW_PREFIX}${propertyKey}`, middlewares, target);
    };
}
exports.Use = Use;
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
function Route(method, path = '') {
    return (target, name, descriptor) => {
        const meta = Reflect.getMetadata(constants_1.ROUTE_PREFIX, target) || [];
        meta.push({ method, path, name });
        Reflect.defineMetadata(constants_1.ROUTE_PREFIX, meta, target);
    };
}
exports.Route = Route;
;
function View(path) {
    return (target, name, descriptor) => {
        Reflect.defineMetadata(constants_1.VIEW, path, target);
    };
}
exports.View = View;
;
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
function Get(path) {
    return Route(constants_1.ACTION_TYPES.GET, path);
}
exports.Get = Get;
;
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
function Post(path) {
    return Route(constants_1.ACTION_TYPES.POST, path);
}
exports.Post = Post;
;
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
function Put(path) {
    return Route(constants_1.ACTION_TYPES.PUT, path);
}
exports.Put = Put;
;
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
function Delete(path) {
    return Route(constants_1.ACTION_TYPES.DELETE, path);
}
exports.Delete = Delete;
;
/**
 * Inject utility method
 *
 * @export
 * @param {any} fn
 * @returns
 */
function Inject(fn) {
    return function (target, name, index) {
        const meta = Reflect.getMetadata(`${constants_1.PARAMS_PREFIX}_${name}`, target) || [];
        meta.push({ index, name, fn });
        Reflect.defineMetadata(`${constants_1.PARAMS_PREFIX}_${name}`, meta, target);
    };
}
exports.Inject = Inject;
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
function Ctx() {
    return Inject((ctx) => ctx);
}
exports.Ctx = Ctx;
/**
 * Node request object constructor decorator. This is a
 * shortcut for `ctx.req`.
 *
 * Example:
 *
 *    @Controller()
 *    export class MyController {
 *      @Post()
 *      post(@Req() req) { ... }
 *    }
 *
 * @export
 * @returns
 */
function Req() {
    return Inject((ctx) => ctx.req);
}
exports.Req = Req;
/**
 * KOA request object constructor decorator. This is a
 * shortcut for `ctx.request`.
 *
 * Example:
 *
 *    @Controller()
 *    export class MyController {
 *      @Post()
 *      post(@Request() request) { ... }
 *    }
 *
 * @export
 * @returns
 */
function Request() {
    return Inject((ctx) => ctx.request);
}
exports.Request = Request;
/**
 * Node response object constructor decorator. This is a
 * shortcut for `ctx.res`.
 *
 * Example:
 *
 *    @Controller()
 *    export class MyController {
 *      @Post()
 *      post(@Res() res) { ... }
 *    }
 *
 * @export
 * @returns
 */
function Res() {
    return Inject((ctx) => ctx.res);
}
exports.Res = Res;
/**
 * KOA response object constructor decorator. This is a
 * shortcut for `ctx.response`.
 *
 * Example:
 *
 *    @Controller()
 *    export class MyController {
 *      @Post()
 *      post(@Response() response) { ... }
 *    }
 *
 * @export
 * @returns
 */
function Response() {
    return Inject((ctx) => ctx.response);
}
exports.Response = Response;
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
function Body() {
    return Inject((ctx) => ctx.request.body);
}
exports.Body = Body;
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
function Fields() {
    return Inject((ctx) => ctx.request.fields);
}
exports.Fields = Fields;
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
function File() {
    return Inject((ctx) => {
        if (ctx.request.files.length)
            return ctx.request.files[0];
        return ctx.request.files;
    });
}
exports.File = File;
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
function Files() {
    return Inject((ctx) => ctx.request.files);
}
exports.Files = Files;
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
function QueryParam(prop) {
    return Inject((ctx) => {
        if (!prop)
            return ctx.query;
        return ctx.query[prop];
    });
}
exports.QueryParam = QueryParam;
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
function QueryParams() {
    return QueryParam();
}
exports.QueryParams = QueryParams;
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
function Param(prop) {
    return Inject((ctx) => {
        if (!prop)
            return ctx.params;
        return ctx.params[prop];
    });
}
exports.Param = Param;
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
function Params() {
    return Param();
}
exports.Params = Params;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVjb3JhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9kZWNvcmF0b3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNEJBQTBCO0FBQzFCLDJDQUF5RjtBQUV6Rjs7Ozs7Ozs7Ozs7OztHQWFHO0FBQ0gsb0JBQTJCLE9BQWUsRUFBRTtJQUMxQyxNQUFNLENBQUMsVUFBUyxNQUFNO1FBQ3BCLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUM7UUFFL0Isa0JBQWtCO1FBQ2xCLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMscUJBQVMsRUFBRSxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFekQsYUFBYTtRQUNiLE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsd0JBQVksRUFBRSxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDakUsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBRWxCLEdBQUcsQ0FBQSxDQUFDLE1BQU0sS0FBSyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDN0IsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxHQUFHLHFCQUFTLElBQUksS0FBSyxDQUFDLElBQUksRUFBRSxFQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUM3RSxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLEdBQUcseUJBQWEsSUFBSSxLQUFLLENBQUMsSUFBSSxFQUFFLEVBQUUsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2xGLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsR0FBRyxnQkFBSSxJQUFJLEtBQUssQ0FBQyxJQUFJLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUVqRSxNQUFNLENBQUMsSUFBSSxDQUFDO2dCQUNWLE1BQU0sRUFBRSxLQUFLLENBQUMsTUFBTTtnQkFDcEIsR0FBRyxFQUFFLElB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QUNILGVBQXNCLElBQUs7SUFDekIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUc7UUFDaEIsRUFBRSxDQUFBLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztRQUM1QixNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMxQixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFMRCxzQkFLQztBQUVEOzs7Ozs7Ozs7Ozs7OztHQWNHO0FBQ0g7SUFDRSxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDakIsQ0FBQztBQUZELHdCQUVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICdyZWZsZWN0LW1ldGFkYXRhJztcbmltcG9ydCB7IFJPVVRFX1BSRUZJWCwgTVdfUFJFRklYLCBQQVJBTVNfUFJFRklYLCBBQ1RJT05fVFlQRVMsIFZJRVcgfSBmcm9tICcuL2NvbnN0YW50cyc7XG5cbi8qKlxuICogQ2xhc3MgZGVjb3JhdG9yIGZvciBjb250cm9sbGVyIGRlY2xhcmF0aW9uXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiAgICBAQ29udHJvbGxlcignL3Byb2ZpbGUnKVxuICogICAgZXhwb3J0IGNsYXNzIFByb2ZpbGVDb250cm9sbGVyIHtcbiAqICAgICAgLi4uXG4gKiAgICB9XG4gKlxuICogQGV4cG9ydFxuICogQHBhcmFtIHtzdHJpbmd9IFtwYXRoPScnXVxuICogQHJldHVybnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIENvbnRyb2xsZXIocGF0aDogc3RyaW5nID0gJycpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHRhcmdldCkge1xuICAgIGNvbnN0IHByb3RvID0gdGFyZ2V0LnByb3RvdHlwZTtcblxuICAgIC8vIGdldCBtaWRkbGV3YXJlc1xuICAgIGNvbnN0IG13cyA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoTVdfUFJFRklYLCB0YXJnZXQpIHx8IFtdO1xuXG4gICAgLy8gZ2V0IHJvdXRlc1xuICAgIGNvbnN0IHJvdXRlRGVmcyA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoUk9VVEVfUFJFRklYLCBwcm90bykgfHwgW107XG4gICAgY29uc3Qgcm91dGVzID0gW107XG5cbiAgICBmb3IoY29uc3Qgcm91dGUgb2Ygcm91dGVEZWZzKSB7XG4gICAgICBjb25zdCBmbk13cyA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoYCR7TVdfUFJFRklYfV8ke3JvdXRlLm5hbWV9YCwgcHJvdG8pIHx8IFtdO1xuICAgICAgY29uc3QgcGFyYW1zID0gUmVmbGVjdC5nZXRNZXRhZGF0YShgJHtQQVJBTVNfUFJFRklYfV8ke3JvdXRlLm5hbWV9YCwgcHJvdG8pIHx8IFtdO1xuICAgICAgY29uc3QgdmlldyA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoYCR7VklFV31fJHtyb3V0ZS5uYW1lfWAsIHByb3RvKTtcblxuICAgICAgcm91dGVzLnB1c2goe1xuICAgICAgICBtZXRob2Q6IHJvdXRlLm1ldGhvZCxcbiAgICAgICAgdXJsOiBwYXRoICsgcm91dGUucGF0aCxcbiAgICAgICAgbWlkZGxld2FyZTogWy4uLm13cywgLi4uZm5Nd3NdLFxuICAgICAgICBuYW1lOiByb3V0ZS5uYW1lLFxuICAgICAgICBwYXJhbXMsXG4gICAgICAgIHZpZXdcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIFJlZmxlY3QuZGVmaW5lTWV0YWRhdGEoUk9VVEVfUFJFRklYLCByb3V0ZXMsIHRhcmdldCk7XG4gIH07XG59O1xuXG4vKipcbiAqIE1pZGRsZXdhcmUocykgZGVjb3JhdG9yXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiAgICBAQ29udHJvbGxlcigpXG4gKiAgICBAVXNlKG15TWlkZGxld2FyZSlcbiAqICAgIGV4cG9ydCBjbGFzcyBNeUNvbnRyb2xsZXIge1xuICpcbiAqICAgICAgQEdldCgpXG4gKiAgICAgIEBVc2UobXlNaWRkbGV3YXJlMilcbiAqICAgICAgZ2V0KCkgeyAuLi4gfVxuICpcbiAqICAgIH1cbiAqXG4gKiBAZXhwb3J0XG4gKiBAcGFyYW0gey4uLmFueVtdfSBtaWRkbGV3YXJlc1xuICogQHJldHVybnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIFVzZSguLi5taWRkbGV3YXJlczogYW55W10pIHtcbiAgcmV0dXJuICh0YXJnZXQ6IGFueSwgcHJvcGVydHlLZXk6IHN0cmluZywgZGVzY3JpcHRvcjogVHlwZWRQcm9wZXJ0eURlc2NyaXB0b3I8YW55PikgPT4ge1xuICAgIGlmKCFwcm9wZXJ0eUtleSkge1xuICAgICAgcHJvcGVydHlLZXkgPSAnJztcbiAgICB9IGVsc2Uge1xuICAgICAgcHJvcGVydHlLZXkgPSAnXycgKyBwcm9wZXJ0eUtleTtcbiAgICB9XG5cbiAgICBSZWZsZWN0LmRlZmluZU1ldGFkYXRhKGAke01XX1BSRUZJWH0ke3Byb3BlcnR5S2V5fWAsIG1pZGRsZXdhcmVzLCB0YXJnZXQpO1xuICB9O1xufVxuXG4vKipcbiAqIFJvdXRlIG1ldGhvZCBkZWNvcmF0b3JcbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqICAgIEBDb250cm9sbGVyKClcbiAqICAgIGV4cG9ydCBjbGFzcyBNeUNvbnRyb2xsZXIge1xuICogICAgICBAUm91dGUoJ2dldCcpXG4gKiAgICAgIGdldCgpIHsgLi4uIH1cbiAqICAgIH1cbiAqXG4gKiBAZXhwb3J0XG4gKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kXG4gKiBAcGFyYW0ge3N0cmluZ30gW3BhdGg9JyddXG4gKiBAcmV0dXJuc1xuICovXG5leHBvcnQgZnVuY3Rpb24gUm91dGUobWV0aG9kOiBzdHJpbmcsIHBhdGg6IHN0cmluZyA9ICcnKSB7XG4gIHJldHVybiAodGFyZ2V0OiBhbnksIG5hbWU6IHN0cmluZywgZGVzY3JpcHRvcjogVHlwZWRQcm9wZXJ0eURlc2NyaXB0b3I8YW55PikgPT4ge1xuICAgIGNvbnN0IG1ldGEgPSBSZWZsZWN0LmdldE1ldGFkYXRhKFJPVVRFX1BSRUZJWCwgdGFyZ2V0KSB8fCBbXTtcbiAgICBtZXRhLnB1c2goeyBtZXRob2QsIHBhdGgsIG5hbWUgfSk7XG4gICAgUmVmbGVjdC5kZWZpbmVNZXRhZGF0YShST1VURV9QUkVGSVgsIG1ldGEsIHRhcmdldCk7XG4gIH07XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gVmlldyhwYXRoOiBzdHJpbmcpIHtcbiAgcmV0dXJuICh0YXJnZXQ6IGFueSwgbmFtZTogc3RyaW5nLCBkZXNjcmlwdG9yOiBUeXBlZFByb3BlcnR5RGVzY3JpcHRvcjxhbnk+KSA9PiB7XG4gICAgUmVmbGVjdC5kZWZpbmVNZXRhZGF0YShWSUVXLCBwYXRoLCB0YXJnZXQpO1xuICB9O1xufTtcblxuLyoqXG4gKiBHZXQgbWV0aG9kIGRlY29yYXRvclxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogICAgQENvbnRyb2xsZXIoKVxuICogICAgZXhwb3J0IGNsYXNzIE15Q29udHJvbGxlciB7XG4gKiAgICAgIEBHZXQoKVxuICogICAgICBnZXQoKSB7IC4uLiB9XG4gKiAgICB9XG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gR2V0KHBhdGg/OiBzdHJpbmcpIHtcbiAgcmV0dXJuIFJvdXRlKEFDVElPTl9UWVBFUy5HRVQsIHBhdGgpO1xufTtcblxuLyoqXG4gKiBQb3N0IG1ldGhvZCBkZWNvcmF0b3JcbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqICAgIEBDb250cm9sbGVyKClcbiAqICAgIGV4cG9ydCBjbGFzcyBNeUNvbnRyb2xsZXIge1xuICogICAgICBAUG9zdCgpXG4gKiAgICAgIHBvc3QoKSB7IC4uLiB9XG4gKiAgICB9XG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gUG9zdChwYXRoPzogc3RyaW5nKSB7XG4gIHJldHVybiBSb3V0ZShBQ1RJT05fVFlQRVMuUE9TVCwgcGF0aCk7XG59O1xuXG4vKipcbiAqIFB1dCBtZXRob2QgZGVjb3JhdG9yXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiAgICBAQ29udHJvbGxlcigpXG4gKiAgICBleHBvcnQgY2xhc3MgTXlDb250cm9sbGVyIHtcbiAqICAgICAgQFB1dCgpXG4gKiAgICAgIHB1dCgpIHsgLi4uIH1cbiAqICAgIH1cbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBQdXQocGF0aD86IHN0cmluZykge1xuICByZXR1cm4gUm91dGUoQUNUSU9OX1RZUEVTLlBVVCwgcGF0aCk7XG59O1xuXG4vKipcbiAqIERlbGV0ZSBtZXRob2QgZGVjb3JhdG9yXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiAgICBAQ29udHJvbGxlcigpXG4gKiAgICBleHBvcnQgY2xhc3MgTXlDb250cm9sbGVyIHtcbiAqICAgICAgQERlbGV0ZSgpXG4gKiAgICAgIGRlbGV0ZSgpIHsgLi4uIH1cbiAqICAgIH1cbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBEZWxldGUocGF0aD86IHN0cmluZykge1xuICByZXR1cm4gUm91dGUoQUNUSU9OX1RZUEVTLkRFTEVURSwgcGF0aCk7XG59O1xuXG4vKipcbiAqIEluamVjdCB1dGlsaXR5IG1ldGhvZFxuICpcbiAqIEBleHBvcnRcbiAqIEBwYXJhbSB7YW55fSBmblxuICogQHJldHVybnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIEluamVjdChmbikge1xuICByZXR1cm4gZnVuY3Rpb24odGFyZ2V0OiBhbnksIG5hbWU6IHN0cmluZywgaW5kZXg6IG51bWJlcikge1xuICAgIGNvbnN0IG1ldGEgPSBSZWZsZWN0LmdldE1ldGFkYXRhKGAke1BBUkFNU19QUkVGSVh9XyR7bmFtZX1gLCB0YXJnZXQpIHx8IFtdO1xuICAgIG1ldGEucHVzaCh7IGluZGV4LCBuYW1lLCBmbiB9KTtcbiAgICBSZWZsZWN0LmRlZmluZU1ldGFkYXRhKGAke1BBUkFNU19QUkVGSVh9XyR7bmFtZX1gLCBtZXRhLCB0YXJnZXQpO1xuICB9O1xufVxuXG4vKipcbiAqIEtPQSBjb250ZXh0IGNvbnN0cnVjdG9yIGRlY29yYXRvclxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogICAgQENvbnRyb2xsZXIoKVxuICogICAgZXhwb3J0IGNsYXNzIE15Q29udHJvbGxlciB7XG4gKiAgICAgIEBQb3N0KClcbiAqICAgICAgcG9zdChAQ3R4KCkgY3R4KSB7IC4uLiB9XG4gKiAgICB9XG4gKlxuICogQGV4cG9ydFxuICogQHJldHVybnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIEN0eCgpIHtcbiAgcmV0dXJuIEluamVjdCgoY3R4KSA9PiBjdHgpO1xufVxuXG4vKipcbiAqIE5vZGUgcmVxdWVzdCBvYmplY3QgY29uc3RydWN0b3IgZGVjb3JhdG9yLiBUaGlzIGlzIGFcbiAqIHNob3J0Y3V0IGZvciBgY3R4LnJlcWAuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiAgICBAQ29udHJvbGxlcigpXG4gKiAgICBleHBvcnQgY2xhc3MgTXlDb250cm9sbGVyIHtcbiAqICAgICAgQFBvc3QoKVxuICogICAgICBwb3N0KEBSZXEoKSByZXEpIHsgLi4uIH1cbiAqICAgIH1cbiAqXG4gKiBAZXhwb3J0XG4gKiBAcmV0dXJuc1xuICovXG5leHBvcnQgZnVuY3Rpb24gUmVxKCkge1xuICByZXR1cm4gSW5qZWN0KChjdHgpID0+IGN0eC5yZXEpO1xufVxuXG4vKipcbiAqIEtPQSByZXF1ZXN0IG9iamVjdCBjb25zdHJ1Y3RvciBkZWNvcmF0b3IuIFRoaXMgaXMgYVxuICogc2hvcnRjdXQgZm9yIGBjdHgucmVxdWVzdGAuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiAgICBAQ29udHJvbGxlcigpXG4gKiAgICBleHBvcnQgY2xhc3MgTXlDb250cm9sbGVyIHtcbiAqICAgICAgQFBvc3QoKVxuICogICAgICBwb3N0KEBSZXF1ZXN0KCkgcmVxdWVzdCkgeyAuLi4gfVxuICogICAgfVxuICpcbiAqIEBleHBvcnRcbiAqIEByZXR1cm5zXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBSZXF1ZXN0KCkge1xuICByZXR1cm4gSW5qZWN0KChjdHgpID0+IGN0eC5yZXF1ZXN0KTtcbn1cblxuLyoqXG4gKiBOb2RlIHJlc3BvbnNlIG9iamVjdCBjb25zdHJ1Y3RvciBkZWNvcmF0b3IuIFRoaXMgaXMgYVxuICogc2hvcnRjdXQgZm9yIGBjdHgucmVzYC5cbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqICAgIEBDb250cm9sbGVyKClcbiAqICAgIGV4cG9ydCBjbGFzcyBNeUNvbnRyb2xsZXIge1xuICogICAgICBAUG9zdCgpXG4gKiAgICAgIHBvc3QoQFJlcygpIHJlcykgeyAuLi4gfVxuICogICAgfVxuICpcbiAqIEBleHBvcnRcbiAqIEByZXR1cm5zXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBSZXMoKSB7XG4gIHJldHVybiBJbmplY3QoKGN0eCkgPT4gY3R4LnJlcyk7XG59XG5cbi8qKlxuICogS09BIHJlc3BvbnNlIG9iamVjdCBjb25zdHJ1Y3RvciBkZWNvcmF0b3IuIFRoaXMgaXMgYVxuICogc2hvcnRjdXQgZm9yIGBjdHgucmVzcG9uc2VgLlxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogICAgQENvbnRyb2xsZXIoKVxuICogICAgZXhwb3J0IGNsYXNzIE15Q29udHJvbGxlciB7XG4gKiAgICAgIEBQb3N0KClcbiAqICAgICAgcG9zdChAUmVzcG9uc2UoKSByZXNwb25zZSkgeyAuLi4gfVxuICogICAgfVxuICpcbiAqIEBleHBvcnRcbiAqIEByZXR1cm5zXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBSZXNwb25zZSgpIHtcbiAgcmV0dXJuIEluamVjdCgoY3R4KSA9PiBjdHgucmVzcG9uc2UpO1xufVxuXG4vKipcbiAqIEJvZHkgY29uc3RydWN0b3IgZGVjb3JhdG9yXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiAgICBAQ29udHJvbGxlcigpXG4gKiAgICBleHBvcnQgY2xhc3MgTXlDb250cm9sbGVyIHtcbiAqICAgICAgQFBvc3QoKVxuICogICAgICBwb3N0KEBCb2R5KCkgbXlCb2R5KSB7IC4uLiB9XG4gKiAgICB9XG4gKlxuICogQGV4cG9ydFxuICogQHJldHVybnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIEJvZHkoKSB7XG4gIHJldHVybiBJbmplY3QoKGN0eCkgPT4gY3R4LnJlcXVlc3QuYm9keSk7XG59XG5cbi8qKlxuICogRmllbGRzIGNvbnN0cnVjdG9yIGRlY29yYXRvclxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogICAgQENvbnRyb2xsZXIoKVxuICogICAgZXhwb3J0IGNsYXNzIE15Q29udHJvbGxlciB7XG4gKiAgICAgIEBQb3N0KClcbiAqICAgICAgcG9zdChARmllbGRzKCkgbXlGaWVsZHMpIHsgLi4uIH1cbiAqICAgIH1cbiAqXG4gKiBAZXhwb3J0XG4gKiBAcmV0dXJuc1xuICovXG5leHBvcnQgZnVuY3Rpb24gRmllbGRzKCkge1xuICByZXR1cm4gSW5qZWN0KChjdHgpID0+IGN0eC5yZXF1ZXN0LmZpZWxkcyk7XG59XG5cbi8qKlxuICogRmlsZSBvYmplY3QgY29uc3RydWN0b3IgZGVjb3JhdG9yLiBUaGlzIGlzIGFcbiAqIHNob3J0Y3V0IGZvciBgY3R4LnJlcS5maWxlc1swXWAuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiAgICBAQ29udHJvbGxlcigpXG4gKiAgICBleHBvcnQgY2xhc3MgTXlDb250cm9sbGVyIHtcbiAqICAgICAgQFBvc3QoKVxuICogICAgICBwb3N0KEBGaWxlKCkgbXlGaWxlKSB7IC4uLiB9XG4gKiAgICB9XG4gKlxuICogQGV4cG9ydFxuICogQHJldHVybnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIEZpbGUoKSB7XG4gIHJldHVybiBJbmplY3QoKGN0eCkgPT4ge1xuICAgIGlmKGN0eC5yZXF1ZXN0LmZpbGVzLmxlbmd0aCkgcmV0dXJuIGN0eC5yZXF1ZXN0LmZpbGVzWzBdO1xuICAgIHJldHVybiBjdHgucmVxdWVzdC5maWxlcztcbiAgfSk7XG59XG5cbi8qKlxuICogRmlsZSBvYmplY3QgY29uc3RydWN0b3IgZGVjb3JhdG9yLiBUaGlzIGlzIGFcbiAqIHNob3J0Y3V0IGZvciBgY3R4LnJlcS5maWxlc2AuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiAgICBAQ29udHJvbGxlcigpXG4gKiAgICBleHBvcnQgY2xhc3MgTXlDb250cm9sbGVyIHtcbiAqICAgICAgQFBvc3QoKVxuICogICAgICBwb3N0KEBGaWxlcygpIGZpbGVzKSB7IC4uLiB9XG4gKiAgICB9XG4gKlxuICogQGV4cG9ydFxuICogQHJldHVybnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIEZpbGVzKCkge1xuICByZXR1cm4gSW5qZWN0KChjdHgpID0+IGN0eC5yZXF1ZXN0LmZpbGVzKTtcbn1cblxuLyoqXG4gKiBRdWVyeSBwYXJhbSBjb25zdHJ1Y3RvciBkZWNvcmF0b3IuIFRoaXMgaXMgYVxuICogc2hvcnRjdXQgZm9yIGV4YW1wbGU6IGBjdHgucXVlcnlbJ2lkJ11gLlxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogICAgQENvbnRyb2xsZXIoKVxuICogICAgZXhwb3J0IGNsYXNzIE15Q29udHJvbGxlciB7XG4gKiAgICAgIEBQb3N0KClcbiAqICAgICAgcG9zdChAUXVlcnlQYXJhbSgnaWQnKSBpZCkgeyAuLi4gfVxuICogICAgfVxuICpcbiAqIEBleHBvcnRcbiAqIEByZXR1cm5zXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBRdWVyeVBhcmFtKHByb3A/KSB7XG4gIHJldHVybiBJbmplY3QoKGN0eCkgPT4ge1xuICAgIGlmKCFwcm9wKSByZXR1cm4gY3R4LnF1ZXJ5O1xuICAgIHJldHVybiBjdHgucXVlcnlbcHJvcF07XG4gIH0pO1xufVxuXG4vKipcbiAqIFF1ZXJ5IHBhcmFtcyBjb25zdHJ1Y3RvciBkZWNvcmF0b3IuIFRoaXMgaXMgYVxuICogc2hvcnRjdXQgZm9yIGV4YW1wbGU6IGBjdHgucXVlcnlgLlxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogICAgQENvbnRyb2xsZXIoKVxuICogICAgZXhwb3J0IGNsYXNzIE15Q29udHJvbGxlciB7XG4gKiAgICAgIEBQb3N0KClcbiAqICAgICAgcG9zdChAUXVlcnlQYXJhbXMoKSBhbGxQYXJhbXMpIHsgLi4uIH1cbiAqICAgIH1cbiAqXG4gKiBAZXhwb3J0XG4gKiBAcmV0dXJuc1xuICovXG5leHBvcnQgZnVuY3Rpb24gUXVlcnlQYXJhbXMoKSB7XG4gIHJldHVybiBRdWVyeVBhcmFtKCk7XG59XG5cbi8qKlxuICogUXVlcnkgcGFyYW0gY29uc3RydWN0b3IgZGVjb3JhdG9yLiBUaGlzIGlzIGFcbiAqIHNob3J0Y3V0IGZvciBleGFtcGxlOiBgY3R4LnBhcmFtc1tteXZhcl1gLlxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogICAgQENvbnRyb2xsZXIoKVxuICogICAgZXhwb3J0IGNsYXNzIE15Q29udHJvbGxlciB7XG4gKiAgICAgIEBQb3N0KCc6aWQnKVxuICogICAgICBwb3N0KEBQYXJhbSgnaWQnKSBpZCkgeyAuLi4gfVxuICogICAgfVxuICpcbiAqIEBleHBvcnRcbiAqIEByZXR1cm5zXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBQYXJhbShwcm9wPykge1xuICByZXR1cm4gSW5qZWN0KChjdHgpID0+IHtcbiAgICBpZighcHJvcCkgcmV0dXJuIGN0eC5wYXJhbXM7XG4gICAgcmV0dXJuIGN0eC5wYXJhbXNbcHJvcF07XG4gIH0pO1xufVxuXG4vKipcbiAqIFF1ZXJ5IHBhcmFtcyBjb25zdHJ1Y3RvciBkZWNvcmF0b3IuIFRoaXMgaXMgYVxuICogc2hvcnRjdXQgZm9yIGV4YW1wbGU6IGBjdHgucGFyYW1zYC5cbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqICAgIEBDb250cm9sbGVyKClcbiAqICAgIGV4cG9ydCBjbGFzcyBNeUNvbnRyb2xsZXIge1xuICogICAgICBAUG9zdCgnOmlkLzpuYW1lJylcbiAqICAgICAgcG9zdChAUGFyYW1zKCkgb2JqKSB7IC4uLiB9XG4gKiAgICB9XG4gKlxuICogQGV4cG9ydFxuICogQHJldHVybnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIFBhcmFtcygpIHtcbiAgcmV0dXJuIFBhcmFtKCk7XG59XG4iXX0=