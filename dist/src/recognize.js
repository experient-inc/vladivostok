var Observable_1 = require('rxjs/Observable');
var of_1 = require('rxjs/observable/of');
var router_state_1 = require('./router_state');
var shared_1 = require('./shared');
var url_tree_1 = require('./url_tree');
var collection_1 = require('./utils/collection');
var tree_1 = require('./utils/tree');
var NoMatch = (function () {
    function NoMatch(segment) {
        if (segment === void 0) { segment = null; }
        this.segment = segment;
    }
    return NoMatch;
})();
function recognize(rootComponentType, config, urlTree, url) {
    try {
        var children = processSegment(config, urlTree.root, {}, shared_1.PRIMARY_OUTLET);
        var root = new router_state_1.ActivatedRouteSnapshot([], {}, shared_1.PRIMARY_OUTLET, rootComponentType, null, urlTree.root, -1);
        var rootNode = new tree_1.TreeNode(root, children);
        return of_1.of(new router_state_1.RouterStateSnapshot(url, rootNode, urlTree.queryParams, urlTree.fragment));
    }
    catch (e) {
        if (e instanceof NoMatch) {
            return new Observable_1.Observable(function (obs) {
                return obs.error(new Error("Cannot match any routes: '" + e.segment + "'"));
            });
        }
        else {
            return new Observable_1.Observable(function (obs) { return obs.error(e); });
        }
    }
}
exports.recognize = recognize;
function processSegment(config, segment, extraParams, outlet) {
    if (segment.pathsWithParams.length === 0 && segment.hasChildren()) {
        return processSegmentChildren(config, segment, extraParams);
    }
    else {
        return [processPathsWithParams(config, segment, 0, segment.pathsWithParams, extraParams, outlet)];
    }
}
function processSegmentChildren(config, segment, extraParams) {
    var children = url_tree_1.mapChildrenIntoArray(segment, function (child, childOutlet) { return processSegment(config, child, extraParams, childOutlet); });
    checkOutletNameUniqueness(children);
    sortActivatedRouteSnapshots(children);
    return children;
}
function sortActivatedRouteSnapshots(nodes) {
    nodes.sort(function (a, b) {
        if (a.value.outlet === shared_1.PRIMARY_OUTLET)
            return -1;
        if (b.value.outlet === shared_1.PRIMARY_OUTLET)
            return 1;
        return a.value.outlet.localeCompare(b.value.outlet);
    });
}
function processPathsWithParams(config, segment, pathIndex, paths, extraParams, outlet) {
    for (var _i = 0; _i < config.length; _i++) {
        var r = config[_i];
        try {
            return processPathsWithParamsAgainstRoute(r, segment, pathIndex, paths, extraParams, outlet);
        }
        catch (e) {
            if (!(e instanceof NoMatch))
                throw e;
        }
    }
    throw new NoMatch(segment);
}
function processPathsWithParamsAgainstRoute(route, segment, pathIndex, paths, parentExtraParams, outlet) {
    if (route.redirectTo)
        throw new NoMatch();
    if ((route.outlet ? route.outlet : shared_1.PRIMARY_OUTLET) !== outlet)
        throw new NoMatch();
    if (route.path === '**') {
        var params = paths.length > 0 ? collection_1.last(paths).parameters : {};
        var snapshot_1 = new router_state_1.ActivatedRouteSnapshot(paths, collection_1.merge(parentExtraParams, params), outlet, route.component, route, segment, -1);
        return new tree_1.TreeNode(snapshot_1, []);
    }
    var _a = match(segment, route, paths, parentExtraParams), consumedPaths = _a.consumedPaths, parameters = _a.parameters, extraParams = _a.extraParams, lastChild = _a.lastChild;
    var snapshot = new router_state_1.ActivatedRouteSnapshot(consumedPaths, parameters, outlet, route.component, route, segment, pathIndex + lastChild - 1);
    var slicedPath = paths.slice(lastChild);
    var childConfig = route.children ? route.children : [];
    if (childConfig.length === 0 && slicedPath.length === 0) {
        return new tree_1.TreeNode(snapshot, []);
    }
    else if (slicedPath.length === 0 && segment.hasChildren()) {
        var children = processSegmentChildren(childConfig, segment, extraParams);
        return new tree_1.TreeNode(snapshot, children);
    }
    else {
        var child = processPathsWithParams(childConfig, segment, pathIndex + lastChild, slicedPath, extraParams, shared_1.PRIMARY_OUTLET);
        return new tree_1.TreeNode(snapshot, [child]);
    }
}
function match(segment, route, paths, parentExtraParams) {
    if (route.path === '') {
        if (route.terminal && (segment.hasChildren() || paths.length > 0)) {
            throw new NoMatch();
        }
        else {
            return { consumedPaths: [], lastChild: 0, parameters: {}, extraParams: {} };
        }
    }
    var path = route.path;
    var parts = path.split('/');
    var posParameters = {};
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
            posParameters[p.substring(1)] = current.path;
        }
        consumedPaths.push(current);
        currentIndex++;
    }
    if (route.terminal && (segment.hasChildren() || currentIndex < paths.length)) {
        throw new NoMatch();
    }
    var parameters = collection_1.merge(parentExtraParams, collection_1.merge(posParameters, consumedPaths[consumedPaths.length - 1].parameters));
    var extraParams = route.component ? {} : parameters;
    return { consumedPaths: consumedPaths, lastChild: currentIndex, parameters: parameters, extraParams: extraParams };
}
function checkOutletNameUniqueness(nodes) {
    var names = {};
    nodes.forEach(function (n) {
        var routeWithSameOutletName = names[n.value.outlet];
        if (routeWithSameOutletName) {
            var p = routeWithSameOutletName.url.map(function (s) { return s.toString(); }).join('/');
            var c = n.value.url.map(function (s) { return s.toString(); }).join('/');
            throw new Error("Two segments cannot have the same outlet name: '" + p + "' and '" + c + "'.");
        }
        names[n.value.outlet] = n.value;
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjb2duaXplLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JlY29nbml6ZS50cyJdLCJuYW1lcyI6WyJOb01hdGNoIiwiTm9NYXRjaC5jb25zdHJ1Y3RvciIsInJlY29nbml6ZSIsInByb2Nlc3NTZWdtZW50IiwicHJvY2Vzc1NlZ21lbnRDaGlsZHJlbiIsInNvcnRBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90cyIsInByb2Nlc3NQYXRoc1dpdGhQYXJhbXMiLCJwcm9jZXNzUGF0aHNXaXRoUGFyYW1zQWdhaW5zdFJvdXRlIiwibWF0Y2giLCJjaGVja091dGxldE5hbWVVbmlxdWVuZXNzIl0sIm1hcHBpbmdzIjoiQUFDQSwyQkFBeUIsaUJBQWlCLENBQUMsQ0FBQTtBQUUzQyxtQkFBa0Isb0JBQW9CLENBQUMsQ0FBQTtBQUd2Qyw2QkFBMEQsZ0JBQWdCLENBQUMsQ0FBQTtBQUMzRSx1QkFBcUMsVUFBVSxDQUFDLENBQUE7QUFDaEQseUJBQTJFLFlBQVksQ0FBQyxDQUFBO0FBQ3hGLDJCQUEwQixvQkFBb0IsQ0FBQyxDQUFBO0FBQy9DLHFCQUF1QixjQUFjLENBQUMsQ0FBQTtBQUV0QztJQUNFQSxpQkFBbUJBLE9BQTBCQTtRQUFqQ0MsdUJBQWlDQSxHQUFqQ0EsY0FBaUNBO1FBQTFCQSxZQUFPQSxHQUFQQSxPQUFPQSxDQUFtQkE7SUFBR0EsQ0FBQ0E7SUFDbkRELGNBQUNBO0FBQURBLENBQUNBLEFBRkQsSUFFQztBQUVELG1CQUNJLGlCQUF1QixFQUFFLE1BQW9CLEVBQUUsT0FBZ0IsRUFDL0QsR0FBVztJQUNiRSxJQUFJQSxDQUFDQTtRQUNIQSxJQUFNQSxRQUFRQSxHQUFHQSxjQUFjQSxDQUFDQSxNQUFNQSxFQUFFQSxPQUFPQSxDQUFDQSxJQUFJQSxFQUFFQSxFQUFFQSxFQUFFQSx1QkFBY0EsQ0FBQ0EsQ0FBQ0E7UUFDMUVBLElBQU1BLElBQUlBLEdBQUdBLElBQUlBLHFDQUFzQkEsQ0FDbkNBLEVBQUVBLEVBQUVBLEVBQUVBLEVB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TUFBTUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0E7SUFDbENBLENBQUNBLENBQUNBLENBQUNBO0FBQ0xBLENBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtUeXBlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tICdyeGpzL09ic2VydmFibGUnO1xyXG5pbXBvcnQge09ic2VydmVyfSBmcm9tICdyeGpzL09ic2VydmVyJztcclxuaW1wb3J0IHtvZiB9IGZyb20gJ3J4anMvb2JzZXJ2YWJsZS9vZic7XHJcblxyXG5pbXBvcnQge1JvdXRlLCBSb3V0ZXJDb25maWd9IGZyb20gJy4vY29uZmlnJztcclxuaW1wb3J0IHtBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90LCBSb3V0ZXJTdGF0ZVNuYXBzaG90fSBmcm9tICcuL3JvdXRlcl9zdGF0ZSc7XHJcbmltcG9ydCB7UFJJTUFSWV9PVVRMRVQsIFBhcmFtc30gZnJvbSAnLi9zaGFyZWQnO1xyXG5pbXBvcnQge1VybFBhdGhXaXRoUGFyYW1zLCBVcmxTZWdtZW50LCBVcmxUcmVlLCBtYXBDaGlsZHJlbkludG9BcnJheX0gZnJvbSAnLi91cmxfdHJlZSc7XHJcbmltcG9ydCB7bGFzdCwgbWVyZ2V9IGZyb20gJy4vdXRpbHMvY29sbGVjdGlvbic7XHJcbmltcG9ydCB7VHJlZU5vZGV9IGZyb20gJy4vdXRpbHMvdHJlZSc7XHJcblxyXG5jbGFzcyBOb01hdGNoIHtcclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgc2VnbWVudDogVXJsU2VnbWVudCA9IG51bGwpIHt9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZWNvZ25pemUoXHJcbiAgICByb290Q29tcG9uZW50VHlwZTogVHlwZSwgY29uZmlnOiBSb3V0ZXJDb25maWcsIHVybFRyZWU6IFVybFRyZWUsXHJcbiAgICB1cmw6IHN0cmluZyk6IE9ic2VydmFibGU8Um91dGVyU3RhdGVTbmFwc2hvdD4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBjaGlsZHJlbiA9IHByb2Nlc3NTZWdtZW50KGNvbmZpZywgdXJsVHJlZS5yb290LCB7fSwgUFJJTUFSWV9PVVRMRVQpO1xyXG4gICAgY29uc3Qgcm9vdCA9IG5ldyBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90KFxyXG4gICAgICAgIFtdLCB7fSwgUFJJTUFSWV9PVVRMRVQsIHJvb3RDb21wb25lbnRUeXBlLCBudWxsLCB1cmxUcmVlLnJvb3QsIC0xKTtcclxuICAgIGNvbnN0IHJvb3ROb2RlID0gbmV3IFRyZWVOb2RlPEFjdGl2YXRlZFJvdXRlU25hcHNob3Q+KHJvb3QsIGNoaWxkcmVuKTtcclxuICAgIHJldHVybiBvZiAobmV3IFJvdXRlclN0YXRlU25hcHNob3QodXJsLCByb290Tm9kZSwgdXJsVHJlZS5xdWVyeVBhcmFtcywgdXJsVHJlZS5mcmFnbWVudCkpO1xyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIGlmIChlIGluc3RhbmNlb2YgTm9NYXRjaCkge1xyXG4gICAgICByZXR1cm4gbmV3IE9ic2VydmFibGU8Um91dGVyU3RhdGVTbmFwc2hvdD4oXHJcbiAgICAgICAgICAob2JzOiBPYnNlcnZlcjxSb3V0ZXJTdGF0ZVNuYXBzaG90PikgPT5cclxuICAgICAgICAgICAgICBvYnMuZXJyb3IobmV3IEVycm9yKGBDYW5ub3QgbWF0Y2ggYW55IHJvdXRlczogJyR7ZS5zZWdtZW50fSdgKSkpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPFJvdXRlclN0YXRlU25hcHNob3Q+KFxyXG4gICAgICAgICAgKG9iczogT2JzZXJ2ZXI8Um91dGVyU3RhdGVTbmFwc2hvdD4pID0+IG9icy5lcnJvcihlKSk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBwcm9jZXNzU2VnbWVudChjb25maWc6IFJvdXRlW10sIHNlZ21lbnQ6IFVybFNlZ21lbnQsIGV4dHJhUGFyYW1zOiBQYXJhbXMsIG91dGxldDogc3RyaW5nKTpcclxuICAgIFRyZWVOb2RlPEFjdGl2YXRlZFJvdXRlU25hcHNob3Q+W10ge1xyXG4gIGlmIChzZWdtZW50LnBhdGhzV2l0aFBhcmFtcy5sZW5ndGggPT09IDAgJiYgc2VnbWVudC5oYXNDaGlsZHJlbigpKSB7XHJcbiAgICByZXR1cm4gcHJvY2Vzc1NlZ21lbnRDaGlsZHJlbihjb25maWcsIHNlZ21lbnQsIGV4dHJhUGFyYW1zKTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIFtwcm9jZXNzUGF0aHNXaXRoUGFyYW1zKFxyXG4gICAgICAgIGNvbmZpZywgc2VnbWVudCwgMCwgc2VnbWVudC5wYXRoc1dpdGhQYXJhbXMsIGV4dHJhUGFyYW1zLCBvdXRsZXQpXTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHByb2Nlc3NTZWdtZW50Q2hpbGRyZW4oXHJcbiAgICBjb25maWc6IFJvdXRlW10sIHNlZ21lbnQ6IFVybFNlZ21lbnQsIGV4dHJhUGFyYW1zOiBQYXJhbXMpOiBUcmVlTm9kZTxBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90PltdIHtcclxuICBjb25zdCBjaGlsZHJlbiA9IG1hcENoaWxkcmVuSW50b0FycmF5KFxyXG4gICAgICBzZWdtZW50LCAoY2hpbGQsIGNoaWxkT3V0bGV0KSA9PiBwcm9jZXNzU2VnbWVudChjb25maWcsIGNoaWxkLCBleHRyYVBhcmFtcywgY2hpbGRPdXRsZXQpKTtcclxuICBjaGVja091dGxldE5hbWVVbmlxdWVuZXNzKGNoaWxkcmVuKTtcclxuICBzb3J0QWN0aXZhdGVkUm91dGVTbmFwc2hvdHMoY2hpbGRyZW4pO1xyXG4gIHJldHVybiBjaGlsZHJlbjtcclxufVxyXG5cclxuZnVuY3Rpb24gc29ydEFjdGl2YXRlZFJvdXRlU25hcHNob3RzKG5vZGVzOiBUcmVlTm9kZTxBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90PltdKTogdm9pZCB7XHJcbiAgbm9kZXMuc29ydCgoYSwgYikgPT4ge1xyXG4gICAgaWYgKGEudmFsdWUub3V0bGV0ID09PSBQUklNQVJZX09VVExFVCkgcmV0dXJuIC0xO1xyXG4gICAgaWYgKGIudmFsdWUub3V0bGV0ID09PSBQUklNQVJZX09VVExFVCkgcmV0dXJuIDE7XHJcbiAgICByZXR1cm4gYS52YWx1ZS5vdXRsZXQubG9jYWxlQ29tcGFyZShiLnZhbHVlLm91dGxldCk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHByb2Nlc3NQYXRoc1dpdGhQYXJhbXMoXHJcbiAgICBjb25maWc6IFJvdXRlW10sIHNlZ21lbnQ6IFVybFNlZ21lbnQsIHBhdGhJbmRleDogbnVtYmVyLCBwYXRoczogVXJsUGF0aFdpdGhQYXJhbXNbXSxcclxuICAgIGV4dHJhUGFyYW1zOiBQYXJhbXMsIG91dGxldDogc3RyaW5nKTogVHJlZU5vZGU8QWN0aXZhdGVkUm91dGVTbmFwc2hvdD4ge1xyXG4gIGZvciAobGV0IHIgb2YgY29uZmlnKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICByZXR1cm4gcHJvY2Vzc1BhdGhzV2l0aFBhcmFtc0FnYWluc3RSb3V0ZShyLCBzZWdtZW50LCBwYXRoSW5kZXgsIHBhdGhzLCBleHRyYVBhcmFtcywgb3V0bGV0KTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgaWYgKCEoZSBpbnN0YW5jZW9mIE5vTWF0Y2gpKSB0aHJvdyBlO1xyXG4gICAgfVxyXG4gIH1cclxuICB0aHJvdyBuZXcgTm9NYXRjaChzZWdtZW50KTtcclxufVxyXG5cclxuZnVuY3Rpb24gcHJvY2Vzc1BhdGhzV2l0aFBhcmFtc0FnYWluc3RSb3V0ZShcclxuICAgIHJvdXRlOiBSb3V0ZSwgc2VnbWVudDogVXJsU2VnbWVudCwgcGF0aEluZGV4OiBudW1iZXIsIHBhdGhzOiBVcmxQYXRoV2l0aFBhcmFtc1tdLFxyXG4gICAgcGFyZW50RXh0cmFQYXJhbXM6IFBhcmFtcywgb3V0bGV0OiBzdHJpbmcpOiBUcmVlTm9kZTxBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90PiB7XHJcbiAgaWYgKHJvdXRlLnJlZGlyZWN0VG8pIHRocm93IG5ldyBOb01hdGNoKCk7XHJcblxyXG4gIGlmICgocm91dGUub3V0bGV0ID8gcm91dGUub3V0bGV0IDogUFJJTUFSWV9PVVRMRVQpICE9PSBvdXRsZXQpIHRocm93IG5ldyBOb01hdGNoKCk7XHJcblxyXG4gIGlmIChyb3V0ZS5wYXRoID09PSAnKionKSB7XHJcbiAgICBjb25zdCBwYXJhbXMgPSBwYXRocy5sZW5ndGggPiAwID8gbGFzdChwYXRocykucGFyYW1ldGVycyA6IHt9O1xyXG4gICAgY29uc3Qgc25hcHNob3QgPSBuZXcgQWN0aXZhdGVkUm91dGVTbmFwc2hvdChcclxuICAgICAgICBwYXRocywgbWVyZ2UocGFyZW50RXh0cmFQYXJhbXMsIHBhcmFtcyksIG91dGxldCwgcm91dGUuY29tcG9uZW50LCByb3V0ZSwgc2VnbWVudCwgLTEpO1xyXG4gICAgcmV0dXJuIG5ldyBUcmVlTm9kZTxBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90PihzbmFwc2hvdCwgW10pO1xyXG4gIH1cclxuXHJcbiAgY29uc3Qge2NvbnN1bWVkUGF0aHMsIHBhcmFtZXRlcnMsIGV4dHJhUGFyYW1zLCBsYXN0Q2hpbGR9ID1cclxuICAgICAgbWF0Y2goc2VnbWVudCwgcm91dGUsIHBhdGhzLCBwYXJlbnRFeHRyYVBhcmFtcyk7XHJcbiAgY29uc3Qgc25hcHNob3QgPSBuZXcgQWN0aXZhdGVkUm91dGVTbmFwc2hvdChcclxuICAgICAgY29uc3VtZWRQYXRocywgcGFyYW1ldGVycywgb3V0bGV0LCByb3V0ZS5jb21wb25lbnQsIHJvdXRlLCBzZWdtZW50LFxyXG4gICAgICBwYXRoSW5kZXggKyBsYXN0Q2hpbGQgLSAxKTtcclxuICBjb25zdCBzbGljZWRQYXRoID0gcGF0aHMuc2xpY2UobGFzdENoaWxkKTtcclxuICBjb25zdCBjaGlsZENvbmZpZyA9IHJvdXRlLmNoaWxkcmVuID8gcm91dGUuY2hpbGRyZW4gOiBbXTtcclxuXHJcbiAgaWYgKGNoaWxkQ29uZmlnLmxlbmd0aCA9PT0gMCAmJiBzbGljZWRQYXRoLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgcmV0dXJuIG5ldyBUcmVlTm9kZTxBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90PihzbmFwc2hvdCwgW10pO1xyXG5cclxuICAgIC8vIFRPRE86IGNoZWNrIHRoYXQgdGhlIHJpZ2h0IHNlZ21lbnQgaXMgcHJlc2VudFxyXG4gIH0gZWxzZSBpZiAoc2xpY2VkUGF0aC5sZW5ndGggPT09IDAgJiYgc2VnbWVudC5oYXNDaGlsZHJlbigpKSB7XHJcbiAgICBjb25zdCBjaGlsZHJlbiA9IHByb2Nlc3NTZWdtZW50Q2hpbGRyZW4oY2hpbGRDb25maWcsIHNlZ21lbnQsIGV4dHJhUGFyYW1zKTtcclxuICAgIHJldHVybiBuZXcgVHJlZU5vZGU8QWN0aXZhdGVkUm91dGVTbmFwc2hvdD4oc25hcHNob3QsIGNoaWxkcmVuKTtcclxuXHJcbiAgfSBlbHNlIHtcclxuICAgIGNvbnN0IGNoaWxkID0gcHJvY2Vzc1BhdGhzV2l0aFBhcmFtcyhcclxuICAgICAgICBjaGlsZENvbmZpZywgc2VnbWVudCwgcGF0aEluZGV4ICsgbGFzdENoaWxkLCBzbGljZWRQYXRoLCBleHRyYVBhcmFtcywgUFJJTUFSWV9PVVRMRVQpO1xyXG4gICAgcmV0dXJuIG5ldyBUcmVlTm9kZTxBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90PihzbmFwc2hvdCwgW2NoaWxkXSk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBtYXRjaChcclxuICAgIHNlZ21lbnQ6IFVybFNlZ21lbnQsIHJvdXRlOiBSb3V0ZSwgcGF0aHM6IFVybFBhdGhXaXRoUGFyYW1zW10sIHBhcmVudEV4dHJhUGFyYW1zOiBQYXJhbXMpIHtcclxuICBpZiAocm91dGUucGF0aCA9PT0gJycpIHtcclxuICAgIGlmIChyb3V0ZS50ZXJtaW5hbCAmJiAoc2VnbWVudC5oYXNDaGlsZHJlbigpIHx8IHBhdGhzLmxlbmd0aCA+IDApKSB7XHJcbiAgICAgIHRocm93IG5ldyBOb01hdGNoKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4ge2NvbnN1bWVkUGF0aHM6IFtdLCBsYXN0Q2hpbGQ6IDAsIHBhcmFtZXRlcnM6IHt9LCBleHRyYVBhcmFtczoge319O1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY29uc3QgcGF0aCA9IHJvdXRlLnBhdGg7XHJcbiAgY29uc3QgcGFydHMgPSBwYXRoLnNwbGl0KCcvJyk7XHJcbiAgY29uc3QgcG9zUGFyYW1ldGVyczoge1trZXk6IHN0cmluZ106IGFueX0gPSB7fTtcclxuICBjb25zdCBjb25zdW1lZFBhdGhzOiBVcmxQYXRoV2l0aFBhcmFtc1tdID0gW107XHJcblxyXG4gIGxldCBjdXJyZW50SW5kZXggPSAwO1xyXG5cclxuICBmb3IgKGxldCBpID0gMDsgaSA8IHBhcnRzLmxlbmd0aDsgKytpKSB7XHJcbiAgICBpZiAoY3VycmVudEluZGV4ID49IHBhdGhzLmxlbmd0aCkgdGhyb3cgbmV3IE5vTWF0Y2goKTtcclxuICAgIGNvbnN0IGN1cnJlbnQgPSBwYXRoc1tjdXJyZW50SW5kZXhdO1xyXG5cclxuICAgIGNvbnN0IHAgPSBwYXJ0c1tpXTtcclxuICAgIGNvbnN0IGlzUG9zUGFyYW0gPSBwLnN0YXJ0c1dpdGgoJzonKTtcclxuXHJcbiAgICBpZiAoIWlzUG9zUGFyYW0gJiYgcCAhPT0gY3VycmVudC5wYXRoKSB0aHJvdyBuZXcgTm9NYXRjaCgpO1xyXG4gICAgaWYgKGlzUG9zUGFyYW0pIHtcclxuICAgICAgcG9zUGFyYW1ldGVyc1twLnN1YnN0cmluZygxKV0gPSBjdXJyZW50LnBhdGg7XHJcbiAgICB9XHJcbiAgICBjb25zdW1lZFBhdGhzLnB1c2goY3VycmVudCk7XHJcbiAgICBjdXJyZW50SW5kZXgrKztcclxuICB9XHJcblxyXG4gIGlmIChyb3V0ZS50ZXJtaW5hbCAmJiAoc2VnbWVudC5oYXNDaGlsZHJlbigpIHx8IGN1cnJlbnRJbmRleCA8IHBhdGhzLmxlbmd0aCkpIHtcclxuICAgIHRocm93IG5ldyBOb01hdGNoKCk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBwYXJhbWV0ZXJzID0gbWVyZ2UoXHJcbiAgICAgIHBhcmVudEV4dHJhUGFyYW1zLCBtZXJnZShwb3NQYXJhbWV0ZXJzLCBjb25zdW1lZFBhdGhzW2NvbnN1bWVkUGF0aHMubGVuZ3RoIC0gMV0ucGFyYW1ldGVycykpO1xyXG4gIGNvbnN0IGV4dHJhUGFyYW1zID0gcm91dGUuY29tcG9uZW50ID8ge30gOiBwYXJhbWV0ZXJzO1xyXG4gIHJldHVybiB7Y29uc3VtZWRQYXRocywgbGFzdENoaWxkOiBjdXJyZW50SW5kZXgsIHBhcmFtZXRlcnMsIGV4dHJhUGFyYW1zfTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2hlY2tPdXRsZXROYW1lVW5pcXVlbmVzcyhub2RlczogVHJlZU5vZGU8QWN0aXZhdGVkUm91dGVTbmFwc2hvdD5bXSk6IHZvaWQge1xyXG4gIGNvbnN0IG5hbWVzOiB7W2s6IHN0cmluZ106IEFjdGl2YXRlZFJvdXRlU25hcHNob3R9ID0ge307XHJcbiAgbm9kZXMuZm9yRWFjaChuID0+IHtcclxuICAgIGxldCByb3V0ZVdpdGhTYW1lT3V0bGV0TmFtZSA9IG5hbWVzW24udmFsdWUub3V0bGV0XTtcclxuICAgIGlmIChyb3V0ZVdpdGhTYW1lT3V0bGV0TmFtZSkge1xyXG4gICAgICBjb25zdCBwID0gcm91dGVXaXRoU2FtZU91dGxldE5hbWUudXJsLm1hcChzID0+IHMudG9TdHJpbmcoKSkuam9pbignLycpO1xyXG4gICAgICBjb25zdCBjID0gbi52YWx1ZS51cmwubWFwKHMgPT4gcy50b1N0cmluZygpKS5qb2luKCcvJyk7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVHdvIHNlZ21lbnRzIGNhbm5vdCBoYXZlIHRoZSBzYW1lIG91dGxldCBuYW1lOiAnJHtwfScgYW5kICcke2N9Jy5gKTtcclxuICAgIH1cclxuICAgIG5hbWVzW24udmFsdWUub3V0bGV0XSA9IG4udmFsdWU7XHJcbiAgfSk7XHJcbn0iXX0=