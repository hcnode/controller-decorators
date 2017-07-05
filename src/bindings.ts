import 'reflect-metadata';
import { ROUTE_PREFIX } from './constants';

/**
 * Given a list of params, execute each with the context.
 *
 * @param params
 * @param ctx
 * @param next
 */
export function getArguments(params, ctx, next): any[] {
  let args = [ctx, next];

  if (params) {
    args = [];

    // sort by index
    params.sort((a, b) => {
      return a.index - b.index;
    });

    for (const param of params) {
      let result;
      if (param !== undefined) result = param.fn(ctx);
      args.push(result);
    }
  }

  return args;
}

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
export function bindRoutes(routerRoutes: any, controllers: any[], getter?: (ctrl) => any): any {
  var reactRouters = [];
  for (const ctrl of controllers) {
    var routes = Reflect.getMetadata(ROUTE_PREFIX, ctrl);
    if (routes) {
      ctrl[ROUTE_PREFIX] = routes;
    } else {
      routes = ctrl[ROUTE_PREFIX];
    }
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
          response(ctx, await result)
        } else {
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
