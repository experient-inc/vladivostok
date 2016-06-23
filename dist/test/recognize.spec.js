var url_serializer_1 = require('../src/url_serializer');
var shared_1 = require('../src/shared');
var recognize_1 = require('../src/recognize');
describe('recognize', function () {
    it('should work', function () {
        checkRecognize([
            {
                path: 'a', component: ComponentA
            }
        ], "a", function (s) {
            checkActivatedRoute(s.root, "", {}, RootComponent);
            checkActivatedRoute(s.firstChild(s.root), "a", {}, ComponentA);
        });
    });
    it('should support secondary routes', function () {
        checkRecognize([
            { path: 'a', component: ComponentA },
            { path: 'b', component: ComponentB, outlet: 'left' },
            { path: 'c', component: ComponentC, outlet: 'right' }
        ], "a(left:b//right:c)", function (s) {
            var c = s.children(s.root);
            checkActivatedRoute(c[0], "a", {}, ComponentA);
            checkActivatedRoute(c[1], "b", {}, ComponentB, 'left');
            checkActivatedRoute(c[2], "c", {}, ComponentC, 'right');
        });
    });
    it('should set url segment and index properly', function () {
        var url = tree("a(left:b//right:c)");
        recognize_1.recognize(RootComponent, [
            { path: 'a', component: ComponentA },
            { path: 'b', component: ComponentB, outlet: 'left' },
            { path: 'c', component: ComponentC, outlet: 'right' }
        ], url, "a(left:b//right:c)").subscribe(function (s) {
            expect(s.root._urlSegment).toBe(url.root);
            expect(s.root._lastPathIndex).toBe(-1);
            var c = s.children(s.root);
            expect(c[0]._urlSegment).toBe(url.root.children[shared_1.PRIMARY_OUTLET]);
            expect(c[0]._lastPathIndex).toBe(0);
            expect(c[1]._urlSegment).toBe(url.root.children["left"]);
            expect(c[1]._lastPathIndex).toBe(0);
            expect(c[2]._urlSegment).toBe(url.root.children["right"]);
            expect(c[2]._lastPathIndex).toBe(0);
        });
    });
    it('should set url segment and index properly (nested case)', function () {
        var url = tree("a/b/c");
        recognize_1.recognize(RootComponent, [
            { path: 'a/b', component: ComponentA, children: [
                    { path: 'c', component: ComponentC }
                ] },
        ], url, "a/b/c").subscribe(function (s) {
            expect(s.root._urlSegment).toBe(url.root);
            expect(s.root._lastPathIndex).toBe(-1);
            var compA = s.firstChild(s.root);
            expect(compA._urlSegment).toBe(url.root.children[shared_1.PRIMARY_OUTLET]);
            expect(compA._lastPathIndex).toBe(1);
            var compC = s.firstChild(compA);
            expect(compC._urlSegment).toBe(url.root.children[shared_1.PRIMARY_OUTLET]);
            expect(compC._lastPathIndex).toBe(2);
        });
    });
    it('should match routes in the depth first order', function () {
        checkRecognize([
            { path: 'a', component: ComponentA, children: [{ path: ':id', component: ComponentB }] },
            { path: 'a/:id', component: ComponentC }
        ], "a/paramA", function (s) {
            checkActivatedRoute(s.root, "", {}, RootComponent);
            checkActivatedRoute(s.firstChild(s.root), "a", {}, ComponentA);
            checkActivatedRoute(s.firstChild(s.firstChild(s.root)), "paramA", { id: 'paramA' }, ComponentB);
        });
        checkRecognize([
            { path: 'a', component: ComponentA },
            { path: 'a/:id', component: ComponentC }
        ], "a/paramA", function (s) {
            checkActivatedRoute(s.root, "", {}, RootComponent);
            checkActivatedRoute(s.firstChild(s.root), "a/paramA", { id: 'paramA' }, ComponentC);
        });
    });
    it('should use outlet name when matching secondary routes', function () {
        checkRecognize([
            { path: 'a', component: ComponentA },
            { path: 'b', component: ComponentB, outlet: 'left' },
            { path: 'b', component: ComponentC, outlet: 'right' }
        ], "a(right:b)", function (s) {
            var c = s.children(s.root);
            checkActivatedRoute(c[0], "a", {}, ComponentA);
            checkActivatedRoute(c[1], "b", {}, ComponentC, 'right');
        });
    });
    xit('should handle nested secondary routes', function () {
        checkRecognize([
            { path: 'a', component: ComponentA },
            { path: 'b', component: ComponentB, outlet: 'left' },
            { path: 'c', component: ComponentC, outlet: 'right' }
        ], "a(left:b(right:c))", function (s) {
            var c = s.children(s.root);
            checkActivatedRoute(c[0], "a", {}, ComponentA);
            checkActivatedRoute(c[1], "b", {}, ComponentB, 'left');
            checkActivatedRoute(c[2], "c", {}, ComponentC, 'right');
        });
    });
    it('should handle non top-level secondary routes', function () {
        checkRecognize([
            { path: 'a', component: ComponentA, children: [
                    { path: 'b', component: ComponentB },
                    { path: 'c', component: ComponentC, outlet: 'left' }
                ] },
        ], "a/(b//left:c)", function (s) {
            var c = s.children(s.firstChild(s.root));
            checkActivatedRoute(c[0], "b", {}, ComponentB, shared_1.PRIMARY_OUTLET);
            checkActivatedRoute(c[1], "c", {}, ComponentC, 'left');
        });
    });
    it('should sort routes by outlet name', function () {
        checkRecognize([
            { path: 'a', component: ComponentA },
            { path: 'c', component: ComponentC, outlet: 'c' },
            { path: 'b', component: ComponentB, outlet: 'b' }
        ], "a(c:c//b:b)", function (s) {
            var c = s.children(s.root);
            checkActivatedRoute(c[0], "a", {}, ComponentA);
            checkActivatedRoute(c[1], "b", {}, ComponentB, 'b');
            checkActivatedRoute(c[2], "c", {}, ComponentC, 'c');
        });
    });
    it('should support matrix parameters', function () {
        checkRecognize([
            {
                path: 'a', component: ComponentA, children: [
                    { path: 'b', component: ComponentB }
                ]
            },
            { path: 'c', component: ComponentC, outlet: 'left' }
        ], "a;a1=11;a2=22/b;b1=111;b2=222(left:c;c1=1111;c2=2222)", function (s) {
            var c = s.children(s.root);
            checkActivatedRoute(c[0], "a", { a1: '11', a2: '22' }, ComponentA);
            checkActivatedRoute(s.firstChild(c[0]), "b", { b1: '111', b2: '222' }, ComponentB);
            checkActivatedRoute(c[1], "c", { c1: '1111', c2: '2222' }, ComponentC, 'left');
        });
    });
    describe("matching empty url", function () {
        it("should support root index routes", function () {
            recognize_1.recognize(RootComponent, [
                { path: '', component: ComponentA }
            ], tree(""), "").forEach(function (s) {
                checkActivatedRoute(s.firstChild(s.root), "", {}, ComponentA);
            });
        });
        it("should support nested root index routes", function () {
            recognize_1.recognize(RootComponent, [
                { path: '', component: ComponentA, children: [{ path: '', component: ComponentB }] }
            ], tree(""), "").forEach(function (s) {
                checkActivatedRoute(s.firstChild(s.root), "", {}, ComponentA);
                checkActivatedRoute(s.firstChild(s.firstChild(s.root)), "", {}, ComponentB);
            });
        });
        it('should set url segment and index properly', function () {
            var url = tree("");
            recognize_1.recognize(RootComponent, [
                { path: '', component: ComponentA, children: [{ path: '', component: ComponentB }] }
            ], url, "").forEach(function (s) {
                expect(s.root._urlSegment).toBe(url.root);
                expect(s.root._lastPathIndex).toBe(-1);
                var c = s.firstChild(s.root);
                expect(c._urlSegment).toBe(url.root);
                expect(c._lastPathIndex).toBe(-1);
                var c2 = s.firstChild(s.firstChild(s.root));
                expect(c2._urlSegment).toBe(url.root);
                expect(c2._lastPathIndex).toBe(-1);
            });
        });
        it("should support index routes", function () {
            recognize_1.recognize(RootComponent, [
                { path: 'a', component: ComponentA, children: [
                        { path: '', component: ComponentB }
                    ] }
            ], tree("a"), "a").forEach(function (s) {
                checkActivatedRoute(s.firstChild(s.root), "a", {}, ComponentA);
                checkActivatedRoute(s.firstChild(s.firstChild(s.root)), "", {}, ComponentB);
            });
        });
        it("should support index routes with children", function () {
            recognize_1.recognize(RootComponent, [
                {
                    path: '', component: ComponentA, children: [
                        { path: '', component: ComponentB, children: [
                                { path: 'c/:id', component: ComponentC }
                            ]
                        }
                    ]
                }
            ], tree("c/10"), "c/10").forEach(function (s) {
                checkActivatedRoute(s.firstChild(s.root), "", {}, ComponentA);
                checkActivatedRoute(s.firstChild(s.firstChild(s.root)), "", {}, ComponentB);
                checkActivatedRoute(s.firstChild(s.firstChild(s.firstChild(s.root))), "c/10", { id: '10' }, ComponentC);
            });
        });
        xit("should pass parameters to every nested index route (case with non-index route)", function () {
            recognize_1.recognize(RootComponent, [
                { path: 'a', component: ComponentA, children: [{ path: '', component: ComponentB }] }
            ], tree("/a;a=1"), "/a;a=1").forEach(function (s) {
                checkActivatedRoute(s.firstChild(s.root), "a", { a: '1' }, ComponentA);
                checkActivatedRoute(s.firstChild(s.firstChild(s.root)), "", { a: '1' }, ComponentB);
            });
        });
    });
    describe("wildcards", function () {
        it("should support simple wildcards", function () {
            checkRecognize([
                { path: '**', component: ComponentA }
            ], "a/b/c/d;a1=11", function (s) {
                checkActivatedRoute(s.firstChild(s.root), "a/b/c/d", { a1: '11' }, ComponentA);
            });
        });
    });
    describe("componentless routes", function () {
        it("should work", function () {
            checkRecognize([
                {
                    path: 'p/:id',
                    children: [
                        { path: 'a', component: ComponentA },
                        { path: 'b', component: ComponentB, outlet: 'aux' }
                    ]
                }
            ], "p/11;pp=22/(a;pa=33//aux:b;pb=44)", function (s) {
                var p = s.firstChild(s.root);
                checkActivatedRoute(p, "p/11", { id: '11', pp: '22' }, undefined);
                var c = s.children(p);
                checkActivatedRoute(c[0], "a", { id: '11', pp: '22', pa: '33' }, ComponentA);
                checkActivatedRoute(c[1], "b", { id: '11', pp: '22', pb: '44' }, ComponentB, "aux");
            });
        });
        it("should merge params until encounters a normal route", function () {
            checkRecognize([
                {
                    path: 'p/:id',
                    children: [
                        { path: 'a/:name', children: [
                                { path: 'b', component: ComponentB, children: [
                                        { path: 'c', component: ComponentC }
                                    ] }
                            ] }
                    ]
                }
            ], "p/11/a/victor/b/c", function (s) {
                var p = s.firstChild(s.root);
                checkActivatedRoute(p, "p/11", { id: '11' }, undefined);
                var a = s.firstChild(p);
                checkActivatedRoute(a, "a/victor", { id: '11', name: 'victor' }, undefined);
                var b = s.firstChild(a);
                checkActivatedRoute(b, "b", { id: '11', name: 'victor' }, ComponentB);
                var c = s.firstChild(b);
                checkActivatedRoute(c, "c", {}, ComponentC);
            });
        });
        xit("should work with empty paths", function () {
            checkRecognize([
                {
                    path: 'p/:id',
                    children: [
                        { path: '', component: ComponentA },
                        { path: '', component: ComponentB, outlet: 'aux' }
                    ]
                }
            ], "p/11", function (s) {
                var p = s.firstChild(s.root);
                checkActivatedRoute(p, "p/11", { id: '11' }, undefined);
                var c = s.children(p);
                console.log("lsfs", c);
                checkActivatedRoute(c[0], "", {}, ComponentA);
                checkActivatedRoute(c[1], "", {}, ComponentB, "aux");
            });
        });
        xit("should work with empty paths and params", function () {
            checkRecognize([
                {
                    path: 'p/:id',
                    children: [
                        { path: '', component: ComponentA },
                        { path: '', component: ComponentB, outlet: 'aux' }
                    ]
                }
            ], "p/11/(;pa=33//aux:;pb=44)", function (s) {
                var p = s.firstChild(s.root);
                checkActivatedRoute(p, "p/11", { id: '11' }, undefined);
                var c = s.children(p);
                checkActivatedRoute(c[0], "", { pa: '33' }, ComponentA);
                checkActivatedRoute(c[1], "", { pb: '44' }, ComponentB, "aux");
            });
        });
        xit("should work with only aux path", function () {
            checkRecognize([
                {
                    path: 'p/:id',
                    children: [
                        { path: '', component: ComponentA },
                        { path: '', component: ComponentB, outlet: 'aux' }
                    ]
                }
            ], "p/11", function (s) {
                var p = s.firstChild(s.root);
                checkActivatedRoute(p, "p/11(aux:;pb=44)", { id: '11' }, undefined);
                var c = s.children(p);
                checkActivatedRoute(c[0], "", {}, ComponentA);
                checkActivatedRoute(c[1], "", { pb: '44' }, ComponentB, "aux");
            });
        });
    });
    describe("query parameters", function () {
        it("should support query params", function () {
            var config = [{ path: 'a', component: ComponentA }];
            checkRecognize(config, "a?q=11", function (s) {
                expect(s.queryParams).toEqual({ q: '11' });
            });
        });
    });
    describe("fragment", function () {
        it("should support fragment", function () {
            var config = [{ path: 'a', component: ComponentA }];
            checkRecognize(config, "a#f1", function (s) {
                expect(s.fragment).toEqual("f1");
            });
        });
    });
    describe("error handling", function () {
        it('should error when two routes with the same outlet name got matched', function () {
            recognize_1.recognize(RootComponent, [
                { path: 'a', component: ComponentA },
                { path: 'b', component: ComponentB, outlet: 'aux' },
                { path: 'c', component: ComponentC, outlet: 'aux' }
            ], tree("a(aux:b//aux:c)"), "a(aux:b//aux:c)").subscribe(function (_) { }, function (s) {
                expect(s.toString()).toContain("Two segments cannot have the same outlet name: 'aux:b' and 'aux:c'.");
            });
        });
        it("should error when no matching routes", function () {
            recognize_1.recognize(RootComponent, [
                { path: 'a', component: ComponentA }
            ], tree("invalid"), "invalid").subscribe(function (_) { }, function (s) {
                expect(s.toString()).toContain("Cannot match any routes");
            });
        });
        it("should error when no matching routes (too short)", function () {
            recognize_1.recognize(RootComponent, [
                { path: 'a/:id', component: ComponentA }
            ], tree("a"), "a").subscribe(function (_) { }, function (s) {
                expect(s.toString()).toContain("Cannot match any routes");
            });
        });
    });
});
function checkRecognize(config, url, callback) {
    recognize_1.recognize(RootComponent, config, tree(url), url).subscribe(callback, function (e) {
        throw e;
    });
}
function checkActivatedRoute(actual, url, params, cmp, outlet) {
    if (outlet === void 0) { outlet = shared_1.PRIMARY_OUTLET; }
    if (actual === null) {
        expect(actual).not.toBeNull();
    }
    else {
        expect(actual.url.map(function (s) { return s.path; }).join("/")).toEqual(url);
        expect(actual.params).toEqual(params);
        expect(actual.component).toBe(cmp);
        expect(actual.outlet).toEqual(outlet);
    }
}
function tree(url) {
    return new url_serializer_1.DefaultUrlSerializer().parse(url);
}
var RootComponent = (function () {
    function RootComponent() {
    }
    return RootComponent;
})();
var ComponentA = (function () {
    function ComponentA() {
    }
    return ComponentA;
})();
var ComponentB = (function () {
    function ComponentB() {
    }
    return ComponentB;
})();
var ComponentC = (function () {
    function ComponentC() {
    }
    return ComponentC;
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjb2duaXplLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90ZXN0L3JlY29nbml6ZS5zcGVjLnRzIl0sIm5hbWVzIjpbImNoZWNrUmVjb2duaXplIiwiY2hlY2tBY3RpdmF0ZWRSb3V0ZSIsInRyZWUiLCJSb290Q29tcG9uZW50IiwiUm9vdENvbXBvbmVudC5jb25zdHJ1Y3RvciIsIkNvbXBvbmVudEEiLCJDb21wb25lbnRBLmNvbnN0cnVjdG9yIiwiQ29tcG9uZW50QiIsIkNvbXBvbmVudEIuY29uc3RydWN0b3IiLCJDb21wb25lbnRDIiwiQ29tcG9uZW50Qy5jb25zdHJ1Y3RvciJdLCJtYXBwaW5ncyI6IkFBQUEsK0JBQW1DLHVCQUF1QixDQUFDLENBQUE7QUFFM0QsdUJBQXFDLGVBQWUsQ0FBQyxDQUFBO0FBR3JELDBCQUF3QixrQkFBa0IsQ0FBQyxDQUFBO0FBRTNDLFFBQVEsQ0FBQyxXQUFXLEVBQUU7SUFDcEIsRUFBRSxDQUFDLGFBQWEsRUFBRTtRQUNoQixjQUFjLENBQUM7WUFDYjtnQkFDRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxVQUFVO2FBQ2pDO1NBQ0YsRUFBRSxHQUFHLEVBQUUsVUFBQyxDQUFxQjtZQUM1QixtQkFBbUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsYUFBYSxDQUFDLENBQUM7WUFDbkQsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUNqRSxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLGlDQUFpQyxFQUFFO1FBQ3BDLGNBQWMsQ0FBQztZQUNiLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFO1lBQ3BDLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxT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SUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFDM0RBLE1BQU1BLENBQUNBLE1BQU1BLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLE9BQU9BLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO1FBQ3RDQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUNuQ0EsTUFBTUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7SUFDeENBLENBQUNBO0FBQ0hBLENBQUNBO0FBRUQsY0FBYyxHQUFXO0lBQ3ZCQyxNQUFNQSxDQUFDQSxJQUFJQSxxQ0FBb0JBLEVBQUVBLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO0FBQy9DQSxDQUFDQTtBQUVEO0lBQUFDO0lBQXFCQyxDQUFDQTtJQUFERCxvQkFBQ0E7QUFBREEsQ0FBQ0EsQUFBdEIsSUFBc0I7QUFDdEI7SUFBQUU7SUFBa0JDLENBQUNBO0lBQURELGlCQUFDQTtBQUFEQSxDQUFDQSxBQUFuQixJQUFtQjtBQUNuQjtJQUFBRTtJQUFrQkMsQ0FBQ0E7SUFBREQsaUJBQUNBO0FBQURBLENBQUNBLEFBQW5CLElBQW1CO0FBQ25CO0lBQUFFO0lBQWtCQyxDQUFDQTtJQUFERCxpQkFBQ0E7QUFBREEsQ0FBQ0EsQUFBbkIsSUFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0RlZmF1bHRVcmxTZXJpYWxpemVyfSBmcm9tICcuLi9zcmMvdXJsX3NlcmlhbGl6ZXInO1xyXG5pbXBvcnQge1VybFRyZWV9IGZyb20gJy4uL3NyYy91cmxfdHJlZSc7XHJcbmltcG9ydCB7UGFyYW1zLCBQUklNQVJZX09VVExFVH0gZnJvbSAnLi4vc3JjL3NoYXJlZCc7XHJcbmltcG9ydCB7QWN0aXZhdGVkUm91dGVTbmFwc2hvdCwgUm91dGVyU3RhdGVTbmFwc2hvdH0gZnJvbSAnLi4vc3JjL3JvdXRlcl9zdGF0ZSc7XHJcbmltcG9ydCB7Um91dGVyQ29uZmlnfSBmcm9tICcuLi9zcmMvY29uZmlnJztcclxuaW1wb3J0IHtyZWNvZ25pemV9IGZyb20gJy4uL3NyYy9yZWNvZ25pemUnO1xyXG5cclxuZGVzY3JpYmUoJ3JlY29nbml6ZScsICgpID0+IHtcclxuICBpdCgnc2hvdWxkIHdvcmsnLCAoKSA9PiB7XHJcbiAgICBjaGVja1JlY29nbml6ZShbXHJcbiAgICAgIHtcclxuICAgICAgICBwYXRoOiAnYScsIGNvbXBvbmVudDogQ29tcG9uZW50QVxyXG4gICAgICB9XHJcbiAgICBdLCBcImFcIiwgKHM6Um91dGVyU3RhdGVTbmFwc2hvdCkgPT4ge1xyXG4gICAgICBjaGVja0FjdGl2YXRlZFJvdXRlKHMucm9vdCwgXCJcIiwge30sIFJvb3RDb21wb25lbnQpO1xyXG4gICAgICBjaGVja0FjdGl2YXRlZFJvdXRlKHMuZmlyc3RDaGlsZChzLnJvb3QpLCBcImFcIiwge30sIENvbXBvbmVudEEpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIGl0KCdzaG91bGQgc3VwcG9ydCBzZWNvbmRhcnkgcm91dGVzJywgKCkgPT4ge1xyXG4gICAgY2hlY2tSZWNvZ25pemUoW1xyXG4gICAgICB7IHBhdGg6ICdhJywgY29tcG9uZW50OiBDb21wb25lbnRBIH0sXHJcbiAgICAgIHsgcGF0aDogJ2InLCBjb21wb25lbnQ6IENvbXBvbmVudEIsIG91dGxldDogJ2xlZnQnIH0sXHJcbiAgICAgIHsgcGF0aDogJ2MnLCBjb21wb25lbnQ6IENvbXBvbmVudEMsIG91dGxldDogJ3JpZ2h0JyB9XHJcbiAgICBdLCBcImEobGVmdDpiLy9yaWdodDpjKVwiLCAoczpSb3V0ZXJTdGF0ZVNuYXBzaG90KSA9PiB7XHJcbiAgICAgIGNvbnN0IGMgPSBzLmNoaWxkcmVuKHMucm9vdCk7XHJcbiAgICAgIGNoZWNrQWN0aXZhdGVkUm91dGUoY1swXSwgXCJhXCIsIHt9LCBDb21wb25lbnRBKTtcclxuICAgICAgY2hlY2tBY3RpdmF0ZWRSb3V0ZShjWzFdLCBcImJcIiwge30sIENvbXBvbmVudEIsICdsZWZ0Jyk7XHJcbiAgICAgIGNoZWNrQWN0aXZhdGVkUm91dGUoY1syXSwgXCJjXCIsIHt9LCBDb21wb25lbnRDLCAncmlnaHQnKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBpdCgnc2hvdWxkIHNldCB1cmwgc2VnbWVudCBhbmQgaW5kZXggcHJvcGVybHknLCAoKSA9PiB7XHJcbiAgICBjb25zdCB1cmwgPSB0cmVlKFwiYShsZWZ0OmIvL3JpZ2h0OmMpXCIpO1xyXG4gICAgcmVjb2duaXplKFJvb3RDb21wb25lbnQsIFtcclxuICAgICAgeyBwYXRoOiAnYScsIGNvbXBvbmVudDogQ29tcG9uZW50QSB9LFxyXG4gICAgICB7IHBhdGg6ICdiJywgY29tcG9uZW50OiBDb21wb25lbnRCLCBvdXRsZXQ6ICdsZWZ0JyB9LFxyXG4gICAgICB7IHBhdGg6ICdjJywgY29tcG9uZW50OiBDb21wb25lbnRDLCBvdXRsZXQ6ICdyaWdodCcgfVxyXG4gICAgXSwgdXJsLCBcImEobGVmdDpiLy9yaWdodDpjKVwiKS5zdWJzY3JpYmUoKHMpID0+IHtcclxuICAgICAgZXhwZWN0KHMucm9vdC5fdXJsU2VnbWVudCkudG9CZSh1cmwucm9vdCk7XHJcbiAgICAgIGV4cGVjdChzLnJvb3QuX2xhc3RQYXRoSW5kZXgpLnRvQmUoLTEpO1xyXG5cclxuICAgICAgY29uc3QgYyA9IHMuY2hpbGRyZW4ocy5yb290KTtcclxuICAgICAgZXhwZWN0KGNbMF0uX3VybFNlZ21lbnQpLnRvQmUodXJsLnJvb3QuY2hpbGRyZW5bUFJJTUFSWV9PVVRMRVRdKTtcclxuICAgICAgZXhwZWN0KGNbMF0uX2xhc3RQYXRoSW5kZXgpLnRvQmUoMCk7XHJcblxyXG4gICAgICBleHBlY3QoY1sxXS5fdXJsU2VnbWVudCkudG9CZSh1cmwucm9vdC5jaGlsZHJlbltcImxlZnRcIl0pO1xyXG4gICAgICBleHBlY3QoY1sxXS5fbGFzdFBhdGhJbmRleCkudG9CZSgwKTtcclxuXHJcbiAgICAgIGV4cGVjdChjWzJdLl91cmxTZWdtZW50KS50b0JlKHVybC5yb290LmNoaWxkcmVuW1wicmlnaHRcIl0pO1xyXG4gICAgICBleHBlY3QoY1syXS5fbGFzdFBhdGhJbmRleCkudG9CZSgwKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBpdCgnc2hvdWxkIHNldCB1cmwgc2VnbWVudCBhbmQgaW5kZXggcHJvcGVybHkgKG5lc3RlZCBjYXNlKScsICgpID0+IHtcclxuICAgIGNvbnN0IHVybCA9IHRyZWUoXCJhL2IvY1wiKTtcclxuICAgIHJlY29nbml6ZShSb290Q29tcG9uZW50LCBbXHJcbiAgICAgIHsgcGF0aDogJ2EvYicsIGNvbXBvbmVudDogQ29tcG9uZW50QSwgY2hpbGRyZW46IFtcclxuICAgICAgICB7cGF0aDogJ2MnLCBjb21wb25lbnQ6IENvbXBvbmVudEN9XHJcbiAgICAgIF0gfSxcclxuICAgIF0sIHVybCwgXCJhL2IvY1wiKS5zdWJzY3JpYmUoKHM6Um91dGVyU3RhdGVTbmFwc2hvdCkgPT4ge1xyXG4gICAgICBleHBlY3Qocy5yb290Ll91cmxTZWdtZW50KS50b0JlKHVybC5yb290KTtcclxuICAgICAgZXhwZWN0KHMucm9vdC5fbGFzdFBhdGhJbmRleCkudG9CZSgtMSk7XHJcblxyXG4gICAgICBjb25zdCBjb21wQSA9IHMuZmlyc3RDaGlsZChzLnJvb3QpO1xyXG4gICAgICBleHBlY3QoY29tcEEuX3VybFNlZ21lbnQpLnRvQmUodXJsLnJvb3QuY2hpbGRyZW5bUFJJTUFSWV9PVVRMRVRdKTtcclxuICAgICAgZXhwZWN0KGNvbXBBLl9sYXN0UGF0aEluZGV4KS50b0JlKDEpO1xyXG5cclxuICAgICAgY29uc3QgY29tcEMgPSBzLmZpcnN0Q2hpbGQoPGFueT5jb21wQSk7XHJcbiAgICAgIGV4cGVjdChjb21wQy5fdXJsU2VnbWVudCkudG9CZSh1cmwucm9vdC5jaGlsZHJlbltQUklNQVJZX09VVExFVF0pO1xyXG4gICAgICBleHBlY3QoY29tcEMuX2xhc3RQYXRoSW5kZXgpLnRvQmUoMik7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgaXQoJ3Nob3VsZCBtYXRjaCByb3V0ZXMgaW4gdGhlIGRlcHRoIGZpcnN0IG9yZGVyJywgKCkgPT4ge1xyXG4gICAgY2hlY2tSZWNvZ25pemUoW1xyXG4gICAgICB7cGF0aDogJ2EnLCBjb21wb25lbnQ6IENvbXBvbmVudEEsIGNoaWxkcmVuOiBbe3BhdGg6ICc6aWQnLCBjb21wb25lbnQ6IENvbXBvbmVudEJ9XX0sXHJcbiAgICAgIHtwYXRoOiAnYS86aWQnLCBjb21wb25lbnQ6IENvbXBvbmVudEN9XHJcbiAgICBdLCBcImEvcGFyYW1BXCIsIChzOlJvdXRlclN0YXRlU25hcHNob3QpID0+IHtcclxuICAgICAgY2hlY2tBY3RpdmF0ZWRSb3V0ZShzLnJvb3QsIFwiXCIsIHt9LCBSb290Q29tcG9uZW50KTtcclxuICAgICAgY2hlY2tBY3RpdmF0ZWRSb3V0ZShzLmZpcnN0Q2hpbGQocy5yb290KSwgXCJhXCIsIHt9LCBDb21wb25lbnRBKTtcclxuICAgICAgY2hlY2tBY3RpdmF0ZWRSb3V0ZShzLmZpcnN0Q2hpbGQoPGFueT5zLmZpcnN0Q2hpbGQocy5yb290KSksIFwicGFyYW1BXCIsIHtpZDogJ3BhcmFtQSd9LCBDb21wb25lbnRCKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGNoZWNrUmVjb2duaXplKFtcclxuICAgICAge3BhdGg6ICdhJywgY29tcG9uZW50OiBDb21wb25lbnRBfSxcclxuICAgICAge3BhdGg6ICdhLzppZCcsIGNvbXBvbmVudDogQ29tcG9uZW50Q31cclxuICAgIF0sIFwiYS9wYXJhbUFcIiwgKHM6Um91dGVyU3RhdGVTbmFwc2hvdCkgPT4ge1xyXG4gICAgICBjaGVja0FjdGl2YXRlZFJvdXRlKHMucm9vdCwgXCJcIiwge30sIFJvb3RDb21wb25lbnQpO1xyXG4gICAgICBjaGVja0FjdGl2YXRlZFJvdXRlKHMuZmlyc3RDaGlsZChzLnJvb3QpLCBcImEvcGFyYW1BXCIsIHtpZDogJ3BhcmFtQSd9LCBDb21wb25lbnRDKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBpdCgnc2hvdWxkIHVzZSBvdXRsZXQgbmFtZSB3aGVuIG1hdGNoaW5nIHNlY29uZGFyeSByb3V0ZXMnLCAoKSA9PiB7XHJcbiAgICBjaGVja1JlY29nbml6ZShbXHJcbiAgICAgIHsgcGF0aDogJ2EnLCBjb21wb25lbnQ6IENvbXBvbmVudEEgfSxcclxuICAgICAgeyBwYXRoOiAnYicsIGNvbXBvbmVudDogQ29tcG9uZW50Qiwgb3V0bGV0OiAnbGVmdCcgfSxcclxuICAgICAgeyBwYXRoOiAnYicsIGNvbXBvbmVudDogQ29tcG9uZW50Qywgb3V0bGV0OiAncmlnaHQnIH1cclxuICAgIF0sIFwiYShyaWdodDpiKVwiLCAoczpSb3V0ZXJTdGF0ZVNuYXBzaG90KSA9PiB7XHJcbiAgICAgIGNvbnN0IGMgPSBzLmNoaWxkcmVuKHMucm9vdCk7XHJcbiAgICAgIGNoZWNrQWN0aXZhdGVkUm91dGUoY1swXSwgXCJhXCIsIHt9LCBDb21wb25lbnRBKTtcclxuICAgICAgY2hlY2tBY3RpdmF0ZWRSb3V0ZShjWzFdLCBcImJcIiwge30sIENvbXBvbmVudEMsICdyaWdodCcpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIHhpdCgnc2hvdWxkIGhhbmRsZSBuZXN0ZWQgc2Vjb25kYXJ5IHJvdXRlcycsICgpID0+IHtcclxuICAgIGNoZWNrUmVjb2duaXplKFtcclxuICAgICAgeyBwYXRoOiAnYScsIGNvbXBvbmVudDogQ29tcG9uZW50QSB9LFxyXG4gICAgICB7IHBhdGg6ICdiJywgY29tcG9uZW50OiBDb21wb25lbnRCLCBvdXRsZXQ6ICdsZWZ0JyB9LFxyXG4gICAgICB7IHBhdGg6ICdjJywgY29tcG9uZW50OiBDb21wb25lbnRDLCBvdXRsZXQ6ICdyaWdodCcgfVxyXG4gICAgXSwgXCJhKGxlZnQ6YihyaWdodDpjKSlcIiwgKHM6Um91dGVyU3RhdGVTbmFwc2hvdCkgPT4ge1xyXG4gICAgICBjb25zdCBjID0gcy5jaGlsZHJlbihzLnJvb3QpO1xyXG4gICAgICBjaGVja0FjdGl2YXRlZFJvdXRlKGNbMF0sIFwiYVwiLCB7fSwgQ29tcG9uZW50QSk7XHJcbiAgICAgIGNoZWNrQWN0aXZhdGVkUm91dGUoY1sxXSwgXCJiXCIsIHt9LCBDb21wb25lbnRCLCAnbGVmdCcpO1xyXG4gICAgICBjaGVja0FjdGl2YXRlZFJvdXRlKGNbMl0sIFwiY1wiLCB7fSwgQ29tcG9uZW50QywgJ3JpZ2h0Jyk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgaXQoJ3Nob3VsZCBoYW5kbGUgbm9uIHRvcC1sZXZlbCBzZWNvbmRhcnkgcm91dGVzJywgKCkgPT4ge1xyXG4gICAgY2hlY2tSZWNvZ25pemUoW1xyXG4gICAgICB7IHBhdGg6ICdhJywgY29tcG9uZW50OiBDb21wb25lbnRBLCBjaGlsZHJlbjogW1xyXG4gICAgICAgIHsgcGF0aDogJ2InLCBjb21wb25lbnQ6IENvbXBvbmVudEIgfSxcclxuICAgICAgICB7IHBhdGg6ICdjJywgY29tcG9uZW50OiBDb21wb25lbnRDLCBvdXRsZXQ6ICdsZWZ0JyB9XHJcbiAgICAgIF0gfSxcclxuICAgIF0sIFwiYS8oYi8vbGVmdDpjKVwiLCAoczpSb3V0ZXJTdGF0ZVNuYXBzaG90KSA9PiB7XHJcbiAgICAgIGNvbnN0IGMgPSBzLmNoaWxkcmVuKDxhbnk+cy5maXJzdENoaWxkKHMucm9vdCkpO1xyXG4gICAgICBjaGVja0FjdGl2YXRlZFJvdXRlKGNbMF0sIFwiYlwiLCB7fSwgQ29tcG9uZW50QiwgUFJJTUFSWV9PVVRMRVQpO1xyXG4gICAgICBjaGVja0FjdGl2YXRlZFJvdXRlKGNbMV0sIFwiY1wiLCB7fSwgQ29tcG9uZW50QywgJ2xlZnQnKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBpdCgnc2hvdWxkIHNvcnQgcm91dGVzIGJ5IG91dGxldCBuYW1lJywgKCkgPT4ge1xyXG4gICAgY2hlY2tSZWNvZ25pemUoW1xyXG4gICAgICB7IHBhdGg6ICdhJywgY29tcG9uZW50OiBDb21wb25lbnRBIH0sXHJcbiAgICAgIHsgcGF0aDogJ2MnLCBjb21wb25lbnQ6IENvbXBvbmVudEMsIG91dGxldDogJ2MnIH0sXHJcbiAgICAgIHsgcGF0aDogJ2InLCBjb21wb25lbnQ6IENvbXBvbmVudEIsIG91dGxldDogJ2InIH1cclxuICAgIF0sIFwiYShjOmMvL2I6YilcIiwgKHM6Um91dGVyU3RhdGVTbmFwc2hvdCkgPT4ge1xyXG4gICAgICBjb25zdCBjID0gcy5jaGlsZHJlbihzLnJvb3QpO1xyXG4gICAgICBjaGVja0FjdGl2YXRlZFJvdXRlKGNbMF0sIFwiYVwiLCB7fSwgQ29tcG9uZW50QSk7XHJcbiAgICAgIGNoZWNrQWN0aXZhdGVkUm91dGUoY1sxXSwgXCJiXCIsIHt9LCBDb21wb25lbnRCLCAnYicpO1xyXG4gICAgICBjaGVja0FjdGl2YXRlZFJvdXRlKGNbMl0sIFwiY1wiLCB7fSwgQ29tcG9uZW50QywgJ2MnKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBpdCgnc2hvdWxkIHN1cHBvcnQgbWF0cml4IHBhcmFtZXRlcnMnLCAoKSA9PiB7XHJcbiAgICBjaGVja1JlY29nbml6ZShbXHJcbiAgICAgIHtcclxuICAgICAgICBwYXRoOiAnYScsIGNvbXBvbmVudDogQ29tcG9uZW50QSwgY2hpbGRyZW46IFtcclxuICAgICAgICAgIHsgcGF0aDogJ2InLCBjb21wb25lbnQ6IENvbXBvbmVudEIgfVxyXG4gICAgICAgIF1cclxuICAgICAgfSxcclxuICAgICAgeyBwYXRoOiAnYycsIGNvbXBvbmVudDogQ29tcG9uZW50Qywgb3V0bGV0OiAnbGVmdCcgfVxyXG4gICAgXSwgXCJhO2ExPTExO2EyPTIyL2I7YjE9MTExO2IyPTIyMihsZWZ0OmM7YzE9MTExMTtjMj0yMjIyKVwiLCAoczpSb3V0ZXJTdGF0ZVNuYXBzaG90KSA9PiB7XHJcbiAgICAgIGNvbnN0IGMgPSBzLmNoaWxkcmVuKHMucm9vdCk7XHJcbiAgICAgIGNoZWNrQWN0aXZhdGVkUm91dGUoY1swXSwgXCJhXCIsIHthMTogJzExJywgYTI6ICcyMid9LCBDb21wb25lbnRBKTtcclxuICAgICAgY2hlY2tBY3RpdmF0ZWRSb3V0ZShzLmZpcnN0Q2hpbGQoPGFueT5jWzBdKSwgXCJiXCIsIHtiMTogJzExMScsIGIyOiAnMjIyJ30sIENvbXBvbmVudEIpO1xyXG4gICAgICBjaGVja0FjdGl2YXRlZFJvdXRlKGNbMV0sIFwiY1wiLCB7YzE6ICcxMTExJywgYzI6ICcyMjIyJ30sIENvbXBvbmVudEMsICdsZWZ0Jyk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgZGVzY3JpYmUoXCJtYXRjaGluZyBlbXB0eSB1cmxcIiwgKCkgPT4ge1xyXG4gICAgaXQoXCJzaG91bGQgc3VwcG9ydCByb290IGluZGV4IHJvdXRlc1wiLCAoKSA9PiB7XHJcbiAgICAgIHJlY29nbml6ZShSb290Q29tcG9uZW50LCBbXHJcbiAgICAgICAge3BhdGg6ICcnLCBjb21wb25lbnQ6IENvbXBvbmVudEF9XHJcbiAgICAgIF0sIHRyZWUoXCJcIiksIFwiXCIpLmZvckVhY2goKHM6Um91dGVyU3RhdGVTbmFwc2hvdCkgPT4ge1xyXG4gICAgICAgIGNoZWNrQWN0aXZhdGVkUm91dGUocy5maXJzdENoaWxkKHMucm9vdCksIFwiXCIsIHt9LCBDb21wb25lbnRBKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdChcInNob3VsZCBzdXBwb3J0IG5lc3RlZCByb290IGluZGV4IHJvdXRlc1wiLCAoKSA9PiB7XHJcbiAgICAgIHJlY29nbml6ZShSb290Q29tcG9uZW50LCBbXHJcbiAgICAgICAge3BhdGg6ICcnLCBjb21wb25lbnQ6IENvbXBvbmVudEEsIGNoaWxkcmVuOiBbe3BhdGg6ICcnLCBjb21wb25lbnQ6IENvbXBvbmVudEJ9XX1cclxuICAgICAgXSwgdHJlZShcIlwiKSwgXCJcIikuZm9yRWFjaCgoczpSb3V0ZXJTdGF0ZVNuYXBzaG90KSA9PiB7XHJcbiAgICAgICAgY2hlY2tBY3RpdmF0ZWRSb3V0ZShzLmZpcnN0Q2hpbGQocy5yb290KSwgXCJcIiwge30sIENvbXBvbmVudEEpO1xyXG4gICAgICAgIGNoZWNrQWN0aXZhdGVkUm91dGUocy5maXJzdENoaWxkKDxhbnk+cy5maXJzdENoaWxkKHMucm9vdCkpLCBcIlwiLCB7fSwgQ29tcG9uZW50Qik7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3Nob3VsZCBzZXQgdXJsIHNlZ21lbnQgYW5kIGluZGV4IHByb3Blcmx5JywgKCkgPT4ge1xyXG4gICAgICBjb25zdCB1cmwgPSB0cmVlKFwiXCIpO1xyXG4gICAgICByZWNvZ25pemUoUm9vdENvbXBvbmVudCwgW1xyXG4gICAgICAgIHtwYXRoOiAnJywgY29tcG9uZW50OiBDb21wb25lbnRBLCBjaGlsZHJlbjogW3twYXRoOiAnJywgY29tcG9uZW50OiBDb21wb25lbnRCfV19XHJcbiAgICAgIF0sIHVybCwgXCJcIikuZm9yRWFjaCgoczpSb3V0ZXJTdGF0ZVNuYXBzaG90KSA9PiB7XHJcbiAgICAgICAgZXhwZWN0KHMucm9vdC5fdXJsU2VnbWVudCkudG9CZSh1cmwucm9vdCk7XHJcbiAgICAgICAgZXhwZWN0KHMucm9vdC5fbGFzdFBhdGhJbmRleCkudG9CZSgtMSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGMgPSBzLmZpcnN0Q2hpbGQocy5yb290KTtcclxuICAgICAgICBleHBlY3QoYy5fdXJsU2VnbWVudCkudG9CZSh1cmwucm9vdCk7XHJcbiAgICAgICAgZXhwZWN0KGMuX2xhc3RQYXRoSW5kZXgpLnRvQmUoLTEpO1xyXG5cclxuICAgICAgICBjb25zdCBjMiA9IHMuZmlyc3RDaGlsZCg8YW55PnMuZmlyc3RDaGlsZChzLnJvb3QpKTtcclxuICAgICAgICBleHBlY3QoYzIuX3VybFNlZ21lbnQpLnRvQmUodXJsLnJvb3QpO1xyXG4gICAgICAgIGV4cGVjdChjMi5fbGFzdFBhdGhJbmRleCkudG9CZSgtMSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoXCJzaG91bGQgc3VwcG9ydCBpbmRleCByb3V0ZXNcIiwgKCkgPT4ge1xyXG4gICAgICByZWNvZ25pemUoUm9vdENvbXBvbmVudCwgW1xyXG4gICAgICAgIHtwYXRoOiAnYScsIGNvbXBvbmVudDogQ29tcG9uZW50QSwgY2hpbGRyZW46IFtcclxuICAgICAgICAgIHtwYXRoOiAnJywgY29tcG9uZW50OiBDb21wb25lbnRCfVxyXG4gICAgICAgIF19XHJcbiAgICAgIF0sIHRyZWUoXCJhXCIpLCBcImFcIikuZm9yRWFjaCgoczpSb3V0ZXJTdGF0ZVNuYXBzaG90KSA9PiB7XHJcbiAgICAgICAgY2hlY2tBY3RpdmF0ZWRSb3V0ZShzLmZpcnN0Q2hpbGQocy5yb290KSwgXCJhXCIsIHt9LCBDb21wb25lbnRBKTtcclxuICAgICAgICBjaGVja0FjdGl2YXRlZFJvdXRlKHMuZmlyc3RDaGlsZCg8YW55PnMuZmlyc3RDaGlsZChzLnJvb3QpKSwgXCJcIiwge30sIENvbXBvbmVudEIpO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KFwic2hvdWxkIHN1cHBvcnQgaW5kZXggcm91dGVzIHdpdGggY2hpbGRyZW5cIiwgKCkgPT4ge1xyXG4gICAgICByZWNvZ25pemUoUm9vdENvbXBvbmVudCwgW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIHBhdGg6ICcnLCBjb21wb25lbnQ6IENvbXBvbmVudEEsIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICB7IHBhdGg6ICcnLCBjb21wb25lbnQ6IENvbXBvbmVudEIsIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgIHtwYXRoOiAnYy86aWQnLCBjb21wb25lbnQ6IENvbXBvbmVudEN9XHJcbiAgICAgICAgICBdXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgXVxyXG4gICAgICAgIH1cclxuICAgICAgXSwgdHJlZShcImMvMTBcIiksIFwiYy8xMFwiKS5mb3JFYWNoKChzOlJvdXRlclN0YXRlU25hcHNob3QpID0+IHtcclxuICAgICAgICBjaGVja0FjdGl2YXRlZFJvdXRlKHMuZmlyc3RDaGlsZChzLnJvb3QpLCBcIlwiLCB7fSwgQ29tcG9uZW50QSk7XHJcbiAgICAgICAgY2hlY2tBY3RpdmF0ZWRSb3V0ZShzLmZpcnN0Q2hpbGQoPGFueT5zLmZpcnN0Q2hpbGQocy5yb290KSksIFwiXCIsIHt9LCBDb21wb25lbnRCKTtcclxuICAgICAgICBjaGVja0FjdGl2YXRlZFJvdXRlKFxyXG4gICAgICAgICAgcy5maXJzdENoaWxkKDxhbnk+cy5maXJzdENoaWxkKDxhbnk+cy5maXJzdENoaWxkKHMucm9vdCkpKSwgXCJjLzEwXCIsIHtpZDogJzEwJ30sIENvbXBvbmVudEMpO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHhpdChcInNob3VsZCBwYXNzIHBhcmFtZXRlcnMgdG8gZXZlcnkgbmVzdGVkIGluZGV4IHJvdXRlIChjYXNlIHdpdGggbm9uLWluZGV4IHJvdXRlKVwiLCAoKSA9PiB7XHJcbiAgICAgIHJlY29nbml6ZShSb290Q29tcG9uZW50LCBbXHJcbiAgICAgICAge3BhdGg6ICdhJywgY29tcG9uZW50OiBDb21wb25lbnRBLCBjaGlsZHJlbjogW3twYXRoOiAnJywgY29tcG9uZW50OiBDb21wb25lbnRCfV19XHJcbiAgICAgIF0sIHRyZWUoXCIvYTthPTFcIiksIFwiL2E7YT0xXCIpLmZvckVhY2goKHM6Um91dGVyU3RhdGVTbmFwc2hvdCkgPT4ge1xyXG4gICAgICAgIGNoZWNrQWN0aXZhdGVkUm91dGUocy5maXJzdENoaWxkKHMucm9vdCksIFwiYVwiLCB7YTogJzEnfSwgQ29tcG9uZW50QSk7XHJcbiAgICAgICAgY2hlY2tBY3RpdmF0ZWRSb3V0ZShzLmZpcnN0Q2hpbGQoPGFueT5zLmZpcnN0Q2hpbGQocy5yb290KSksIFwiXCIsIHthOiAnMSd9LCBDb21wb25lbnRCKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgZGVzY3JpYmUoXCJ3aWxkY2FyZHNcIiwgKCkgPT4ge1xyXG4gICAgaXQoXCJzaG91bGQgc3VwcG9ydCBzaW1wbGUgd2lsZGNhcmRzXCIsICgpID0+IHtcclxuICAgICAgY2hlY2tSZWNvZ25pemUoW1xyXG4gICAgICAgIHtwYXRoOiAnKionLCBjb21wb25lbnQ6IENvbXBvbmVudEF9XHJcbiAgICAgIF0sIFwiYS9iL2MvZDthMT0xMVwiLCAoczpSb3V0ZXJTdGF0ZVNuYXBzaG90KSA9PiB7XHJcbiAgICAgICAgY2hlY2tBY3RpdmF0ZWRSb3V0ZShzLmZpcnN0Q2hpbGQocy5yb290KSwgXCJhL2IvYy9kXCIsIHthMTonMTEnfSwgQ29tcG9uZW50QSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIGRlc2NyaWJlKFwiY29tcG9uZW50bGVzcyByb3V0ZXNcIiwgKCkgPT4ge1xyXG4gICAgaXQoXCJzaG91bGQgd29ya1wiLCAoKSA9PiB7XHJcbiAgICAgIGNoZWNrUmVjb2duaXplKFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBwYXRoOiAncC86aWQnLFxyXG4gICAgICAgICAgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAge3BhdGg6ICdhJywgY29tcG9uZW50OiBDb21wb25lbnRBfSxcclxuICAgICAgICAgICAge3BhdGg6ICdiJywgY29tcG9uZW50OiBDb21wb25lbnRCLCBvdXRsZXQ6ICdhdXgnfVxyXG4gICAgICAgICAgXVxyXG4gICAgICAgIH1cclxuICAgICAgXSwgXCJwLzExO3BwPTIyLyhhO3BhPTMzLy9hdXg6YjtwYj00NClcIiwgKHM6Um91dGVyU3RhdGVTbmFwc2hvdCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHAgPSBzLmZpcnN0Q2hpbGQocy5yb290KTtcclxuICAgICAgICBjaGVja0FjdGl2YXRlZFJvdXRlKHAsIFwicC8xMVwiLCB7aWQ6ICcxMScsIHBwOiAnMjInfSwgdW5kZWZpbmVkKTtcclxuXHJcbiAgICAgICAgY29uc3QgYyA9IHMuY2hpbGRyZW4ocCk7XHJcbiAgICAgICAgY2hlY2tBY3RpdmF0ZWRSb3V0ZShjWzBdLCBcImFcIiwge2lkOiAnMTEnLCBwcDogJzIyJywgcGE6ICczMyd9LCBDb21wb25lbnRBKTtcclxuICAgICAgICBjaGVja0FjdGl2YXRlZFJvdXRlKGNbMV0sIFwiYlwiLCB7aWQ6ICcxMScsIHBwOiAnMjInLCBwYjogJzQ0J30sIENvbXBvbmVudEIsIFwiYXV4XCIpO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KFwic2hvdWxkIG1lcmdlIHBhcmFtcyB1bnRpbCBlbmNvdW50ZXJzIGEgbm9ybWFsIHJvdXRlXCIsICgpID0+IHtcclxuICAgICAgY2hlY2tSZWNvZ25pemUoW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIHBhdGg6ICdwLzppZCcsXHJcbiAgICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICB7cGF0aDogJ2EvOm5hbWUnLCBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICAgIHtwYXRoOiAnYicsIGNvbXBvbmVudDogQ29tcG9uZW50QiwgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAgICAgIHtwYXRoOiAnYycsIGNvbXBvbmVudDogQ29tcG9uZW50Q31cclxuICAgICAgICAgICAgICBdfVxyXG4gICAgICAgICAgICBdfVxyXG4gICAgICAgICAgXVxyXG4gICAgICAgIH1cclxuICAgICAgXSwgXCJwLzExL2EvdmljdG9yL2IvY1wiLCAoczpSb3V0ZXJTdGF0ZVNuYXBzaG90KSA9PiB7XHJcbiAgICAgICAgY29uc3QgcCA9IHMuZmlyc3RDaGlsZChzLnJvb3QpO1xyXG4gICAgICAgIGNoZWNrQWN0aXZhdGVkUm91dGUocCwgXCJwLzExXCIsIHtpZDogJzExJ30sIHVuZGVmaW5lZCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGEgPSBzLmZpcnN0Q2hpbGQocCk7XHJcbiAgICAgICAgY2hlY2tBY3RpdmF0ZWRSb3V0ZShhLCBcImEvdmljdG9yXCIsIHtpZDogJzExJywgbmFtZTogJ3ZpY3Rvcid9LCB1bmRlZmluZWQpO1xyXG5cclxuICAgICAgICBjb25zdCBiID0gcy5maXJzdENoaWxkKGEpO1xyXG4gICAgICAgIGNoZWNrQWN0aXZhdGVkUm91dGUoYiwgXCJiXCIsIHtpZDogJzExJywgbmFtZTogJ3ZpY3Rvcid9LCBDb21wb25lbnRCKTtcclxuXHJcbiAgICAgICAgY29uc3QgYyA9IHMuZmlyc3RDaGlsZChiKTtcclxuICAgICAgICBjaGVja0FjdGl2YXRlZFJvdXRlKGMsIFwiY1wiLCB7fSwgQ29tcG9uZW50Qyk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgeGl0KFwic2hvdWxkIHdvcmsgd2l0aCBlbXB0eSBwYXRoc1wiLCAoKSA9PiB7XHJcbiAgICAgIGNoZWNrUmVjb2duaXplKFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBwYXRoOiAncC86aWQnLFxyXG4gICAgICAgICAgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAge3BhdGg6ICcnLCBjb21wb25lbnQ6IENvbXBvbmVudEF9LFxyXG4gICAgICAgICAgICB7cGF0aDogJycsIGNvbXBvbmVudDogQ29tcG9uZW50Qiwgb3V0bGV0OiAnYXV4J31cclxuICAgICAgICAgIF1cclxuICAgICAgICB9XHJcbiAgICAgIF0sIFwicC8xMVwiLCAoczpSb3V0ZXJTdGF0ZVNuYXBzaG90KSA9PiB7XHJcbiAgICAgICAgY29uc3QgcCA9IHMuZmlyc3RDaGlsZChzLnJvb3QpO1xyXG4gICAgICAgIGNoZWNrQWN0aXZhdGVkUm91dGUocCwgXCJwLzExXCIsIHtpZDogJzExJ30sIHVuZGVmaW5lZCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGMgPSBzLmNoaWxkcmVuKHApO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwibHNmc1wiLCBjKTtcclxuICAgICAgICBjaGVja0FjdGl2YXRlZFJvdXRlKGNbMF0sIFwiXCIsIHt9LCBDb21wb25lbnRBKTtcclxuICAgICAgICBjaGVja0FjdGl2YXRlZFJvdXRlKGNbMV0sIFwiXCIsIHt9LCBDb21wb25lbnRCLCBcImF1eFwiKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB4aXQoXCJzaG91bGQgd29yayB3aXRoIGVtcHR5IHBhdGhzIGFuZCBwYXJhbXNcIiwgKCkgPT4ge1xyXG4gICAgICBjaGVja1JlY29nbml6ZShbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgcGF0aDogJ3AvOmlkJyxcclxuICAgICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgIHtwYXRoOiAnJywgY29tcG9uZW50OiBDb21wb25lbnRBfSxcclxuICAgICAgICAgICAge3BhdGg6ICcnLCBjb21wb25lbnQ6IENvbXBvbmVudEIsIG91dGxldDogJ2F1eCd9XHJcbiAgICAgICAgICBdXHJcbiAgICAgICAgfVxyXG4gICAgICBdLCBcInAvMTEvKDtwYT0zMy8vYXV4OjtwYj00NClcIiwgKHM6Um91dGVyU3RhdGVTbmFwc2hvdCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHAgPSBzLmZpcnN0Q2hpbGQocy5yb290KTtcclxuICAgICAgICBjaGVja0FjdGl2YXRlZFJvdXRlKHAsIFwicC8xMVwiLCB7aWQ6ICcxMSd9LCB1bmRlZmluZWQpO1xyXG5cclxuICAgICAgICBjb25zdCBjID0gcy5jaGlsZHJlbihwKTtcclxuICAgICAgICBjaGVja0FjdGl2YXRlZFJvdXRlKGNbMF0sIFwiXCIsIHtwYTogJzMzJ30sIENvbXBvbmVudEEpO1xyXG4gICAgICAgIGNoZWNrQWN0aXZhdGVkUm91dGUoY1sxXSwgXCJcIiwge3BiOiAnNDQnfSwgQ29tcG9uZW50QiwgXCJhdXhcIik7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgeGl0KFwic2hvdWxkIHdvcmsgd2l0aCBvbmx5IGF1eCBwYXRoXCIsICgpID0+IHtcclxuICAgICAgY2hlY2tSZWNvZ25pemUoW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIHBhdGg6ICdwLzppZCcsXHJcbiAgICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICB7cGF0aDogJycsIGNvbXBvbmVudDogQ29tcG9uZW50QX0sXHJcbiAgICAgICAgICAgIHtwYXRoOiAnJywgY29tcG9uZW50OiBDb21wb25lbnRCLCBvdXRsZXQ6ICdhdXgnfVxyXG4gICAgICAgICAgXVxyXG4gICAgICAgIH1cclxuICAgICAgXSwgXCJwLzExXCIsIChzOlJvdXRlclN0YXRlU25hcHNob3QpID0+IHtcclxuICAgICAgICBjb25zdCBwID0gcy5maXJzdENoaWxkKHMucm9vdCk7XHJcbiAgICAgICAgY2hlY2tBY3RpdmF0ZWRSb3V0ZShwLCBcInAvMTEoYXV4OjtwYj00NClcIiwge2lkOiAnMTEnfSwgdW5kZWZpbmVkKTtcclxuXHJcbiAgICAgICAgY29uc3QgYyA9IHMuY2hpbGRyZW4ocCk7XHJcbiAgICAgICAgY2hlY2tBY3RpdmF0ZWRSb3V0ZShjWzBdLCBcIlwiLCB7fSwgQ29tcG9uZW50QSk7XHJcbiAgICAgICAgY2hlY2tBY3RpdmF0ZWRSb3V0ZShjWzFdLCBcIlwiLCB7cGI6ICc0NCd9LCBDb21wb25lbnRCLCBcImF1eFwiKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgZGVzY3JpYmUoXCJxdWVyeSBwYXJhbWV0ZXJzXCIsICgpID0+IHtcclxuICAgIGl0KFwic2hvdWxkIHN1cHBvcnQgcXVlcnkgcGFyYW1zXCIsICgpID0+IHtcclxuICAgICAgY29uc3QgY29uZmlnID0gW3twYXRoOiAnYScsIGNvbXBvbmVudDogQ29tcG9uZW50QX1dO1xyXG4gICAgICBjaGVja1JlY29nbml6ZShjb25maWcsIFwiYT9xPTExXCIsIChzOlJvdXRlclN0YXRlU25hcHNob3QpID0+IHtcclxuICAgICAgICBleHBlY3Qocy5xdWVyeVBhcmFtcykudG9FcXVhbCh7cTogJzExJ30pO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBkZXNjcmliZShcImZyYWdtZW50XCIsICgpID0+IHtcclxuICAgIGl0KFwic2hvdWxkIHN1cHBvcnQgZnJhZ21lbnRcIiwgKCkgPT4ge1xyXG4gICAgICBjb25zdCBjb25maWcgPSBbe3BhdGg6ICdhJywgY29tcG9uZW50OiBDb21wb25lbnRBfV07XHJcbiAgICAgIGNoZWNrUmVjb2duaXplKGNvbmZpZywgXCJhI2YxXCIsIChzOlJvdXRlclN0YXRlU25hcHNob3QpID0+IHtcclxuICAgICAgICBleHBlY3Qocy5mcmFnbWVudCkudG9FcXVhbChcImYxXCIpO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBkZXNjcmliZShcImVycm9yIGhhbmRsaW5nXCIsICgpID0+IHtcclxuICAgIGl0KCdzaG91bGQgZXJyb3Igd2hlbiB0d28gcm91dGVzIHdpdGggdGhlIHNhbWUgb3V0bGV0IG5hbWUgZ290IG1hdGNoZWQnLCAoKSA9PiB7XHJcbiAgICAgIHJlY29nbml6ZShSb290Q29tcG9uZW50LCBbXHJcbiAgICAgICAgeyBwYXRoOiAnYScsIGNvbXBvbmVudDogQ29tcG9uZW50QSB9LFxyXG4gICAgICAgIHsgcGF0aDogJ2InLCBjb21wb25lbnQ6IENvbXBvbmVudEIsIG91dGxldDogJ2F1eCcgfSxcclxuICAgICAgICB7IHBhdGg6ICdjJywgY29tcG9uZW50OiBDb21wb25lbnRDLCBvdXRsZXQ6ICdhdXgnIH1cclxuICAgICAgXSwgdHJlZShcImEoYXV4OmIvL2F1eDpjKVwiKSwgXCJhKGF1eDpiLy9hdXg6YylcIikuc3Vic2NyaWJlKChfKSA9PiB7fSwgKHM6Um91dGVyU3RhdGVTbmFwc2hvdCkgPT4ge1xyXG4gICAgICAgIGV4cGVjdChzLnRvU3RyaW5nKCkpLnRvQ29udGFpbihcIlR3byBzZWdtZW50cyBjYW5ub3QgaGF2ZSB0aGUgc2FtZSBvdXRsZXQgbmFtZTogJ2F1eDpiJyBhbmQgJ2F1eDpjJy5cIik7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoXCJzaG91bGQgZXJyb3Igd2hlbiBubyBtYXRjaGluZyByb3V0ZXNcIiwgKCkgPT4ge1xyXG4gICAgICByZWNvZ25pemUoUm9vdENvbXBvbmVudCwgW1xyXG4gICAgICAgIHsgcGF0aDogJ2EnLCBjb21wb25lbnQ6IENvbXBvbmVudEEgfVxyXG4gICAgICBdLCB0cmVlKFwiaW52YWxpZFwiKSwgXCJpbnZhbGlkXCIpLnN1YnNjcmliZSgoXykgPT4ge30sIChzOlJvdXRlclN0YXRlU25hcHNob3QpID0+IHtcclxuICAgICAgICBleHBlY3Qocy50b1N0cmluZygpKS50b0NvbnRhaW4oXCJDYW5ub3QgbWF0Y2ggYW55IHJvdXRlc1wiKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdChcInNob3VsZCBlcnJvciB3aGVuIG5vIG1hdGNoaW5nIHJvdXRlcyAodG9vIHNob3J0KVwiLCAoKSA9PiB7XHJcbiAgICAgIHJlY29nbml6ZShSb290Q29tcG9uZW50LCBbXHJcbiAgICAgICAgeyBwYXRoOiAnYS86aWQnLCBjb21wb25lbnQ6IENvbXBvbmVudEEgfVxyXG4gICAgICBdLCB0cmVlKFwiYVwiKSwgXCJhXCIpLnN1YnNjcmliZSgoXykgPT4ge30sIChzOlJvdXRlclN0YXRlU25hcHNob3QpID0+IHtcclxuICAgICAgICBleHBlY3Qocy50b1N0cmluZygpKS50b0NvbnRhaW4oXCJDYW5ub3QgbWF0Y2ggYW55IHJvdXRlc1wiKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9KTtcclxufSk7XHJcblxyXG5mdW5jdGlvbiBjaGVja1JlY29nbml6ZShjb25maWc6IFJvdXRlckNvbmZpZywgdXJsOiBzdHJpbmcsIGNhbGxiYWNrOiBhbnkpOiB2b2lkIHtcclxuICByZWNvZ25pemUoUm9vdENvbXBvbmVudCwgY29uZmlnLCB0cmVlKHVybCksIHVybCkuc3Vic2NyaWJlKGNhbGxiYWNrLCBlID0+IHtcclxuICAgIHRocm93IGU7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNoZWNrQWN0aXZhdGVkUm91dGUoYWN0dWFsOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90LCB1cmw6IHN0cmluZywgcGFyYW1zOiBQYXJhbXMsIGNtcDogRnVuY3Rpb24sIG91dGxldDogc3RyaW5nID0gUFJJTUFSWV9PVVRMRVQpOnZvaWQge1xyXG4gIGlmIChhY3R1YWwgPT09IG51bGwpIHtcclxuICAgIGV4cGVjdChhY3R1YWwpLm5vdC50b0JlTnVsbCgpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBleHBlY3QoYWN0dWFsLnVybC5tYXAocyA9PiBzLnBhdGgpLmpvaW4oXCIvXCIpKS50b0VxdWFsKHVybCk7XHJcbiAgICBleHBlY3QoYWN0dWFsLnBhcmFtcykudG9FcXVhbChwYXJhbXMpO1xyXG4gICAgZXhwZWN0KGFjdHVhbC5jb21wb25lbnQpLnRvQmUoY21wKTtcclxuICAgIGV4cGVjdChhY3R1YWwub3V0bGV0KS50b0VxdWFsKG91dGxldCk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiB0cmVlKHVybDogc3RyaW5nKTogVXJsVHJlZSB7XHJcbiAgcmV0dXJuIG5ldyBEZWZhdWx0VXJsU2VyaWFsaXplcigpLnBhcnNlKHVybCk7XHJcbn1cclxuXHJcbmNsYXNzIFJvb3RDb21wb25lbnQge31cclxuY2xhc3MgQ29tcG9uZW50QSB7fVxyXG5jbGFzcyBDb21wb25lbnRCIHt9XHJcbmNsYXNzIENvbXBvbmVudEMge31cclxuIl19