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
        const routes = Reflect.getMetadata(constants_1.ROUTE_PREFIX, ctrl);
        for (const { method, url, middleware, name, params, view } of routes) {
            if (view) {
                reactRouters.push({
                    component: view, path: url
                });
            }
            routerRoutes[method](url, ...middleware, async function (ctx, next) {
                const inst = getter === undefined ?
                    new ctrl() : getter(ctrl);
                const args = getArguments(params, ctx, next);
                const result = inst[name](...args);
                if (result)
                    ctx.body = await result;
                return result;
            });
        }
    }
    return reactRouters;
}
exports.bindRoutes = bindRoutes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmluZGluZ3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvYmluZGluZ3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0QkFBMEI7QUFDMUIsMkNBQTJDO0FBRTNDOzs7Ozs7R0FNRztBQUNILHNCQUE2QixNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUk7SUFDNUMsSUFBSSxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFFdkIsRUFBRSxDQUFBLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNWLElBQUksR0FBRyxFQUFFLENBQUM7UUFFVixnQkFBZ0I7UUFDaEIsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQ2YsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUMzQixDQUFDLENBQUMsQ0FBQztRQUVILEdBQUcsQ0FBQSxDQUFDLE1BQU0sS0FBSyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDMUIsSUFBSSxNQUFNLENBQUM7WUFDWCxFQUFFLENBQUEsQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDO2dCQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQy9DLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDcEIsQ0FBQztJQUNILENBQUM7SUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQW5CRCxvQ0FtQkM7QUFFRDs7Ozs7Ozs7Ozs7OztHQWFHO0FBQ0gsb0JBQTJCLFlBQWlCLEVBQUUsV0FBa0IsRUFBRSxNQUFzQjtJQUN0RixJQUFJLFlBQVksR0FBRyxFQUFFLENBQUM7SUFDdEIsR0FBRyxDQUFBLENBQUMsTUFBTSxJQUFJLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQztRQUM5QixNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLHdCQUFZLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdkQsR0FBRyxDQUFBLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNwRSxFQUFFLENBQUEsQ0FBQyxJQUFJLENBQUMsQ0FBQSxDQUFDO2dCQUNQLFlBQVksQ0FBQyxJQUFJLENBQUM7b0JBQ2hCLFNBQVMsRUFBRyxJQUFJLEVBQUUsSUFBSSxFQUFHLEdBQUc7aUJBQzdCLENBQUMsQ0FBQztZQUNMLENBQUM7WUFDRCxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsVUFBVSxFQUFFLEtBQUssV0FBVSxHQUFHLEVBQUUsSUFBSTtnQkFDL0QsTUFBTSxJQUFJLEdBQUcsTUFBTSxLQUFLLFNBQVM7b0JBQy9CLElBQUksSUFBSSxFQUFFLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUU1QixNQUFNLElBQUksR0FBRyxZQUFZLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDN0MsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7Z0JBQ25DLEVBQUUsQ0FBQSxDQUFDLE1BQU0sQ0FBQztvQkFBQyxHQUFHLENBQUMsSUFBSSxHQUFHLE1BQU0sTUFBTSxDQUFDO2dCQUNuQyxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQ2hCLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztJQUNILENBQUM7SUFDRCxNQUFNLENBQUMsWUFBWSxDQUFDO0FBQ3RCLENBQUM7QUF0QkQsZ0NBc0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICdyZWZsZWN0LW1ldGFkYXRhJztcbmltcG9ydCB7IFJPVVRFX1BSRUZJWCB9IGZyb20gJy4vY29uc3RhbnRzJztcblxuLyoqXG4gKiBHaXZlbiBhIGxpc3Qgb2YgcGFyYW1zLCBleGVjdXRlIGVhY2ggd2l0aCB0aGUgY29udGV4dC5cbiAqXG4gKiBAcGFyYW0gcGFyYW1zXG4gKiBAcGFyYW0gY3R4XG4gKiBAcGFyYW0gbmV4dFxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0QXJndW1lbnRzKHBhcmFtcywgY3R4LCBuZXh0KTogYW55W10ge1xuICBsZXQgYXJncyA9IFtjdHgsIG5leHRdO1xuXG4gIGlmKHBhcmFtcykge1xuICAgIGFyZ3MgPSBbXTtcblxuICAgIC8vIHNvcnQgYnkgaW5kZXhcbiAgICBwYXJhbXMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgcmV0dXJuIGEuaW5kZXggLSBiLmluZGV4O1xuICAgIH0pO1xuXG4gICAgZm9yKGNvbnN0IHBhcmFtIG9mIHBhcmFtcykge1xuICAgICAgbGV0IHJlc3VsdDtcbiAgICAgIGlmKHBhcmFtICE9PSB1bmRlZmluZWQpIHJlc3VsdCA9IHBhcmFtLmZuKGN0eCk7XG4gICAgICBhcmdzLnB1c2gocmVzdWx0KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYXJncztcbn1cblxuLyoqXG4gKiBCaW5kcyB0aGUgcm91dGVzIHRvIHRoZSByb3V0ZXJcbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqICAgIGNvbnN0IHJvdXRlciA9IG5ldyBSb3V0ZXIoKTtcbiAqICAgIGJpbmRSb3V0ZXMocm91dGVyLCBbUHJvZmlsZUNvbnRyb2xsZXJdKTtcbiAqXG4gKiBAZXhwb3J0XG4gKiBAcGFyYW0geyp9IHJvdXRlclJvdXRlc1xuICogQHBhcmFtIHthbnlbXX0gY29udHJvbGxlcnNcbiAqIEBwYXJhbSB7KGN0cmwpID0+IGFueX0gW2dldHRlcl1cbiAqIEByZXR1cm5zIHsqfVxuICovXG5leHBvcnQgZnVuY3Rpb24gYmluZFJvdXRlcyhyb3V0ZXJSb3V0ZXM6IGFueSwgY29udHJvbGxlcnM6IGFueVtdLCBnZXR0ZXI/OiAoY3RybCkgPT4gYW55KTogYW55IHtcbiAgdmFyIHJlYWN0Um91dGVycyA9IFtdO1xuICBmb3IoY29uc3QgY3RybCBvZiBjb250cm9sbGVycykge1xuICAgIGNvbnN0IHJvdXRlcyA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoUk9VVEVfUFJFRklYLCBjdHJsKTtcbiAgICBmb3IoY29uc3QgeyBtZXRob2QsIHVybCwgbWlkZGxld2FyZSwgbmFtZSwgcGFyYW1zLCB2aWV3IH0gb2Ygcm91dGVzKSB7XG4gICAgICBpZih2aWV3KXtcbiAgICAgICAgcmVhY3RSb3V0ZXJzLnB1c2goe1xuICAgICAgICAgIGNvbXBvbmVudCA6IHZpZXcsIHBhdGggOiB1cmxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByb3V0ZXJSb3V0ZXNbbWV0aG9kXSh1cmwsIC4uLm1pZGRsZXdhcmUsIGFzeW5jIGZ1bmN0aW9uKGN0eCwgbmV4dCkge1xuICAgICAgICBjb25zdCBpbnN0ID0gZ2V0dGVyID09PSB1bmRlZmluZWQgP1xuICAgICAgICAgIG5ldyBjdHJsKCkgOiBnZXR0ZXIoY3RybCk7XG5cbiAgICAgICAgY29uc3QgYXJncyA9IGdldEFyZ3VtZW50cyhwYXJhbXMsIGN0eCwgbmV4dCk7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGluc3RbbmFtZV0oLi4uYXJncyk7XG4gICAgICAgIGlmKHJlc3VsdCkgY3R4LmJvZHkgPSBhd2FpdCByZXN1bHQ7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlYWN0Um91dGVycztcbn1cbiJdfQ==