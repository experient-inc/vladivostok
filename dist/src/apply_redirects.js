var Observable_1 = require('rxjs/Observable');
var of_1 = require('rxjs/observable/of');
var shared_1 = require('./shared');
var url_tree_1 = require('./url_tree');
var NoMatch = (function () {
    function NoMatch(segment) {
        if (segment === void 0) { segment = null; }
        this.segment = segment;
    }
    return NoMatch;
})();
var GlobalRedirect = (function () {
    function GlobalRedirect(paths) {
        this.paths = paths;
    }
    return GlobalRedirect;
})();
function applyRedirects(urlTree, config) {
    try {
        return createUrlTree(urlTree, expandSegment(config, urlTree.root, shared_1.PRIMARY_OUTLET));
    }
    catch (e) {
        if (e instanceof GlobalRedirect) {
            return createUrlTree(urlTree, new url_tree_1.UrlSegment([], (_a = {}, _a[shared_1.PRIMARY_OUTLET] = new url_tree_1.UrlSegment(e.paths, {}), _a)));
        }
        else if (e instanceof NoMatch) {
            return new Observable_1.Observable(function (obs) {
                return obs.error(new Error("Cannot match any routes: '" + e.segment + "'"));
            });
        }
        else {
            return new Observable_1.Observable(function (obs) { return obs.error(e); });
        }
    }
    var _a;
}
exports.applyRedirects = applyRedirects;
function createUrlTree(urlTree, root) {
    return of_1.of(new url_tree_1.UrlTree(root, urlTree.queryParams, urlTree.fragment));
}
function expandSegment(routes, segment, outlet) {
    if (segment.pathsWithParams.length === 0 && segment.hasChildren()) {
        return new url_tree_1.UrlSegment([], expandSegmentChildren(routes, segment));
    }
    else {
        return expandPathsWithParams(segment, routes, segment.pathsWithParams, outlet, true);
    }
}
function expandSegmentChildren(routes, segment) {
    return url_tree_1.mapChildren(segment, function (child, childOutlet) { return expandSegment(routes, child, childOutlet); });
}
function expandPathsWithParams(segment, routes, paths, outlet, allowRedirects) {
    for (var _i = 0; _i < routes.length; _i++) {
        var r = routes[_i];
        try {
            return expandPathsWithParamsAgainstRoute(segment, routes, r, paths, outlet, allowRedirects);
        }
        catch (e) {
            if (!(e instanceof NoMatch))
                throw e;
        }
    }
    throw new NoMatch(segment);
}
function expandPathsWithParamsAgainstRoute(segment, routes, route, paths, outlet, allowRedirects) {
    if ((route.outlet ? route.outlet : shared_1.PRIMARY_OUTLET) !== outlet)
        throw new NoMatch();
    if (route.redirectTo && !allowRedirects)
        throw new NoMatch();
    if (route.redirectTo) {
        return expandPathsWithParamsAgainstRouteUsingRedirect(segment, routes, route, paths, outlet);
    }
    else {
        return matchPathsWithParamsAgainstRoute(segment, route, paths);
    }
}
function expandPathsWithParamsAgainstRouteUsingRedirect(segment, routes, route, paths, outlet) {
    if (route.path === '**') {
        return expandWildCardWithParamsAgainstRouteUsingRedirect(route);
    }
    else {
        return expandRegularPathWithParamsAgainstRouteUsingRedirect(segment, routes, route, paths, outlet);
    }
}
function expandWildCardWithParamsAgainstRouteUsingRedirect(route) {
    var newPaths = applyRedirectCommands([], route.redirectTo, {});
    if (route.redirectTo.startsWith('/')) {
        throw new GlobalRedirect(newPaths);
    }
    else {
        return new url_tree_1.UrlSegment(newPaths, {});
    }
}
function expandRegularPathWithParamsAgainstRouteUsingRedirect(segment, routes, route, paths, outlet) {
    var _a = match(segment, route, paths), consumedPaths = _a.consumedPaths, lastChild = _a.lastChild, positionalParamSegments = _a.positionalParamSegments;
    var newPaths = applyRedirectCommands(consumedPaths, route.redirectTo, positionalParamSegments);
    if (route.redirectTo.startsWith('/')) {
        throw new GlobalRedirect(newPaths);
    }
    else {
        return expandPathsWithParams(segment, routes, newPaths.concat(paths.slice(lastChild)), outlet, false);
    }
}
function matchPathsWithParamsAgainstRoute(segment, route, paths) {
    if (route.path === '**') {
        return new url_tree_1.UrlSegment(paths, {});
    }
    else {
        var _a = match(segment, route, paths), consumedPaths = _a.consumedPaths, lastChild = _a.lastChild;
        var childConfig = route.children ? route.children : [];
        var slicedPath = paths.slice(lastChild);
        if (childConfig.length === 0 && slicedPath.length === 0) {
            return new url_tree_1.UrlSegment(consumedPaths, {});
        }
        else if (slicedPath.length === 0 && segment.hasChildren()) {
            var children = expandSegmentChildren(childConfig, segment);
            return new url_tree_1.UrlSegment(consumedPaths, children);
        }
        else {
            var cs = expandPathsWithParams(segment, childConfig, slicedPath, shared_1.PRIMARY_OUTLET, true);
            return new url_tree_1.UrlSegment(consumedPaths.concat(cs.pathsWithParams), cs.children);
        }
    }
}
function match(segment, route, paths) {
    if (route.path === '') {
        if (route.terminal && (segment.hasChildren() || paths.length > 0)) {
            throw new NoMatch();
        }
        else {
            return { consumedPaths: [], lastChild: 0, positionalParamSegments: {} };
        }
    }
    var path = route.path;
    var parts = path.split('/');
    var positionalParamSegments = {};
    var consumedPaths = [];
    var currentIndex = 0;
    for (var i = 0; i < parts.length; ++i) {
        if (currentIndex >= paths.length)
            throw new NoMatch();
        var current = paths[currentIndex];
        var p = parts[i];
        var isPosParam = p.startsWith(':');
        if (!isPosParam && p !== current.path)
            throw new NoMatch();
        if (isPosParam) {
            positionalParamSegments[p.substring(1)] = current;
        }
        consumedPaths.push(current);
        currentIndex++;
    }
    if (route.terminal && (segment.hasChildren() || currentIndex < paths.length)) {
        throw new NoMatch();
    }
    return { consumedPaths: consumedPaths, lastChild: currentIndex, positionalParamSegments: positionalParamSegments };
}
function applyRedirectCommands(paths, redirectTo, posParams) {
    if (redirectTo.startsWith('/')) {
        var parts = redirectTo.substring(1).split('/');
        return createPaths(redirectTo, parts, paths, posParams);
    }
    else {
        var parts = redirectTo.split('/');
        return createPaths(redirectTo, parts, paths, posParams);
    }
}
function createPaths(redirectTo, parts, segments, posParams) {
    return parts.map(function (p) { return p.startsWith(':') ? findPosParam(p, posParams, redirectTo) :
        findOrCreatePath(p, segments); });
}
function findPosParam(part, posParams, redirectTo) {
    var paramName = part.substring(1);
    var pos = posParams[paramName];
    if (!pos)
        throw new Error("Cannot redirect to '" + redirectTo + "'. Cannot find '" + part + "'.");
    return pos;
}
function findOrCreatePath(part, paths) {
    var matchingIndex = paths.findIndex(function (s) { return s.path === part; });
    if (matchingIndex > -1) {
        var r = paths[matchingIndex];
        paths.splice(matchingIndex);
        return r;
    }
    else {
        return new url_tree_1.UrlPathWithParams(part, {});
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbHlfcmVkaXJlY3RzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FwcGx5X3JlZGlyZWN0cy50cyJdLCJuYW1lcyI6WyJOb01hdGNoIiwiTm9NYXRjaC5jb25zdHJ1Y3RvciIsIkdsb2JhbFJlZGlyZWN0IiwiR2xvYmFsUmVkaXJlY3QuY29uc3RydWN0b3IiLCJhcHBseVJlZGlyZWN0cyIsImNyZWF0ZVVybFRyZWUiLCJleHBhbmRTZWdtZW50IiwiZXhwYW5kU2VnbWVudENoaWxkcmVuIiwiZXhwYW5kUGF0aHNXaXRoUGFyYW1zIiwiZXhwYW5kUGF0aHNXaXRoUGFyYW1zQWdhaW5zdFJvdXRlIiwiZXhwYW5kUGF0aHNXaXRoUGFyYW1zQWdhaW5zdFJvdXRlVXNpbmdSZWRpcmVjdCIsImV4cGFuZFdpbGRDYXJkV2l0aFBhcmFtc0FnYWluc3RSb3V0ZVVzaW5nUmVkaXJlY3QiLCJleHBhbmRSZWd1bGFyUGF0aFdpdGhQYXJhbXNBZ2FpbnN0Um91dGVVc2luZ1JlZGlyZWN0IiwibWF0Y2hQYXRoc1dpdGhQYXJhbXNBZ2FpbnN0Um91dGUiLCJtYXRjaCIsImFwcGx5UmVkaXJlY3RDb21tYW5kcyIsImNyZWF0ZVBhdGhzIiwiZmluZFBvc1BhcmFtIiwiZmluZE9yQ3JlYXRlUGF0aCJdLCJtYXBwaW5ncyI6IkFBQUEsMkJBQXlCLGlCQUFpQixDQUFDLENBQUE7QUFFM0MsbUJBQWtCLG9CQUFvQixDQUFDLENBQUE7QUFHdkMsdUJBQTZCLFVBQVUsQ0FBQyxDQUFBO0FBQ3hDLHlCQUFrRSxZQUFZLENBQUMsQ0FBQTtBQUUvRTtJQUNFQSxpQkFBbUJBLE9BQTBCQTtRQUFqQ0MsdUJBQWlDQSxHQUFqQ0EsY0FBaUNBO1FBQTFCQSxZQUFPQSxHQUFQQSxPQUFPQSxDQUFtQkE7SUFBR0EsQ0FBQ0E7SUFDbkRELGNBQUNBO0FBQURBLENBQUNBLEFBRkQsSUFFQztBQUNEO0lBQ0VFLHdCQUFtQkEsS0FBMEJBO1FBQTFCQyxVQUFLQSxHQUFMQSxL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QSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtJQUNwQ0EsSUFBTUEsR0FBR0EsR0FBR0EsU0FBU0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0E7SUFDakNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBO1FBQUNBLE1BQU1BLElBQUlBLEtBQUtBLENBQUNBLHlCQUF1QkEsVUFBVUEsd0JBQW1CQSxJQUFJQSxPQUFJQSxDQUFDQSxDQUFDQTtJQUN4RkEsTUFBTUEsQ0FBQ0EsR0FBR0EsQ0FBQ0E7QUFDYkEsQ0FBQ0E7QUFFRCwwQkFBMEIsSUFBWSxFQUFFLEtBQTBCO0lBQ2hFQyxJQUFNQSxhQUFhQSxHQUFHQSxLQUFLQSxDQUFDQSxTQUFTQSxDQUFDQSxVQUFBQSxDQUFDQSxJQUFJQSxPQUFBQSxDQUFDQSxDQUFDQSxJQUFJQSxLQUFLQSxJQUFJQSxFQUFmQSxDQUFlQSxDQUFDQSxDQUFDQTtJQUM1REEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsYUFBYUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDdkJBLElBQU1BLENBQUNBLEdBQUdBLEtBQUtBLENBQUNBLGFBQWFBLENBQUNBLENBQUNBO1FBQy9CQSxLQUFLQSxDQUFDQSxNQUFNQSxDQUFDQSxhQUFhQSxDQUFDQSxDQUFDQTtRQUM1QkEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFDWEEsQ0FBQ0E7SUFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFDTkEsTUFBTUEsQ0FBQ0EsSUFBSUEsNEJBQWlCQSxDQUFDQSxJQUFJQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQTtJQUN6Q0EsQ0FBQ0E7QUFDSEEsQ0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMvT2JzZXJ2YWJsZSc7XHJcbmltcG9ydCB7T2JzZXJ2ZXJ9IGZyb20gJ3J4anMvT2JzZXJ2ZXInO1xyXG5pbXBvcnQge29mIH0gZnJvbSAncnhqcy9vYnNlcnZhYmxlL29mJztcclxuXHJcbmltcG9ydCB7Um91dGUsIFJvdXRlckNvbmZpZ30gZnJvbSAnLi9jb25maWcnO1xyXG5pbXBvcnQge1BSSU1BUllfT1VUTEVUfSBmcm9tICcuL3NoYXJlZCc7XHJcbmltcG9ydCB7VXJsUGF0aFdpdGhQYXJhbXMsIFVybFNlZ21lbnQsIFVybFRyZWUsIG1hcENoaWxkcmVufSBmcm9tICcuL3VybF90cmVlJztcclxuXHJcbmNsYXNzIE5vTWF0Y2gge1xyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBzZWdtZW50OiBVcmxTZWdtZW50ID0gbnVsbCkge31cclxufVxyXG5jbGFzcyBHbG9iYWxSZWRpcmVjdCB7XHJcbiAgY29uc3RydWN0b3IocHVibGljIHBhdGhzOiBVcmxQYXRoV2l0aFBhcmFtc1tdKSB7fVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYXBwbHlSZWRpcmVjdHModXJsVHJlZTogVXJsVHJlZSwgY29uZmlnOiBSb3V0ZXJDb25maWcpOiBPYnNlcnZhYmxlPFVybFRyZWU+IHtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGNyZWF0ZVVybFRyZWUodXJsVHJlZSwgZXhwYW5kU2VnbWVudChjb25maWcsIHVybFRyZWUucm9vdCwgUFJJTUFSWV9PVVRMRVQpKTtcclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBpZiAoZSBpbnN0YW5jZW9mIEdsb2JhbFJlZGlyZWN0KSB7XHJcbiAgICAgIHJldHVybiBjcmVhdGVVcmxUcmVlKFxyXG4gICAgICAgICAgdXJsVHJlZSwgbmV3IFVybFNlZ21lbnQoW10sIHtbUFJJTUFSWV9PVVRMRVRdOiBuZXcgVXJsU2VnbWVudChlLnBhdGhzLCB7fSl9KSk7XHJcbiAgICB9IGVsc2UgaWYgKGUgaW5zdGFuY2VvZiBOb01hdGNoKSB7XHJcbiAgICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxVcmxUcmVlPihcclxuICAgICAgICAgIChvYnM6IE9ic2VydmVyPFVybFRyZWU+KSA9PlxyXG4gICAgICAgICAgICAgIG9icy5lcnJvcihuZXcgRXJyb3IoYENhbm5vdCBtYXRjaCBhbnkgcm91dGVzOiAnJHtlLnNlZ21lbnR9J2ApKSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gbmV3IE9ic2VydmFibGU8VXJsVHJlZT4oKG9iczogT2JzZXJ2ZXI8VXJsVHJlZT4pID0+IG9icy5lcnJvcihlKSk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVVcmxUcmVlKHVybFRyZWU6IFVybFRyZWUsIHJvb3Q6IFVybFNlZ21lbnQpOiBPYnNlcnZhYmxlPFVybFRyZWU+IHtcclxuICByZXR1cm4gb2YgKG5ldyBVcmxUcmVlKHJvb3QsIHVybFRyZWUucXVlcnlQYXJhbXMsIHVybFRyZWUuZnJhZ21lbnQpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZXhwYW5kU2VnbWVudChyb3V0ZXM6IFJvdXRlW10sIHNlZ21lbnQ6IFVybFNlZ21lbnQsIG91dGxldDogc3RyaW5nKTogVXJsU2VnbWVudCB7XHJcbiAgaWYgKHNlZ21lbnQucGF0aHNXaXRoUGFyYW1zLmxlbmd0aCA9PT0gMCAmJiBzZWdtZW50Lmhhc0NoaWxkcmVuKCkpIHtcclxuICAgIHJldHVybiBuZXcgVXJsU2VnbWVudChbXSwgZXhwYW5kU2VnbWVudENoaWxkcmVuKHJvdXRlcywgc2VnbWVudCkpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gZXhwYW5kUGF0aHNXaXRoUGFyYW1zKHNlZ21lbnQsIHJvdXRlcywgc2VnbWVudC5wYXRoc1dpdGhQYXJhbXMsIG91dGxldCwgdHJ1ZSk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBleHBhbmRTZWdtZW50Q2hpbGRyZW4ocm91dGVzOiBSb3V0ZVtdLCBzZWdtZW50OiBVcmxTZWdtZW50KToge1tuYW1lOiBzdHJpbmddOiBVcmxTZWdtZW50fSB7XHJcbiAgcmV0dXJuIG1hcENoaWxkcmVuKHNlZ21lbnQsIChjaGlsZCwgY2hpbGRPdXRsZXQpID0+IGV4cGFuZFNlZ21lbnQocm91dGVzLCBjaGlsZCwgY2hpbGRPdXRsZXQpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZXhwYW5kUGF0aHNXaXRoUGFyYW1zKFxyXG4gICAgc2VnbWVudDogVXJsU2VnbWVudCwgcm91dGVzOiBSb3V0ZVtdLCBwYXRoczogVXJsUGF0aFdpdGhQYXJhbXNbXSwgb3V0bGV0OiBzdHJpbmcsXHJcbiAgICBhbGxvd1JlZGlyZWN0czogYm9vbGVhbik6IFVybFNlZ21lbnQge1xyXG4gIGZvciAobGV0IHIgb2Ygcm91dGVzKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICByZXR1cm4gZXhwYW5kUGF0aHNXaXRoUGFyYW1zQWdhaW5zdFJvdXRlKHNlZ21lbnQsIHJvdXRlcywgciwgcGF0aHMsIG91dGxldCwgYWxsb3dSZWRpcmVjdHMpO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBpZiAoIShlIGluc3RhbmNlb2YgTm9NYXRjaCkpIHRocm93IGU7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHRocm93IG5ldyBOb01hdGNoKHNlZ21lbnQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBleHBhbmRQYXRoc1dpdGhQYXJhbXNBZ2FpbnN0Um91dGUoXHJcbiAgICBzZWdtZW50OiBVcmxTZWdtZW50LCByb3V0ZXM6IFJvdXRlW10sIHJvdXRlOiBSb3V0ZSwgcGF0aHM6IFVybFBhdGhXaXRoUGFyYW1zW10sIG91dGxldDogc3RyaW5nLFxyXG4gICAgYWxsb3dSZWRpcmVjdHM6IGJvb2xlYW4pOiBVcmxTZWdtZW50IHtcclxuICBpZiAoKHJvdXRlLm91dGxldCA/IHJvdXRlLm91dGxldCA6IFBSSU1BUllfT1VUTEVUKSAhPT0gb3V0bGV0KSB0aHJvdyBuZXcgTm9NYXRjaCgpO1xyXG4gIGlmIChyb3V0ZS5yZWRpcmVjdFRvICYmICFhbGxvd1JlZGlyZWN0cykgdGhyb3cgbmV3IE5vTWF0Y2goKTtcclxuXHJcbiAgaWYgKHJvdXRlLnJlZGlyZWN0VG8pIHtcclxuICAgIHJldHVybiBleHBhbmRQYXRoc1dpdGhQYXJhbXNBZ2FpbnN0Um91dGVVc2luZ1JlZGlyZWN0KHNlZ21lbnQsIHJvdXRlcywgcm91dGUsIHBhdGhzLCBvdXRsZXQpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gbWF0Y2hQYXRoc1dpdGhQYXJhbXNBZ2FpbnN0Um91dGUoc2VnbWVudCwgcm91dGUsIHBhdGhzKTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGV4cGFuZFBhdGhzV2l0aFBhcmFtc0FnYWluc3RSb3V0ZVVzaW5nUmVkaXJlY3QoXHJcbiAgICBzZWdtZW50OiBVcmxTZWdtZW50LCByb3V0ZXM6IFJvdXRlW10sIHJvdXRlOiBSb3V0ZSwgcGF0aHM6IFVybFBhdGhXaXRoUGFyYW1zW10sXHJcbiAgICBvdXRsZXQ6IHN0cmluZyk6IFVybFNlZ21lbnQge1xyXG4gIGlmIChyb3V0ZS5wYXRoID09PSAnKionKSB7XHJcbiAgICByZXR1cm4gZXhwYW5kV2lsZENhcmRXaXRoUGFyYW1zQWdhaW5zdFJvdXRlVXNpbmdSZWRpcmVjdChyb3V0ZSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiBleHBhbmRSZWd1bGFyUGF0aFdpdGhQYXJhbXNBZ2FpbnN0Um91dGVVc2luZ1JlZGlyZWN0KFxyXG4gICAgICAgIHNlZ21lbnQsIHJvdXRlcywgcm91dGUsIHBhdGhzLCBvdXRsZXQpO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZXhwYW5kV2lsZENhcmRXaXRoUGFyYW1zQWdhaW5zdFJvdXRlVXNpbmdSZWRpcmVjdChyb3V0ZTogUm91dGUpOiBVcmxTZWdtZW50IHtcclxuICBjb25zdCBuZXdQYXRocyA9IGFwcGx5UmVkaXJlY3RDb21tYW5kcyhbXSwgcm91dGUucmVkaXJlY3RUbywge30pO1xyXG4gIGlmIChyb3V0ZS5yZWRpcmVjdFRvLnN0YXJ0c1dpdGgoJy8nKSkge1xyXG4gICAgdGhyb3cgbmV3IEdsb2JhbFJlZGlyZWN0KG5ld1BhdGhzKTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIG5ldyBVcmxTZWdtZW50KG5ld1BhdGhzLCB7fSk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBleHBhbmRSZWd1bGFyUGF0aFdpdGhQYXJhbXNBZ2FpbnN0Um91dGVVc2luZ1JlZGlyZWN0KFxyXG4gICAgc2VnbWVudDogVXJsU2VnbWVudCwgcm91dGVzOiBSb3V0ZVtdLCByb3V0ZTogUm91dGUsIHBhdGhzOiBVcmxQYXRoV2l0aFBhcmFtc1tdLFxyXG4gICAgb3V0bGV0OiBzdHJpbmcpOiBVcmxTZWdtZW50IHtcclxuICBjb25zdCB7Y29uc3VtZWRQYXRocywgbGFzdENoaWxkLCBwb3NpdGlvbmFsUGFyYW1TZWdtZW50c30gPSBtYXRjaChzZWdtZW50LCByb3V0ZSwgcGF0aHMpO1xyXG4gIGNvbnN0IG5ld1BhdGhzID1cclxuICAgICAgYXBwbHlSZWRpcmVjdENvbW1hbmRzKGNvbnN1bWVkUGF0aHMsIHJvdXRlLnJlZGlyZWN0VG8sIDxhbnk+cG9zaXRpb25hbFBhcmFtU2VnbWVudHMpO1xyXG4gIGlmIChyb3V0ZS5yZWRpcmVjdFRvLnN0YXJ0c1dpdGgoJy8nKSkge1xyXG4gICAgdGhyb3cgbmV3IEdsb2JhbFJlZGlyZWN0KG5ld1BhdGhzKTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIGV4cGFuZFBhdGhzV2l0aFBhcmFtcyhcclxuICAgICAgICBzZWdtZW50LCByb3V0ZXMsIG5ld1BhdGhzLmNvbmNhdChwYXRocy5zbGljZShsYXN0Q2hpbGQpKSwgb3V0bGV0LCBmYWxzZSk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBtYXRjaFBhdGhzV2l0aFBhcmFtc0FnYWluc3RSb3V0ZShcclxuICAgIHNlZ21lbnQ6IFVybFNlZ21lbnQsIHJvdXRlOiBSb3V0ZSwgcGF0aHM6IFVybFBhdGhXaXRoUGFyYW1zW10pOiBVcmxTZWdtZW50IHtcclxuICBpZiAocm91dGUucGF0aCA9PT0gJyoqJykge1xyXG4gICAgcmV0dXJuIG5ldyBVcmxTZWdtZW50KHBhdGhzLCB7fSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGNvbnN0IHtjb25zdW1lZFBhdGhzLCBsYXN0Q2hpbGR9ID0gbWF0Y2goc2VnbWVudCwgcm91dGUsIHBhdGhzKTtcclxuICAgIGNvbnN0IGNoaWxkQ29uZmlnID0gcm91dGUuY2hpbGRyZW4gPyByb3V0ZS5jaGlsZHJlbiA6IFtdO1xyXG4gICAgY29uc3Qgc2xpY2VkUGF0aCA9IHBhdGhzLnNsaWNlKGxhc3RDaGlsZCk7XHJcblxyXG4gICAgaWYgKGNoaWxkQ29uZmlnLmxlbmd0aCA9PT0gMCAmJiBzbGljZWRQYXRoLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICByZXR1cm4gbmV3IFVybFNlZ21lbnQoY29uc3VtZWRQYXRocywge30pO1xyXG5cclxuICAgICAgLy8gVE9ETzogY2hlY2sgdGhhdCB0aGUgcmlnaHQgc2VnbWVudCBpcyBwcmVzZW50XHJcbiAgICB9IGVsc2UgaWYgKHNsaWNlZFBhdGgubGVuZ3RoID09PSAwICYmIHNlZ21lbnQuaGFzQ2hpbGRyZW4oKSkge1xyXG4gICAgICBjb25zdCBjaGlsZHJlbiA9IGV4cGFuZFNlZ21lbnRDaGlsZHJlbihjaGlsZENvbmZpZywgc2VnbWVudCk7XHJcbiAgICAgIHJldHVybiBuZXcgVXJsU2VnbWVudChjb25zdW1lZFBhdGhzLCBjaGlsZHJlbik7XHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc3QgY3MgPSBleHBhbmRQYXRoc1dpdGhQYXJhbXMoc2VnbWVudCwgY2hpbGRDb25maWcsIHNsaWNlZFBhdGgsIFBSSU1BUllfT1VUTEVULCB0cnVlKTtcclxuICAgICAgcmV0dXJuIG5ldyBVcmxTZWdtZW50KGNvbnN1bWVkUGF0aHMuY29uY2F0KGNzLnBhdGhzV2l0aFBhcmFtcyksIGNzLmNoaWxkcmVuKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1hdGNoKHNlZ21lbnQ6IFVybFNlZ21lbnQsIHJvdXRlOiBSb3V0ZSwgcGF0aHM6IFVybFBhdGhXaXRoUGFyYW1zW10pOiB7XHJcbiAgY29uc3VtZWRQYXRoczogVXJsUGF0aFdpdGhQYXJhbXNbXSxcclxuICBsYXN0Q2hpbGQ6IG51bWJlcixcclxuICBwb3NpdGlvbmFsUGFyYW1TZWdtZW50czoge1trOiBzdHJpbmddOiBVcmxQYXRoV2l0aFBhcmFtc31cclxufSB7XHJcbiAgaWYgKHJvdXRlLnBhdGggPT09ICcnKSB7XHJcbiAgICBpZiAocm91dGUudGVybWluYWwgJiYgKHNlZ21lbnQuaGFzQ2hpbGRyZW4oKSB8fCBwYXRocy5sZW5ndGggPiAwKSkge1xyXG4gICAgICB0aHJvdyBuZXcgTm9NYXRjaCgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIHtjb25zdW1lZFBhdGhzOiBbXSwgbGFzdENoaWxkOiAwLCBwb3NpdGlvbmFsUGFyYW1TZWdtZW50czoge319O1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY29uc3QgcGF0aCA9IHJvdXRlLnBhdGg7XHJcbiAgY29uc3QgcGFydHMgPSBwYXRoLnNwbGl0KCcvJyk7XHJcbiAgY29uc3QgcG9zaXRpb25hbFBhcmFtU2VnbWVudHM6IHtbazogc3RyaW5nXTogVXJsUGF0aFdpdGhQYXJhbXN9ID0ge307XHJcbiAgY29uc3QgY29uc3VtZWRQYXRoczogVXJsUGF0aFdpdGhQYXJhbXNbXSA9IFtdO1xyXG5cclxuICBsZXQgY3VycmVudEluZGV4ID0gMDtcclxuXHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXJ0cy5sZW5ndGg7ICsraSkge1xyXG4gICAgaWYgKGN1cnJlbnRJbmRleCA+PSBwYXRocy5sZW5ndGgpIHRocm93IG5ldyBOb01hdGNoKCk7XHJcbiAgICBjb25zdCBjdXJyZW50ID0gcGF0aHNbY3VycmVudEluZGV4XTtcclxuXHJcbiAgICBjb25zdCBwID0gcGFydHNbaV07XHJcbiAgICBjb25zdCBpc1Bvc1BhcmFtID0gcC5zdGFydHNXaXRoKCc6Jyk7XHJcblxyXG4gICAgaWYgKCFpc1Bvc1BhcmFtICYmIHAgIT09IGN1cnJlbnQucGF0aCkgdGhyb3cgbmV3IE5vTWF0Y2goKTtcclxuICAgIGlmIChpc1Bvc1BhcmFtKSB7XHJcbiAgICAgIHBvc2l0aW9uYWxQYXJhbVNlZ21lbnRzW3Auc3Vic3RyaW5nKDEpXSA9IGN1cnJlbnQ7XHJcbiAgICB9XHJcbiAgICBjb25zdW1lZFBhdGhzLnB1c2goY3VycmVudCk7XHJcbiAgICBjdXJyZW50SW5kZXgrKztcclxuICB9XHJcblxyXG4gIGlmIChyb3V0ZS50ZXJtaW5hbCAmJiAoc2VnbWVudC5oYXNDaGlsZHJlbigpIHx8IGN1cnJlbnRJbmRleCA8IHBhdGhzLmxlbmd0aCkpIHtcclxuICAgIHRocm93IG5ldyBOb01hdGNoKCk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge2NvbnN1bWVkUGF0aHMsIGxhc3RDaGlsZDogY3VycmVudEluZGV4LCBwb3NpdGlvbmFsUGFyYW1TZWdtZW50c307XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFwcGx5UmVkaXJlY3RDb21tYW5kcyhcclxuICAgIHBhdGhzOiBVcmxQYXRoV2l0aFBhcmFtc1tdLCByZWRpcmVjdFRvOiBzdHJpbmcsXHJcbiAgICBwb3NQYXJhbXM6IHtbazogc3RyaW5nXTogVXJsUGF0aFdpdGhQYXJhbXN9KTogVXJsUGF0aFdpdGhQYXJhbXNbXSB7XHJcbiAgaWYgKHJlZGlyZWN0VG8uc3RhcnRzV2l0aCgnLycpKSB7XHJcbiAgICBjb25zdCBwYXJ0cyA9IHJlZGlyZWN0VG8uc3Vic3RyaW5nKDEpLnNwbGl0KCcvJyk7XHJcbiAgICByZXR1cm4gY3JlYXRlUGF0aHMocmVkaXJlY3RUbywgcGFydHMsIHBhdGhzLCBwb3NQYXJhbXMpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBjb25zdCBwYXJ0cyA9IHJlZGlyZWN0VG8uc3BsaXQoJy8nKTtcclxuICAgIHJldHVybiBjcmVhdGVQYXRocyhyZWRpcmVjdFRvLCBwYXJ0cywgcGF0aHMsIHBvc1BhcmFtcyk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVQYXRocyhcclxuICAgIHJlZGlyZWN0VG86IHN0cmluZywgcGFydHM6IHN0cmluZ1tdLCBzZWdtZW50czogVXJsUGF0aFdpdGhQYXJhbXNbXSxcclxuICAgIHBvc1BhcmFtczoge1trOiBzdHJpbmddOiBVcmxQYXRoV2l0aFBhcmFtc30pOiBVcmxQYXRoV2l0aFBhcmFtc1tdIHtcclxuICByZXR1cm4gcGFydHMubWFwKFxyXG4gICAgICBwID0+IHAuc3RhcnRzV2l0aCgnOicpID8gZmluZFBvc1BhcmFtKHAsIHBvc1BhcmFtcywgcmVkaXJlY3RUbykgOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmluZE9yQ3JlYXRlUGF0aChwLCBzZWdtZW50cykpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBmaW5kUG9zUGFyYW0oXHJcbiAgICBwYXJ0OiBzdHJpbmcsIHBvc1BhcmFtczoge1trOiBzdHJpbmddOiBVcmxQYXRoV2l0aFBhcmFtc30sXHJcbiAgICByZWRpcmVjdFRvOiBzdHJpbmcpOiBVcmxQYXRoV2l0aFBhcmFtcyB7XHJcbiAgY29uc3QgcGFyYW1OYW1lID0gcGFydC5zdWJzdHJpbmcoMSk7XHJcbiAgY29uc3QgcG9zID0gcG9zUGFyYW1zW3BhcmFtTmFtZV07XHJcbiAgaWYgKCFwb3MpIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IHJlZGlyZWN0IHRvICcke3JlZGlyZWN0VG99Jy4gQ2Fubm90IGZpbmQgJyR7cGFydH0nLmApO1xyXG4gIHJldHVybiBwb3M7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZpbmRPckNyZWF0ZVBhdGgocGFydDogc3RyaW5nLCBwYXRoczogVXJsUGF0aFdpdGhQYXJhbXNbXSk6IFVybFBhdGhXaXRoUGFyYW1zIHtcclxuICBjb25zdCBtYXRjaGluZ0luZGV4ID0gcGF0aHMuZmluZEluZGV4KHMgPT4gcy5wYXRoID09PSBwYXJ0KTtcclxuICBpZiAobWF0Y2hpbmdJbmRleCA+IC0xKSB7XHJcbiAgICBjb25zdCByID0gcGF0aHNbbWF0Y2hpbmdJbmRleF07XHJcbiAgICBwYXRocy5zcGxpY2UobWF0Y2hpbmdJbmRleCk7XHJcbiAgICByZXR1cm4gcjtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIG5ldyBVcmxQYXRoV2l0aFBhcmFtcyhwYXJ0LCB7fSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==