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
            const inst = getter === undefined ?
                new ctrl() : getter(ctrl);
            if (view) {
                reactRouters.push({
                    component: view, path: url, func: inst[name], args: (ctx, next) => getArguments(params, ctx, next)
                });
            }
            else {
                middleware.push(async function (ctx, next) {
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
            routerRoutes[method](url, ...middleware);
        }
    }
    return reactRouters;
}
exports.bindRoutes = bindRoutes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmluZGluZ3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvYmluZGluZ3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0QkFBMEI7QUFDMUIsMkNBQTJDO0FBRTNDOzs7Ozs7R0FNRztBQUNILHNCQUE2QixNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUk7SUFDNUMsSUFBSSxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFFdkIsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNYLElBQUksR0FBRyxFQUFFLENBQUM7UUFFVixnQkFBZ0I7UUFDaEIsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQ2YsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUMzQixDQUFDLENBQUMsQ0FBQztRQUVILEdBQUcsQ0FBQyxDQUFDLE1BQU0sS0FBSyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDM0IsSUFBSSxNQUFNLENBQUM7WUFDWCxFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDO2dCQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2hELElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDcEIsQ0FBQztJQUNILENBQUM7SUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQW5CRCxvQ0FtQkM7QUFFRDs7Ozs7Ozs7Ozs7OztHQWFHO0FBQ0gsb0JBQTJCLFlBQWlCLEVBQUUsV0FBa0IsRUFBRSxNQUFzQjtJQUN0RixJQUFJLFlBQVksR0FBRyxFQUFFLENBQUM7SUFDdEIsR0FBRyxDQUFDLENBQUMsTUFBTSxJQUFJLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQztRQUMvQixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLHdCQUFZLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDckQsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNYLElBQUksQ0FBQyx3QkFBWSxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQzlCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLE1BQU0sR0FBRyxJQUFJLENBQUMsd0JBQVksQ0FBQyxDQUFDO1FBQzlCLENBQUM7UUFDRCxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQztZQUMvRSxNQUFNLElBQUksR0FBRyxNQUFNLEtBQUssU0FBUztnQkFDL0IsSUFBSSxJQUFJLEVBQUUsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFNUIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDVCxZQUFZLENBQUMsSUFBSSxDQUFDO29CQUNoQixTQUFTLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxLQUFLLFlBQVksQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQztpQkFDckcsQ0FBQyxDQUFDO1lBQ0wsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxXQUFXLEdBQUcsRUFBRSxJQUFJO29CQUN2QyxNQUFNLElBQUksR0FBRyxZQUFZLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFDN0MsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7b0JBQ25DLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7d0JBQ2IsUUFBUSxDQUFDLEdBQUcsRUFBRSxNQUFNLE1BQU0sQ0FBQyxDQUFBO29CQUM3QixDQUFDO29CQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNOLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7NEJBQ1gsR0FBRyxDQUFDLElBQUksR0FBRyxNQUFNLE1BQU0sQ0FBQzt3QkFDMUIsQ0FBQztvQkFDSCxDQUFDO29CQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7Z0JBQ2hCLENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQztZQUNELFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxVQUFVLENBQUMsQ0FBQztRQUMzQyxDQUFDO0lBQ0gsQ0FBQztJQUNELE1BQU0sQ0FBQyxZQUFZLENBQUM7QUFDdEIsQ0FBQztBQW5DRCxnQ0FtQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJ3JlZmxlY3QtbWV0YWRhdGEnO1xuaW1wb3J0IHsgUk9VVEVfUFJFRklYIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuXG4vKipcbiAqIEdpdmVuIGEgbGlzdCBvZiBwYXJhbXMsIGV4ZWN1dGUgZWFjaCB3aXRoIHRoZSBjb250ZXh0LlxuICpcbiAqIEBwYXJhbSBwYXJhbXNcbiAqIEBwYXJhbSBjdHhcbiAqIEBwYXJhbSBuZXh0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRBcmd1bWVudHMocGFyYW1zLCBjdHgsIG5leHQpOiBhbnlbXSB7XG4gIGxldCBhcmdzID0gW2N0eCwgbmV4dF07XG5cbiAgaWYgKHBhcmFtcykge1xuICAgIGFyZ3MgPSBbXTtcblxuICAgIC8vIHNvcnQgYnkgaW5kZXhcbiAgICBwYXJhbXMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgcmV0dXJuIGEuaW5kZXggLSBiLmluZGV4O1xuICAgIH0pO1xuXG4gICAgZm9yIChjb25zdCBwYXJhbSBvZiBwYXJhbXMpIHtcbiAgICAgIGxldCByZXN1bHQ7XG4gICAgICBpZiAocGFyYW0gIT09IHVuZGVmaW5lZCkgcmVzdWx0ID0gcGFyYW0uZm4oY3R4KTtcbiAgICAgIGFyZ3MucHVzaChyZXN1bHQpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBhcmdzO1xufVxuXG4vKipcbiAqIEJpbmRzIHRoZSByb3V0ZXMgdG8gdGhlIHJvdXRlclxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogICAgY29uc3Qgcm91dGVyID0gbmV3IFJvdXRlcigpO1xuICogICAgYmluZFJvdXRlcyhyb3V0ZXIsIFtQcm9maWxlQ29udHJvbGxlcl0pO1xuICpcbiAqIEBleHBvcnRcbiAqIEBwYXJhbSB7Kn0gcm91dGVyUm91dGVzXG4gKiBAcGFyYW0ge2FueVtdfSBjb250cm9sbGVyc1xuICogQHBhcmFtIHsoY3RybCkgPT4gYW55fSBbZ2V0dGVyXVxuICogQHJldHVybnMgeyp9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBiaW5kUm91dGVzKHJvdXRlclJvdXRlczogYW55LCBjb250cm9sbGVyczogYW55W10sIGdldHRlcj86IChjdHJsKSA9PiBhbnkpOiBhbnkge1xuICB2YXIgcmVhY3RSb3V0ZXJzID0gW107XG4gIGZvciAoY29uc3QgY3RybCBvZiBjb250cm9sbGVycykge1xuICAgIHZhciByb3V0ZXMgPSBSZWZsZWN0LmdldE1ldGFkYXRhKFJPVVRFX1BSRUZJWCwgY3RybCk7XG4gICAgaWYgKHJvdXRlcykge1xuICAgICAgY3RybFtST1VURV9QUkVGSVhdID0gcm91dGVzO1xuICAgIH0gZWxzZSB7XG4gICAgICByb3V0ZXMgPSBjdHJsW1JPVVRFX1BSRUZJWF07XG4gICAgfVxuICAgIGZvciAoY29uc3QgeyBtZXRob2QsIHVybCwgbWlkZGxld2FyZSwgbmFtZSwgcGFyYW1zLCB2aWV3LCByZXNwb25zZSB9IG9mIHJvdXRlcykge1xuICAgICAgY29uc3QgaW5zdCA9IGdldHRlciA9PT0gdW5kZWZpbmVkID9cbiAgICAgICAgbmV3IGN0cmwoKSA6IGdldHRlcihjdHJsKTtcblxuICAgICAgaWYgKHZpZXcpIHtcbiAgICAgICAgcmVhY3RSb3V0ZXJzLnB1c2goe1xuICAgICAgICAgIGNvbXBvbmVudDogdmlldywgcGF0aDogdXJsLCBmdW5jIDogaW5zdFtuYW1lXSwgYXJncyA6IChjdHgsIG5leHQpID0+IGdldEFyZ3VtZW50cyhwYXJhbXMsIGN0eCwgbmV4dClcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtaWRkbGV3YXJlLnB1c2goYXN5bmMgZnVuY3Rpb24gKGN0eCwgbmV4dCkge1xuICAgICAgICAgIGNvbnN0IGFyZ3MgPSBnZXRBcmd1bWVudHMocGFyYW1zLCBjdHgsIG5leHQpO1xuICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGluc3RbbmFtZV0oLi4uYXJncyk7XG4gICAgICAgICAgaWYgKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXNwb25zZShjdHgsIGF3YWl0IHJlc3VsdClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICAgICAgICBjdHguYm9keSA9IGF3YWl0IHJlc3VsdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByb3V0ZXJSb3V0ZXNbbWV0aG9kXSh1cmwsIC4uLm1pZGRsZXdhcmUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVhY3RSb3V0ZXJzO1xufVxuIl19