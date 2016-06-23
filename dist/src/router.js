require('rxjs/add/operator/map');
require('rxjs/add/operator/scan');
require('rxjs/add/operator/mergeMap');
require('rxjs/add/operator/concat');
require('rxjs/add/operator/concatMap');
require('rxjs/add/operator/every');
require('rxjs/add/operator/mergeAll');
require('rxjs/add/observable/from');
var core_1 = require('@angular/core');
var Observable_1 = require('rxjs/Observable');
var Subject_1 = require('rxjs/Subject');
var of_1 = require('rxjs/observable/of');
var apply_redirects_1 = require('./apply_redirects');
var config_1 = require('./config');
var create_router_state_1 = require('./create_router_state');
var create_url_tree_1 = require('./create_url_tree');
var recognize_1 = require('./recognize');
var resolve_1 = require('./resolve');
var router_outlet_map_1 = require('./router_outlet_map');
var router_state_1 = require('./router_state');
var shared_1 = require('./shared');
var url_tree_1 = require('./url_tree');
var collection_1 = require('./utils/collection');
var NavigationStart = (function () {
    function NavigationStart(id, url) {
        this.id = id;
        this.url = url;
    }
    NavigationStart.prototype.toString = function () { return "NavigationStart(id: " + this.id + ", url: '" + this.url + "')"; };
    return NavigationStart;
})();
exports.NavigationStart = NavigationStart;
var NavigationEnd = (function () {
    function NavigationEnd(id, url, urlAfterRedirects) {
        this.id = id;
        this.url = url;
        this.urlAfterRedirects = urlAfterRedirects;
    }
    NavigationEnd.prototype.toString = function () {
        return "NavigationEnd(id: " + this.id + ", url: '" + this.url + "', urlAfterRedirects: '" + this.urlAfterRedirects + "')";
    };
    return NavigationEnd;
})();
exports.NavigationEnd = NavigationEnd;
var NavigationCancel = (function () {
    function NavigationCancel(id, url) {
        this.id = id;
        this.url = url;
    }
    NavigationCancel.prototype.toString = function () { return "NavigationCancel(id: " + this.id + ", url: '" + this.url + "')"; };
    return NavigationCancel;
})();
exports.NavigationCancel = NavigationCancel;
var NavigationError = (function () {
    function NavigationError(id, url, error) {
        this.id = id;
        this.url = url;
        this.error = error;
    }
    NavigationError.prototype.toString = function () {
        return "NavigationError(id: " + this.id + ", url: '" + this.url + "', error: " + this.error + ")";
    };
    return NavigationError;
})();
exports.NavigationError = NavigationError;
var RoutesRecognized = (function () {
    function RoutesRecognized(id, url, urlAfterRedirects, state) {
        this.id = id;
        this.url = url;
        this.urlAfterRedirects = urlAfterRedirects;
        this.state = state;
    }
    RoutesRecognized.prototype.toString = function () {
        return "RoutesRecognized(id: " + this.id + ", url: '" + this.url + "', urlAfterRedirects: '" + this.urlAfterRedirects + "', state: " + this.state + ")";
    };
    return RoutesRecognized;
})();
exports.RoutesRecognized = RoutesRecognized;
var Router = (function () {
    function Router(rootComponentType, resolver, urlSerializer, outletMap, location, injector, config) {
        this.rootComponentType = rootComponentType;
        this.resolver = resolver;
        this.urlSerializer = urlSerializer;
        this.outletMap = outletMap;
        this.location = location;
        this.injector = injector;
        this.navigationId = 0;
        this.resetConfig(config);
        this.routerEvents = new Subject_1.Subject();
        this.currentUrlTree = url_tree_1.createEmptyUrlTree();
        this.currentRouterState = router_state_1.createEmptyState(this.currentUrlTree, this.rootComponentType);
    }
    Router.prototype.initialNavigation = function () {
        this.setUpLocationChangeListener();
        this.navigateByUrl(this.location.path());
    };
    Object.defineProperty(Router.prototype, "routerState", {
        get: function () { return this.currentRouterState; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Router.prototype, "url", {
        get: function () { return this.serializeUrl(this.currentUrlTree); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Router.prototype, "events", {
        get: function () { return this.routerEvents; },
        enumerable: true,
        configurable: true
    });
    Router.prototype.resetConfig = function (config) {
        config_1.validateConfig(config);
        this.config = config;
    };
    Router.prototype.dispose = function () { this.locationSubscription.unsubscribe(); };
    Router.prototype.createUrlTree = function (commands, _a) {
        var _b = _a === void 0 ? {} : _a, relativeTo = _b.relativeTo, queryParams = _b.queryParams, fragment = _b.fragment;
        var a = relativeTo ? relativeTo : this.routerState.root;
        return create_url_tree_1.createUrlTree(a, this.currentUrlTree, commands, queryParams, fragment);
    };
    Router.prototype.navigateByUrl = function (url) {
        if (url instanceof url_tree_1.UrlTree) {
            return this.scheduleNavigation(url, false);
        }
        else {
            var urlTree = this.urlSerializer.parse(url);
            return this.scheduleNavigation(urlTree, false);
        }
    };
    Router.prototype.navigate = function (commands, extras) {
        if (extras === void 0) { extras = {}; }
        return this.scheduleNavigation(this.createUrlTree(commands, extras), false);
    };
    Router.prototype.serializeUrl = function (url) { return this.urlSerializer.serialize(url); };
    Router.prototype.parseUrl = function (url) { return this.urlSerializer.parse(url); };
    Router.prototype.scheduleNavigation = function (url, preventPushState) {
        var _this = this;
        var id = ++this.navigationId;
        this.routerEvents.next(new NavigationStart(id, this.serializeUrl(url)));
        return Promise.resolve().then(function (_) { return _this.runNavigate(url, preventPushState, id); });
    };
    Router.prototype.setUpLocationChangeListener = function () {
        var _this = this;
        this.locationSubscription = this.location.subscribe(function (change) {
            return _this.scheduleNavigation(_this.urlSerializer.parse(change['url']), change['pop']);
        });
    };
    Router.prototype.runNavigate = function (url, preventPushState, id) {
        var _this = this;
        if (id !== this.navigationId) {
            this.location.go(this.urlSerializer.serialize(this.currentUrlTree));
            this.routerEvents.next(new NavigationCancel(id, this.serializeUrl(url)));
            return Promise.resolve(false);
        }
        return new Promise(function (resolvePromise, rejectPromise) {
            var updatedUrl;
            var state;
            apply_redirects_1.applyRedirects(url, _this.config)
                .mergeMap(function (u) {
                updatedUrl = u;
                return recognize_1.recognize(_this.rootComponentType, _this.config, updatedUrl, _this.serializeUrl(updatedUrl));
            })
                .mergeMap(function (newRouterStateSnapshot) {
                _this.routerEvents.next(new RoutesRecognized(id, _this.serializeUrl(url), _this.serializeUrl(updatedUrl), newRouterStateSnapshot));
                return resolve_1.resolve(_this.resolver, newRouterStateSnapshot);
            })
                .map(function (routerStateSnapshot) {
                return create_router_state_1.createRouterState(routerStateSnapshot, _this.currentRouterState);
            })
                .map(function (newState) {
                state = newState;
            })
                .mergeMap(function (_) {
                return new GuardChecks(state.snapshot, _this.currentRouterState.snapshot, _this.injector)
                    .check(_this.outletMap);
            })
                .forEach(function (shouldActivate) {
                if (!shouldActivate || id !== _this.navigationId) {
                    _this.routerEvents.next(new NavigationCancel(id, _this.serializeUrl(url)));
                    return Promise.resolve(false);
                }
                new ActivateRoutes(state, _this.currentRouterState).activate(_this.outletMap);
                _this.currentUrlTree = updatedUrl;
                _this.currentRouterState = state;
                if (!preventPushState) {
                    var path = _this.urlSerializer.serialize(updatedUrl);
                    if (_this.location.isCurrentPathEqualTo(path)) {
                        _this.location.replaceState(path);
                    }
                    else {
                        _this.location.go(path);
                    }
                }
                return Promise.resolve(true);
            })
                .then(function () {
                _this.routerEvents.next(new NavigationEnd(id, _this.serializeUrl(url), _this.serializeUrl(updatedUrl)));
                resolvePromise(true);
            }, function (e) {
                _this.routerEvents.next(new NavigationError(id, _this.serializeUrl(url), e));
                rejectPromise(e);
            });
        });
    };
    return Router;
})();
exports.Router = Router;
var CanActivate = (function () {
    function CanActivate(route) {
        this.route = route;
    }
    return CanActivate;
})();
var CanDeactivate = (function () {
    function CanDeactivate(component, route) {
        this.component = component;
        this.route = route;
    }
    return CanDeactivate;
})();
var GuardChecks = (function () {
    function GuardChecks(future, curr, injector) {
        this.future = future;
        this.curr = curr;
        this.injector = injector;
        this.checks = [];
    }
    GuardChecks.prototype.check = function (parentOutletMap) {
        var _this = this;
        var futureRoot = this.future._root;
        var currRoot = this.curr ? this.curr._root : null;
        this.traverseChildRoutes(futureRoot, currRoot, parentOutletMap);
        if (this.checks.length === 0)
            return of_1.of(true);
        return Observable_1.Observable.from(this.checks)
            .map(function (s) {
            if (s instanceof CanActivate) {
                return _this.runCanActivate(s.route);
            }
            else if (s instanceof CanDeactivate) {
                return _this.runCanDeactivate(s.component, s.route);
            }
            else {
                throw new Error('Cannot be reached');
            }
        })
            .mergeAll()
            .every(function (result) { return result === true; });
    };
    GuardChecks.prototype.traverseChildRoutes = function (futureNode, currNode, outletMap) {
        var _this = this;
        var prevChildren = nodeChildrenAsMap(currNode);
        futureNode.children.forEach(function (c) {
            _this.traverseRoutes(c, prevChildren[c.value.outlet], outletMap);
            delete prevChildren[c.value.outlet];
        });
        collection_1.forEach(prevChildren, function (v, k) { return _this.deactivateOutletAndItChildren(v, outletMap._outlets[k]); });
    };
    GuardChecks.prototype.traverseRoutes = function (futureNode, currNode, parentOutletMap) {
        var future = futureNode.value;
        var curr = currNode ? currNode.value : null;
        var outlet = parentOutletMap ? parentOutletMap._outlets[futureNode.value.outlet] : null;
        if (curr && future._routeConfig === curr._routeConfig) {
            if (!collection_1.shallowEqual(future.params, curr.params)) {
                this.checks.push(new CanDeactivate(outlet.component, curr), new CanActivate(future));
            }
            if (future.component) {
                this.traverseChildRoutes(futureNode, currNode, outlet ? outlet.outletMap : null);
            }
            else {
                this.traverseChildRoutes(futureNode, currNode, parentOutletMap);
            }
        }
        else {
            if (curr) {
                if (curr.component) {
                    this.deactivateOutletAndItChildren(curr, outlet);
                }
                else {
                    this.deactivateOutletMap(parentOutletMap);
                }
            }
            this.checks.push(new CanActivate(future));
            if (future.component) {
                this.traverseChildRoutes(futureNode, null, outlet ? outlet.outletMap : null);
            }
            else {
                this.traverseChildRoutes(futureNode, null, parentOutletMap);
            }
        }
    };
    GuardChecks.prototype.deactivateOutletAndItChildren = function (route, outlet) {
        if (outlet && outlet.isActivated) {
            this.deactivateOutletMap(outlet.outletMap);
            this.checks.push(new CanDeactivate(outlet.component, route));
        }
    };
    GuardChecks.prototype.deactivateOutletMap = function (outletMap) {
        var _this = this;
        collection_1.forEach(outletMap._outlets, function (v) {
            if (v.isActivated) {
                _this.deactivateOutletAndItChildren(v.activatedRoute.snapshot, v);
            }
        });
    };
    GuardChecks.prototype.runCanActivate = function (future) {
        var _this = this;
        var canActivate = future._routeConfig ? future._routeConfig.canActivate : null;
        if (!canActivate || canActivate.length === 0)
            return of_1.of(true);
        return Observable_1.Observable.from(canActivate)
            .map(function (c) {
            var guard = _this.injector.get(c);
            if (guard.canActivate) {
                return wrapIntoObservable(guard.canActivate(future, _this.future));
            }
            else {
                return wrapIntoObservable(guard(future, _this.future));
            }
        })
            .mergeAll()
            .every(function (result) { return result === true; });
    };
    GuardChecks.prototype.runCanDeactivate = function (component, curr) {
        var _this = this;
        var canDeactivate = curr ? (curr._routeConfig ? curr._routeConfig.canDeactivate : null) : null;
        if (!canDeactivate || canDeactivate.length === 0)
            return of_1.of(true);
        return Observable_1.Observable.from(canDeactivate)
            .map(function (c) {
            var guard = _this.injector.get(c);
            if (guard.canDeactivate) {
                return wrapIntoObservable(guard.canDeactivate(component, curr, _this.curr));
            }
            else {
                return wrapIntoObservable(guard(component, curr, _this.curr));
            }
        })
            .mergeAll()
            .every(function (result) { return result === true; });
    };
    return GuardChecks;
})();
function wrapIntoObservable(value) {
    if (value instanceof Observable_1.Observable) {
        return value;
    }
    else {
        return of_1.of(value);
    }
}
var ActivateRoutes = (function () {
    function ActivateRoutes(futureState, currState) {
        this.futureState = futureState;
        this.currState = currState;
    }
    ActivateRoutes.prototype.activate = function (parentOutletMap) {
        var futureRoot = this.futureState._root;
        var currRoot = this.currState ? this.currState._root : null;
        pushQueryParamsAndFragment(this.futureState);
        this.activateChildRoutes(futureRoot, currRoot, parentOutletMap);
    };
    ActivateRoutes.prototype.activateChildRoutes = function (futureNode, currNode, outletMap) {
        var _this = this;
        var prevChildren = nodeChildrenAsMap(currNode);
        futureNode.children.forEach(function (c) {
            _this.activateRoutes(c, prevChildren[c.value.outlet], outletMap);
            delete prevChildren[c.value.outlet];
        });
        collection_1.forEach(prevChildren, function (v, k) { return _this.deactivateOutletAndItChildren(outletMap._outlets[k]); });
    };
    ActivateRoutes.prototype.activateRoutes = function (futureNode, currNode, parentOutletMap) {
        var future = futureNode.value;
        var curr = currNode ? currNode.value : null;
        if (future === curr) {
            router_state_1.advanceActivatedRoute(future);
            if (future.component) {
                var outlet = getOutlet(parentOutletMap, futureNode.value);
                this.activateChildRoutes(futureNode, currNode, outlet.outletMap);
            }
            else {
                this.activateChildRoutes(futureNode, currNode, parentOutletMap);
            }
        }
        else {
            if (curr) {
                if (curr.component) {
                    var outlet = getOutlet(parentOutletMap, futureNode.value);
                    this.deactivateOutletAndItChildren(outlet);
                }
                else {
                    this.deactivateOutletMap(parentOutletMap);
                }
            }
            if (future.component) {
                router_state_1.advanceActivatedRoute(future);
                var outlet = getOutlet(parentOutletMap, futureNode.value);
                var outletMap = new router_outlet_map_1.RouterOutletMap();
                this.placeComponentIntoOutlet(outletMap, future, outlet);
                this.activateChildRoutes(futureNode, null, outletMap);
            }
            else {
                router_state_1.advanceActivatedRoute(future);
                this.activateChildRoutes(futureNode, null, parentOutletMap);
            }
        }
    };
    ActivateRoutes.prototype.placeComponentIntoOutlet = function (outletMap, future, outlet) {
        var resolved = core_1.ReflectiveInjector.resolve([
            { provide: router_state_1.ActivatedRoute, useValue: future },
            { provide: router_outlet_map_1.RouterOutletMap, useValue: outletMap }
        ]);
        outlet.activate(future._futureSnapshot._resolvedComponentFactory, future, resolved, outletMap);
    };
    ActivateRoutes.prototype.deactivateOutletAndItChildren = function (outlet) {
        if (outlet && outlet.isActivated) {
            this.deactivateOutletMap(outlet.outletMap);
            outlet.deactivate();
        }
    };
    ActivateRoutes.prototype.deactivateOutletMap = function (outletMap) {
        var _this = this;
        collection_1.forEach(outletMap._outlets, function (v) { return _this.deactivateOutletAndItChildren(v); });
    };
    return ActivateRoutes;
})();
function pushQueryParamsAndFragment(state) {
    if (!collection_1.shallowEqual(state.snapshot.queryParams, state.queryParams.value)) {
        state.queryParams.next(state.snapshot.queryParams);
    }
    if (state.snapshot.fragment !== state.fragment.value) {
        state.fragment.next(state.snapshot.fragment);
    }
}
function nodeChildrenAsMap(node) {
    return node ? node.children.reduce(function (m, c) {
        m[c.value.outlet] = c;
        return m;
    }, {}) : {};
}
function getOutlet(outletMap, route) {
    var outlet = outletMap._outlets[route.outlet];
    if (!outlet) {
        var componentName = route.component.name;
        if (route.outlet === shared_1.PRIMARY_OUTLET) {
            throw new Error("Cannot find primary outlet to load '" + componentName + "'");
        }
        else {
            throw new Error("Cannot find the outlet " + route.outlet + " to load '" + componentName + "'");
        }
    }
    return outlet;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JvdXRlci50cyJdLCJuYW1lcyI6WyJOYXZpZ2F0aW9uU3RhcnQiLCJOYXZpZ2F0aW9uU3RhcnQuY29uc3RydWN0b3IiLCJOYXZpZ2F0aW9uU3RhcnQudG9TdHJpbmciLCJOYXZpZ2F0aW9uRW5kIiwiTmF2aWdhdGlvbkVuZC5jb25zdHJ1Y3RvciIsIk5hdmlnYXRpb25FbmQudG9TdHJpbmciLCJOYXZpZ2F0aW9uQ2FuY2VsIiwiTmF2aWdhdGlvbkNhbmNlbC5jb25zdHJ1Y3RvciIsIk5hdmlnYXRpb25DYW5jZWwudG9TdHJpbmciLCJOYXZpZ2F0aW9uRXJyb3IiLCJOYXZpZ2F0aW9uRXJyb3IuY29uc3RydWN0b3IiLCJOYXZpZ2F0aW9uRXJyb3IudG9TdHJpbmciLCJSb3V0ZXNSZWNvZ25pemVkIiwiUm91dGVzUmVjb2duaXplZC5jb25zdHJ1Y3RvciIsIlJvdXRlc1JlY29nbml6ZWQudG9TdHJpbmciLCJSb3V0ZXIiLCJSb3V0ZXIuY29uc3RydWN0b3IiLCJSb3V0ZXIuaW5pdGlhbE5hdmlnYXRpb24iLCJSb3V0ZXIucm91dGVyU3RhdGUiLCJSb3V0ZXIudXJsIiwiUm91dGVyLmV2ZW50cyIsIlJvdXRlci5yZXNldENvbmZpZyIsIlJvdXRlci5kaXNwb3NlIiwiUm91dGVyLmNyZWF0ZVVybFRyZWUiLCJSb3V0ZXIubmF2aWdhdGVCeVVybCIsIlJvdXRlci5uYXZpZ2F0ZSIsIlJvdXRlci5zZXJpYWxpemVVcmwiLCJSb3V0ZXIucGFyc2VVcmwiLCJSb3V0ZXIuc2NoZWR1bGVOYXZpZ2F0aW9uIiwiUm91dGVyLnNldFVwTG9jYXRpb25DaGFuZ2VMaXN0ZW5lciIsIlJvdXRlci5ydW5OYXZpZ2F0ZSIsIkNhbkFjdGl2YXRlIiwiQ2FuQWN0aXZhdGUuY29uc3RydWN0b3IiLCJDYW5EZWFjdGl2YXRlIiwiQ2FuRGVhY3RpdmF0ZS5jb25zdHJ1Y3RvciIsIkd1YXJkQ2hlY2tzIiwiR3VhcmRDaGVja3MuY29uc3RydWN0b3IiLCJHdWFyZENoZWNrcy5jaGVjayIsIkd1YXJkQ2hlY2tzLnRyYXZlcnNlQ2hpbGRSb3V0ZXMiLCJHdWFyZENoZWNrcy50cmF2ZXJzZVJvdXRlcyIsIkd1YXJkQ2hlY2tzLmRlYWN0aXZhdGVPdXRsZXRBbmRJdENoaWxkcmVuIiwiR3VhcmRDaGVja3MuZGVhY3RpdmF0ZU91dGxldE1hcCIsIkd1YXJkQ2hlY2tzLnJ1bkNhbkFjdGl2YXRlIiwiR3VhcmRDaGVja3MucnVuQ2FuRGVhY3RpdmF0ZSIsIndyYXBJbnRvT2JzZXJ2YWJsZSIsIkFjdGl2YXRlUm91dGVzIiwiQWN0aXZhdGVSb3V0ZXMuY29uc3RydWN0b3IiLCJBY3RpdmF0ZVJvdXRlcy5hY3RpdmF0ZSIsIkFjdGl2YXRlUm91dGVzLmFjdGl2YXRlQ2hpbGRSb3V0ZXMiLCJBY3RpdmF0ZVJvdXRlcy5hY3RpdmF0ZVJvdXRlcyIsIkFjdGl2YXRlUm91dGVzLnBsYWNlQ29tcG9uZW50SW50b091dGxldCIsIkFjdGl2YXRlUm91dGVzLmRlYWN0aXZhdGVPdXRsZXRBbmRJdENoaWxkcmVuIiwiQWN0aXZhdGVSb3V0ZXMuZGVhY3RpdmF0ZU91dGxldE1hcCIsInB1c2hRdWVyeVBhcmFtc0FuZEZyYWdtZW50Iiwibm9kZUNoaWxkcmVuQXNNYXAiLCJnZXRPdXRsZXQiXSwibWFwcGluZ3MiOiJBQUFBLFFBQU8sdUJBQXVCLENBQUMsQ0FBQTtBQUMvQixRQUFPLHdCQUF3QixDQUFDLENBQUE7QUFDaEMsUUFBTyw0QkFBNEIsQ0FBQyxDQUFBO0FBQ3BDLFFBQU8sMEJBQTBCLENBQUMsQ0FBQTtBQUNsQyxRQUFPLDZCQUE2QixDQUFDLENBQUE7QUFDckMsUUFBTyx5QkFBeUIsQ0FBQyxDQUFBO0FBQ2pDLFFBQU8sNEJBQTRCLENBQUMsQ0FBQTtBQUNwQyxRQUFPLDBCQUEwQixDQUFDLENBQUE7QUFHbEMscUJBQW9FLGVBQWUsQ0FBQyxDQUFBO0FBQ3BGLDJCQUF5QixpQkFBaUIsQ0FBQyxDQUFBO0FBQzNDLHdCQUFz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QSxJQUFJQSxNQUFNQSxDQUFDQSxZQUFZQSxLQUFLQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUN0REEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EseUJBQVlBLENBQUNBLE1BQU1BLENBQUNBLE1BQU1BLEVBQUVBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUM5Q0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsYUFBYUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsU0FBU0EsRUFBRUEsSUFBSUEsQ0FBQ0EsRUFBRUEsSUFBSUEsV0FBV0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDdkZBLENBQUNBO1lBSURBLEVBQUVBLENBQUNBLENBQUNBLE1BQU1BLENBQUNBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBO2dCQUNyQkEsSUFBSUEsQ0FBQ0EsbUJBQW1CQSxDQUFDQSxVQUFVQSxFQUFFQSxRQUFRQSxFQUFFQSxNQUFNQSxHQUFHQSxNQUFNQSxDQUFDQSxTQUFTQSxHQUFHQSxJQUFJQSxDQUFDQSxDQUFDQTtZQUNuRkEsQ0FBQ0E7WUFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ05BLElBQUlBLENBQUNBLG1CQUFtQkEsQ0FBQ0EsVUFBVUEsRUFBRUEsUUFBUUEsRUFBRUEsZUFBZUEsQ0FBQ0EsQ0FBQ0E7WUFDbEVBLENBQUNBO1FBQ0hBLENBQUNBO1FBQUNBLElBQUlBLENBQUNBLENBQUNBO1lBRU5BLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO2dCQUNUQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDbkJBLElBQUlBLENBQUNBLDZCQUE2QkEsQ0FBQ0EsSUFBSUEsRUFBRUEsTUFBTUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ25EQSxDQUFDQTtnQkFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7b0JBQ05BLElBQUlBLENBQUNB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Q0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3JCQSxJQUFNQSxNQUFNQSxHQUFHQSxTQUFTQSxDQUFDQSxlQUFlQSxFQUFFQSxVQUFVQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtnQkFDNURBLElBQUlBLENBQUNBLG1CQUFtQkEsQ0FBQ0EsVUFBVUEsRUFBRUEsUUFBUUEsRUFBRUEsTUFBTUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0E7WUFDbkVBLENBQUNBO1lBQUNBLElBQUlBLENBQUNBLENBQUNBO2dCQUNOQSxJQUFJQSxDQUFDQSxtQkFBbUJBLENBQUNBLFVBQVVBLEVBQUVBLFFBQVFBLEVBQUVBLGVBQWVBLENBQUNBLENBQUNBO1lBQ2xFQSxDQUFDQTtRQUNIQSxDQUFDQTtRQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtZQUVOQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDVEEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ25CQSxJQUFNQSxNQUFNQSxHQUFHQSxTQUFTQSxDQUFDQSxlQUFlQSxFQUFFQSxVQUFVQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtvQkFDNURBLElBQUlBLENBQUNBLDZCQUE2QkEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7Z0JBQzdDQSxDQUFDQTtnQkFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7b0JBQ05BLElBQUlBLENBQUNBLG1CQUFtQkEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsQ0FBQ0E7Z0JBQzVDQSxDQUFDQTtZQUNIQSxDQUFDQTtZQUtEQSxFQUFFQSxDQUFDQSxDQUFDQSxNQUFNQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFFckJBLG9DQUFxQkEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7Z0JBQzlCQSxJQUFNQSxNQUFNQSxHQUFHQSxTQUFTQSxDQUFDQSxlQUFlQSxFQUFFQSxVQUFVQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtnQkFDNURB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QkE7UUFDMURBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1FBQ3RCQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTtJQUNYQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQTtBQUNkQSxDQUFDQTtBQUVELG1CQUFtQixTQUEwQixFQUFFLEtBQXFCO0lBQ2xFQyxJQUFJQSxNQUFNQSxHQUFHQSxTQUFTQSxDQUFDQSxRQUFRQSxDQUFDQSxLQUFLQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTtJQUM5Q0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDWkEsSUFBTUEsYUFBYUEsR0FBU0EsS0FBS0EsQ0FBQ0EsU0FBVUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7UUFDbERBLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLEtBQUtBLHVCQUFjQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNwQ0EsTUFBTUEsSUFBSUEsS0FBS0EsQ0FBQ0EseUNBQXVDQSxhQUFhQSxNQUFHQSxDQUFDQSxDQUFDQTtRQUMzRUEsQ0FBQ0E7UUFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDTkEsTUFBTUEsSUFBSUEsS0FBS0EsQ0FBQ0EsNEJBQTBCQSxLQUFLQSxDQUFDQSxNQUFNQSxrQkFBYUEsYUFBYUEsTUFBR0EsQ0FBQ0EsQ0FBQ0E7UUFDdkZBLENBQUNBO0lBQ0hBLENBQUNBO0lBQ0RBLE1BQU1BLENBQUNBLE1BQU1BLENBQUNBO0FBQ2hCQSxDQUFDQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAncnhqcy9hZGQvb3BlcmF0b3IvbWFwJztcclxuaW1wb3J0ICdyeGpzL2FkZC9vcGVyYXRvci9zY2FuJztcclxuaW1wb3J0ICdyeGpzL2FkZC9vcGVyYXRvci9tZXJnZU1hcCc7XHJcbmltcG9ydCAncnhqcy9hZGQvb3BlcmF0b3IvY29uY2F0JztcclxuaW1wb3J0ICdyeGpzL2FkZC9vcGVyYXRvci9jb25jYXRNYXAnO1xyXG5pbXBvcnQgJ3J4anMvYWRkL29wZXJhdG9yL2V2ZXJ5JztcclxuaW1wb3J0ICdyeGpzL2FkZC9vcGVyYXRvci9tZXJnZUFsbCc7XHJcbmltcG9ydCAncnhqcy9hZGQvb2JzZXJ2YWJsZS9mcm9tJztcclxuXHJcbmltcG9ydCB7TG9jYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7Q29tcG9uZW50UmVzb2x2ZXIsIEluamVjdG9yLCBSZWZsZWN0aXZlSW5qZWN0b3IsIFR5cGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMvT2JzZXJ2YWJsZSc7XHJcbmltcG9ydCB7U3ViamVjdH0gZnJvbSAncnhqcy9TdWJqZWN0JztcclxuaW1wb3J0IHtTdWJzY3JpcHRpb259IGZyb20gJ3J4anMvU3Vic2NyaXB0aW9uJztcclxuaW1wb3J0IHtvZiB9IGZyb20gJ3J4anMvb2JzZXJ2YWJsZS9vZic7XHJcblxyXG5pbXBvcnQge2FwcGx5UmVkaXJlY3RzfSBmcm9tICcuL2FwcGx5X3JlZGlyZWN0cyc7XHJcbmltcG9ydCB7Um91dGVyQ29uZmlnLCB2YWxpZGF0ZUNvbmZpZ30gZnJvbSAnLi9jb25maWcnO1xyXG5pbXBvcnQge2NyZWF0ZVJvdXRlclN0YXRlfSBmcm9tICcuL2NyZWF0ZV9yb3V0ZXJfc3RhdGUnO1xyXG5pbXBvcnQge2NyZWF0ZVVybFRyZWV9IGZyb20gJy4vY3JlYXRlX3VybF90cmVlJztcclxuaW1wb3J0IHtSb3V0ZXJPdXRsZXR9IGZyb20gJy4vZGlyZWN0aXZlcy9yb3V0ZXJfb3V0bGV0JztcclxuaW1wb3J0IHtyZWNvZ25pemV9IGZyb20gJy4vcmVjb2duaXplJztcclxuaW1wb3J0IHtyZXNvbHZlfSBmcm9tICcuL3Jlc29sdmUnO1xyXG5pbXBvcnQge1JvdXRlck91dGxldE1hcH0gZnJvbSAnLi9yb3V0ZXJfb3V0bGV0X21hcCc7XHJcbmltcG9ydCB7QWN0aXZhdGVkUm91dGUsIEFjdGl2YXRlZFJvdXRlU25hcHNob3QsIFJvdXRlclN0YXRlLCBSb3V0ZXJTdGF0ZVNuYXBzaG90LCBhZHZhbmNlQWN0aXZhdGVkUm91dGUsIGNyZWF0ZUVtcHR5U3RhdGV9IGZyb20gJy4vcm91dGVyX3N0YXRlJztcclxuaW1wb3J0IHtQUklNQVJZX09VVExFVCwgUGFyYW1zfSBmcm9tICcuL3NoYXJlZCc7XHJcbmltcG9ydCB7VXJsU2VyaWFsaXplcn0gZnJvbSAnLi91cmxfc2VyaWFsaXplcic7XHJcbmltcG9ydCB7VXJsVHJlZSwgY3JlYXRlRW1wdHlVcmxUcmVlfSBmcm9tICcuL3VybF90cmVlJztcclxuaW1wb3J0IHtmb3JFYWNoLCBzaGFsbG93RXF1YWx9IGZyb20gJy4vdXRpbHMvY29sbGVjdGlvbic7XHJcbmltcG9ydCB7VHJlZU5vZGV9IGZyb20gJy4vdXRpbHMvdHJlZSc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIE5hdmlnYXRpb25FeHRyYXMge1xyXG4gIHJlbGF0aXZlVG8/OiBBY3RpdmF0ZWRSb3V0ZTtcclxuICBxdWVyeVBhcmFtcz86IFBhcmFtcztcclxuICBmcmFnbWVudD86IHN0cmluZztcclxufVxyXG5cclxuLyoqXHJcbiAqIEFuIGV2ZW50IHRyaWdnZXJlZCB3aGVuIGEgbmF2aWdhdGlvbiBzdGFydHNcclxuICovXHJcbmV4cG9ydCBjbGFzcyBOYXZpZ2F0aW9uU3RhcnQge1xyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBpZDogbnVtYmVyLCBwdWJsaWMgdXJsOiBzdHJpbmcpIHt9XHJcblxyXG4gIHRvU3RyaW5nKCk6IHN0cmluZyB7IHJldHVybiBgTmF2aWdhdGlvblN0YXJ0KGlkOiAke3RoaXMuaWR9LCB1cmw6ICcke3RoaXMudXJsfScpYDsgfVxyXG59XHJcblxyXG4vKipcclxuICogQW4gZXZlbnQgdHJpZ2dlcmVkIHdoZW4gYSBuYXZpZ2F0aW9uIGVuZHMgc3VjY2Vzc2Z1bGx5XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgTmF2aWdhdGlvbkVuZCB7XHJcbiAgY29uc3RydWN0b3IocHVibGljIGlkOiBudW1iZXIsIHB1YmxpYyB1cmw6IHN0cmluZywgcHVibGljIHVybEFmdGVyUmVkaXJlY3RzOiBzdHJpbmcpIHt9XHJcblxyXG4gIHRvU3RyaW5nKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gYE5hdmlnYXRpb25FbmQoaWQ6ICR7dGhpcy5pZH0sIHVybDogJyR7dGhpcy51cmx9JywgdXJsQWZ0ZXJSZWRpcmVjdHM6ICcke3RoaXMudXJsQWZ0ZXJSZWRpcmVjdHN9JylgO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEFuIGV2ZW50IHRyaWdnZXJlZCB3aGVuIGEgbmF2aWdhdGlvbiBpcyBjYW5jZWxlZFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIE5hdmlnYXRpb25DYW5jZWwge1xyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBpZDogbnVtYmVyLCBwdWJsaWMgdXJsOiBzdHJpbmcpIHt9XHJcblxyXG4gIHRvU3RyaW5nKCk6IHN0cmluZyB7IHJldHVybiBgTmF2aWdhdGlvbkNhbmNlbChpZDogJHt0aGlzLmlkfSwgdXJsOiAnJHt0aGlzLnVybH0nKWA7IH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEFuIGV2ZW50IHRyaWdnZXJlZCB3aGVuIGEgbmF2aWdhdGlvbiBmYWlscyBkdWUgdG8gdW5leHBlY3RlZCBlcnJvclxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIE5hdmlnYXRpb25FcnJvciB7XHJcbiAgY29uc3RydWN0b3IocHVibGljIGlkOiBudW1iZXIsIHB1YmxpYyB1cmw6IHN0cmluZywgcHVibGljIGVycm9yOiBhbnkpIHt9XHJcblxyXG4gIHRvU3RyaW5nKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gYE5hdmlnYXRpb25FcnJvcihpZDogJHt0aGlzLmlkfSwgdXJsOiAnJHt0aGlzLnVybH0nLCBlcnJvcjogJHt0aGlzLmVycm9yfSlgO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEFuIGV2ZW50IHRyaWdnZXJlZCB3aGVuIHJvdXRlcyBhcmUgcmVjb2duaXplZFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFJvdXRlc1JlY29nbml6ZWQge1xyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgICBwdWJsaWMgaWQ6IG51bWJlciwgcHVibGljIHVybDogc3RyaW5nLCBwdWJsaWMgdXJsQWZ0ZXJSZWRpcmVjdHM6IHN0cmluZyxcclxuICAgICAgcHVibGljIHN0YXRlOiBSb3V0ZXJTdGF0ZVNuYXBzaG90KSB7fVxyXG5cclxuICB0b1N0cmluZygpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIGBSb3V0ZXNSZWNvZ25pemVkKGlkOiAke3RoaXMuaWR9LCB1cmw6ICcke3RoaXMudXJsfScsIHVybEFmdGVyUmVkaXJlY3RzOiAnJHt0aGlzLnVybEFmdGVyUmVkaXJlY3RzfScsIHN0YXRlOiAke3RoaXMuc3RhdGV9KWA7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgdHlwZSBFdmVudCA9IE5hdmlnYXRpb25TdGFydCB8IE5hdmlnYXRpb25FbmQgfCBOYXZpZ2F0aW9uQ2FuY2VsIHwgTmF2aWdhdGlvbkVycm9yO1xyXG5cclxuLyoqXHJcbiAqIFRoZSBgUm91dGVyYCBpcyByZXNwb25zaWJsZSBmb3IgbWFwcGluZyBVUkxzIHRvIGNvbXBvbmVudHMuXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgUm91dGVyIHtcclxuICBwcml2YXRlIGN1cnJlbnRVcmxUcmVlOiBVcmxUcmVlO1xyXG4gIHByaXZhdGUgY3VycmVudFJvdXRlclN0YXRlOiBSb3V0ZXJTdGF0ZTtcclxuICBwcml2YXRlIGxvY2F0aW9uU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XHJcbiAgcHJpdmF0ZSByb3V0ZXJFdmVudHM6IFN1YmplY3Q8RXZlbnQ+O1xyXG4gIHByaXZhdGUgbmF2aWdhdGlvbklkOiBudW1iZXIgPSAwO1xyXG4gIHByaXZhdGUgY29uZmlnOiBSb3V0ZXJDb25maWc7XHJcblxyXG4gIC8qKlxyXG4gICAqIEBpbnRlcm5hbFxyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgICBwcml2YXRlIHJvb3RDb21wb25lbnRUeXBlOiBUeXBlLCBwcml2YXRlIHJlc29sdmVyOiBDb21wb25lbnRSZXNvbHZlcixcclxuICAgICAgcHJpdmF0ZSB1cmxTZXJpYWxpemVyOiBVcmxTZXJpYWxpemVyLCBwcml2YXRlIG91dGxldE1hcDogUm91dGVyT3V0bGV0TWFwLFxyXG4gICAgICBwcml2YXRlIGxvY2F0aW9uOiBMb2NhdGlvbiwgcHJpdmF0ZSBpbmplY3RvcjogSW5qZWN0b3IsIGNvbmZpZzogUm91dGVyQ29uZmlnKSB7XHJcbiAgICB0aGlzLnJlc2V0Q29uZmlnKGNvbmZpZyk7XHJcbiAgICB0aGlzLnJvdXRlckV2ZW50cyA9IG5ldyBTdWJqZWN0PEV2ZW50PigpO1xyXG4gICAgdGhpcy5jdXJyZW50VXJsVHJlZSA9IGNyZWF0ZUVtcHR5VXJsVHJlZSgpO1xyXG4gICAgdGhpcy5jdXJyZW50Um91dGVyU3RhdGUgPSBjcmVhdGVFbXB0eVN0YXRlKHRoaXMuY3VycmVudFVybFRyZWUsIHRoaXMucm9vdENvbXBvbmVudFR5cGUpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQGludGVybmFsXHJcbiAgICovXHJcbiAgaW5pdGlhbE5hdmlnYXRpb24oKTogdm9pZCB7XHJcbiAgICB0aGlzLnNldFVwTG9jYXRpb25DaGFuZ2VMaXN0ZW5lcigpO1xyXG4gICAgdGhpcy5uYXZpZ2F0ZUJ5VXJsKHRoaXMubG9jYXRpb24ucGF0aCgpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIGN1cnJlbnQgcm91dGUgc3RhdGUuXHJcbiAgICovXHJcbiAgZ2V0IHJvdXRlclN0YXRlKCk6IFJvdXRlclN0YXRlIHsgcmV0dXJuIHRoaXMuY3VycmVudFJvdXRlclN0YXRlOyB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIGN1cnJlbnQgdXJsLlxyXG4gICAqL1xyXG4gIGdldCB1cmwoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuc2VyaWFsaXplVXJsKHRoaXMuY3VycmVudFVybFRyZWUpOyB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgYW4gb2JzZXJ2YWJsZSBvZiByb3V0ZSBldmVudHNcclxuICAgKi9cclxuICBnZXQgZXZlbnRzKCk6IE9ic2VydmFibGU8RXZlbnQ+IHsgcmV0dXJuIHRoaXMucm91dGVyRXZlbnRzOyB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlc2V0cyB0aGUgY29uZmlndXJhdGlvbiB1c2VkIGZvciBuYXZpZ2F0aW9uIGFuZCBnZW5lcmF0aW5nIGxpbmtzLlxyXG4gICAqXHJcbiAgICogIyMjIFVzYWdlXHJcbiAgICpcclxuICAgKiBgYGBcclxuICAgKiByb3V0ZXIucmVzZXRDb25maWcoW1xyXG4gICAqICB7IHBhdGg6ICd0ZWFtLzppZCcsIGNvbXBvbmVudDogVGVhbUNtcCwgY2hpbGRyZW46IFtcclxuICAgKiAgICB7IHBhdGg6ICdzaW1wbGUnLCBjb21wb25lbnQ6IFNpbXBsZUNtcCB9LFxyXG4gICAqICAgIHsgcGF0aDogJ3VzZXIvOm5hbWUnLCBjb21wb25lbnQ6IFVzZXJDbXAgfVxyXG4gICAqICBdIH1cclxuICAgKiBdKTtcclxuICAgKiBgYGBcclxuICAgKi9cclxuICByZXNldENvbmZpZyhjb25maWc6IFJvdXRlckNvbmZpZyk6IHZvaWQge1xyXG4gICAgdmFsaWRhdGVDb25maWcoY29uZmlnKTtcclxuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQGludGVybmFsXHJcbiAgICovXHJcbiAgZGlzcG9zZSgpOiB2b2lkIHsgdGhpcy5sb2NhdGlvblN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpOyB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEFwcGxpZXMgYW4gYXJyYXkgb2YgY29tbWFuZHMgdG8gdGhlIGN1cnJlbnQgdXJsIHRyZWUgYW5kIGNyZWF0ZXNcclxuICAgKiBhIG5ldyB1cmwgdHJlZS5cclxuICAgKlxyXG4gICAqIFdoZW4gZ2l2ZW4gYW4gYWN0aXZhdGUgcm91dGUsIGFwcGxpZXMgdGhlIGdpdmVuIGNvbW1hbmRzIHN0YXJ0aW5nIGZyb20gdGhlIHJvdXRlLlxyXG4gICAqIFdoZW4gbm90IGdpdmVuIGEgcm91dGUsIGFwcGxpZXMgdGhlIGdpdmVuIGNvbW1hbmQgc3RhcnRpbmcgZnJvbSB0aGUgcm9vdC5cclxuICAgKlxyXG4gICAqICMjIyBVc2FnZVxyXG4gICAqXHJcbiAgICogYGBgXHJcbiAgICogLy8gY3JlYXRlIC90ZWFtLzMzL3VzZXIvMTFcclxuICAgKiByb3V0ZXIuY3JlYXRlVXJsVHJlZShbJy90ZWFtJywgMzMsICd1c2VyJywgMTFdKTtcclxuICAgKlxyXG4gICAqIC8vIGNyZWF0ZSAvdGVhbS8zMztleHBhbmQ9dHJ1ZS91c2VyLzExXHJcbiAgICogcm91dGVyLmNyZWF0ZVVybFRyZWUoWycvdGVhbScsIDMzLCB7ZXhwYW5kOiB0cnVlfSwgJ3VzZXInLCAxMV0pO1xyXG4gICAqXHJcbiAgICogLy8geW91IGNhbiBjb2xsYXBzZSBzdGF0aWMgZnJhZ21lbnRzIGxpa2UgdGhpc1xyXG4gICAqIHJvdXRlci5jcmVhdGVVcmxUcmVlKFsnL3RlYW0vMzMvdXNlcicsIHVzZXJJZF0pO1xyXG4gICAqXHJcbiAgICogLy8gYXNzdW1pbmcgdGhlIGN1cnJlbnQgdXJsIGlzIGAvdGVhbS8zMy91c2VyLzExYCBhbmQgdGhlIHJvdXRlIHBvaW50cyB0byBgdXNlci8xMWBcclxuICAgKlxyXG4gICAqIC8vIG5hdmlnYXRlIHRvIC90ZWFtLzMzL3VzZXIvMTEvZGV0YWlsc1xyXG4gICAqIHJvdXRlci5jcmVhdGVVcmxUcmVlKFsnZGV0YWlscyddLCB7cmVsYXRpdmVUbzogcm91dGV9KTtcclxuICAgKlxyXG4gICAqIC8vIG5hdmlnYXRlIHRvIC90ZWFtLzMzL3VzZXIvMjJcclxuICAgKiByb3V0ZXIuY3JlYXRlVXJsVHJlZShbJy4uLzIyJ10sIHtyZWxhdGl2ZVRvOiByb3V0ZX0pO1xyXG4gICAqXHJcbiAgICogLy8gbmF2aWdhdGUgdG8gL3RlYW0vNDQvdXNlci8yMlxyXG4gICAqIHJvdXRlci5jcmVhdGVVcmxUcmVlKFsnLi4vLi4vdGVhbS80NC91c2VyLzIyJ10sIHtyZWxhdGl2ZVRvOiByb3V0ZX0pO1xyXG4gICAqIGBgYFxyXG4gICAqL1xyXG4gIGNyZWF0ZVVybFRyZWUoY29tbWFuZHM6IGFueVtdLCB7cmVsYXRpdmVUbywgcXVlcnlQYXJhbXMsIGZyYWdtZW50fTogTmF2aWdhdGlvbkV4dHJhcyA9IHt9KTpcclxuICAgICAgVXJsVHJlZSB7XHJcbiAgICBjb25zdCBhID0gcmVsYXRpdmVUbyA/IHJlbGF0aXZlVG8gOiB0aGlzLnJvdXRlclN0YXRlLnJvb3Q7XHJcbiAgICByZXR1cm4gY3JlYXRlVXJsVHJlZShhLCB0aGlzLmN1cnJlbnRVcmxUcmVlLCBjb21tYW5kcywgcXVlcnlQYXJhbXMsIGZyYWdtZW50KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE5hdmlnYXRlIGJhc2VkIG9uIHRoZSBwcm92aWRlZCB1cmwuIFRoaXMgbmF2aWdhdGlvbiBpcyBhbHdheXMgYWJzb2x1dGUuXHJcbiAgICpcclxuICAgKiBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0OlxyXG4gICAqIC0gaXMgcmVzb2x2ZWQgd2l0aCAndHJ1ZScgd2hlbiBuYXZpZ2F0aW9uIHN1Y2NlZWRzXHJcbiAgICogLSBpcyByZXNvbHZlZCB3aXRoICdmYWxzZScgd2hlbiBuYXZpZ2F0aW9uIGZhaWxzXHJcbiAgICogLSBpcyByZWplY3RlZCB3aGVuIGFuIGVycm9yIGhhcHBlbnNcclxuICAgKlxyXG4gICAqICMjIyBVc2FnZVxyXG4gICAqXHJcbiAgICogYGBgXHJcbiAgICogcm91dGVyLm5hdmlnYXRlQnlVcmwoXCIvdGVhbS8zMy91c2VyLzExXCIpO1xyXG4gICAqIGBgYFxyXG4gICAqL1xyXG4gIG5hdmlnYXRlQnlVcmwodXJsOiBzdHJpbmd8VXJsVHJlZSk6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gICAgaWYgKHVybCBpbnN0YW5jZW9mIFVybFRyZWUpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuc2NoZWR1bGVOYXZpZ2F0aW9uKHVybCwgZmFsc2UpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc3QgdXJsVHJlZSA9IHRoaXMudXJsU2VyaWFsaXplci5wYXJzZSh1cmwpO1xyXG4gICAgICByZXR1cm4gdGhpcy5zY2hlZHVsZU5hdmlnYXRpb24odXJsVHJlZSwgZmFsc2UpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTmF2aWdhdGUgYmFzZWQgb24gdGhlIHByb3ZpZGVkIGFycmF5IG9mIGNvbW1hbmRzIGFuZCBhIHN0YXJ0aW5nIHBvaW50LlxyXG4gICAqIElmIG5vIHN0YXJ0aW5nIHJvdXRlIGlzIHByb3ZpZGVkLCB0aGUgbmF2aWdhdGlvbiBpcyBhYnNvbHV0ZS5cclxuICAgKlxyXG4gICAqIFJldHVybnMgYSBwcm9taXNlIHRoYXQ6XHJcbiAgICogLSBpcyByZXNvbHZlZCB3aXRoICd0cnVlJyB3aGVuIG5hdmlnYXRpb24gc3VjY2VlZHNcclxuICAgKiAtIGlzIHJlc29sdmVkIHdpdGggJ2ZhbHNlJyB3aGVuIG5hdmlnYXRpb24gZmFpbHNcclxuICAgKiAtIGlzIHJlamVjdGVkIHdoZW4gYW4gZXJyb3IgaGFwcGVuc1xyXG4gICAqXHJcbiAgICogIyMjIFVzYWdlXHJcbiAgICpcclxuICAgKiBgYGBcclxuICAgKiByb3V0ZXIubmF2aWdhdGUoWyd0ZWFtJywgMzMsICd0ZWFtJywgJzExXSwge3JlbGF0aXZlVG86IHJvdXRlfSk7XHJcbiAgICogYGBgXHJcbiAgICovXHJcbiAgbmF2aWdhdGUoY29tbWFuZHM6IGFueVtdLCBleHRyYXM6IE5hdmlnYXRpb25FeHRyYXMgPSB7fSk6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gICAgcmV0dXJuIHRoaXMuc2NoZWR1bGVOYXZpZ2F0aW9uKHRoaXMuY3JlYXRlVXJsVHJlZShjb21tYW5kcywgZXh0cmFzKSwgZmFsc2UpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2VyaWFsaXplcyBhIHtAbGluayBVcmxUcmVlfSBpbnRvIGEgc3RyaW5nLlxyXG4gICAqL1xyXG4gIHNlcmlhbGl6ZVVybCh1cmw6IFVybFRyZWUpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy51cmxTZXJpYWxpemVyLnNlcmlhbGl6ZSh1cmwpOyB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFBhcnNlIGEgc3RyaW5nIGludG8gYSB7QGxpbmsgVXJsVHJlZX0uXHJcbiAgICovXHJcbiAgcGFyc2VVcmwodXJsOiBzdHJpbmcpOiBVcmxUcmVlIHsgcmV0dXJuIHRoaXMudXJsU2VyaWFsaXplci5wYXJzZSh1cmwpOyB9XHJcblxyXG4gIHByaXZhdGUgc2NoZWR1bGVOYXZpZ2F0aW9uKHVybDogVXJsVHJlZSwgcHJldmVudFB1c2hTdGF0ZTogYm9vbGVhbik6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gICAgY29uc3QgaWQgPSArK3RoaXMubmF2aWdhdGlvbklkO1xyXG4gICAgdGhpcy5yb3V0ZXJFdmVudHMubmV4dChuZXcgTmF2aWdhdGlvblN0YXJ0KGlkLCB0aGlzLnNlcmlhbGl6ZVVybCh1cmwpKSk7XHJcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoXykgPT4gdGhpcy5ydW5OYXZpZ2F0ZSh1cmwsIHByZXZlbnRQdXNoU3RhdGUsIGlkKSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNldFVwTG9jYXRpb25DaGFuZ2VMaXN0ZW5lcigpOiB2b2lkIHtcclxuICAgIHRoaXMubG9jYXRpb25TdWJzY3JpcHRpb24gPSA8YW55PnRoaXMubG9jYXRpb24uc3Vic2NyaWJlKChjaGFuZ2UpID0+IHtcclxuICAgICAgcmV0dXJuIHRoaXMuc2NoZWR1bGVOYXZpZ2F0aW9uKHRoaXMudXJsU2VyaWFsaXplci5wYXJzZShjaGFuZ2VbJ3VybCddKSwgY2hhbmdlWydwb3AnXSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcnVuTmF2aWdhdGUodXJsOiBVcmxUcmVlLCBwcmV2ZW50UHVzaFN0YXRlOiBib29sZWFuLCBpZDogbnVtYmVyKTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICBpZiAoaWQgIT09IHRoaXMubmF2aWdhdGlvbklkKSB7XHJcbiAgICAgIHRoaXMubG9jYXRpb24uZ28odGhpcy51cmxTZXJpYWxpemVyLnNlcmlhbGl6ZSh0aGlzLmN1cnJlbnRVcmxUcmVlKSk7XHJcbiAgICAgIHRoaXMucm91dGVyRXZlbnRzLm5leHQobmV3IE5hdmlnYXRpb25DYW5jZWwoaWQsIHRoaXMuc2VyaWFsaXplVXJsKHVybCkpKTtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlUHJvbWlzZSwgcmVqZWN0UHJvbWlzZSkgPT4ge1xyXG4gICAgICBsZXQgdXBkYXRlZFVybDogVXJsVHJlZTtcclxuICAgICAgbGV0IHN0YXRlOiBSb3V0ZXJTdGF0ZTtcclxuICAgICAgYXBwbHlSZWRpcmVjdHModXJsLCB0aGlzLmNvbmZpZylcclxuICAgICAgICAgIC5tZXJnZU1hcCh1ID0+IHtcclxuICAgICAgICAgICAgdXBkYXRlZFVybCA9IHU7XHJcbiAgICAgICAgICAgIHJldHVybiByZWNvZ25pemUoXHJcbiAgICAgICAgICAgICAgICB0aGlzLnJvb3RDb21wb25lbnRUeXBlLCB0aGlzLmNvbmZpZywgdXBkYXRlZFVybCwgdGhpcy5zZXJpYWxpemVVcmwodXBkYXRlZFVybCkpO1xyXG4gICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAubWVyZ2VNYXAoKG5ld1JvdXRlclN0YXRlU25hcHNob3QpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5yb3V0ZXJFdmVudHMubmV4dChuZXcgUm91dGVzUmVjb2duaXplZChcclxuICAgICAgICAgICAgICAgIGlkLCB0aGlzLnNlcmlhbGl6ZVVybCh1cmwpLCB0aGlzLnNlcmlhbGl6ZVVybCh1cGRhdGVkVXJsKSwgbmV3Um91dGVyU3RhdGVTbmFwc2hvdCkpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSh0aGlzLnJlc29sdmVyLCBuZXdSb3V0ZXJTdGF0ZVNuYXBzaG90KTtcclxuXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLm1hcCgocm91dGVyU3RhdGVTbmFwc2hvdCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gY3JlYXRlUm91dGVyU3RhdGUocm91dGVyU3RhdGVTbmFwc2hvdCwgdGhpcy5jdXJyZW50Um91dGVyU3RhdGUpO1xyXG5cclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAubWFwKChuZXdTdGF0ZTogUm91dGVyU3RhdGUpID0+IHtcclxuICAgICAgICAgICAgc3RhdGUgPSBuZXdTdGF0ZTtcclxuXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLm1lcmdlTWFwKF8gPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IEd1YXJkQ2hlY2tzKHN0YXRlLnNuYXBzaG90LCB0aGlzLmN1cnJlbnRSb3V0ZXJTdGF0ZS5zbmFwc2hvdCwgdGhpcy5pbmplY3RvcilcclxuICAgICAgICAgICAgICAgIC5jaGVjayh0aGlzLm91dGxldE1hcCk7XHJcblxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC5mb3JFYWNoKChzaG91bGRBY3RpdmF0ZTogYm9vbGVhbikgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIXNob3VsZEFjdGl2YXRlIHx8IGlkICE9PSB0aGlzLm5hdmlnYXRpb25JZCkge1xyXG4gICAgICAgICAgICAgIHRoaXMucm91dGVyRXZlbnRzLm5leHQobmV3IE5hdmlnYXRpb25DYW5jZWwoaWQsIHRoaXMuc2VyaWFsaXplVXJsKHVybCkpKTtcclxuICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbmV3IEFjdGl2YXRlUm91dGVzKHN0YXRlLCB0aGlzLmN1cnJlbnRSb3V0ZXJTdGF0ZSkuYWN0aXZhdGUodGhpcy5vdXRsZXRNYXApO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50VXJsVHJlZSA9IHVwZGF0ZWRVcmw7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFJvdXRlclN0YXRlID0gc3RhdGU7XHJcbiAgICAgICAgICAgIGlmICghcHJldmVudFB1c2hTdGF0ZSkge1xyXG4gICAgICAgICAgICAgIGxldCBwYXRoID0gdGhpcy51cmxTZXJpYWxpemVyLnNlcmlhbGl6ZSh1cGRhdGVkVXJsKTtcclxuICAgICAgICAgICAgICBpZiAodGhpcy5sb2NhdGlvbi5pc0N1cnJlbnRQYXRoRXF1YWxUbyhwYXRoKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2NhdGlvbi5yZXBsYWNlU3RhdGUocGF0aCk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9jYXRpb24uZ28ocGF0aCk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSk7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnRoZW4oXHJcbiAgICAgICAgICAgICAgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZXJFdmVudHMubmV4dChcclxuICAgICAgICAgICAgICAgICAgICBuZXcgTmF2aWdhdGlvbkVuZChpZCwgdGhpcy5zZXJpYWxpemVVcmwodXJsKSwgdGhpcy5zZXJpYWxpemVVcmwodXBkYXRlZFVybCkpKTtcclxuICAgICAgICAgICAgICAgIHJlc29sdmVQcm9taXNlKHRydWUpO1xyXG5cclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZXJFdmVudHMubmV4dChuZXcgTmF2aWdhdGlvbkVycm9yKGlkLCB0aGlzLnNlcmlhbGl6ZVVybCh1cmwpLCBlKSk7XHJcbiAgICAgICAgICAgICAgICByZWplY3RQcm9taXNlKGUpO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5jbGFzcyBDYW5BY3RpdmF0ZSB7XHJcbiAgY29uc3RydWN0b3IocHVibGljIHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90KSB7fVxyXG59XHJcbmNsYXNzIENhbkRlYWN0aXZhdGUge1xyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBjb21wb25lbnQ6IE9iamVjdCwgcHVibGljIHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90KSB7fVxyXG59XHJcblxyXG5jbGFzcyBHdWFyZENoZWNrcyB7XHJcbiAgcHJpdmF0ZSBjaGVja3M6IEFycmF5PENhbkFjdGl2YXRlfENhbkRlYWN0aXZhdGU+ID0gW107XHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICAgIHByaXZhdGUgZnV0dXJlOiBSb3V0ZXJTdGF0ZVNuYXBzaG90LCBwcml2YXRlIGN1cnI6IFJvdXRlclN0YXRlU25hcHNob3QsXHJcbiAgICAgIHByaXZhdGUgaW5qZWN0b3I6IEluamVjdG9yKSB7fVxyXG5cclxuICBjaGVjayhwYXJlbnRPdXRsZXRNYXA6IFJvdXRlck91dGxldE1hcCk6IE9ic2VydmFibGU8Ym9vbGVhbj4ge1xyXG4gICAgY29uc3QgZnV0dXJlUm9vdCA9IHRoaXMuZnV0dXJlLl9yb290O1xyXG4gICAgY29uc3QgY3VyclJvb3QgPSB0aGlzLmN1cnIgPyB0aGlzLmN1cnIuX3Jvb3QgOiBudWxsO1xyXG4gICAgdGhpcy50cmF2ZXJzZUNoaWxkUm91dGVzKGZ1dHVyZVJvb3QsIGN1cnJSb290LCBwYXJlbnRPdXRsZXRNYXApO1xyXG4gICAgaWYgKHRoaXMuY2hlY2tzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIG9mICh0cnVlKTtcclxuXHJcbiAgICByZXR1cm4gT2JzZXJ2YWJsZS5mcm9tKHRoaXMuY2hlY2tzKVxyXG4gICAgICAgIC5tYXAocyA9PiB7XHJcbiAgICAgICAgICBpZiAocyBpbnN0YW5jZW9mIENhbkFjdGl2YXRlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJ1bkNhbkFjdGl2YXRlKHMucm91dGUpO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChzIGluc3RhbmNlb2YgQ2FuRGVhY3RpdmF0ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ydW5DYW5EZWFjdGl2YXRlKHMuY29tcG9uZW50LCBzLnJvdXRlKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGJlIHJlYWNoZWQnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIC5tZXJnZUFsbCgpXHJcbiAgICAgICAgLmV2ZXJ5KHJlc3VsdCA9PiByZXN1bHQgPT09IHRydWUpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB0cmF2ZXJzZUNoaWxkUm91dGVzKFxyXG4gICAgICBmdXR1cmVOb2RlOiBUcmVlTm9kZTxBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90PiwgY3Vyck5vZGU6IFRyZWVOb2RlPEFjdGl2YXRlZFJvdXRlU25hcHNob3Q+LFxyXG4gICAgICBvdXRsZXRNYXA6IFJvdXRlck91dGxldE1hcCk6IHZvaWQge1xyXG4gICAgY29uc3QgcHJldkNoaWxkcmVuOiB7W2tleTogc3RyaW5nXTogYW55fSA9IG5vZGVDaGlsZHJlbkFzTWFwKGN1cnJOb2RlKTtcclxuICAgIGZ1dHVyZU5vZGUuY2hpbGRyZW4uZm9yRWFjaChjID0+IHtcclxuICAgICAgdGhpcy50cmF2ZXJzZVJvdXRlcyhjLCBwcmV2Q2hpbGRyZW5bYy52YWx1ZS5vdXRsZXRdLCBvdXRsZXRNYXApO1xyXG4gICAgICBkZWxldGUgcHJldkNoaWxkcmVuW2MudmFsdWUub3V0bGV0XTtcclxuICAgIH0pO1xyXG4gICAgZm9yRWFjaChcclxuICAgICAgICBwcmV2Q2hpbGRyZW4sXHJcbiAgICAgICAgKHY6IGFueSwgazogc3RyaW5nKSA9PiB0aGlzLmRlYWN0aXZhdGVPdXRsZXRBbmRJdENoaWxkcmVuKHYsIG91dGxldE1hcC5fb3V0bGV0c1trXSkpO1xyXG4gIH1cclxuXHJcbiAgdHJhdmVyc2VSb3V0ZXMoXHJcbiAgICAgIGZ1dHVyZU5vZGU6IFRyZWVOb2RlPEFjdGl2YXRlZFJvdXRlU25hcHNob3Q+LCBjdXJyTm9kZTogVHJlZU5vZGU8QWN0aXZhdGVkUm91dGVTbmFwc2hvdD4sXHJcbiAgICAgIHBhcmVudE91dGxldE1hcDogUm91dGVyT3V0bGV0TWFwKTogdm9pZCB7XHJcbiAgICBjb25zdCBmdXR1cmUgPSBmdXR1cmVOb2RlLnZhbHVlO1xyXG4gICAgY29uc3QgY3VyciA9IGN1cnJOb2RlID8gY3Vyck5vZGUudmFsdWUgOiBudWxsO1xyXG4gICAgY29uc3Qgb3V0bGV0ID0gcGFyZW50T3V0bGV0TWFwID8gcGFyZW50T3V0bGV0TWFwLl9vdXRsZXRzW2Z1dHVyZU5vZGUudmFsdWUub3V0bGV0XSA6IG51bGw7XHJcblxyXG4gICAgLy8gcmV1c2luZyB0aGUgbm9kZVxyXG4gICAgaWYgKGN1cnIgJiYgZnV0dXJlLl9yb3V0ZUNvbmZpZyA9PT0gY3Vyci5fcm91dGVDb25maWcpIHtcclxuICAgICAgaWYgKCFzaGFsbG93RXF1YWwoZnV0dXJlLnBhcmFtcywgY3Vyci5wYXJhbXMpKSB7XHJcbiAgICAgICAgdGhpcy5jaGVja3MucHVzaChuZXcgQ2FuRGVhY3RpdmF0ZShvdXRsZXQuY29tcG9uZW50LCBjdXJyKSwgbmV3IENhbkFjdGl2YXRlKGZ1dHVyZSkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBJZiB3ZSBoYXZlIGEgY29tcG9uZW50LCB3ZSBuZWVkIHRvIGdvIHRocm91Z2ggYW4gb3V0bGV0LlxyXG4gICAgICAvLyBPdGhlcndpc2UsIHRoaXMgcm91dGUgaXMgbm90IHJlcHJlc2VudGVkIGluIHRoZSBjb21wb25lbnQgdHJlZS5cclxuICAgICAgaWYgKGZ1dHVyZS5jb21wb25lbnQpIHtcclxuICAgICAgICB0aGlzLnRyYXZlcnNlQ2hpbGRSb3V0ZXMoZnV0dXJlTm9kZSwgY3Vyck5vZGUsIG91dGxldCA/IG91dGxldC5vdXRsZXRNYXAgOiBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnRyYXZlcnNlQ2hpbGRSb3V0ZXMoZnV0dXJlTm9kZSwgY3Vyck5vZGUsIHBhcmVudE91dGxldE1hcCk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIGlmIHdlIGhhZCBhIGNvbXBvbmVudGxlc3Mgcm91dGUsIHdlIG5lZWQgdG8gZGVhY3RpdmF0ZSBldmVyeXRoaW5nIVxyXG4gICAgICBpZiAoY3Vycikge1xyXG4gICAgICAgIGlmIChjdXJyLmNvbXBvbmVudCkge1xyXG4gICAgICAgICAgdGhpcy5kZWFjdGl2YXRlT3V0bGV0QW5kSXRDaGlsZHJlbihjdXJyLCBvdXRsZXQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLmRlYWN0aXZhdGVPdXRsZXRNYXAocGFyZW50T3V0bGV0TWFwKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIGlmIHdlIGhhdmUgYSBjb21wb25lbnQsIHdlIG5lZWQgdG8gZGVhY3RpdmF0ZSBpdHMgb3V0bGV0LCBydW4gY2FuQWN0aXZhdGUsXHJcbiAgICAgIC8vIGFuZCB0aGVuIHRyYXZlcnNlIGl0cyBjaGlsZHJlbiB3aXRoIHRoZSBvdXRsZXQgbWFwIGZyb20gdGhhdCBvdXRsZXQuXHJcbiAgICAgIC8vIE90aGVyd2lzZSwgdGhpcyByb3V0ZSBpcyBub3QgcmVwcmVzZW50ZWQgaW4gdGhlIGNvbXBvbmVudCB0cmVlLFxyXG4gICAgICAvLyBzbyB3ZSByZXVzZSB0aGUgcGFyZW50IG1hcC5cclxuICAgICAgdGhpcy5jaGVja3MucHVzaChuZXcgQ2FuQWN0aXZhdGUoZnV0dXJlKSk7XHJcbiAgICAgIGlmIChmdXR1cmUuY29tcG9uZW50KSB7XHJcbiAgICAgICAgdGhpcy50cmF2ZXJzZUNoaWxkUm91dGVzKGZ1dHVyZU5vZGUsIG51bGwsIG91dGxldCA/IG91dGxldC5vdXRsZXRNYXAgOiBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnRyYXZlcnNlQ2hpbGRSb3V0ZXMoZnV0dXJlTm9kZSwgbnVsbCwgcGFyZW50T3V0bGV0TWFwKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBkZWFjdGl2YXRlT3V0bGV0QW5kSXRDaGlsZHJlbihyb3V0ZTogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCwgb3V0bGV0OiBSb3V0ZXJPdXRsZXQpOiB2b2lkIHtcclxuICAgIGlmIChvdXRsZXQgJiYgb3V0bGV0LmlzQWN0aXZhdGVkKSB7XHJcbiAgICAgIHRoaXMuZGVhY3RpdmF0ZU91dGxldE1hcChvdXRsZXQub3V0bGV0TWFwKTtcclxuICAgICAgdGhpcy5jaGVja3MucHVzaChuZXcgQ2FuRGVhY3RpdmF0ZShvdXRsZXQuY29tcG9uZW50LCByb3V0ZSkpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBkZWFjdGl2YXRlT3V0bGV0TWFwKG91dGxldE1hcDogUm91dGVyT3V0bGV0TWFwKTogdm9pZCB7XHJcbiAgICBmb3JFYWNoKG91dGxldE1hcC5fb3V0bGV0cywgKHY6IFJvdXRlck91dGxldCkgPT4ge1xyXG4gICAgICBpZiAodi5pc0FjdGl2YXRlZCkge1xyXG4gICAgICAgIHRoaXMuZGVhY3RpdmF0ZU91dGxldEFuZEl0Q2hpbGRyZW4odi5hY3RpdmF0ZWRSb3V0ZS5zbmFwc2hvdCwgdik7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBydW5DYW5BY3RpdmF0ZShmdXR1cmU6IEFjdGl2YXRlZFJvdXRlU25hcHNob3QpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcclxuICAgIGNvbnN0IGNhbkFjdGl2YXRlID0gZnV0dXJlLl9yb3V0ZUNvbmZpZyA/IGZ1dHVyZS5fcm91dGVDb25maWcuY2FuQWN0aXZhdGUgOiBudWxsO1xyXG4gICAgaWYgKCFjYW5BY3RpdmF0ZSB8fCBjYW5BY3RpdmF0ZS5sZW5ndGggPT09IDApIHJldHVybiBvZiAodHJ1ZSk7XHJcbiAgICByZXR1cm4gT2JzZXJ2YWJsZS5mcm9tKGNhbkFjdGl2YXRlKVxyXG4gICAgICAgIC5tYXAoYyA9PiB7XHJcbiAgICAgICAgICBjb25zdCBndWFyZCA9IHRoaXMuaW5qZWN0b3IuZ2V0KGMpO1xyXG4gICAgICAgICAgaWYgKGd1YXJkLmNhbkFjdGl2YXRlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB3cmFwSW50b09ic2VydmFibGUoZ3VhcmQuY2FuQWN0aXZhdGUoZnV0dXJlLCB0aGlzLmZ1dHVyZSkpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHdyYXBJbnRvT2JzZXJ2YWJsZShndWFyZChmdXR1cmUsIHRoaXMuZnV0dXJlKSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICAubWVyZ2VBbGwoKVxyXG4gICAgICAgIC5ldmVyeShyZXN1bHQgPT4gcmVzdWx0ID09PSB0cnVlKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcnVuQ2FuRGVhY3RpdmF0ZShjb21wb25lbnQ6IE9iamVjdCwgY3VycjogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCk6IE9ic2VydmFibGU8Ym9vbGVhbj4ge1xyXG4gICAgdmFyIGNhbkRlYWN0aXZhdGUgPSBjdXJyID8gKGN1cnIuX3JvdXRlQ29uZmlnID8gY3Vyci5fcm91dGVDb25maWcuY2FuRGVhY3RpdmF0ZSA6IG51bGwpIDogbnVsbDtcclxuICAgIGlmICghY2FuRGVhY3RpdmF0ZSB8fCBjYW5EZWFjdGl2YXRlLmxlbmd0aCA9PT0gMCkgcmV0dXJuIG9mICh0cnVlKTtcclxuICAgIHJldHVybiBPYnNlcnZhYmxlLmZyb20oY2FuRGVhY3RpdmF0ZSlcclxuICAgICAgICAubWFwKGMgPT4ge1xyXG4gICAgICAgICAgY29uc3QgZ3VhcmQgPSB0aGlzLmluamVjdG9yLmdldChjKTtcclxuXHJcbiAgICAgICAgICBpZiAoZ3VhcmQuY2FuRGVhY3RpdmF0ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gd3JhcEludG9PYnNlcnZhYmxlKGd1YXJkLmNhbkRlYWN0aXZhdGUoY29tcG9uZW50LCBjdXJyLCB0aGlzLmN1cnIpKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB3cmFwSW50b09ic2VydmFibGUoZ3VhcmQoY29tcG9uZW50LCBjdXJyLCB0aGlzLmN1cnIpKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIC5tZXJnZUFsbCgpXHJcbiAgICAgICAgLmV2ZXJ5KHJlc3VsdCA9PiByZXN1bHQgPT09IHRydWUpO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gd3JhcEludG9PYnNlcnZhYmxlPFQ+KHZhbHVlOiBUIHwgT2JzZXJ2YWJsZTxUPik6IE9ic2VydmFibGU8VD4ge1xyXG4gIGlmICh2YWx1ZSBpbnN0YW5jZW9mIE9ic2VydmFibGUpIHtcclxuICAgIHJldHVybiB2YWx1ZTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIG9mICh2YWx1ZSk7XHJcbiAgfVxyXG59XHJcblxyXG5jbGFzcyBBY3RpdmF0ZVJvdXRlcyB7XHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBmdXR1cmVTdGF0ZTogUm91dGVyU3RhdGUsIHByaXZhdGUgY3VyclN0YXRlOiBSb3V0ZXJTdGF0ZSkge31cclxuXHJcbiAgYWN0aXZhdGUocGFyZW50T3V0bGV0TWFwOiBSb3V0ZXJPdXRsZXRNYXApOiB2b2lkIHtcclxuICAgIGNvbnN0IGZ1dHVyZVJvb3QgPSB0aGlzLmZ1dHVyZVN0YXRlLl9yb290O1xyXG4gICAgY29uc3QgY3VyclJvb3QgPSB0aGlzLmN1cnJTdGF0ZSA/IHRoaXMuY3VyclN0YXRlLl9yb290IDogbnVsbDtcclxuXHJcbiAgICBwdXNoUXVlcnlQYXJhbXNBbmRGcmFnbWVudCh0aGlzLmZ1dHVyZVN0YXRlKTtcclxuICAgIHRoaXMuYWN0aXZhdGVDaGlsZFJvdXRlcyhmdXR1cmVSb290LCBjdXJyUm9vdCwgcGFyZW50T3V0bGV0TWFwKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYWN0aXZhdGVDaGlsZFJvdXRlcyhcclxuICAgICAgZnV0dXJlTm9kZTogVHJlZU5vZGU8QWN0aXZhdGVkUm91dGU+LCBjdXJyTm9kZTogVHJlZU5vZGU8QWN0aXZhdGVkUm91dGU+LFxyXG4gICAgICBvdXRsZXRNYXA6IFJvdXRlck91dGxldE1hcCk6IHZvaWQge1xyXG4gICAgY29uc3QgcHJldkNoaWxkcmVuOiB7W2tleTogc3RyaW5nXTogYW55fSA9IG5vZGVDaGlsZHJlbkFzTWFwKGN1cnJOb2RlKTtcclxuICAgIGZ1dHVyZU5vZGUuY2hpbGRyZW4uZm9yRWFjaChjID0+IHtcclxuICAgICAgdGhpcy5hY3RpdmF0ZVJvdXRlcyhjLCBwcmV2Q2hpbGRyZW5bYy52YWx1ZS5vdXRsZXRdLCBvdXRsZXRNYXApO1xyXG4gICAgICBkZWxldGUgcHJldkNoaWxkcmVuW2MudmFsdWUub3V0bGV0XTtcclxuICAgIH0pO1xyXG4gICAgZm9yRWFjaChcclxuICAgICAgICBwcmV2Q2hpbGRyZW4sXHJcbiAgICAgICAgKHY6IGFueSwgazogc3RyaW5nKSA9PiB0aGlzLmRlYWN0aXZhdGVPdXRsZXRBbmRJdENoaWxkcmVuKG91dGxldE1hcC5fb3V0bGV0c1trXSkpO1xyXG4gIH1cclxuXHJcbiAgYWN0aXZhdGVSb3V0ZXMoXHJcbiAgICAgIGZ1dHVyZU5vZGU6IFRyZWVOb2RlPEFjdGl2YXRlZFJvdXRlPiwgY3Vyck5vZGU6IFRyZWVOb2RlPEFjdGl2YXRlZFJvdXRlPixcclxuICAgICAgcGFyZW50T3V0bGV0TWFwOiBSb3V0ZXJPdXRsZXRNYXApOiB2b2lkIHtcclxuICAgIGNvbnN0IGZ1dHVyZSA9IGZ1dHVyZU5vZGUudmFsdWU7XHJcbiAgICBjb25zdCBjdXJyID0gY3Vyck5vZGUgPyBjdXJyTm9kZS52YWx1ZSA6IG51bGw7XHJcblxyXG4gICAgLy8gcmV1c2luZyB0aGUgbm9kZVxyXG4gICAgaWYgKGZ1dHVyZSA9PT0gY3Vycikge1xyXG4gICAgICAvLyBhZHZhbmNlIHRoZSByb3V0ZSB0byBwdXNoIHRoZSBwYXJhbWV0ZXJzXHJcbiAgICAgIGFkdmFuY2VBY3RpdmF0ZWRSb3V0ZShmdXR1cmUpO1xyXG5cclxuICAgICAgLy8gSWYgd2UgaGF2ZSBhIGNvbXBvbmVudCwgd2UgbmVlZCB0byBnbyB0aHJvdWdoIGFuIG91dGxldC5cclxuICAgICAgLy8gT3RoZXJ3aXNlLCB0aGlzIHJvdXRlIGlzIG5vdCByZXByZXNlbnRlZCBpbiB0aGUgY29tcG9uZW50IHRyZWUuXHJcbiAgICAgIGlmIChmdXR1cmUuY29tcG9uZW50KSB7XHJcbiAgICAgICAgY29uc3Qgb3V0bGV0ID0gZ2V0T3V0bGV0KHBhcmVudE91dGxldE1hcCwgZnV0dXJlTm9kZS52YWx1ZSk7XHJcbiAgICAgICAgdGhpcy5hY3RpdmF0ZUNoaWxkUm91dGVzKGZ1dHVyZU5vZGUsIGN1cnJOb2RlLCBvdXRsZXQub3V0bGV0TWFwKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmFjdGl2YXRlQ2hpbGRSb3V0ZXMoZnV0dXJlTm9kZSwgY3Vyck5vZGUsIHBhcmVudE91dGxldE1hcCk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIGlmIHdlIGhhZCBhIGNvbXBvbmVudGxlc3Mgcm91dGUsIHdlIG5lZWQgdG8gZGVhY3RpdmF0ZSBldmVyeXRoaW5nIVxyXG4gICAgICBpZiAoY3Vycikge1xyXG4gICAgICAgIGlmIChjdXJyLmNvbXBvbmVudCkge1xyXG4gICAgICAgICAgY29uc3Qgb3V0bGV0ID0gZ2V0T3V0bGV0KHBhcmVudE91dGxldE1hcCwgZnV0dXJlTm9kZS52YWx1ZSk7XHJcbiAgICAgICAgICB0aGlzLmRlYWN0aXZhdGVPdXRsZXRBbmRJdENoaWxkcmVuKG91dGxldCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuZGVhY3RpdmF0ZU91dGxldE1hcChwYXJlbnRPdXRsZXRNYXApO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gaWYgd2UgaGF2ZSBhIGNvbXBvbmVudCwgd2UgbmVlZCB0byBhZHZhbmNlIHRoZSByb3V0ZVxyXG4gICAgICAvLyBhbmQgcGxhY2UgdGhlIGNvbXBvbmVudCBpbnRvIHRoZSBvdXRsZXQuXHJcbiAgICAgIC8vIE90aGVyd2lzZSwgdGhpcyByb3V0ZSBpcyBub3QgcmVwcmVzZW50ZWQgaW4gdGhlIGNvbXBvbmVudCB0cmVlLlxyXG4gICAgICBpZiAoZnV0dXJlLmNvbXBvbmVudCkge1xyXG4gICAgICAgIC8vIHRoaXMuZGVhY3RpdmF0ZU91dGxldEFuZEl0Q2hpbGRyZW4ob3V0bGV0KTtcclxuICAgICAgICBhZHZhbmNlQWN0aXZhdGVkUm91dGUoZnV0dXJlKTtcclxuICAgICAgICBjb25zdCBvdXRsZXQgPSBnZXRPdXRsZXQocGFyZW50T3V0bGV0TWFwLCBmdXR1cmVOb2RlLnZhbHVlKTtcclxuICAgICAgICBjb25zdCBvdXRsZXRNYXAgPSBuZXcgUm91dGVyT3V0bGV0TWFwKCk7XHJcbiAgICAgICAgdGhpcy5wbGFjZUNvbXBvbmVudEludG9PdXRsZXQob3V0bGV0TWFwLCBmdXR1cmUsIG91dGxldCk7XHJcbiAgICAgICAgdGhpcy5hY3RpdmF0ZUNoaWxkUm91dGVzKGZ1dHVyZU5vZGUsIG51bGwsIG91dGxldE1hcCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYWR2YW5jZUFjdGl2YXRlZFJvdXRlKGZ1dHVyZSk7XHJcbiAgICAgICAgdGhpcy5hY3RpdmF0ZUNoaWxkUm91dGVzKGZ1dHVyZU5vZGUsIG51bGwsIHBhcmVudE91dGxldE1hcCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgcGxhY2VDb21wb25lbnRJbnRvT3V0bGV0KFxyXG4gICAgICBvdXRsZXRNYXA6IFJvdXRlck91dGxldE1hcCwgZnV0dXJlOiBBY3RpdmF0ZWRSb3V0ZSwgb3V0bGV0OiBSb3V0ZXJPdXRsZXQpOiB2b2lkIHtcclxuICAgIGNvbnN0IHJlc29sdmVkID0gUmVmbGVjdGl2ZUluamVjdG9yLnJlc29sdmUoW1xyXG4gICAgICB7cHJvdmlkZTogQWN0aXZhdGVkUm91dGUsIHVzZVZhbHVlOiBmdXR1cmV9LFxyXG4gICAgICB7cHJvdmlkZTogUm91dGVyT3V0bGV0TWFwLCB1c2VWYWx1ZTogb3V0bGV0TWFwfVxyXG4gICAgXSk7XHJcbiAgICBvdXRsZXQuYWN0aXZhdGUoZnV0dXJlLl9mdXR1cmVTbmFwc2hvdC5fcmVzb2x2ZWRDb21wb25lbnRGYWN0b3J5LCBmdXR1cmUsIHJlc29sdmVkLCBvdXRsZXRNYXApO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBkZWFjdGl2YXRlT3V0bGV0QW5kSXRDaGlsZHJlbihvdXRsZXQ6IFJvdXRlck91dGxldCk6IHZvaWQge1xyXG4gICAgaWYgKG91dGxldCAmJiBvdXRsZXQuaXNBY3RpdmF0ZWQpIHtcclxuICAgICAgdGhpcy5kZWFjdGl2YXRlT3V0bGV0TWFwKG91dGxldC5vdXRsZXRNYXApO1xyXG4gICAgICBvdXRsZXQuZGVhY3RpdmF0ZSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBkZWFjdGl2YXRlT3V0bGV0TWFwKG91dGxldE1hcDogUm91dGVyT3V0bGV0TWFwKTogdm9pZCB7XHJcbiAgICBmb3JFYWNoKG91dGxldE1hcC5fb3V0bGV0cywgKHY6IFJvdXRlck91dGxldCkgPT4gdGhpcy5kZWFjdGl2YXRlT3V0bGV0QW5kSXRDaGlsZHJlbih2KSk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBwdXNoUXVlcnlQYXJhbXNBbmRGcmFnbWVudChzdGF0ZTogUm91dGVyU3RhdGUpOiB2b2lkIHtcclxuICBpZiAoIXNoYWxsb3dFcXVhbChzdGF0ZS5zbmFwc2hvdC5xdWVyeVBhcmFtcywgKDxhbnk+c3RhdGUucXVlcnlQYXJhbXMpLnZhbHVlKSkge1xyXG4gICAgKDxhbnk+c3RhdGUucXVlcnlQYXJhbXMpLm5leHQoc3RhdGUuc25hcHNob3QucXVlcnlQYXJhbXMpO1xyXG4gIH1cclxuXHJcbiAgaWYgKHN0YXRlLnNuYXBzaG90LmZyYWdtZW50ICE9PSAoPGFueT5zdGF0ZS5mcmFnbWVudCkudmFsdWUpIHtcclxuICAgICg8YW55PnN0YXRlLmZyYWdtZW50KS5uZXh0KHN0YXRlLnNuYXBzaG90LmZyYWdtZW50KTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG5vZGVDaGlsZHJlbkFzTWFwKG5vZGU6IFRyZWVOb2RlPGFueT4pIHtcclxuICByZXR1cm4gbm9kZSA/IG5vZGUuY2hpbGRyZW4ucmVkdWNlKChtOiBhbnksIGM6IFRyZWVOb2RlPGFueT4pID0+IHtcclxuICAgIG1bYy52YWx1ZS5vdXRsZXRdID0gYztcclxuICAgIHJldHVybiBtO1xyXG4gIH0sIHt9KSA6IHt9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRPdXRsZXQob3V0bGV0TWFwOiBSb3V0ZXJPdXRsZXRNYXAsIHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSk6IFJvdXRlck91dGxldCB7XHJcbiAgbGV0IG91dGxldCA9IG91dGxldE1hcC5fb3V0bGV0c1tyb3V0ZS5vdXRsZXRdO1xyXG4gIGlmICghb3V0bGV0KSB7XHJcbiAgICBjb25zdCBjb21wb25lbnROYW1lID0gKDxhbnk+cm91dGUuY29tcG9uZW50KS5uYW1lO1xyXG4gICAgaWYgKHJvdXRlLm91dGxldCA9PT0gUFJJTUFSWV9PVVRMRVQpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgZmluZCBwcmltYXJ5IG91dGxldCB0byBsb2FkICcke2NvbXBvbmVudE5hbWV9J2ApO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgZmluZCB0aGUgb3V0bGV0ICR7cm91dGUub3V0bGV0fSB0byBsb2FkICcke2NvbXBvbmVudE5hbWV9J2ApO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gb3V0bGV0O1xyXG59XHJcbiJdfQ==