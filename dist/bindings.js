"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var constants_1 = require("./constants");
/**
 * Given a list of params, execute each with the context.
 *
 * @param params
 * @param ctx
 * @param next
 */
function getArguments(params, ctx, next) {
    var args = [ctx, next];
    if (params) {
        args = [];
        // sort by index
        params.sort(function (a, b) {
            return a.index - b.index;
        });
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = params[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var param = _step.value;

                var result = void 0;
                if (param !== undefined) result = param.fn(ctx);
                args.push(result);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
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
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        var _loop = function _loop() {
            var ctrl = _step2.value;
            routes = Reflect.getMetadata(constants_1.ROUTE_PREFIX, ctrl);

            if (routes) {
                ctrl[constants_1.ROUTE_PREFIX] = routes;
            } else {
                routes = ctrl[constants_1.ROUTE_PREFIX];
            }
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                var _loop2 = function _loop2() {
                    var _ref = _step3.value;
                    var method = _ref.method,
                        url = _ref.url,
                        middleware = _ref.middleware,
                        name = _ref.name,
                        params = _ref.params,
                        view = _ref.view,
                        response = _ref.response;

                    if (view) {
                        reactRouters.push({
                            component: view, path: url
                        });
                    }
                    routerRoutes[method].apply(routerRoutes, [url].concat(_toConsumableArray(middleware), [function () {
                        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx, next) {
                            var inst, args, result;
                            return regeneratorRuntime.wrap(function _callee$(_context) {
                                while (1) {
                                    switch (_context.prev = _context.next) {
                                        case 0:
                                            inst = getter === undefined ? new ctrl() : getter(ctrl);
                                            args = getArguments(params, ctx, next);
                                            result = inst[name].apply(inst, _toConsumableArray(args));

                                            if (!response) {
                                                _context.next = 12;
                                                break;
                                            }

                                            _context.t0 = response;
                                            _context.t1 = ctx;
                                            _context.next = 8;
                                            return result;

                                        case 8:
                                            _context.t2 = _context.sent;
                                            (0, _context.t0)(_context.t1, _context.t2);
                                            _context.next = 16;
                                            break;

                                        case 12:
                                            if (!result) {
                                                _context.next = 16;
                                                break;
                                            }

                                            _context.next = 15;
                                            return result;

                                        case 15:
                                            ctx.body = _context.sent;

                                        case 16:
                                            return _context.abrupt("return", result);

                                        case 17:
                                        case "end":
                                            return _context.stop();
                                    }
                                }
                            }, _callee, this);
                        }));

                        return function (_x, _x2) {
                            return _ref2.apply(this, arguments);
                        };
                    }()]));
                };

                for (var _iterator3 = routes[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    _loop2();
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }
        };

        for (var _iterator2 = controllers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var routes;

            _loop();
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    return reactRouters;
}
exports.bindRoutes = bindRoutes;