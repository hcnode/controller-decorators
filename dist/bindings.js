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
        for (const { method, url, middleware, name, params, view, response } of routes) {
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
    return reactRouters;
}
exports.bindRoutes = bindRoutes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmluZGluZ3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvYmluZGluZ3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0QkFBMEI7QUFDMUIsMkNBQTJDO0FBRTNDOzs7Ozs7R0FNRztBQUNILHNCQUE2QixNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUk7SUFDNUMsSUFBSSxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFFdkIsRUFBRSxDQUFBLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNWLElBQUksR0FBRyxFQUFFLENBQUM7UUFFVixnQkFBZ0I7UUFDaEIsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQ2YsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUMzQixDQUFDLENBQUMsQ0FBQztRQUVILEdBQUcsQ0FBQSxDQUFDLE1BQU0sS0FBSyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDMUIsSUFBSSxNQUFNLENBQUM7WUFDWCxFQUFFLENBQUEsQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDO2dCQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQy9DLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDcEIsQ0FBQztJQUNILENBQUM7SUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQW5CRCxvQ0FtQkM7QUFFRDs7Ozs7Ozs7Ozs7OztHQWFHO0FBQ0gsb0JBQTJCLFlBQWlCLEVBQUUsV0FBa0IsRUFBRSxNQUFzQjtJQUN0RixJQUFJLFlBQVksR0FBRyxFQUFFLENBQUM7SUFDdEIsR0FBRyxDQUFBLENBQUMsTUFBTSxJQUFJLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQztRQUM5QixNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLHdCQUFZLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdkQsR0FBRyxDQUFBLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDOUUsRUFBRSxDQUFBLENBQUMsSUFBSSxDQUFDLENBQUEsQ0FBQztnQkFDUCxZQUFZLENBQUMsSUFBSSxDQUFDO29CQUNoQixTQUFTLEVBQUcsSUFBSSxFQUFFLElBQUksRUFBRyxHQUFHO2lCQUM3QixDQUFDLENBQUM7WUFDTCxDQUFDO1lBQ0QsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLFVBQVUsRUFBRSxLQUFLLFdBQVUsR0FBRyxFQUFFLElBQUk7Z0JBQy9ELE1BQU0sSUFBSSxHQUFHLE1BQU0sS0FBSyxTQUFTO29CQUMvQixJQUFJLElBQUksRUFBRSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFFNUIsTUFBTSxJQUFJLEdBQUcsWUFBWSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQzdDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO2dCQUNuQyxFQUFFLENBQUEsQ0FBQyxRQUFRLENBQUMsQ0FBQSxDQUFDO29CQUNYLFFBQVEsQ0FBQyxHQUFHLEVBQUUsTUFBTSxNQUFNLENBQUMsQ0FBQTtnQkFDN0IsQ0FBQztnQkFBQSxJQUFJLENBQUEsQ0FBQztvQkFDSixFQUFFLENBQUEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO3dCQUNWLEdBQUcsQ0FBQyxJQUFJLEdBQUcsTUFBTSxNQUFNLENBQUM7b0JBQzFCLENBQUM7Z0JBQ0gsQ0FBQztnQkFDRCxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQ2hCLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztJQUNILENBQUM7SUFDRCxNQUFNLENBQUMsWUFBWSxDQUFDO0FBQ3RCLENBQUM7QUE1QkQsZ0NBNEJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICdyZWZsZWN0LW1ldGFkYXRhJztcbmltcG9ydCB7IFJPVVRFX1BSRUZJWCB9IGZyb20gJy4vY29uc3RhbnRzJztcblxuLyoqXG4gKiBHaXZlbiBhIGxpc3Qgb2YgcGFyYW1zLCBleGVjdXRlIGVhY2ggd2l0aCB0aGUgY29udGV4dC5cbiAqXG4gKiBAcGFyYW0gcGFyYW1zXG4gKiBAcGFyYW0gY3R4XG4gKiBAcGFyYW0gbmV4dFxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0QXJndW1lbnRzKHBhcmFtcywgY3R4LCBuZXh0KTogYW55W10ge1xuICBsZXQgYXJncyA9IFtjdHgsIG5leHRdO1xuXG4gIGlmKHBhcmFtcykge1xuICAgIGFyZ3MgPSBbXTtcblxuICAgIC8vIHNvcnQgYnkgaW5kZXhcbiAgICBwYXJhbXMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgcmV0dXJuIGEuaW5kZXggLSBiLmluZGV4O1xuICAgIH0pO1xuXG4gICAgZm9yKGNvbnN0IHBhcmFtIG9mIHBhcmFtcykge1xuICAgICAgbGV0IHJlc3VsdDtcbiAgICAgIGlmKHBhcmFtICE9PSB1bmRlZmluZWQpIHJlc3VsdCA9IHBhcmFtLmZuKGN0eCk7XG4gICAgICBhcmdzLnB1c2gocmVzdWx0KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYXJncztcbn1cblxuLyoqXG4gKiBCaW5kcyB0aGUgcm91dGVzIHRvIHRoZSByb3V0ZXJcbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqICAgIGNvbnN0IHJvdXRlciA9IG5ldyBSb3V0ZXIoKTtcbiAqICAgIGJpbmRSb3V0ZXMocm91dGVyLCBbUHJvZmlsZUNvbnRyb2xsZXJdKTtcbiAqXG4gKiBAZXhwb3J0XG4gKiBAcGFyYW0geyp9IHJvdXRlclJvdXRlc1xuICogQHBhcmFtIHthbnlbXX0gY29udHJvbGxlcnNcbiAqIEBwYXJhbSB7KGN0cmwpID0+IGFueX0gW2dldHRlcl1cbiAqIEByZXR1cm5zIHsqfVxuICovXG5leHBvcnQgZnVuY3Rpb24gYmluZFJvdXRlcyhyb3V0ZXJSb3V0ZXM6IGFueSwgY29udHJvbGxlcnM6IGFueVtdLCBnZXR0ZXI/OiAoY3RybCkgPT4gYW55KTogYW55IHtcbiAgdmFyIHJlYWN0Um91dGVycyA9IFtdO1xuICBmb3IoY29uc3QgY3RybCBvZiBjb250cm9sbGVycykge1xuICAgIGNvbnN0IHJvdXRlcyA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoUk9VVEVfUFJFRklYLCBjdHJsKTtcbiAgICBmb3IoY29uc3QgeyBtZXRob2QsIHVybCwgbWlkZGxld2FyZSwgbmFtZSwgcGFyYW1zLCB2aWV3LCByZXNwb25zZSB9IG9mIHJvdXRlcykge1xuICAgICAgaWYodmlldyl7XG4gICAgICAgIHJlYWN0Um91dGVycy5wdXNoKHtcbiAgICAgICAgICBjb21wb25lbnQgOiB2aWV3LCBwYXRoIDogdXJsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcm91dGVyUm91dGVzW21ldGhvZF0odXJsLCAuLi5taWRkbGV3YXJlLCBhc3luYyBmdW5jdGlvbihjdHgsIG5leHQpIHtcbiAgICAgICAgY29uc3QgaW5zdCA9IGdldHRlciA9PT0gdW5kZWZpbmVkID9cbiAgICAgICAgICBuZXcgY3RybCgpIDogZ2V0dGVyKGN0cmwpO1xuXG4gICAgICAgIGNvbnN0IGFyZ3MgPSBnZXRBcmd1bWVudHMocGFyYW1zLCBjdHgsIG5leHQpO1xuICAgICAgICBjb25zdCByZXN1bHQgPSBpbnN0W25hbWVdKC4uLmFyZ3MpO1xuICAgICAgICBpZihyZXNwb25zZSl7XG4gICAgICAgICAgcmVzcG9uc2UoY3R4LCBhd2FpdCByZXN1bHQpXG4gICAgICAgIH1lbHNle1xuICAgICAgICAgIGlmKHJlc3VsdCkge1xuICAgICAgICAgICAgY3R4LmJvZHkgPSBhd2FpdCByZXN1bHQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlYWN0Um91dGVycztcbn1cbiJdfQ==