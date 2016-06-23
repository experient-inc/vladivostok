var shared_1 = require('./shared');
var url_serializer_1 = require('./url_serializer');
var collection_1 = require('./utils/collection');
function createEmptyUrlTree() {
    return new UrlTree(new UrlSegment([], {}), {}, null);
}
exports.createEmptyUrlTree = createEmptyUrlTree;
function containsTree(container, containee, exact) {
    if (exact) {
        return equalSegments(container.root, containee.root);
    }
    else {
        return containsSegment(container.root, containee.root);
    }
}
exports.containsTree = containsTree;
function equalSegments(container, containee) {
    if (!equalPath(container.pathsWithParams, containee.pathsWithParams))
        return false;
    if (Object.keys(container.children).length !== Object.keys(containee.children).length)
        return false;
    for (var c in containee.children) {
        if (!container.children[c])
            return false;
        if (!equalSegments(container.children[c], containee.children[c]))
            return false;
    }
    return true;
}
function containsSegment(container, containee) {
    return containsSegmentHelper(container, containee, containee.pathsWithParams);
}
function containsSegmentHelper(container, containee, containeePaths) {
    if (!container)
        return false;
    if (container.pathsWithParams.length > containeePaths.length) {
        var current = container.pathsWithParams.slice(0, containeePaths.length);
        if (!equalPath(current, containeePaths))
            return false;
        if (Object.keys(containee.children).length > 0)
            return false;
        return true;
    }
    else if (container.pathsWithParams.length === containeePaths.length) {
        if (!equalPath(container.pathsWithParams, containeePaths))
            return false;
        for (var c in containee.children) {
            if (!container.children[c])
                return false;
            if (!containsSegment(container.children[c], containee.children[c]))
                return false;
        }
        return true;
    }
    else {
        var current = containeePaths.slice(0, container.pathsWithParams.length);
        var next = containeePaths.slice(container.pathsWithParams.length);
        if (!equalPath(container.pathsWithParams, current))
            return false;
        return containsSegmentHelper(container.children[shared_1.PRIMARY_OUTLET], containee, next);
    }
}
var UrlTree = (function () {
    function UrlTree(root, queryParams, fragment) {
        this.root = root;
        this.queryParams = queryParams;
        this.fragment = fragment;
    }
    UrlTree.prototype.toString = function () { return new url_serializer_1.DefaultUrlSerializer().serialize(this); };
    return UrlTree;
})();
exports.UrlTree = UrlTree;
var UrlSegment = (function () {
    function UrlSegment(pathsWithParams, children) {
        var _this = this;
        this.pathsWithParams = pathsWithParams;
        this.children = children;
        this.parent = null;
        collection_1.forEach(children, function (v, k) { return v.parent = _this; });
    }
    UrlSegment.prototype.hasChildren = function () { return Object.keys(this.children).length > 0; };
    UrlSegment.prototype.toString = function () { return url_serializer_1.serializePaths(this); };
    return UrlSegment;
})();
exports.UrlSegment = UrlSegment;
var UrlPathWithParams = (function () {
    function UrlPathWithParams(path, parameters) {
        this.path = path;
        this.parameters = parameters;
    }
    UrlPathWithParams.prototype.toString = function () { return url_serializer_1.serializePath(this); };
    return UrlPathWithParams;
})();
exports.UrlPathWithParams = UrlPathWithParams;
function equalPathsWithParams(a, b) {
    if (a.length !== b.length)
        return false;
    for (var i = 0; i < a.length; ++i) {
        if (a[i].path !== b[i].path)
            return false;
        if (!collection_1.shallowEqual(a[i].parameters, b[i].parameters))
            return false;
    }
    return true;
}
exports.equalPathsWithParams = equalPathsWithParams;
function equalPath(a, b) {
    if (a.length !== b.length)
        return false;
    for (var i = 0; i < a.length; ++i) {
        if (a[i].path !== b[i].path)
            return false;
    }
    return true;
}
exports.equalPath = equalPath;
function mapChildren(segment, fn) {
    var newChildren = {};
    collection_1.forEach(segment.children, function (child, childOutlet) {
        if (childOutlet === shared_1.PRIMARY_OUTLET) {
            newChildren[childOutlet] = fn(child, childOutlet);
        }
    });
    collection_1.forEach(segment.children, function (child, childOutlet) {
        if (childOutlet !== shared_1.PRIMARY_OUTLET) {
            newChildren[childOutlet] = fn(child, childOutlet);
        }
    });
    return newChildren;
}
exports.mapChildren = mapChildren;
function mapChildrenIntoArray(segment, fn) {
    var res = [];
    collection_1.forEach(segment.children, function (child, childOutlet) {
        if (childOutlet === shared_1.PRIMARY_OUTLET) {
            res = res.concat(fn(child, childOutlet));
        }
    });
    collection_1.forEach(segment.children, function (child, childOutlet) {
        if (childOutlet !== shared_1.PRIMARY_OUTLET) {
            res = res.concat(fn(child, childOutlet));
        }
    });
    return res;
}
exports.mapChildrenIntoArray = mapChildrenIntoArray;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXJsX3RyZWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXJsX3RyZWUudHMiXSwibmFtZXMiOlsiY3JlYXRlRW1wdHlVcmxUcmVlIiwiY29udGFpbnNUcmVlIiwiZXF1YWxTZWdtZW50cyIsImNvbnRhaW5zU2VnbWVudCIsImNvbnRhaW5zU2VnbWVudEhlbHBlciIsIlVybFRyZWUiLCJVcmxUcmVlLmNvbnN0cnVjdG9yIiwiVXJsVHJlZS50b1N0cmluZyIsIlVybFNlZ21lbnQiLCJVcmxTZWdtZW50LmNvbnN0cnVjdG9yIiwiVXJsU2VnbWVudC5oYXNDaGlsZHJlbiIsIlVybFNlZ21lbnQudG9TdHJpbmciLCJVcmxQYXRoV2l0aFBhcmFtcyIsIlVybFBhdGhXaXRoUGFyYW1zLmNvbnN0cnVjdG9yIiwiVXJsUGF0aFdpdGhQYXJhbXMudG9TdHJpbmciLCJlcXVhbFBhdGhzV2l0aFBhcmFtcyIsImVxdWFsUGF0aCIsIm1hcENoaWxkcmVuIiwibWFwQ2hpbGRyZW5JbnRvQXJyYXkiXSwibWFwcGluZ3MiOiJBQUFBLHVCQUE2QixVQUFVLENBQUMsQ0FBQTtBQUN4QywrQkFBa0Usa0JBQWtCLENBQUMsQ0FBQTtBQUNyRiwyQkFBb0Msb0JBQW9CLENBQUMsQ0FBQTtBQUV6RDtJQUNFQSxNQUFNQSxDQUFDQSxJQUFJQSxPQUFPQSxDQUFDQSxJQUFJQSxVQUFVQSxDQUFDQSxFQUFFQSxFQUFFQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQTtBQUN2REEsQ0FBQ0E7QUFGZSwwQkFBa0IscUJBRWpDLENBQUE7QUFFRCxzQkFBNkIsU0FBa0IsRUFBRSxTQUFrQixFQUFFLEtBQWM7SUFDakZDLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBO1FBQ1ZBLE1BQU1BLENBQUNBLGFBQWFBLENBQUNBLFNBQVNBLENBQUNBLElBQUlBLEVBQUVBLFNBQVNBLENBQUNBLElBQUlBLENBQUNB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Q0FBQ0EsZUFBZUEsRUFBRUEsY0FBY0EsQ0FBQ0EsQ0FBQ0E7WUFBQ0EsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7UUFDeEVBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLElBQUlBLFNBQVNBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBO1lBQ2pDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxTQUFTQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFBQ0EsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7WUFDekNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLGVBQWVBLENBQUNBLFNBQVNBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLFNBQVNBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUFDQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQTtRQUNuRkEsQ0FBQ0E7UUFDREEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7SUFFZEEsQ0FBQ0E7SUFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFDTkEsSUFBTUEsT0FBT0EsR0FBR0EsY0FBY0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsU0FBU0EsQ0FBQ0EsZUFBZUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7UUFDMUVBLElBQU1BLElBQUlBLEdBQUdBLGNBQWNBLENBQUNBLEtBQUtBLENBQUNBLFNBQVNBLENBQUNBLGVBQWVBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO1FBQ3BFQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxTQUFTQSxDQUFDQSxTQUFTQSxDQUFDQSxlQUFlQSxFQUFFQSxPQUFPQSxDQUFDQSxDQUFDQTtZQUFDQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQTtRQUNqRUEsTUFBTUEsQ0FBQ0EscUJBQXFCQSxDQUFDQSxTQUFTQSxDQUFDQSxRQUFRQSxDQUFDQSx1QkFBY0EsQ0FBQ0EsRUFBRUEsU0FBU0EsRUFBRUEsSUFBSUEs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JztcclxuaW1wb3J0IHtEZWZhdWx0VXJsU2VyaWFsaXplciwgc2VyaWFsaXplUGF0aCwgc2VyaWFsaXplUGF0aHN9IGZyb20gJy4vdXJsX3NlcmlhbGl6ZXInO1xyXG5pbXBvcnQge2ZvckVhY2gsIHNoYWxsb3dFcXVhbH0gZnJvbSAnLi91dGlscy9jb2xsZWN0aW9uJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFbXB0eVVybFRyZWUoKSB7XHJcbiAgcmV0dXJuIG5ldyBVcmxUcmVlKG5ldyBVcmxTZWdtZW50KFtdLCB7fSksIHt9LCBudWxsKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNvbnRhaW5zVHJlZShjb250YWluZXI6IFVybFRyZWUsIGNvbnRhaW5lZTogVXJsVHJlZSwgZXhhY3Q6IGJvb2xlYW4pOiBib29sZWFuIHtcclxuICBpZiAoZXhhY3QpIHtcclxuICAgIHJldHVybiBlcXVhbFNlZ21lbnRzKGNvbnRhaW5lci5yb290LCBjb250YWluZWUucm9vdCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiBjb250YWluc1NlZ21lbnQoY29udGFpbmVyLnJvb3QsIGNvbnRhaW5lZS5yb290KTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGVxdWFsU2VnbWVudHMoY29udGFpbmVyOiBVcmxTZWdtZW50LCBjb250YWluZWU6IFVybFNlZ21lbnQpOiBib29sZWFuIHtcclxuICBpZiAoIWVxdWFsUGF0aChjb250YWluZXIucGF0aHNXaXRoUGFyYW1zLCBjb250YWluZWUucGF0aHNXaXRoUGFyYW1zKSkgcmV0dXJuIGZhbHNlO1xyXG4gIGlmIChPYmplY3Qua2V5cyhjb250YWluZXIuY2hpbGRyZW4pLmxlbmd0aCAhPT0gT2JqZWN0LmtleXMoY29udGFpbmVlLmNoaWxkcmVuKS5sZW5ndGgpXHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgZm9yIChsZXQgYyBpbiBjb250YWluZWUuY2hpbGRyZW4pIHtcclxuICAgIGlmICghY29udGFpbmVyLmNoaWxkcmVuW2NdKSByZXR1cm4gZmFsc2U7XHJcbiAgICBpZiAoIWVxdWFsU2VnbWVudHMoY29udGFpbmVyLmNoaWxkcmVuW2NdLCBjb250YWluZWUuY2hpbGRyZW5bY10pKSByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG4gIHJldHVybiB0cnVlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjb250YWluc1NlZ21lbnQoY29udGFpbmVyOiBVcmxTZWdtZW50LCBjb250YWluZWU6IFVybFNlZ21lbnQpOiBib29sZWFuIHtcclxuICByZXR1cm4gY29udGFpbnNTZWdtZW50SGVscGVyKGNvbnRhaW5lciwgY29udGFpbmVlLCBjb250YWluZWUucGF0aHNXaXRoUGFyYW1zKTtcclxufVxyXG5cclxuZnVuY3Rpb24gY29udGFpbnNTZWdtZW50SGVscGVyKFxyXG4gICAgY29udGFpbmVyOiBVcmxTZWdtZW50LCBjb250YWluZWU6IFVybFNlZ21lbnQsIGNvbnRhaW5lZVBhdGhzOiBVcmxQYXRoV2l0aFBhcmFtc1tdKTogYm9vbGVhbiB7XHJcbiAgaWYoIWNvbnRhaW5lcilcclxuICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgaWYgKGNvbnRhaW5lci5wYXRoc1dpdGhQYXJhbXMubGVuZ3RoID4gY29udGFpbmVlUGF0aHMubGVuZ3RoKSB7XHJcbiAgICBjb25zdCBjdXJyZW50ID0gY29udGFpbmVyLnBhdGhzV2l0aFBhcmFtcy5zbGljZSgwLCBjb250YWluZWVQYXRocy5sZW5ndGgpO1xyXG4gICAgaWYgKCFlcXVhbFBhdGgoY3VycmVudCwgY29udGFpbmVlUGF0aHMpKSByZXR1cm4gZmFsc2U7XHJcbiAgICBpZiAoT2JqZWN0LmtleXMoY29udGFpbmVlLmNoaWxkcmVuKS5sZW5ndGggPiAwKSByZXR1cm4gZmFsc2U7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuXHJcbiAgfSBlbHNlIGlmIChjb250YWluZXIucGF0aHNXaXRoUGFyYW1zLmxlbmd0aCA9PT0gY29udGFpbmVlUGF0aHMubGVuZ3RoKSB7XHJcbiAgICBpZiAoIWVxdWFsUGF0aChjb250YWluZXIucGF0aHNXaXRoUGFyYW1zLCBjb250YWluZWVQYXRocykpIHJldHVybiBmYWxzZTtcclxuICAgIGZvciAobGV0IGMgaW4gY29udGFpbmVlLmNoaWxkcmVuKSB7XHJcbiAgICAgIGlmICghY29udGFpbmVyLmNoaWxkcmVuW2NdKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgIGlmICghY29udGFpbnNTZWdtZW50KGNvbnRhaW5lci5jaGlsZHJlbltjXSwgY29udGFpbmVlLmNoaWxkcmVuW2NdKSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRydWU7XHJcblxyXG4gIH0gZWxzZSB7XHJcbiAgICBjb25zdCBjdXJyZW50ID0gY29udGFpbmVlUGF0aHMuc2xpY2UoMCwgY29udGFpbmVyLnBhdGhzV2l0aFBhcmFtcy5sZW5ndGgpO1xyXG4gICAgY29uc3QgbmV4dCA9IGNvbnRhaW5lZVBhdGhzLnNsaWNlKGNvbnRhaW5lci5wYXRoc1dpdGhQYXJhbXMubGVuZ3RoKTtcclxuICAgIGlmICghZXF1YWxQYXRoKGNvbnRhaW5lci5wYXRoc1dpdGhQYXJhbXMsIGN1cnJlbnQpKSByZXR1cm4gZmFsc2U7XHJcbiAgICByZXR1cm4gY29udGFpbnNTZWdtZW50SGVscGVyKGNvbnRhaW5lci5jaGlsZHJlbltQUklNQVJZX09VVExFVF0sIGNvbnRhaW5lZSwgbmV4dCk7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogQSBVUkwgaW4gdGhlIHRyZWUgZm9ybS5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBVcmxUcmVlIHtcclxuICAvKipcclxuICAgKiBAaW50ZXJuYWxcclxuICAgKi9cclxuICBjb25zdHJ1Y3RvcihcclxuICAgICAgcHVibGljIHJvb3Q6IFVybFNlZ21lbnQsIHB1YmxpYyBxdWVyeVBhcmFtczoge1trZXk6IHN0cmluZ106IHN0cmluZ30sXHJcbiAgICAgIHB1YmxpYyBmcmFnbWVudDogc3RyaW5nKSB7fVxyXG5cclxuICB0b1N0cmluZygpOiBzdHJpbmcgeyByZXR1cm4gbmV3IERlZmF1bHRVcmxTZXJpYWxpemVyKCkuc2VyaWFsaXplKHRoaXMpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBVcmxTZWdtZW50IHtcclxuICBwdWJsaWMgcGFyZW50OiBVcmxTZWdtZW50ID0gbnVsbDtcclxuICBjb25zdHJ1Y3RvcihcclxuICAgICAgcHVibGljIHBhdGhzV2l0aFBhcmFtczogVXJsUGF0aFdpdGhQYXJhbXNbXSwgcHVibGljIGNoaWxkcmVuOiB7W2tleTogc3RyaW5nXTogVXJsU2VnbWVudH0pIHtcclxuICAgIGZvckVhY2goY2hpbGRyZW4sICh2OiBhbnksIGs6IGFueSkgPT4gdi5wYXJlbnQgPSB0aGlzKTtcclxuICB9XHJcblxyXG4gIGhhc0NoaWxkcmVuKCk6IGJvb2xlYW4geyByZXR1cm4gT2JqZWN0LmtleXModGhpcy5jaGlsZHJlbikubGVuZ3RoID4gMDsgfVxyXG5cclxuICB0b1N0cmluZygpOiBzdHJpbmcgeyByZXR1cm4gc2VyaWFsaXplUGF0aHModGhpcyk7IH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFVybFBhdGhXaXRoUGFyYW1zIHtcclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcGF0aDogc3RyaW5nLCBwdWJsaWMgcGFyYW1ldGVyczoge1trZXk6IHN0cmluZ106IHN0cmluZ30pIHt9XHJcbiAgdG9TdHJpbmcoKTogc3RyaW5nIHsgcmV0dXJuIHNlcmlhbGl6ZVBhdGgodGhpcyk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGVxdWFsUGF0aHNXaXRoUGFyYW1zKGE6IFVybFBhdGhXaXRoUGFyYW1zW10sIGI6IFVybFBhdGhXaXRoUGFyYW1zW10pOiBib29sZWFuIHtcclxuICBpZiAoYS5sZW5ndGggIT09IGIubGVuZ3RoKSByZXR1cm4gZmFsc2U7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBhLmxlbmd0aDsgKytpKSB7XHJcbiAgICBpZiAoYVtpXS5wYXRoICE9PSBiW2ldLnBhdGgpIHJldHVybiBmYWxzZTtcclxuICAgIGlmICghc2hhbGxvd0VxdWFsKGFbaV0ucGFyYW1ldGVycywgYltpXS5wYXJhbWV0ZXJzKSkgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuICByZXR1cm4gdHJ1ZTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGVxdWFsUGF0aChhOiBVcmxQYXRoV2l0aFBhcmFtc1tdLCBiOiBVcmxQYXRoV2l0aFBhcmFtc1tdKTogYm9vbGVhbiB7XHJcbiAgaWYgKGEubGVuZ3RoICE9PSBiLmxlbmd0aCkgcmV0dXJuIGZhbHNlO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYS5sZW5ndGg7ICsraSkge1xyXG4gICAgaWYgKGFbaV0ucGF0aCAhPT0gYltpXS5wYXRoKSByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG4gIHJldHVybiB0cnVlO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWFwQ2hpbGRyZW4oc2VnbWVudDogVXJsU2VnbWVudCwgZm46ICh2OiBVcmxTZWdtZW50LCBrOiBzdHJpbmcpID0+IFVybFNlZ21lbnQpOlxyXG4gICAge1tuYW1lOiBzdHJpbmddOiBVcmxTZWdtZW50fSB7XHJcbiAgY29uc3QgbmV3Q2hpbGRyZW46IHtbbmFtZTogc3RyaW5nXTogVXJsU2VnbWVudH0gPSB7fTtcclxuICBmb3JFYWNoKHNlZ21lbnQuY2hpbGRyZW4sIChjaGlsZDogVXJsU2VnbWVudCwgY2hpbGRPdXRsZXQ6IHN0cmluZykgPT4ge1xyXG4gICAgaWYgKGNoaWxkT3V0bGV0ID09PSBQUklNQVJZX09VVExFVCkge1xyXG4gICAgICBuZXdDaGlsZHJlbltjaGlsZE91dGxldF0gPSBmbihjaGlsZCwgY2hpbGRPdXRsZXQpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG4gIGZvckVhY2goc2VnbWVudC5jaGlsZHJlbiwgKGNoaWxkOiBVcmxTZWdtZW50LCBjaGlsZE91dGxldDogc3RyaW5nKSA9PiB7XHJcbiAgICBpZiAoY2hpbGRPdXRsZXQgIT09IFBSSU1BUllfT1VUTEVUKSB7XHJcbiAgICAgIG5ld0NoaWxkcmVuW2NoaWxkT3V0bGV0XSA9IGZuKGNoaWxkLCBjaGlsZE91dGxldCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgcmV0dXJuIG5ld0NoaWxkcmVuO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWFwQ2hpbGRyZW5JbnRvQXJyYXk8VD4oXHJcbiAgICBzZWdtZW50OiBVcmxTZWdtZW50LCBmbjogKHY6IFVybFNlZ21lbnQsIGs6IHN0cmluZykgPT4gVFtdKTogVFtdIHtcclxuICBsZXQgcmVzOiBUW10gPSBbXTtcclxuICBmb3JFYWNoKHNlZ21lbnQuY2hpbGRyZW4sIChjaGlsZDogVXJsU2VnbWVudCwgY2hpbGRPdXRsZXQ6IHN0cmluZykgPT4ge1xyXG4gICAgaWYgKGNoaWxkT3V0bGV0ID09PSBQUklNQVJZX09VVExFVCkge1xyXG4gICAgICByZXMgPSByZXMuY29uY2F0KGZuKGNoaWxkLCBjaGlsZE91dGxldCkpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG4gIGZvckVhY2goc2VnbWVudC5jaGlsZHJlbiwgKGNoaWxkOiBVcmxTZWdtZW50LCBjaGlsZE91dGxldDogc3RyaW5nKSA9PiB7XHJcbiAgICBpZiAoY2hpbGRPdXRsZXQgIT09IFBSSU1BUllfT1VUTEVUKSB7XHJcbiAgICAgIHJlcyA9IHJlcy5jb25jYXQoZm4oY2hpbGQsIGNoaWxkT3V0bGV0KSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgcmV0dXJuIHJlcztcclxufVxyXG4iXX0=