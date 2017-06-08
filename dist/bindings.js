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
    for (const ctrl of controllers) {
        const routes = Reflect.getMetadata(constants_1.ROUTE_PREFIX, ctrl);
        var reactRouters = [];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmluZGluZ3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvYmluZGluZ3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0QkFBMEI7QUFDMUIsMkNBQTJDO0FBRTNDOzs7Ozs7R0FNRztBQUNILHNCQUE2QixNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUk7SUFDNUMsSUFBSSxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFFdkIsRUFBRSxDQUFBLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNWLElBQUksR0FBRyxFQUFFLENBQUM7UUFFVixnQkFBZ0I7UUFDaEIsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQ2YsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUMzQixDQUFDLENBQUMsQ0FBQztRQUVILEdBQUcsQ0FBQSxDQUFDLE1BQU0sS0FBSyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDMUIsSUFBSSxNQUFNLENBQUM7WUFDWCxFQUFFLENBQUEsQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDO2dCQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQy9DLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDcEIsQ0FBQztJQUNILENBQUM7SUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQW5CRCxvQ0FtQkM7QUFFRDs7Ozs7Ozs7Ozs7OztHQWFHO0FBQ0gsb0JBQTJCLFlBQWlCLEVBQUUsV0FBa0IsRUFBRSxNQUFzQjtJQUN0RixHQUFHLENBQUEsQ0FBQyxNQUFNLElBQUksSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBQzlCLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsd0JBQVksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN2RCxJQUFJLFlBQVksR0FBRyxFQUFFLENBQUM7UUFDdEIsR0FBRyxDQUFBLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNwRSxFQUFFLENBQUEsQ0FBQyxJQUFJLENBQUMsQ0FBQSxDQUFDO2dCQUNQLFlBQVksQ0FBQyxJQUFJLENBQUM7b0JBQ2hCLFNBQVMsRUFBRyxJQUFJLEVBQUUsSUFBSSxFQUFHLEdBQUc7aUJBQzdCLENBQUMsQ0FBQztZQUNMLENBQUM7WUFDRCxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsVUFBVSxFQUFFLEtBQUssV0FBVSxHQUFHLEVBQUUsSUFBSTtnQkFDL0QsTUFBTSxJQUFJLEdBQUcsTUFBTSxLQUFLLFNBQVM7b0JBQy9CLElBQUksSUFBSSxFQUFFLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUU1QixNQUFNLElBQUksR0FBRyxZQUFZLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDN0MsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7Z0JBQ25DLEVBQUUsQ0FBQSxDQUFDLE1BQU0sQ0FBQztvQkFBQyxHQUFHLENBQUMsSUFBSSxHQUFHLE1BQU0sTUFBTSxDQUFDO2dCQUNuQyxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQ2hCLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztJQUNILENBQUM7SUFDRCxNQUFNLENBQUMsWUFBWSxDQUFDO0FBQ3RCLENBQUM7QUF0QkQsZ0NBc0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICdyZWZsZWN0LW1ldGFkYXRhJztcbmltcG9ydCB7IFJPVVRFX1BSRUZJWCB9IGZyb20gJy4vY29uc3RhbnRzJztcblxuLyoqXG4gKiBHaXZlbiBhIGxpc3Qgb2YgcGFyYW1zLCBleGVjdXRlIGVhY2ggd2l0aCB0aGUgY29udGV4dC5cbiAqXG4gKiBAcGFyYW0gcGFyYW1zXG4gKiBAcGFyYW0gY3R4XG4gKiBAcGFyYW0gbmV4dFxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0QXJndW1lbnRzKHBhcmFtcywgY3R4LCBuZXh0KTogYW55W10ge1xuICBsZXQgYXJncyA9IFtjdHgsIG5leHRdO1xuXG4gIGlmKHBhcmFtcykge1xuICAgIGFyZ3MgPSBbXTtcblxuICAgIC8vIHNvcnQgYnkgaW5kZXhcbiAgICBwYXJhbXMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgcmV0dXJuIGEuaW5kZXggLSBiLmluZGV4O1xuICAgIH0pO1xuXG4gICAgZm9yKGNvbnN0IHBhcmFtIG9mIHBhcmFtcykge1xuICAgICAgbGV0IHJlc3VsdDtcbiAgICAgIGlmKHBhcmFtICE9PSB1bmRlZmluZWQpIHJlc3VsdCA9IHBhcmFtLmZuKGN0eCk7XG4gICAgICBhcmdzLnB1c2gocmVzdWx0KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYXJncztcbn1cblxuLyoqXG4gKiBCaW5kcyB0aGUgcm91dGVzIHRvIHRoZSByb3V0ZXJcbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqICAgIGNvbnN0IHJvdXRlciA9IG5ldyBSb3V0ZXIoKTtcbiAqICAgIGJpbmRSb3V0ZXMocm91dGVyLCBbUHJvZmlsZUNvbnRyb2xsZXJdKTtcbiAqXG4gKiBAZXhwb3J0XG4gKiBAcGFyYW0geyp9IHJvdXRlclJvdXRlc1xuICogQHBhcmFtIHthbnlbXX0gY29udHJvbGxlcnNcbiAqIEBwYXJhbSB7KGN0cmwpID0+IGFueX0gW2dldHRlcl1cbiAqIEByZXR1cm5zIHsqfVxuICovXG5leHBvcnQgZnVuY3Rpb24gYmluZFJvdXRlcyhyb3V0ZXJSb3V0ZXM6IGFueSwgY29udHJvbGxlcnM6IGFueVtdLCBnZXR0ZXI/OiAoY3RybCkgPT4gYW55KTogYW55IHtcbiAgZm9yKGNvbnN0IGN0cmwgb2YgY29udHJvbGxlcnMpIHtcbiAgICBjb25zdCByb3V0ZXMgPSBSZWZsZWN0LmdldE1ldGFkYXRhKFJPVVRFX1BSRUZJWCwgY3RybCk7XG4gICAgdmFyIHJlYWN0Um91dGVycyA9IFtdO1xuICAgIGZvcihjb25zdCB7IG1ldGhvZCwgdXJsLCBtaWRkbGV3YXJlLCBuYW1lLCBwYXJhbXMsIHZpZXcgfSBvZiByb3V0ZXMpIHtcbiAgICAgIGlmKHZpZXcpe1xuICAgICAgICByZWFjdFJvdXRlcnMucHVzaCh7XG4gICAgICAgICAgY29tcG9uZW50IDogdmlldywgcGF0aCA6IHVybFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJvdXRlclJvdXRlc1ttZXRob2RdKHVybCwgLi4ubWlkZGxld2FyZSwgYXN5bmMgZnVuY3Rpb24oY3R4LCBuZXh0KSB7XG4gICAgICAgIGNvbnN0IGluc3QgPSBnZXR0ZXIgPT09IHVuZGVmaW5lZCA/XG4gICAgICAgICAgbmV3IGN0cmwoKSA6IGdldHRlcihjdHJsKTtcblxuICAgICAgICBjb25zdCBhcmdzID0gZ2V0QXJndW1lbnRzKHBhcmFtcywgY3R4LCBuZXh0KTtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gaW5zdFtuYW1lXSguLi5hcmdzKTtcbiAgICAgICAgaWYocmVzdWx0KSBjdHguYm9keSA9IGF3YWl0IHJlc3VsdDtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVhY3RSb3V0ZXJzO1xufVxuIl19