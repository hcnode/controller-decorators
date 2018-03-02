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
            const response = Reflect.getMetadata(`${constants_1.RESPONSE}_${route.name}`, proto);
            routes.push({
                method: route.method,
                url: path + route.path,
                // override mode like sails.js
                middleware: fnMws ? [...fnMws] : [...mws],
                name: route.name,
                params,
                view,
                response
            });
        }
        Reflect.defineMetadata(constants_1.ROUTE_PREFIX, routes, target);
        target[constants_1.ROUTE_PREFIX] = routes;
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
        Reflect.defineMetadata(constants_1.VIEW + '_' + name, path, target);
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
 
 * @export
 * @returns
 */
function Response(response) {
    return function (target, name, index) {
        Reflect.defineMetadata(`${constants_1.RESPONSE}_${name}`, response, target);
    };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVjb3JhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9kZWNvcmF0b3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNEJBQTBCO0FBQzFCLDJDQUFtRztBQUVuRzs7Ozs7Ozs7Ozs7OztHQWFHO0FBQ0gsb0JBQTJCLE9BQWUsRUFBRTtJQUMxQyxNQUFNLENBQUMsVUFBUyxNQUFNO1FBQ3BCLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUM7UUFFL0Isa0JBQWtCO1FBQ2xCLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMscUJBQVMsRUFBRSxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFekQsYUFBYTtRQUNiLE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsd0JBQVksRUFBRSxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDakUsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBRWxCLEdBQUcsQ0FBQSxDQUFDLE1BQU0sS0FBSyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDN0IsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxHQUFHLHFCQUFTLElBQUksS0FBSyxDQUFDLElBQUksRUFBRSxFQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUM3RSxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLEdBQUcseUJBQWEsSUFBSSxLQUFLLENBQUMsSUFBSSxFQUFFLEVBQUUsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2xGLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsR0FBRyxnQkFBSSxJQUFJLEtBQUssQ0FBQyxJQUFJLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNqRSxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLEdBQUcsb0JBQVEsSUFBSSxLQUFLLENBQUMsSUFBSSxFQUFF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LENBQUEsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO1FBQzVCLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzFCLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUxELHNCQUtDO0FBRUQ7Ozs7Ozs7Ozs7Ozs7O0dBY0c7QUFDSDtJQUNFLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNqQixDQUFDO0FBRkQsd0JBRUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJ3JlZmxlY3QtbWV0YWRhdGEnO1xuaW1wb3J0IHsgUk9VVEVfUFJFRklYLCBNV19QUkVGSVgsIFBBUkFNU19QUkVGSVgsIEFDVElPTl9UWVBFUywgVklFVywgUkVTUE9OU0UgfSBmcm9tICcuL2NvbnN0YW50cyc7XG5cbi8qKlxuICogQ2xhc3MgZGVjb3JhdG9yIGZvciBjb250cm9sbGVyIGRlY2xhcmF0aW9uXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiAgICBAQ29udHJvbGxlcignL3Byb2ZpbGUnKVxuICogICAgZXhwb3J0IGNsYXNzIFByb2ZpbGVDb250cm9sbGVyIHtcbiAqICAgICAgLi4uXG4gKiAgICB9XG4gKlxuICogQGV4cG9ydFxuICogQHBhcmFtIHtzdHJpbmd9IFtwYXRoPScnXVxuICogQHJldHVybnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIENvbnRyb2xsZXIocGF0aDogc3RyaW5nID0gJycpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHRhcmdldCkge1xuICAgIGNvbnN0IHByb3RvID0gdGFyZ2V0LnByb3RvdHlwZTtcblxuICAgIC8vIGdldCBtaWRkbGV3YXJlc1xuICAgIGNvbnN0IG13cyA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoTVdfUFJFRklYLCB0YXJnZXQpIHx8IFtdO1xuXG4gICAgLy8gZ2V0IHJvdXRlc1xuICAgIGNvbnN0IHJvdXRlRGVmcyA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoUk9VVEVfUFJFRklYLCBwcm90bykgfHwgW107XG4gICAgY29uc3Qgcm91dGVzID0gW107XG5cbiAgICBmb3IoY29uc3Qgcm91dGUgb2Ygcm91dGVEZWZzKSB7XG4gICAgICBjb25zdCBmbk13cyA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoYCR7TVdfUFJFRklYfV8ke3JvdXRlLm5hbWV9YCwgcHJvdG8pIHx8IFtdO1xuICAgICAgY29uc3QgcGFyYW1zID0gUmVmbGVjdC5nZXRNZXRhZGF0YShgJHtQQVJBTVNfUFJFRklYfV8ke3JvdXRlLm5hbWV9YCwgcHJvdG8pIHx8IFtdO1xuICAgICAgY29uc3QgdmlldyA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoYCR7VklFV31fJHtyb3V0ZS5uYW1lfWAsIHByb3RvKTtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gUmVmbGVjdC5nZXRNZXRhZGF0YShgJHtSRVNQT05TRX1fJHtyb3V0ZS5uYW1lfWAsIHByb3RvKTtcblxuICAgICAgcm91dGVzLnB1c2goe1xuICAgICAgICBtZXRob2Q6IHJvdXRlLm1ldGhvZCxcbiAgICAgICAgdXJsOiBwYXRoICsgcm91dGUucGF0aCxcbiAgICAgICAgLy8gb3ZlcnJpZGUgbW9kZSBsaWtlIHNhaWxzLmpzXG4gICAgICAgIG1pZGRsZXdhcmU6IGZuTXdzID8gWy4uLmZuTXdzXSA6IFsuLi5td3NdLFxuICAgICAgICBuYW1lOiByb3V0ZS5uYW1lLFxuICAgICAgICBwYXJhbXMsXG4gICAgICAgIHZpZXcsXG4gICAgICAgIHJlc3BvbnNlXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBSZWZsZWN0LmRlZmluZU1ldGFkYXRhKFJPVVRFX1BSRUZJWCwgcm91dGVzLCB0YXJnZXQpO1xuICAgIHRhcmdldFtST1VURV9QUkVGSVhdID0gcm91dGVzO1xuICB9O1xufTtcblxuLyoqXG4gKiBNaWRkbGV3YXJlKHMpIGRlY29yYXRvclxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogICAgQENvbnRyb2xsZXIoKVxuICogICAgQFVzZShteU1pZGRsZXdhcmUpXG4gKiAgICBleHBvcnQgY2xhc3MgTXlDb250cm9sbGVyIHtcbiAqXG4gKiAgICAgIEBHZXQoKVxuICogICAgICBAVXNlKG15TWlkZGxld2FyZTIpXG4gKiAgICAgIGdldCgpIHsgLi4uIH1cbiAqXG4gKiAgICB9XG4gKlxuICogQGV4cG9ydFxuICogQHBhcmFtIHsuLi5hbnlbXX0gbWlkZGxld2FyZXNcbiAqIEByZXR1cm5zXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBVc2UoLi4ubWlkZGxld2FyZXM6IGFueVtdKSB7XG4gIHJldHVybiAodGFyZ2V0OiBhbnksIHByb3BlcnR5S2V5OiBzdHJpbmcsIGRlc2NyaXB0b3I6IFR5cGVkUHJvcGVydHlEZXNjcmlwdG9yPGFueT4pID0+IHtcbiAgICBpZighcHJvcGVydHlLZXkpIHtcbiAgICAgIHByb3BlcnR5S2V5ID0gJyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHByb3BlcnR5S2V5ID0gJ18nICsgcHJvcGVydHlLZXk7XG4gICAgfVxuXG4gICAgUmVmbGVjdC5kZWZpbmVNZXRhZGF0YShgJHtNV19QUkVGSVh9JHtwcm9wZXJ0eUtleX1gLCBtaWRkbGV3YXJlcywgdGFyZ2V0KTtcbiAgfTtcbn1cblxuLyoqXG4gKiBSb3V0ZSBtZXRob2QgZGVjb3JhdG9yXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiAgICBAQ29udHJvbGxlcigpXG4gKiAgICBleHBvcnQgY2xhc3MgTXlDb250cm9sbGVyIHtcbiAqICAgICAgQFJvdXRlKCdnZXQnKVxuICogICAgICBnZXQoKSB7IC4uLiB9XG4gKiAgICB9XG4gKlxuICogQGV4cG9ydFxuICogQHBhcmFtIHtzdHJpbmd9IG1ldGhvZFxuICogQHBhcmFtIHtzdHJpbmd9IFtwYXRoPScnXVxuICogQHJldHVybnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIFJvdXRlKG1ldGhvZDogc3RyaW5nLCBwYXRoOiBzdHJpbmcgPSAnJykge1xuICByZXR1cm4gKHRhcmdldDogYW55LCBuYW1lOiBzdHJpbmcsIGRlc2NyaXB0b3I6IFR5cGVkUHJvcGVydHlEZXNjcmlwdG9yPGFueT4pID0+IHtcbiAgICBjb25zdCBtZXRhID0gUmVmbGVjdC5nZXRNZXRhZGF0YShST1VURV9QUkVGSVgsIHRhcmdldCkgfHwgW107XG4gICAgbWV0YS5wdXNoKHsgbWV0aG9kLCBwYXRoLCBuYW1lIH0pO1xuICAgIFJlZmxlY3QuZGVmaW5lTWV0YWRhdGEoUk9VVEVfUFJFRklYLCBtZXRhLCB0YXJnZXQpO1xuICB9O1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIFZpZXcocGF0aDogc3RyaW5nKSB7XG4gIHJldHVybiAodGFyZ2V0OiBhbnksIG5hbWU6IHN0cmluZywgZGVzY3JpcHRvcjogVHlwZWRQcm9wZXJ0eURlc2NyaXB0b3I8YW55PikgPT4ge1xuICAgIFJlZmxlY3QuZGVmaW5lTWV0YWRhdGEoVklFVyArICdfJyArIG5hbWUsIHBhdGgsIHRhcmdldCk7XG4gIH07XG59O1xuXG5cbi8qKlxuICogR2V0IG1ldGhvZCBkZWNvcmF0b3JcbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqICAgIEBDb250cm9sbGVyKClcbiAqICAgIGV4cG9ydCBjbGFzcyBNeUNvbnRyb2xsZXIge1xuICogICAgICBAR2V0KClcbiAqICAgICAgZ2V0KCkgeyAuLi4gfVxuICogICAgfVxuICpcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIEdldChwYXRoPzogc3RyaW5nKSB7XG4gIHJldHVybiBSb3V0ZShBQ1RJT05fVFlQRVMuR0VULCBwYXRoKTtcbn07XG5cbi8qKlxuICogUG9zdCBtZXRob2QgZGVjb3JhdG9yXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiAgICBAQ29udHJvbGxlcigpXG4gKiAgICBleHBvcnQgY2xhc3MgTXlDb250cm9sbGVyIHtcbiAqICAgICAgQFBvc3QoKVxuICogICAgICBwb3N0KCkgeyAuLi4gfVxuICogICAgfVxuICpcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIFBvc3QocGF0aD86IHN0cmluZykge1xuICByZXR1cm4gUm91dGUoQUNUSU9OX1RZUEVTLlBPU1QsIHBhdGgpO1xufTtcblxuLyoqXG4gKiBQdXQgbWV0aG9kIGRlY29yYXRvclxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogICAgQENvbnRyb2xsZXIoKVxuICogICAgZXhwb3J0IGNsYXNzIE15Q29udHJvbGxlciB7XG4gKiAgICAgIEBQdXQoKVxuICogICAgICBwdXQoKSB7IC4uLiB9XG4gKiAgICB9XG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gUHV0KHBhdGg/OiBzdHJpbmcpIHtcbiAgcmV0dXJuIFJvdXRlKEFDVElPTl9UWVBFUy5QVVQsIHBhdGgpO1xufTtcblxuLyoqXG4gKiBEZWxldGUgbWV0aG9kIGRlY29yYXRvclxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogICAgQENvbnRyb2xsZXIoKVxuICogICAgZXhwb3J0IGNsYXNzIE15Q29udHJvbGxlciB7XG4gKiAgICAgIEBEZWxldGUoKVxuICogICAgICBkZWxldGUoKSB7IC4uLiB9XG4gKiAgICB9XG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gRGVsZXRlKHBhdGg/OiBzdHJpbmcpIHtcbiAgcmV0dXJuIFJvdXRlKEFDVElPTl9UWVBFUy5ERUxFVEUsIHBhdGgpO1xufTtcblxuLyoqXG4gKiBJbmplY3QgdXRpbGl0eSBtZXRob2RcbiAqXG4gKiBAZXhwb3J0XG4gKiBAcGFyYW0ge2FueX0gZm5cbiAqIEByZXR1cm5zXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBJbmplY3QoZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHRhcmdldDogYW55LCBuYW1lOiBzdHJpbmcsIGluZGV4OiBudW1iZXIpIHtcbiAgICBjb25zdCBtZXRhID0gUmVmbGVjdC5nZXRNZXRhZGF0YShgJHtQQVJBTVNfUFJFRklYfV8ke25hbWV9YCwgdGFyZ2V0KSB8fCBbXTtcbiAgICBtZXRhLnB1c2goeyBpbmRleCwgbmFtZSwgZm4gfSk7XG4gICAgUmVmbGVjdC5kZWZpbmVNZXRhZGF0YShgJHtQQVJBTVNfUFJFRklYfV8ke25hbWV9YCwgbWV0YSwgdGFyZ2V0KTtcbiAgfTtcbn1cblxuLyoqXG4gKiBLT0EgY29udGV4dCBjb25zdHJ1Y3RvciBkZWNvcmF0b3JcbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqICAgIEBDb250cm9sbGVyKClcbiAqICAgIGV4cG9ydCBjbGFzcyBNeUNvbnRyb2xsZXIge1xuICogICAgICBAUG9zdCgpXG4gKiAgICAgIHBvc3QoQEN0eCgpIGN0eCkgeyAuLi4gfVxuICogICAgfVxuICpcbiAqIEBleHBvcnRcbiAqIEByZXR1cm5zXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBDdHgoKSB7XG4gIHJldHVybiBJbmplY3QoKGN0eCkgPT4gY3R4KTtcbn1cblxuXG5cbi8qKlxuIFxuICogQGV4cG9ydFxuICogQHJldHVybnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIFJlc3BvbnNlKHJlc3BvbnNlKSB7XG4gIHJldHVybiBmdW5jdGlvbih0YXJnZXQ6IGFueSwgbmFtZTogc3RyaW5nLCBpbmRleDogbnVtYmVyKSB7XG4gICAgUmVmbGVjdC5kZWZpbmVNZXRhZGF0YShgJHtSRVNQT05TRX1fJHtuYW1lfWAsIHJlc3BvbnNlLCB0YXJnZXQpO1xuICB9O1xufVxuXG4vKipcbiAqIEJvZHkgY29uc3RydWN0b3IgZGVjb3JhdG9yXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiAgICBAQ29udHJvbGxlcigpXG4gKiAgICBleHBvcnQgY2xhc3MgTXlDb250cm9sbGVyIHtcbiAqICAgICAgQFBvc3QoKVxuICogICAgICBwb3N0KEBCb2R5KCkgbXlCb2R5KSB7IC4uLiB9XG4gKiAgICB9XG4gKlxuICogQGV4cG9ydFxuICogQHJldHVybnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIEJvZHkoKSB7XG4gIHJldHVybiBJbmplY3QoKGN0eCkgPT4gY3R4LnJlcXVlc3QuYm9keSk7XG59XG5cbi8qKlxuICogRmllbGRzIGNvbnN0cnVjdG9yIGRlY29yYXRvclxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogICAgQENvbnRyb2xsZXIoKVxuICogICAgZXhwb3J0IGNsYXNzIE15Q29udHJvbGxlciB7XG4gKiAgICAgIEBQb3N0KClcbiAqICAgICAgcG9zdChARmllbGRzKCkgbXlGaWVsZHMpIHsgLi4uIH1cbiAqICAgIH1cbiAqXG4gKiBAZXhwb3J0XG4gKiBAcmV0dXJuc1xuICovXG5leHBvcnQgZnVuY3Rpb24gRmllbGRzKCkge1xuICByZXR1cm4gSW5qZWN0KChjdHgpID0+IGN0eC5yZXF1ZXN0LmZpZWxkcyk7XG59XG5cbi8qKlxuICogRmlsZSBvYmplY3QgY29uc3RydWN0b3IgZGVjb3JhdG9yLiBUaGlzIGlzIGFcbiAqIHNob3J0Y3V0IGZvciBgY3R4LnJlcS5maWxlc1swXWAuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiAgICBAQ29udHJvbGxlcigpXG4gKiAgICBleHBvcnQgY2xhc3MgTXlDb250cm9sbGVyIHtcbiAqICAgICAgQFBvc3QoKVxuICogICAgICBwb3N0KEBGaWxlKCkgbXlGaWxlKSB7IC4uLiB9XG4gKiAgICB9XG4gKlxuICogQGV4cG9ydFxuICogQHJldHVybnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIEZpbGUoKSB7XG4gIHJldHVybiBJbmplY3QoKGN0eCkgPT4ge1xuICAgIGlmKGN0eC5yZXF1ZXN0LmZpbGVzLmxlbmd0aCkgcmV0dXJuIGN0eC5yZXF1ZXN0LmZpbGVzWzBdO1xuICAgIHJldHVybiBjdHgucmVxdWVzdC5maWxlcztcbiAgfSk7XG59XG5cbi8qKlxuICogRmlsZSBvYmplY3QgY29uc3RydWN0b3IgZGVjb3JhdG9yLiBUaGlzIGlzIGFcbiAqIHNob3J0Y3V0IGZvciBgY3R4LnJlcS5maWxlc2AuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiAgICBAQ29udHJvbGxlcigpXG4gKiAgICBleHBvcnQgY2xhc3MgTXlDb250cm9sbGVyIHtcbiAqICAgICAgQFBvc3QoKVxuICogICAgICBwb3N0KEBGaWxlcygpIGZpbGVzKSB7IC4uLiB9XG4gKiAgICB9XG4gKlxuICogQGV4cG9ydFxuICogQHJldHVybnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIEZpbGVzKCkge1xuICByZXR1cm4gSW5qZWN0KChjdHgpID0+IGN0eC5yZXF1ZXN0LmZpbGVzKTtcbn1cblxuLyoqXG4gKiBRdWVyeSBwYXJhbSBjb25zdHJ1Y3RvciBkZWNvcmF0b3IuIFRoaXMgaXMgYVxuICogc2hvcnRjdXQgZm9yIGV4YW1wbGU6IGBjdHgucXVlcnlbJ2lkJ11gLlxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogICAgQENvbnRyb2xsZXIoKVxuICogICAgZXhwb3J0IGNsYXNzIE15Q29udHJvbGxlciB7XG4gKiAgICAgIEBQb3N0KClcbiAqICAgICAgcG9zdChAUXVlcnlQYXJhbSgnaWQnKSBpZCkgeyAuLi4gfVxuICogICAgfVxuICpcbiAqIEBleHBvcnRcbiAqIEByZXR1cm5zXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBRdWVyeVBhcmFtKHByb3A/KSB7XG4gIHJldHVybiBJbmplY3QoKGN0eCkgPT4ge1xuICAgIGlmKCFwcm9wKSByZXR1cm4gY3R4LnF1ZXJ5O1xuICAgIHJldHVybiBjdHgucXVlcnlbcHJvcF07XG4gIH0pO1xufVxuXG4vKipcbiAqIFF1ZXJ5IHBhcmFtcyBjb25zdHJ1Y3RvciBkZWNvcmF0b3IuIFRoaXMgaXMgYVxuICogc2hvcnRjdXQgZm9yIGV4YW1wbGU6IGBjdHgucXVlcnlgLlxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogICAgQENvbnRyb2xsZXIoKVxuICogICAgZXhwb3J0IGNsYXNzIE15Q29udHJvbGxlciB7XG4gKiAgICAgIEBQb3N0KClcbiAqICAgICAgcG9zdChAUXVlcnlQYXJhbXMoKSBhbGxQYXJhbXMpIHsgLi4uIH1cbiAqICAgIH1cbiAqXG4gKiBAZXhwb3J0XG4gKiBAcmV0dXJuc1xuICovXG5leHBvcnQgZnVuY3Rpb24gUXVlcnlQYXJhbXMoKSB7XG4gIHJldHVybiBRdWVyeVBhcmFtKCk7XG59XG5cbi8qKlxuICogUXVlcnkgcGFyYW0gY29uc3RydWN0b3IgZGVjb3JhdG9yLiBUaGlzIGlzIGFcbiAqIHNob3J0Y3V0IGZvciBleGFtcGxlOiBgY3R4LnBhcmFtc1tteXZhcl1gLlxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogICAgQENvbnRyb2xsZXIoKVxuICogICAgZXhwb3J0IGNsYXNzIE15Q29udHJvbGxlciB7XG4gKiAgICAgIEBQb3N0KCc6aWQnKVxuICogICAgICBwb3N0KEBQYXJhbSgnaWQnKSBpZCkgeyAuLi4gfVxuICogICAgfVxuICpcbiAqIEBleHBvcnRcbiAqIEByZXR1cm5zXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBQYXJhbShwcm9wPykge1xuICByZXR1cm4gSW5qZWN0KChjdHgpID0+IHtcbiAgICBpZighcHJvcCkgcmV0dXJuIGN0eC5wYXJhbXM7XG4gICAgcmV0dXJuIGN0eC5wYXJhbXNbcHJvcF07XG4gIH0pO1xufVxuXG4vKipcbiAqIFF1ZXJ5IHBhcmFtcyBjb25zdHJ1Y3RvciBkZWNvcmF0b3IuIFRoaXMgaXMgYVxuICogc2hvcnRjdXQgZm9yIGV4YW1wbGU6IGBjdHgucGFyYW1zYC5cbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqICAgIEBDb250cm9sbGVyKClcbiAqICAgIGV4cG9ydCBjbGFzcyBNeUNvbnRyb2xsZXIge1xuICogICAgICBAUG9zdCgnOmlkLzpuYW1lJylcbiAqICAgICAgcG9zdChAUGFyYW1zKCkgb2JqKSB7IC4uLiB9XG4gKiAgICB9XG4gKlxuICogQGV4cG9ydFxuICogQHJldHVybnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIFBhcmFtcygpIHtcbiAgcmV0dXJuIFBhcmFtKCk7XG59XG4iXX0=