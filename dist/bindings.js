"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const constants_1 = require("./constants");
/**
 * Given a list of params, execute each with the context.
 *
 * @param params
 * @param ctx
 * @param next
 */
function getArguments(params, ctx, next) {
    let args = [ctx, next];
    if (params) {
        args = [];
        // sort by index
        params.sort((a, b) => {
            return a.index - b.index;
        });
        for (const param of params) {
            let result;
            if (param !== undefined)
                result = param.fn(ctx);
            args.push(result);
        }
    }
    return args;
}
exports.getArguments = getArguments;
/**
 * Binds the routes to the router
 *
 * Example:
 *
 *    const router = new Router();
 *    bindRoutes(router, [ProfileController]);
 *
 * @export
 * @param {*} routerRoutes
 * @param {any[]} controllers
 * @param {(ctrl) => any} [getter]
 * @returns {*}
 */
function bindRoutes(routerRoutes, controllers, getter) {
    var reactRouters = [];
    for (const ctrl of controllers) {
        var routes = Reflect.getMetadata(constants_1.ROUTE_PREFIX, ctrl);
        if (routes) {
            ctrl[constants_1.ROUTE_PREFIX] = routes;
        }
        else {
            routes = ctrl[constants_1.ROUTE_PREFIX];
        }
        for (const { method, url, middleware, name, params, view, response } of routes) {
            if (view) {
                reactRouters.push({
                    component: view, path: url
                });
            }
            else {
                routerRoutes[method](url, ...middleware, async function (ctx, next) {
                    const inst = getter === undefined ?
                        new ctrl() : getter(ctrl);
                    const args = getArguments(params, ctx, next);
                    const result = inst[name](...args);
                    if (response) {
                        response(ctx, await result);
                    }
                    else {
                        if (result) {
                            ctx.body = await result;
                        }
                    }
                    return result;
                });
            }
        }
    }
    return reactRouters;
}
exports.bindRoutes = bindRoutes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmluZGluZ3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvYmluZGluZ3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0QkFBMEI7QUFDMUIsMkNBQTJDO0FBRTNDOzs7Ozs7R0FNRztBQUNILHNCQUE2QixNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUk7SUFDNUMsSUFBSSxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFFdkIsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNYLElBQUksR0FBRyxFQUFFLENBQUM7UUFFVixnQkFBZ0I7UUFDaEIsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQ2YsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUMzQixDQUFDLENBQUMsQ0FBQztRQUVILEdBQUcsQ0FBQyxDQUFDLE1BQU0sS0FBSyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDM0IsSUFBSSxNQUFNLENBQUM7WUFDWCxFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDO2dCQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2hELElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDcEIsQ0FBQztJQUNILENBQUM7SUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQW5CRCxvQ0FtQkM7QUFFRDs7Ozs7Ozs7Ozs7OztHQWFHO0FBQ0gsb0JBQTJCLFlBQWlCLEVBQUUsV0FBa0IsRUFBRSxNQUFzQjtJQUN0RixJQUFJLFlBQVksR0FBRyxFQUFFLENBQUM7SUFDdEIsR0FBRyxDQUFDLENBQUMsTUFBTSxJQUFJLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQztRQUMvQixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLHdCQUFZLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDckQsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNYLElBQUksQ0FBQyx3QkFBWSxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQzlCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLE1BQU0sR0FBRyxJQUFJLENBQUMsd0JBQVksQ0FBQyxDQUFDO1FBQzlCLENBQUM7UUFDRCxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQztZQUMvRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNULFlBQVksQ0FBQyxJQUFJLENBQUM7b0JBQ2hCLFNBQVMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUc7aUJBQzNCLENBQUMsQ0FBQztZQUNMLENBQUM7WUFBQSxJQUFJLENBQUEsQ0FBQztnQkFDSixZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsVUFBVSxFQUFFLEtBQUssV0FBVyxHQUFHLEVBQUUsSUFBSTtvQkFDaEUsTUFBTSxJQUFJLEdBQUcsTUFBTSxLQUFLLFNBQVM7d0JBQy9CLElBQUksSUFBSSxFQUFFLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUU1QixNQUFNLElBQUksR0FBRyxZQUFZLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFDN0MsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7b0JBQ25DLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7d0JBQ2IsUUFBUSxDQUFDLEdBQUcsRUFBRSxNQUFNLE1BQU0sQ0FBQyxDQUFBO29CQUM3QixDQUFDO29CQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNOLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7NEJBQ1gsR0FBRyxDQUFDLElBQUksR0FBRyxNQUFNLE1BQU0sQ0FBQzt3QkFDMUIsQ0FBQztvQkFDSCxDQUFDO29CQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7Z0JBQ2hCLENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDO0lBQ0QsTUFBTSxDQUFDLFlBQVksQ0FBQztBQUN0QixDQUFDO0FBbENELGdDQWtDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAncmVmbGVjdC1tZXRhZGF0YSc7XG5pbXBvcnQgeyBST1VURV9QUkVGSVggfSBmcm9tICcuL2NvbnN0YW50cyc7XG5cbi8qKlxuICogR2l2ZW4gYSBsaXN0IG9mIHBhcmFtcywgZXhlY3V0ZSBlYWNoIHdpdGggdGhlIGNvbnRleHQuXG4gKlxuICogQHBhcmFtIHBhcmFtc1xuICogQHBhcmFtIGN0eFxuICogQHBhcmFtIG5leHRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEFyZ3VtZW50cyhwYXJhbXMsIGN0eCwgbmV4dCk6IGFueVtdIHtcbiAgbGV0IGFyZ3MgPSBbY3R4LCBuZXh0XTtcblxuICBpZiAocGFyYW1zKSB7XG4gICAgYXJncyA9IFtdO1xuXG4gICAgLy8gc29ydCBieSBpbmRleFxuICAgIHBhcmFtcy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICByZXR1cm4gYS5pbmRleCAtIGIuaW5kZXg7XG4gICAgfSk7XG5cbiAgICBmb3IgKGNvbnN0IHBhcmFtIG9mIHBhcmFtcykge1xuICAgICAgbGV0IHJlc3VsdDtcbiAgICAgIGlmIChwYXJhbSAhPT0gdW5kZWZpbmVkKSByZXN1bHQgPSBwYXJhbS5mbihjdHgpO1xuICAgICAgYXJncy5wdXNoKHJlc3VsdCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGFyZ3M7XG59XG5cbi8qKlxuICogQmluZHMgdGhlIHJvdXRlcyB0byB0aGUgcm91dGVyXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiAgICBjb25zdCByb3V0ZXIgPSBuZXcgUm91dGVyKCk7XG4gKiAgICBiaW5kUm91dGVzKHJvdXRlciwgW1Byb2ZpbGVDb250cm9sbGVyXSk7XG4gKlxuICogQGV4cG9ydFxuICogQHBhcmFtIHsqfSByb3V0ZXJSb3V0ZXNcbiAqIEBwYXJhbSB7YW55W119IGNvbnRyb2xsZXJzXG4gKiBAcGFyYW0geyhjdHJsKSA9PiBhbnl9IFtnZXR0ZXJdXG4gKiBAcmV0dXJucyB7Kn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRSb3V0ZXMocm91dGVyUm91dGVzOiBhbnksIGNvbnRyb2xsZXJzOiBhbnlbXSwgZ2V0dGVyPzogKGN0cmwpID0+IGFueSk6IGFueSB7XG4gIHZhciByZWFjdFJvdXRlcnMgPSBbXTtcbiAgZm9yIChjb25zdCBjdHJsIG9mIGNvbnRyb2xsZXJzKSB7XG4gICAgdmFyIHJvdXRlcyA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoUk9VVEVfUFJFRklYLCBjdHJsKTtcbiAgICBpZiAocm91dGVzKSB7XG4gICAgICBjdHJsW1JPVVRFX1BSRUZJWF0gPSByb3V0ZXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJvdXRlcyA9IGN0cmxbUk9VVEVfUFJFRklYXTtcbiAgICB9XG4gICAgZm9yIChjb25zdCB7IG1ldGhvZCwgdXJsLCBtaWRkbGV3YXJlLCBuYW1lLCBwYXJhbXMsIHZpZXcsIHJlc3BvbnNlIH0gb2Ygcm91dGVzKSB7XG4gICAgICBpZiAodmlldykge1xuICAgICAgICByZWFjdFJvdXRlcnMucHVzaCh7XG4gICAgICAgICAgY29tcG9uZW50OiB2aWV3LCBwYXRoOiB1cmxcbiAgICAgICAgfSk7XG4gICAgICB9ZWxzZXtcbiAgICAgICAgcm91dGVyUm91dGVzW21ldGhvZF0odXJsLCAuLi5taWRkbGV3YXJlLCBhc3luYyBmdW5jdGlvbiAoY3R4LCBuZXh0KSB7XG4gICAgICAgICAgY29uc3QgaW5zdCA9IGdldHRlciA9PT0gdW5kZWZpbmVkID9cbiAgICAgICAgICAgIG5ldyBjdHJsKCkgOiBnZXR0ZXIoY3RybCk7XG5cbiAgICAgICAgICBjb25zdCBhcmdzID0gZ2V0QXJndW1lbnRzKHBhcmFtcywgY3R4LCBuZXh0KTtcbiAgICAgICAgICBjb25zdCByZXN1bHQgPSBpbnN0W25hbWVdKC4uLmFyZ3MpO1xuICAgICAgICAgIGlmIChyZXNwb25zZSkge1xuICAgICAgICAgICAgcmVzcG9uc2UoY3R4LCBhd2FpdCByZXN1bHQpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgY3R4LmJvZHkgPSBhd2FpdCByZXN1bHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcmVhY3RSb3V0ZXJzO1xufVxuIl19