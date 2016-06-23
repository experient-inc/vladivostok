var url_serializer_1 = require('../src/url_serializer');
var url_tree_1 = require('../src/url_tree');
var apply_redirects_1 = require('../src/apply_redirects');
describe('applyRedirects', function () {
    it("should return the same url tree when no redirects", function () {
        checkRedirect([
            { path: 'a', component: ComponentA, children: [{ path: 'b', component: ComponentB }] }
        ], "/a/b", function (t) {
            compareTrees(t, tree('/a/b'));
        });
    });
    it("should add new segments when needed", function () {
        checkRedirect([
            { path: 'a/b', redirectTo: 'a/b/c' },
            { path: '**', component: ComponentC }
        ], "/a/b", function (t) {
            compareTrees(t, tree('/a/b/c'));
        });
    });
    it("should handle positional parameters", function () {
        checkRedirect([
            { path: 'a/:aid/b/:bid', redirectTo: 'newa/:aid/newb/:bid' },
            { path: '**', component: ComponentC }
        ], "/a/1/b/2", function (t) {
            compareTrees(t, tree('/newa/1/newb/2'));
        });
    });
    it("should throw when cannot handle a positional parameter", function () {
        apply_redirects_1.applyRedirects(tree("/a/1"), [
            { path: 'a/:id', redirectTo: 'a/:other' }
        ]).subscribe(function () { }, function (e) {
            expect(e.message).toEqual("Cannot redirect to 'a/:other'. Cannot find ':other'.");
        });
    });
    it("should pass matrix parameters", function () {
        checkRedirect([
            { path: 'a/:id', redirectTo: 'd/a/:id/e' },
            { path: '**', component: ComponentC }
        ], "/a;p1=1/1;p2=2", function (t) {
            compareTrees(t, tree('/d/a;p1=1/1;p2=2/e'));
        });
    });
    it("should handle preserve secondary routes", function () {
        checkRedirect([
            { path: 'a/:id', redirectTo: 'd/a/:id/e' },
            { path: 'c/d', component: ComponentA, outlet: 'aux' },
            { path: '**', component: ComponentC }
        ], "/a/1(aux:c/d)", function (t) {
            compareTrees(t, tree('/d/a/1/e(aux:c/d)'));
        });
    });
    it("should redirect secondary routes", function () {
        checkRedirect([
            { path: 'a/:id', component: ComponentA },
            { path: 'c/d', redirectTo: 'f/c/d/e', outlet: 'aux' },
            { path: '**', component: ComponentC, outlet: 'aux' }
        ], "/a/1(aux:c/d)", function (t) {
            compareTrees(t, tree('/a/1(aux:f/c/d/e)'));
        });
    });
    it("should use the configuration of the route redirected to", function () {
        checkRedirect([
            { path: 'a', component: ComponentA, children: [
                    { path: 'b', component: ComponentB },
                ] },
            { path: 'c', redirectTo: 'a' }
        ], "c/b", function (t) {
            compareTrees(t, tree('a/b'));
        });
    });
    it("should redirect empty path", function () {
        checkRedirect([
            { path: 'a', component: ComponentA, children: [
                    { path: 'b', component: ComponentB },
                ] },
            { path: '', redirectTo: 'a' }
        ], "b", function (t) {
            compareTrees(t, tree('a/b'));
        });
    });
    it("should redirect empty path (global redirect)", function () {
        checkRedirect([
            { path: 'a', component: ComponentA, children: [
                    { path: 'b', component: ComponentB },
                ] },
            { path: '', redirectTo: '/a/b' }
        ], "", function (t) {
            compareTrees(t, tree('a/b'));
        });
    });
    xit("should support nested redirects", function () {
        checkRedirect([
            { path: 'a', component: ComponentA, children: [
                    { path: 'b', component: ComponentB },
                    { path: '', redirectTo: 'b' }
                ] },
            { path: '', redirectTo: 'a' }
        ], "", function (t) {
            compareTrees(t, tree('a/b'));
        });
    });
    xit("should support nested redirects (when redirected to an empty path)", function () {
        checkRedirect([
            { path: '', component: ComponentA, children: [
                    { path: 'b', component: ComponentB },
                    { path: '', redirectTo: 'b' }
                ] },
            { path: 'a', redirectTo: '' }
        ], "a", function (t) {
            compareTrees(t, tree('b'));
        });
    });
    xit("should support redirects with both main and aux", function () {
        checkRedirect([
            { path: 'a', children: [
                    { path: 'b', component: ComponentB },
                    { path: '', redirectTo: 'b' },
                    { path: 'c', component: ComponentC, outlet: 'aux' },
                    { path: '', redirectTo: 'c', outlet: 'aux' }
                ] },
            { path: 'a', redirectTo: '' }
        ], "a", function (t) {
            compareTrees(t, tree('a/(b//aux:c)'));
        });
    });
    it("should redirect empty path route only when terminal", function () {
        var config = [
            { path: 'a', component: ComponentA, children: [
                    { path: 'b', component: ComponentB },
                ] },
            { path: '', redirectTo: 'a', terminal: true }
        ];
        apply_redirects_1.applyRedirects(tree("b"), config).subscribe(function (_) {
            throw "Should not be reached";
        }, function (e) {
            expect(e.message).toEqual("Cannot match any routes: 'b'");
        });
    });
    it("should redirect wild cards", function () {
        checkRedirect([
            { path: '404', component: ComponentA },
            { path: '**', redirectTo: '/404' },
        ], "/a/1(aux:c/d)", function (t) {
            compareTrees(t, tree('/404'));
        });
    });
    it("should support global redirects", function () {
        checkRedirect([
            { path: 'a', component: ComponentA, children: [
                    { path: 'b/:id', redirectTo: '/global/:id' }
                ] },
            { path: '**', component: ComponentC }
        ], "/a/b/1", function (t) {
            compareTrees(t, tree('/global/1'));
        });
    });
});
function checkRedirect(config, url, callback) {
    apply_redirects_1.applyRedirects(tree(url), config).subscribe(callback, function (e) {
        throw e;
    });
}
function tree(url) {
    return new url_serializer_1.DefaultUrlSerializer().parse(url);
}
function compareTrees(actual, expected) {
    var serializer = new url_serializer_1.DefaultUrlSerializer();
    var error = "\"" + serializer.serialize(actual) + "\" is not equal to \"" + serializer.serialize(expected) + "\"";
    compareSegments(actual.root, expected.root, error);
}
function compareSegments(actual, expected, error) {
    expect(actual).toBeDefined(error);
    expect(url_tree_1.equalPathsWithParams(actual.pathsWithParams, expected.pathsWithParams)).toEqual(true, error);
    expect(Object.keys(actual.children).length).toEqual(Object.keys(expected.children).length, error);
    Object.keys(expected.children).forEach(function (key) {
        compareSegments(actual.children[key], expected.children[key], error);
    });
}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbHlfcmVkaXJlY3RzLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90ZXN0L2FwcGx5X3JlZGlyZWN0cy5zcGVjLnRzIl0sIm5hbWVzIjpbImNoZWNrUmVkaXJlY3QiLCJ0cmVlIiwiY29tcGFyZVRyZWVzIiwiY29tcGFyZVNlZ21lbnRzIiwiQ29tcG9uZW50QSIsIkNvbXBvbmVudEEuY29uc3RydWN0b3IiLCJDb21wb25lbnRCIiwiQ29tcG9uZW50Qi5jb25zdHJ1Y3RvciIsIkNvbXBvbmVudEMiLCJDb21wb25lbnRDLmNvbnN0cnVjdG9yIl0sIm1hcHBpbmdzIjoiQUFBQSwrQkFBbUMsdUJBQXVCLENBQUMsQ0FBQTtBQUUzRCx5QkFBd0QsaUJBQWlCLENBQUMsQ0FBQTtBQUUxRSxnQ0FBNkIsd0JBQXdCLENBQUMsQ0FBQTtBQUV0RCxRQUFRLENBQUMsZ0JBQWdCLEVBQUU7SUFDekIsRUFBRSxDQUFDLG1EQUFtRCxFQUFFO1FBQ3RELGFBQWEsQ0FBQztZQUNaLEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFDLENBQUMsRUFBQztTQUNuRixFQUFFLE1BQU0sRUFBRSxVQUFDLENBQVM7WUFDbkIsWUFBWSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNoQyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHFDQUFxQyxFQUFFO1FBQ3hDLGFBQWEsQ0FBQztZQUNaLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFDO1lBQ2xDLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFDO1NBQ3BDLEVBQUUsTUFBTSxFQUFFLFVBQUMsQ0FBUztZQUNuQixZQUFZLENB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LEdBQUdBLENBQUNBLEVBQUVBLEtBQUtBLENBQUNBLENBQUNBO0lBQ3ZFQSxDQUFDQSxDQUFDQSxDQUFDQTtBQUNMQSxDQUFDQTtBQUVEO0lBQUFDO0lBQWtCQyxDQUFDQTtJQUFERCxpQkFBQ0E7QUFBREEsQ0FBQ0EsQUFBbkIsSUFBbUI7QUFDbkI7SUFBQUU7SUFBa0JDLENBQUNBO0lBQURELGlCQUFDQTtBQUFEQSxDQUFDQSxBQUFuQixJQUFtQjtBQUNuQjtJQUFBRTtJQUFrQkMsQ0FBQ0E7SUFBREQsaUJBQUNBO0FBQURBLENBQUNBLEFBQW5CLElBQW1CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtEZWZhdWx0VXJsU2VyaWFsaXplcn0gZnJvbSAnLi4vc3JjL3VybF9zZXJpYWxpemVyJztcclxuaW1wb3J0IHtUcmVlTm9kZX0gZnJvbSAnLi4vc3JjL3V0aWxzL3RyZWUnO1xyXG5pbXBvcnQge1VybFRyZWUsIFVybFNlZ21lbnQsIGVxdWFsUGF0aHNXaXRoUGFyYW1zfSBmcm9tICcuLi9zcmMvdXJsX3RyZWUnO1xyXG5pbXBvcnQge1JvdXRlckNvbmZpZ30gZnJvbSAnLi4vc3JjL2NvbmZpZyc7XHJcbmltcG9ydCB7YXBwbHlSZWRpcmVjdHN9IGZyb20gJy4uL3NyYy9hcHBseV9yZWRpcmVjdHMnO1xyXG5cclxuZGVzY3JpYmUoJ2FwcGx5UmVkaXJlY3RzJywgKCkgPT4ge1xyXG4gIGl0KFwic2hvdWxkIHJldHVybiB0aGUgc2FtZSB1cmwgdHJlZSB3aGVuIG5vIHJlZGlyZWN0c1wiLCAoKSA9PiB7XHJcbiAgICBjaGVja1JlZGlyZWN0KFtcclxuICAgICAge3BhdGg6ICdhJywgY29tcG9uZW50OiBDb21wb25lbnRBLCBjaGlsZHJlbjogW3twYXRoOiAnYicsIGNvbXBvbmVudDogQ29tcG9uZW50Qn1dfVxyXG4gICAgXSwgXCIvYS9iXCIsICh0OlVybFRyZWUpID0+IHtcclxuICAgICAgY29tcGFyZVRyZWVzKHQsIHRyZWUoJy9hL2InKSk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgaXQoXCJzaG91bGQgYWRkIG5ldyBzZWdtZW50cyB3aGVuIG5lZWRlZFwiLCAoKSA9PiB7XHJcbiAgICBjaGVja1JlZGlyZWN0KFtcclxuICAgICAge3BhdGg6ICdhL2InLCByZWRpcmVjdFRvOiAnYS9iL2MnfSxcclxuICAgICAge3BhdGg6ICcqKicsIGNvbXBvbmVudDogQ29tcG9uZW50Q31cclxuICAgIF0sIFwiL2EvYlwiLCAodDpVcmxUcmVlKSA9PiB7XHJcbiAgICAgIGNvbXBhcmVUcmVlcyh0LCB0cmVlKCcvYS9iL2MnKSk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgaXQoXCJzaG91bGQgaGFuZGxlIHBvc2l0aW9uYWwgcGFyYW1ldGVyc1wiLCAoKSA9PiB7XHJcbiAgICBjaGVja1JlZGlyZWN0KFtcclxuICAgICAge3BhdGg6ICdhLzphaWQvYi86YmlkJywgcmVkaXJlY3RUbzogJ25ld2EvOmFpZC9uZXdiLzpiaWQnfSxcclxuICAgICAge3BhdGg6ICcqKicsIGNvbXBvbmVudDogQ29tcG9uZW50Q31cclxuICAgIF0sIFwiL2EvMS9iLzJcIiwgKHQ6VXJsVHJlZSkgPT4ge1xyXG4gICAgICBjb21wYXJlVHJlZXModCwgdHJlZSgnL25ld2EvMS9uZXdiLzInKSk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgaXQoXCJzaG91bGQgdGhyb3cgd2hlbiBjYW5ub3QgaGFuZGxlIGEgcG9zaXRpb25hbCBwYXJhbWV0ZXJcIiwgKCkgPT4ge1xyXG4gICAgYXBwbHlSZWRpcmVjdHModHJlZShcIi9hLzFcIiksIFtcclxuICAgICAge3BhdGg6ICdhLzppZCcsIHJlZGlyZWN0VG86ICdhLzpvdGhlcid9XHJcbiAgICBdKS5zdWJzY3JpYmUoKCkgPT4ge30sIChlKSA9PiB7XHJcbiAgICAgIGV4cGVjdChlLm1lc3NhZ2UpLnRvRXF1YWwoXCJDYW5ub3QgcmVkaXJlY3QgdG8gJ2EvOm90aGVyJy4gQ2Fubm90IGZpbmQgJzpvdGhlcicuXCIpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIGl0KFwic2hvdWxkIHBhc3MgbWF0cml4IHBhcmFtZXRlcnNcIiwgKCkgPT4ge1xyXG4gICAgY2hlY2tSZWRpcmVjdChbXHJcbiAgICAgIHtwYXRoOiAnYS86aWQnLCByZWRpcmVjdFRvOiAnZC9hLzppZC9lJ30sXHJcbiAgICAgIHtwYXRoOiAnKionLCBjb21wb25lbnQ6IENvbXBvbmVudEN9XHJcbiAgICBdLCBcIi9hO3AxPTEvMTtwMj0yXCIsICh0OlVybFRyZWUpID0+IHtcclxuICAgICAgY29tcGFyZVRyZWVzKHQsIHRyZWUoJy9kL2E7cDE9MS8xO3AyPTIvZScpKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBpdChcInNob3VsZCBoYW5kbGUgcHJlc2VydmUgc2Vjb25kYXJ5IHJvdXRlc1wiLCAoKSA9PiB7XHJcbiAgICBjaGVja1JlZGlyZWN0KFtcclxuICAgICAge3BhdGg6ICdhLzppZCcsIHJlZGlyZWN0VG86ICdkL2EvOmlkL2UnfSxcclxuICAgICAge3BhdGg6ICdjL2QnLCBjb21wb25lbnQ6IENvbXBvbmVudEEsIG91dGxldDogJ2F1eCd9LFxyXG4gICAgICB7cGF0aDogJyoqJywgY29tcG9uZW50OiBDb21wb25lbnRDfVxyXG4gICAgXSwgXCIvYS8xKGF1eDpjL2QpXCIsICh0OlVybFRyZWUpID0+IHtcclxuICAgICAgY29tcGFyZVRyZWVzKHQsIHRyZWUoJy9kL2EvMS9lKGF1eDpjL2QpJykpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIGl0KFwic2hvdWxkIHJlZGlyZWN0IHNlY29uZGFyeSByb3V0ZXNcIiwgKCkgPT4ge1xyXG4gICAgY2hlY2tSZWRpcmVjdChbXHJcbiAgICAgIHtwYXRoOiAnYS86aWQnLCBjb21wb25lbnQ6IENvbXBvbmVudEF9LFxyXG4gICAgICB7cGF0aDogJ2MvZCcsIHJlZGlyZWN0VG86ICdmL2MvZC9lJywgb3V0bGV0OiAnYXV4J30sXHJcbiAgICAgIHtwYXRoOiAnKionLCBjb21wb25lbnQ6IENvbXBvbmVudEMsIG91dGxldDogJ2F1eCd9XHJcbiAgICBdLCBcIi9hLzEoYXV4OmMvZClcIiwgKHQ6VXJsVHJlZSkgPT4ge1xyXG4gICAgICBjb21wYXJlVHJlZXModCwgdHJlZSgnL2EvMShhdXg6Zi9jL2QvZSknKSk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgaXQoXCJzaG91bGQgdXNlIHRoZSBjb25maWd1cmF0aW9uIG9mIHRoZSByb3V0ZSByZWRpcmVjdGVkIHRvXCIsICgpID0+IHtcclxuICAgIGNoZWNrUmVkaXJlY3QoW1xyXG4gICAgICB7cGF0aDogJ2EnLCBjb21wb25lbnQ6IENvbXBvbmVudEEsIGNoaWxkcmVuOiBbXHJcbiAgICAgICAge3BhdGg6ICdiJywgY29tcG9uZW50OiBDb21wb25lbnRCfSxcclxuICAgICAgXX0sXHJcbiAgICAgIHtwYXRoOiAnYycsIHJlZGlyZWN0VG86ICdhJ31cclxuICAgIF0sIFwiYy9iXCIsICh0OlVybFRyZWUpID0+IHtcclxuICAgICAgY29tcGFyZVRyZWVzKHQsIHRyZWUoJ2EvYicpKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBpdChcInNob3VsZCByZWRpcmVjdCBlbXB0eSBwYXRoXCIsICgpID0+IHtcclxuICAgIGNoZWNrUmVkaXJlY3QoW1xyXG4gICAgICB7cGF0aDogJ2EnLCBjb21wb25lbnQ6IENvbXBvbmVudEEsIGNoaWxkcmVuOiBbXHJcbiAgICAgICAge3BhdGg6ICdiJywgY29tcG9uZW50OiBDb21wb25lbnRCfSxcclxuICAgICAgXX0sXHJcbiAgICAgIHtwYXRoOiAnJywgcmVkaXJlY3RUbzogJ2EnfVxyXG4gICAgXSwgXCJiXCIsICh0OlVybFRyZWUpID0+IHtcclxuICAgICAgY29tcGFyZVRyZWVzKHQsIHRyZWUoJ2EvYicpKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBpdChcInNob3VsZCByZWRpcmVjdCBlbXB0eSBwYXRoIChnbG9iYWwgcmVkaXJlY3QpXCIsICgpID0+IHtcclxuICAgIGNoZWNrUmVkaXJlY3QoW1xyXG4gICAgICB7cGF0aDogJ2EnLCBjb21wb25lbnQ6IENvbXBvbmVudEEsIGNoaWxkcmVuOiBbXHJcbiAgICAgICAge3BhdGg6ICdiJywgY29tcG9uZW50OiBDb21wb25lbnRCfSxcclxuICAgICAgXX0sXHJcbiAgICAgIHtwYXRoOiAnJywgcmVkaXJlY3RUbzogJy9hL2InfVxyXG4gICAgXSwgXCJcIiwgKHQ6VXJsVHJlZSkgPT4ge1xyXG4gICAgICBjb21wYXJlVHJlZXModCwgdHJlZSgnYS9iJykpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIHhpdChcInNob3VsZCBzdXBwb3J0IG5lc3RlZCByZWRpcmVjdHNcIiwgKCkgPT4ge1xyXG4gICAgY2hlY2tSZWRpcmVjdChbXHJcbiAgICAgIHtwYXRoOiAnYScsIGNvbXBvbmVudDogQ29tcG9uZW50QSwgY2hpbGRyZW46IFtcclxuICAgICAgICB7cGF0aDogJ2InLCBjb21wb25lbnQ6IENvbXBvbmVudEJ9LFxyXG4gICAgICAgIHtwYXRoOiAnJywgcmVkaXJlY3RUbzogJ2InfVxyXG4gICAgICBdfSxcclxuICAgICAge3BhdGg6ICcnLCByZWRpcmVjdFRvOiAnYSd9XHJcbiAgICBdLCBcIlwiLCAodDpVcmxUcmVlKSA9PiB7XHJcbiAgICAgIGNvbXBhcmVUcmVlcyh0LCB0cmVlKCdhL2InKSk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgeGl0KFwic2hvdWxkIHN1cHBvcnQgbmVzdGVkIHJlZGlyZWN0cyAod2hlbiByZWRpcmVjdGVkIHRvIGFuIGVtcHR5IHBhdGgpXCIsICgpID0+IHtcclxuICAgIGNoZWNrUmVkaXJlY3QoW1xyXG4gICAgICB7cGF0aDogJycsIGNvbXBvbmVudDogQ29tcG9uZW50QSwgY2hpbGRyZW46IFtcclxuICAgICAgICB7cGF0aDogJ2InLCBjb21wb25lbnQ6IENvbXBvbmVudEJ9LFxyXG4gICAgICAgIHtwYXRoOiAnJywgcmVkaXJlY3RUbzogJ2InfVxyXG4gICAgICBdfSxcclxuICAgICAge3BhdGg6ICdhJywgcmVkaXJlY3RUbzogJyd9XHJcbiAgICBdLCBcImFcIiwgKHQ6VXJsVHJlZSkgPT4ge1xyXG4gICAgICBjb21wYXJlVHJlZXModCwgdHJlZSgnYicpKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICB4aXQoXCJzaG91bGQgc3VwcG9ydCByZWRpcmVjdHMgd2l0aCBib3RoIG1haW4gYW5kIGF1eFwiLCAoKSA9PiB7XHJcbiAgICBjaGVja1JlZGlyZWN0KFtcclxuICAgICAge3BhdGg6ICdhJywgY2hpbGRyZW46IFtcclxuICAgICAgICB7cGF0aDogJ2InLCBjb21wb25lbnQ6IENvbXBvbmVudEJ9LFxyXG4gICAgICAgIHtwYXRoOiAnJywgcmVkaXJlY3RUbzogJ2InfSxcclxuXHJcbiAgICAgICAge3BhdGg6ICdjJywgY29tcG9uZW50OiBDb21wb25lbnRDLCBvdXRsZXQ6ICdhdXgnfSxcclxuICAgICAgICB7cGF0aDogJycsIHJlZGlyZWN0VG86ICdjJywgb3V0bGV0OiAnYXV4J31cclxuICAgICAgXX0sXHJcbiAgICAgIHtwYXRoOiAnYScsIHJlZGlyZWN0VG86ICcnfVxyXG4gICAgXSwgXCJhXCIsICh0OlVybFRyZWUpID0+IHtcclxuICAgICAgY29tcGFyZVRyZWVzKHQsIHRyZWUoJ2EvKGIvL2F1eDpjKScpKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBpdChcInNob3VsZCByZWRpcmVjdCBlbXB0eSBwYXRoIHJvdXRlIG9ubHkgd2hlbiB0ZXJtaW5hbFwiLCAoKSA9PiB7XHJcbiAgICBjb25zdCBjb25maWcgPSBbXHJcbiAgICAgIHtwYXRoOiAnYScsIGNvbXBvbmVudDogQ29tcG9uZW50QSwgY2hpbGRyZW46IFtcclxuICAgICAgICB7cGF0aDogJ2InLCBjb21wb25lbnQ6IENvbXBvbmVudEJ9LFxyXG4gICAgICBdfSxcclxuICAgICAge3BhdGg6ICcnLCByZWRpcmVjdFRvOiAnYScsIHRlcm1pbmFsOiB0cnVlfVxyXG4gICAgXTtcclxuXHJcbiAgICBhcHBseVJlZGlyZWN0cyh0cmVlKFwiYlwiKSwgY29uZmlnKS5zdWJzY3JpYmUoKF8pID0+IHtcclxuICAgICAgdGhyb3cgXCJTaG91bGQgbm90IGJlIHJlYWNoZWRcIjtcclxuICAgIH0sIGUgPT4ge1xyXG4gICAgICBleHBlY3QoZS5tZXNzYWdlKS50b0VxdWFsKFwiQ2Fubm90IG1hdGNoIGFueSByb3V0ZXM6ICdiJ1wiKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBpdChcInNob3VsZCByZWRpcmVjdCB3aWxkIGNhcmRzXCIsICgpID0+IHtcclxuICAgIGNoZWNrUmVkaXJlY3QoW1xyXG4gICAgICB7cGF0aDogJzQwNCcsIGNvbXBvbmVudDogQ29tcG9uZW50QX0sXHJcbiAgICAgIHtwYXRoOiAnKionLCByZWRpcmVjdFRvOiAnLzQwNCd9LFxyXG4gICAgXSwgXCIvYS8xKGF1eDpjL2QpXCIsICh0OlVybFRyZWUpID0+IHtcclxuICAgICAgY29tcGFyZVRyZWVzKHQsIHRyZWUoJy80MDQnKSk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgaXQoXCJzaG91bGQgc3VwcG9ydCBnbG9iYWwgcmVkaXJlY3RzXCIsICgpID0+IHtcclxuICAgIGNoZWNrUmVkaXJlY3QoW1xyXG4gICAgICB7cGF0aDogJ2EnLCBjb21wb25lbnQ6IENvbXBvbmVudEEsIGNoaWxkcmVuOiBbXHJcbiAgICAgICAge3BhdGg6ICdiLzppZCcsIHJlZGlyZWN0VG86ICcvZ2xvYmFsLzppZCd9XHJcbiAgICAgIF19LFxyXG4gICAgICB7cGF0aDogJyoqJywgY29tcG9uZW50OiBDb21wb25lbnRDfVxyXG4gICAgXSwgXCIvYS9iLzFcIiwgKHQ6VXJsVHJlZSkgPT4ge1xyXG4gICAgICBjb21wYXJlVHJlZXModCwgdHJlZSgnL2dsb2JhbC8xJykpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gY2hlY2tSZWRpcmVjdChjb25maWc6IFJvdXRlckNvbmZpZywgdXJsOiBzdHJpbmcsIGNhbGxiYWNrOiBhbnkpOiB2b2lkIHtcclxuICBhcHBseVJlZGlyZWN0cyh0cmVlKHVybCksIGNvbmZpZykuc3Vic2NyaWJlKGNhbGxiYWNrLCBlID0+IHtcclxuICAgIHRocm93IGU7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRyZWUodXJsOiBzdHJpbmcpOiBVcmxUcmVlIHtcclxuICByZXR1cm4gbmV3IERlZmF1bHRVcmxTZXJpYWxpemVyKCkucGFyc2UodXJsKTtcclxufVxyXG5cclxuZnVuY3Rpb24gY29tcGFyZVRyZWVzKGFjdHVhbDogVXJsVHJlZSwgZXhwZWN0ZWQ6IFVybFRyZWUpOiB2b2lke1xyXG4gIGNvbnN0IHNlcmlhbGl6ZXIgPSBuZXcgRGVmYXVsdFVybFNlcmlhbGl6ZXIoKTtcclxuICBjb25zdCBlcnJvciA9IGBcIiR7c2VyaWFsaXplci5zZXJpYWxpemUoYWN0dWFsKX1cIiBpcyBub3QgZXF1YWwgdG8gXCIke3NlcmlhbGl6ZXIuc2VyaWFsaXplKGV4cGVjdGVkKX1cImA7XHJcbiAgY29tcGFyZVNlZ21lbnRzKGFjdHVhbC5yb290LCBleHBlY3RlZC5yb290LCBlcnJvcik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNvbXBhcmVTZWdtZW50cyhhY3R1YWw6IFVybFNlZ21lbnQsIGV4cGVjdGVkOiBVcmxTZWdtZW50LCBlcnJvcjogc3RyaW5nKTogdm9pZHtcclxuICBleHBlY3QoYWN0dWFsKS50b0JlRGVmaW5lZChlcnJvcik7XHJcbiAgZXhwZWN0KGVxdWFsUGF0aHNXaXRoUGFyYW1zKGFjdHVhbC5wYXRoc1dpdGhQYXJhbXMsIGV4cGVjdGVkLnBhdGhzV2l0aFBhcmFtcykpLnRvRXF1YWwodHJ1ZSwgZXJyb3IpO1xyXG5cclxuICBleHBlY3QoT2JqZWN0LmtleXMoYWN0dWFsLmNoaWxkcmVuKS5sZW5ndGgpLnRvRXF1YWwoT2JqZWN0LmtleXMoZXhwZWN0ZWQuY2hpbGRyZW4pLmxlbmd0aCwgZXJyb3IpO1xyXG5cclxuICBPYmplY3Qua2V5cyhleHBlY3RlZC5jaGlsZHJlbikuZm9yRWFjaChrZXkgPT4ge1xyXG4gICAgY29tcGFyZVNlZ21lbnRzKGFjdHVhbC5jaGlsZHJlbltrZXldLCBleHBlY3RlZC5jaGlsZHJlbltrZXldLCBlcnJvcik7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmNsYXNzIENvbXBvbmVudEEge31cclxuY2xhc3MgQ29tcG9uZW50QiB7fVxyXG5jbGFzcyBDb21wb25lbnRDIHt9XHJcbiJdfQ==