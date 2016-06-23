var url_serializer_1 = require('../src/url_serializer');
var router_state_1 = require('../src/router_state');
var shared_1 = require('../src/shared');
var create_url_tree_1 = require('../src/create_url_tree');
var BehaviorSubject_1 = require('rxjs/BehaviorSubject');
describe('createUrlTree', function () {
    var serializer = new url_serializer_1.DefaultUrlSerializer();
    it("should navigate to the root", function () {
        var p = serializer.parse("/");
        var t = createRoot(p, ["/"]);
        expect(serializer.serialize(t)).toEqual("/");
    });
    it("should support nested segments", function () {
        var p = serializer.parse("/a/b");
        var t = createRoot(p, ["/one", 11, "two", 22]);
        expect(serializer.serialize(t)).toEqual("/one/11/two/22");
    });
    it("should stringify positional parameters", function () {
        var p = serializer.parse("/a/b");
        var t = createRoot(p, ["/one", 11]);
        var params = t.root.children[shared_1.PRIMARY_OUTLET].pathsWithParams;
        expect(params[0].path).toEqual("one");
        expect(params[1].path).toEqual("11");
    });
    it("should preserve secondary segments", function () {
        var p = serializer.parse("/a/11/b(right:c)");
        var t = createRoot(p, ["/a", 11, 'd']);
        expect(serializer.serialize(t)).toEqual("/a/11/d(right:c)");
    });
    it("should support updating secondary segments", function () {
        var p = serializer.parse("/a(right:b)");
        var t = createRoot(p, ["right:c", 11, 'd']);
        expect(serializer.serialize(t)).toEqual("/a(right:c/11/d)");
    });
    it("should support updating secondary segments (nested case)", function () {
        var p = serializer.parse("/a/(b//right:c)");
        var t = createRoot(p, ["a", "right:d", 11, 'e']);
        expect(serializer.serialize(t)).toEqual("/a/(b//right:d/11/e)");
    });
    it('should update matrix parameters', function () {
        var p = serializer.parse("/a;pp=11");
        var t = createRoot(p, ["/a", { pp: 22, dd: 33 }]);
        expect(serializer.serialize(t)).toEqual("/a;pp=22;dd=33");
    });
    it('should create matrix parameters', function () {
        var p = serializer.parse("/a");
        var t = createRoot(p, ["/a", { pp: 22, dd: 33 }]);
        expect(serializer.serialize(t)).toEqual("/a;pp=22;dd=33");
    });
    it('should create matrix parameters together with other segments', function () {
        var p = serializer.parse("/a");
        var t = createRoot(p, ["/a", "/b", { aa: 22, bb: 33 }]);
        expect(serializer.serialize(t)).toEqual("/a/b;aa=22;bb=33");
    });
    describe("relative navigation", function () {
        it("should work", function () {
            var p = serializer.parse("/a/(c//left:cp)(left:ap)");
            var t = create(p.root.children[shared_1.PRIMARY_OUTLET], 0, p, ["c2"]);
            expect(serializer.serialize(t)).toEqual("/a/(c2//left:cp)(left:ap)");
        });
        it("should work when the first command starts with a ./", function () {
            var p = serializer.parse("/a/(c//left:cp)(left:ap)");
            var t = create(p.root.children[shared_1.PRIMARY_OUTLET], 0, p, ["./c2"]);
            expect(serializer.serialize(t)).toEqual("/a/(c2//left:cp)(left:ap)");
        });
        it("should work when the first command is ./)", function () {
            var p = serializer.parse("/a/(c//left:cp)(left:ap)");
            var t = create(p.root.children[shared_1.PRIMARY_OUTLET], 0, p, ["./", "c2"]);
            expect(serializer.serialize(t)).toEqual("/a/(c2//left:cp)(left:ap)");
        });
        it("should work when given params", function () {
            var p = serializer.parse("/a/(c//left:cp)(left:ap)");
            var t = create(p.root.children[shared_1.PRIMARY_OUTLET], 0, p, [{ 'x': 99 }]);
            expect(serializer.serialize(t)).toEqual("/a/(c;x=99//left:cp)(left:ap)");
        });
        it("should work when index > 0", function () {
            var p = serializer.parse("/a/c");
            var t = create(p.root.children[shared_1.PRIMARY_OUTLET], 1, p, ["c2"]);
            expect(serializer.serialize(t)).toEqual("/a/c/c2");
        });
        it("should support going to a parent (within a segment)", function () {
            var p = serializer.parse("/a/c");
            var t = create(p.root.children[shared_1.PRIMARY_OUTLET], 1, p, ["../c2"]);
            expect(serializer.serialize(t)).toEqual("/a/c2");
        });
        it("should work when given ../", function () {
            var p = serializer.parse("/a/c");
            var t = create(p.root.children[shared_1.PRIMARY_OUTLET], 1, p, ["../", "c2"]);
            expect(serializer.serialize(t)).toEqual("/a/c2");
        });
        it("should support setting matrix params", function () {
            var p = serializer.parse("/a/(c//left:cp)(left:ap)");
            var t = create(p.root.children[shared_1.PRIMARY_OUTLET], 0, p, ['../', { x: 5 }]);
            expect(serializer.serialize(t)).toEqual("/a;x=5(left:ap)");
        });
        xit("should support going to a parent (across segments)", function () {
            var p = serializer.parse("/q/(a/(c//left:cp)//left:qp)(left:ap)");
            var t = create(p.root.children[shared_1.PRIMARY_OUTLET].children[shared_1.PRIMARY_OUTLET], 0, p, ['../../q2']);
            expect(serializer.serialize(t)).toEqual("/q2(left:ap)");
        });
        xit("should navigate to the root", function () {
            var p = serializer.parse("/a/c");
            var t = create(p.root.children[shared_1.PRIMARY_OUTLET], 0, p, ['../']);
            expect(serializer.serialize(t)).toEqual("");
        });
        it("should throw when too many ..", function () {
            var p = serializer.parse("/a/(c//left:cp)(left:ap)");
            expect(function () { return create(p.root.children[shared_1.PRIMARY_OUTLET], 0, p, ['../../']); }).toThrowError("Invalid number of '../'");
        });
    });
    it("should set query params", function () {
        var p = serializer.parse("/");
        var t = createRoot(p, [], { a: 'hey' });
        expect(t.queryParams).toEqual({ a: 'hey' });
    });
    it("should stringify query params", function () {
        var p = serializer.parse("/");
        var t = createRoot(p, [], { a: 1 });
        expect(t.queryParams).toEqual({ a: '1' });
    });
    it("should reuse old query params when given undefined", function () {
        var p = serializer.parse("/?a=1");
        var t = createRoot(p, [], undefined);
        expect(t.queryParams).toEqual({ a: '1' });
    });
    it("should set fragment", function () {
        var p = serializer.parse("/");
        var t = createRoot(p, [], {}, "fragment");
        expect(t.fragment).toEqual("fragment");
    });
    it("should reused old fragment when given undefined", function () {
        var p = serializer.parse("/#fragment");
        var t = createRoot(p, [], undefined, undefined);
        expect(t.fragment).toEqual("fragment");
    });
});
function createRoot(tree, commands, queryParams, fragment) {
    var s = new router_state_1.ActivatedRouteSnapshot([], {}, shared_1.PRIMARY_OUTLET, "someComponent", null, tree.root, -1);
    var a = new router_state_1.ActivatedRoute(new BehaviorSubject_1.BehaviorSubject(null), new BehaviorSubject_1.BehaviorSubject(null), shared_1.PRIMARY_OUTLET, "someComponent", s);
    router_state_1.advanceActivatedRoute(a);
    return create_url_tree_1.createUrlTree(a, tree, commands, queryParams, fragment);
}
function create(segment, startIndex, tree, commands, queryParams, fragment) {
    if (!segment) {
        expect(segment).toBeDefined();
    }
    var s = new router_state_1.ActivatedRouteSnapshot([], {}, shared_1.PRIMARY_OUTLET, "someComponent", null, segment, startIndex);
    var a = new router_state_1.ActivatedRoute(new BehaviorSubject_1.BehaviorSubject(null), new BehaviorSubject_1.BehaviorSubject(null), shared_1.PRIMARY_OUTLET, "someComponent", s);
    router_state_1.advanceActivatedRoute(a);
    return create_url_tree_1.createUrlTree(a, tree, commands, queryParams, fragment);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlX3VybF90cmVlLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90ZXN0L2NyZWF0ZV91cmxfdHJlZS5zcGVjLnRzIl0sIm5hbWVzIjpbImNyZWF0ZVJvb3QiLCJjcmVhdGUiXSwibWFwcGluZ3MiOiJBQUFBLCtCQUFtQyx1QkFBdUIsQ0FBQyxDQUFBO0FBRTNELDZCQUE0RSxxQkFBcUIsQ0FBQyxDQUFBO0FBQ2xHLHVCQUFxQyxlQUFlLENBQUMsQ0FBQTtBQUNyRCxnQ0FBNEIsd0JBQXdCLENBQUMsQ0FBQTtBQUNyRCxnQ0FBOEIsc0JBQXNCLENBQUMsQ0FBQTtBQUVyRCxRQUFRLENBQUMsZUFBZSxFQUFFO0lBQ3hCLElBQU0sVUFBVSxHQUFHLElBQUkscUNBQW9CLEVBQUUsQ0FBQztJQUU5QyxFQUFFLENBQUMsNkJBQTZCLEVBQUU7UUFDaEMsSUFBTSxDQUFDLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNoQyxJQUFNLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUMvQixNQUFNLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMvQyxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxnQ0FBZ0MsRUFBRTtRQUNuQyxJQUFNLENBQUMsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ25DLElBQU0sQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2pELE1BQU0sQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDNUQsQ0FBQyxDQUFDLENBQUM7SUFHSCxFQUFFLENBQUMsd0NBQXdDLEVBQUU7UUFDM0MsSUFBTSxDQUFDLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNuQyxJQUFNLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdEMsSUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsdUJBQWMsQ0FBQyxDQUFDLGVBQWUsQ0FBQztRQUMvRCxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN0QyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN2QyxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxvQ0FBb0MsRUFBRTtRQUN2QyxJQUFNLENBQUMsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDL0MsSUFBTSxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QyxNQUFNLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBQzlELENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDRDQUE0QyxFQUFFO1FBQy9DLElBQU0sQ0FBQyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDMUMsSUFBTSxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUM5QyxNQUFNLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBQzlELENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDBEQUEwRCxFQUFFO1FBQzdELElBQU0sQ0FBQyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUM5QyxJQUFNLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNuRCxNQUFNLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0lBQ2xFLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLGlDQUFpQyxFQUFFO1FBQ3BDLElBQU0sQ0FBQyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDdkMsSUFBTSxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQztRQUNsRCxNQUFNLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQzVELENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLGlDQUFpQyxFQUFFO1FBQ3BDLElBQU0sQ0FBQyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakMsSUFBTSxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQztRQUNsRCxNQUFNLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQzVELENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDhEQUE4RCxFQUFFO1FBQ2pFLElBQU0sQ0FBQyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakMsSUFBTSxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEQsTUFBTSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUM5RCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxxQkFBcUIsRUFBRTtRQUM5QixFQUFFLENBQUMsYUFBYSxFQUFFO1lBQ2hCLElBQU0sQ0FBQyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsMEJBQTBCLENBQUMsQ0FBQztZQUN2RCxJQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsdUJBQWMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ2hFLE1BQU0sQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLDJCQUEyQixDQUFDLENBQUM7UUFDdkUsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMscURBQXFELEVBQUU7WUFDeEQsSUFBTSxDQUFDLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1lBQ3ZELElBQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyx1QkFBYyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDbEUsTUFBTSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsMkJBQTJCLENBQUMsQ0FBQztRQUN2RSxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywyQ0FBMkMsRUFBRTtZQUM5QyxJQUFNLENBQUMsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLDBCQUEwQixDQUFDLENBQUM7WUFDdkQsSUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLHVCQUFjLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDdEUsTUFBTSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsMkJBQTJCLENBQUMsQ0FBQztRQUN2RSxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywrQkFBK0IsRUFBRTtZQUNsQyxJQUFNLENBQUMsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLDBCQUEwQixDQUFDLENBQUM7WUFDdkQsSUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLHVCQUFjLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQyxHQUFHLEVBQUUsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JFLE1BQU0sQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLCtCQUErQixDQUFDLENBQUM7UUFDM0UsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsNEJBQTRCLEVBQUU7WUFDL0IsSUFBTSxDQUFDLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNuQyxJQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsdUJBQWMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ2hFLE1BQU0sQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3JELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHFEQUFxRCxFQUFFO1lBQ3hELElBQU0sQ0FBQyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDbkMsSUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLHVCQUFjLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNuRSxNQUFNLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNuRCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyw0QkFBNEIsRUFBRTtZQUMvQixJQUFNLENBQUMsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ25DLElBQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyx1QkFBYyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3ZFLE1BQU0sQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ25ELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHNDQUFzQyxFQUFFO1lBQ3pDLElBQU0sQ0FBQyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsMEJBQTBCLENBQUMsQ0FBQztZQUN2RCxJQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsdUJBQWMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pFLE1BQU0sQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDN0QsQ0FBQyxDQUFDLENBQUM7UUFFSCxHQUFHLENBQUMsb0RBQW9ELEVBQUU7WUFDeEQsSUFBTSxDQUFDLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO1lBRXBFLElBQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyx1QkFBYyxDQUFDLENBQUMsUUFBUSxDQUFDLHVCQUFjLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUMvRixNQUFNLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUMxRCxDQUFDLENBQUMsQ0FBQztRQUVILEdBQUcsQ0FBQyw2QkFBNkIsRUFBRTtZQUNqQyxJQUFNLENBQUMsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ25DLElBQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyx1QkFBYyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDakUsTUFBTSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDOUMsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsK0JBQStCLEVBQUU7WUFDbEMsSUFBTSxDQUFDLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1lBQ3ZELE1BQU0sQ0FBQyxjQUFNLE9BQUEsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLHVCQUFjLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBekQsQ0FBeUQsQ0FBQyxDQUFDLFlBQVksQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1FBQ2xILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMseUJBQXlCLEVBQUU7UUFDNUIsSUFBTSxDQUFDLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNoQyxJQUFNLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFDLENBQUMsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO1FBQ3hDLE1BQU0sQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUMsQ0FBQyxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7SUFDNUMsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsK0JBQStCLEVBQUU7UUFDbEMsSUFBTSxDQUFDLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNoQyxJQUFNLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBTyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQ3pDLE1BQU0sQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBQyxDQUFDLENBQUM7SUFDMUMsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsb0RBQW9ELEVBQUU7UUFDdkQsSUFBTSxDQUFDLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNwQyxJQUFNLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUN2QyxNQUFNLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFDLENBQUMsRUFBRSxHQUFHLEVBQUMsQ0FBQyxDQUFDO0lBQzFDLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHFCQUFxQixFQUFFO1FBQ3hCLElBQU0sQ0FBQyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDaEMsSUFBTSxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQzVDLE1BQU0sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3pDLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLGlEQUFpRCxFQUFFO1FBQ3BELElBQU0sQ0FBQyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDekMsSUFBTSxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ2xELE1BQU0sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3pDLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFSCxvQkFBb0IsSUFBYSxFQUFFLFFBQWUsRUFBRSxXQUFvQixFQUFFLFFBQWlCO0lBQ3pGQSxJQUFNQSxDQUFDQSxHQUFHQSxJQUFJQSxxQ0FBc0JBLENBQUNBLEVBQUVBLEVBQU9BLEVBQUVBLEVBQUVBLHVCQUFjQSxFQUFFQSxlQUFlQSxFQUFFQSxJQUFJQSxFQUFFQSxJQUFJQSxDQUFDQSxJQUFJQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtJQUN4R0EsSUFBTUEsQ0FBQ0EsR0FBR0EsSUFBSUEsNkJBQWNBLENBQUNBLElBQUlBLGlDQUFlQSxDQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxJQUFJQSxpQ0FBZUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsdUJBQWNBLEVBQUVBLGVBQWVBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO0lBQ3ZIQSxvQ0FBcUJBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO0lBQ3pCQSxNQUFNQSxDQUFDQSwrQkFBYUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsSUFBSUEsRUFBRUEsUUFBUUEsRUFBRUEsV0FBV0EsRUFBRUEsUUFBUUEsQ0FBQ0EsQ0FBQ0E7QUFDakVBLENBQUNBO0FBRUQsZ0JBQWdCLE9BQW1CLEVBQUUsVUFBa0IsRUFBRSxJQUFhLEVBQUUsUUFBZSxFQUFFLFdBQW9CLEVBQUUsUUFBaUI7SUFDOUhDLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBO1FBQ2JBLE1BQU1BLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLFdBQVdBLEVBQUVBLENBQUNBO0lBQ2hDQSxDQUFDQTtJQUNEQSxJQUFNQSxDQUFDQSxHQUFHQSxJQUFJQSxxQ0FBc0JBLENBQUNBLEVBQUVBLEVBQU9BLEVBQUVBLEVBQUVBLHVCQUFjQSxFQUFFQSxlQUFlQSxFQUFFQSxJQUFJQSxFQUFPQSxPQUFPQSxFQUFFQSxVQUFVQSxDQUFDQSxDQUFDQTtJQUNuSEEsSUFBTUEsQ0FBQ0EsR0FBR0EsSUFBSUEsNkJBQWNBLENBQUNBLElBQUlBLGlDQUFlQSxDQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxJQUFJQSxpQ0FBZUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsdUJBQWNBLEVBQUVBLGVBQWVBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO0lBQ3ZIQSxvQ0FBcUJBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO0lBQ3pCQSxNQUFNQSxDQUFDQSwrQkFBYUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsSUFBSUEsRUFBRUEsUUFBUUEsRUFBRUEsV0FBV0EsRUFBRUEsUUFBUUEsQ0FBQ0EsQ0FBQ0E7QUFDakVBLENBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtEZWZhdWx0VXJsU2VyaWFsaXplcn0gZnJvbSAnLi4vc3JjL3VybF9zZXJpYWxpemVyJztcclxuaW1wb3J0IHtVcmxUcmVlLCBVcmxQYXRoV2l0aFBhcmFtcywgVXJsU2VnbWVudH0gZnJvbSAnLi4vc3JjL3VybF90cmVlJztcclxuaW1wb3J0IHtBY3RpdmF0ZWRSb3V0ZSwgQWN0aXZhdGVkUm91dGVTbmFwc2hvdCwgYWR2YW5jZUFjdGl2YXRlZFJvdXRlfSBmcm9tICcuLi9zcmMvcm91dGVyX3N0YXRlJztcclxuaW1wb3J0IHtQUklNQVJZX09VVExFVCwgUGFyYW1zfSBmcm9tICcuLi9zcmMvc2hhcmVkJztcclxuaW1wb3J0IHtjcmVhdGVVcmxUcmVlfSBmcm9tICcuLi9zcmMvY3JlYXRlX3VybF90cmVlJztcclxuaW1wb3J0IHtCZWhhdmlvclN1YmplY3R9IGZyb20gJ3J4anMvQmVoYXZpb3JTdWJqZWN0JztcclxuXHJcbmRlc2NyaWJlKCdjcmVhdGVVcmxUcmVlJywgKCkgPT4ge1xyXG4gIGNvbnN0IHNlcmlhbGl6ZXIgPSBuZXcgRGVmYXVsdFVybFNlcmlhbGl6ZXIoKTtcclxuXHJcbiAgaXQoXCJzaG91bGQgbmF2aWdhdGUgdG8gdGhlIHJvb3RcIiwgKCkgPT4ge1xyXG4gICAgY29uc3QgcCA9IHNlcmlhbGl6ZXIucGFyc2UoXCIvXCIpO1xyXG4gICAgY29uc3QgdCA9IGNyZWF0ZVJvb3QocCwgW1wiL1wiXSk7XHJcbiAgICBleHBlY3Qoc2VyaWFsaXplci5zZXJpYWxpemUodCkpLnRvRXF1YWwoXCIvXCIpO1xyXG4gIH0pO1xyXG5cclxuICBpdChcInNob3VsZCBzdXBwb3J0IG5lc3RlZCBzZWdtZW50c1wiLCAoKSA9PiB7XHJcbiAgICBjb25zdCBwID0gc2VyaWFsaXplci5wYXJzZShcIi9hL2JcIik7XHJcbiAgICBjb25zdCB0ID0gY3JlYXRlUm9vdChwLCBbXCIvb25lXCIsIDExLCBcInR3b1wiLCAyMl0pO1xyXG4gICAgZXhwZWN0KHNlcmlhbGl6ZXIuc2VyaWFsaXplKHQpKS50b0VxdWFsKFwiL29uZS8xMS90d28vMjJcIik7XHJcbiAgfSk7XHJcblxyXG4gIFxyXG4gIGl0KFwic2hvdWxkIHN0cmluZ2lmeSBwb3NpdGlvbmFsIHBhcmFtZXRlcnNcIiwgKCkgPT4ge1xyXG4gICAgY29uc3QgcCA9IHNlcmlhbGl6ZXIucGFyc2UoXCIvYS9iXCIpO1xyXG4gICAgY29uc3QgdCA9IGNyZWF0ZVJvb3QocCwgW1wiL29uZVwiLCAxMV0pO1xyXG4gICAgY29uc3QgcGFyYW1zID0gdC5yb290LmNoaWxkcmVuW1BSSU1BUllfT1VUTEVUXS5wYXRoc1dpdGhQYXJhbXM7XHJcbiAgICBleHBlY3QocGFyYW1zWzBdLnBhdGgpLnRvRXF1YWwoXCJvbmVcIik7XHJcbiAgICBleHBlY3QocGFyYW1zWzFdLnBhdGgpLnRvRXF1YWwoXCIxMVwiKTtcclxuICB9KTtcclxuXHJcbiAgaXQoXCJzaG91bGQgcHJlc2VydmUgc2Vjb25kYXJ5IHNlZ21lbnRzXCIsICgpID0+IHtcclxuICAgIGNvbnN0IHAgPSBzZXJpYWxpemVyLnBhcnNlKFwiL2EvMTEvYihyaWdodDpjKVwiKTtcclxuICAgIGNvbnN0IHQgPSBjcmVhdGVSb290KHAsIFtcIi9hXCIsIDExLCAnZCddKTtcclxuICAgIGV4cGVjdChzZXJpYWxpemVyLnNlcmlhbGl6ZSh0KSkudG9FcXVhbChcIi9hLzExL2QocmlnaHQ6YylcIik7XHJcbiAgfSk7XHJcblxyXG4gIGl0KFwic2hvdWxkIHN1cHBvcnQgdXBkYXRpbmcgc2Vjb25kYXJ5IHNlZ21lbnRzXCIsICgpID0+IHtcclxuICAgIGNvbnN0IHAgPSBzZXJpYWxpemVyLnBhcnNlKFwiL2EocmlnaHQ6YilcIik7XHJcbiAgICBjb25zdCB0ID0gY3JlYXRlUm9vdChwLCBbXCJyaWdodDpjXCIsIDExLCAnZCddKTtcclxuICAgIGV4cGVjdChzZXJpYWxpemVyLnNlcmlhbGl6ZSh0KSkudG9FcXVhbChcIi9hKHJpZ2h0OmMvMTEvZClcIik7XHJcbiAgfSk7XHJcblxyXG4gIGl0KFwic2hvdWxkIHN1cHBvcnQgdXBkYXRpbmcgc2Vjb25kYXJ5IHNlZ21lbnRzIChuZXN0ZWQgY2FzZSlcIiwgKCkgPT4ge1xyXG4gICAgY29uc3QgcCA9IHNlcmlhbGl6ZXIucGFyc2UoXCIvYS8oYi8vcmlnaHQ6YylcIik7XHJcbiAgICBjb25zdCB0ID0gY3JlYXRlUm9vdChwLCBbXCJhXCIsIFwicmlnaHQ6ZFwiLCAxMSwgJ2UnXSk7XHJcbiAgICBleHBlY3Qoc2VyaWFsaXplci5zZXJpYWxpemUodCkpLnRvRXF1YWwoXCIvYS8oYi8vcmlnaHQ6ZC8xMS9lKVwiKTtcclxuICB9KTtcclxuICBcclxuICBpdCgnc2hvdWxkIHVwZGF0ZSBtYXRyaXggcGFyYW1ldGVycycsICgpID0+IHtcclxuICAgIGNvbnN0IHAgPSBzZXJpYWxpemVyLnBhcnNlKFwiL2E7cHA9MTFcIik7XHJcbiAgICBjb25zdCB0ID0gY3JlYXRlUm9vdChwLCBbXCIvYVwiLCB7cHA6IDIyLCBkZDogMzN9XSk7XHJcbiAgICBleHBlY3Qoc2VyaWFsaXplci5zZXJpYWxpemUodCkpLnRvRXF1YWwoXCIvYTtwcD0yMjtkZD0zM1wiKTtcclxuICB9KTtcclxuXHJcbiAgaXQoJ3Nob3VsZCBjcmVhdGUgbWF0cml4IHBhcmFtZXRlcnMnLCAoKSA9PiB7XHJcbiAgICBjb25zdCBwID0gc2VyaWFsaXplci5wYXJzZShcIi9hXCIpO1xyXG4gICAgY29uc3QgdCA9IGNyZWF0ZVJvb3QocCwgW1wiL2FcIiwge3BwOiAyMiwgZGQ6IDMzfV0pO1xyXG4gICAgZXhwZWN0KHNlcmlhbGl6ZXIuc2VyaWFsaXplKHQpKS50b0VxdWFsKFwiL2E7cHA9MjI7ZGQ9MzNcIik7XHJcbiAgfSk7XHJcblxyXG4gIGl0KCdzaG91bGQgY3JlYXRlIG1hdHJpeCBwYXJhbWV0ZXJzIHRvZ2V0aGVyIHdpdGggb3RoZXIgc2VnbWVudHMnLCAoKSA9PiB7XHJcbiAgICBjb25zdCBwID0gc2VyaWFsaXplci5wYXJzZShcIi9hXCIpO1xyXG4gICAgY29uc3QgdCA9IGNyZWF0ZVJvb3QocCwgW1wiL2FcIiwgXCIvYlwiLCB7YWE6IDIyLCBiYjogMzN9XSk7XHJcbiAgICBleHBlY3Qoc2VyaWFsaXplci5zZXJpYWxpemUodCkpLnRvRXF1YWwoXCIvYS9iO2FhPTIyO2JiPTMzXCIpO1xyXG4gIH0pO1xyXG5cclxuICBkZXNjcmliZShcInJlbGF0aXZlIG5hdmlnYXRpb25cIiwgKCkgPT4ge1xyXG4gICAgaXQoXCJzaG91bGQgd29ya1wiLCAoKSA9PiB7XHJcbiAgICAgIGNvbnN0IHAgPSBzZXJpYWxpemVyLnBhcnNlKFwiL2EvKGMvL2xlZnQ6Y3ApKGxlZnQ6YXApXCIpO1xyXG4gICAgICBjb25zdCB0ID0gY3JlYXRlKHAucm9vdC5jaGlsZHJlbltQUklNQVJZX09VVExFVF0sIDAsIHAsIFtcImMyXCJdKTtcclxuICAgICAgZXhwZWN0KHNlcmlhbGl6ZXIuc2VyaWFsaXplKHQpKS50b0VxdWFsKFwiL2EvKGMyLy9sZWZ0OmNwKShsZWZ0OmFwKVwiKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KFwic2hvdWxkIHdvcmsgd2hlbiB0aGUgZmlyc3QgY29tbWFuZCBzdGFydHMgd2l0aCBhIC4vXCIsICgpID0+IHtcclxuICAgICAgY29uc3QgcCA9IHNlcmlhbGl6ZXIucGFyc2UoXCIvYS8oYy8vbGVmdDpjcCkobGVmdDphcClcIik7XHJcbiAgICAgIGNvbnN0IHQgPSBjcmVhdGUocC5yb290LmNoaWxkcmVuW1BSSU1BUllfT1VUTEVUXSwgMCwgcCwgW1wiLi9jMlwiXSk7XHJcbiAgICAgIGV4cGVjdChzZXJpYWxpemVyLnNlcmlhbGl6ZSh0KSkudG9FcXVhbChcIi9hLyhjMi8vbGVmdDpjcCkobGVmdDphcClcIik7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdChcInNob3VsZCB3b3JrIHdoZW4gdGhlIGZpcnN0IGNvbW1hbmQgaXMgLi8pXCIsICgpID0+IHtcclxuICAgICAgY29uc3QgcCA9IHNlcmlhbGl6ZXIucGFyc2UoXCIvYS8oYy8vbGVmdDpjcCkobGVmdDphcClcIik7XHJcbiAgICAgIGNvbnN0IHQgPSBjcmVhdGUocC5yb290LmNoaWxkcmVuW1BSSU1BUllfT1VUTEVUXSwgMCwgcCwgW1wiLi9cIiwgXCJjMlwiXSk7XHJcbiAgICAgIGV4cGVjdChzZXJpYWxpemVyLnNlcmlhbGl6ZSh0KSkudG9FcXVhbChcIi9hLyhjMi8vbGVmdDpjcCkobGVmdDphcClcIik7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdChcInNob3VsZCB3b3JrIHdoZW4gZ2l2ZW4gcGFyYW1zXCIsICgpID0+IHtcclxuICAgICAgY29uc3QgcCA9IHNlcmlhbGl6ZXIucGFyc2UoXCIvYS8oYy8vbGVmdDpjcCkobGVmdDphcClcIik7XHJcbiAgICAgIGNvbnN0IHQgPSBjcmVhdGUocC5yb290LmNoaWxkcmVuW1BSSU1BUllfT1VUTEVUXSwgMCwgcCwgW3sneCc6IDk5fV0pO1xyXG4gICAgICBleHBlY3Qoc2VyaWFsaXplci5zZXJpYWxpemUodCkpLnRvRXF1YWwoXCIvYS8oYzt4PTk5Ly9sZWZ0OmNwKShsZWZ0OmFwKVwiKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KFwic2hvdWxkIHdvcmsgd2hlbiBpbmRleCA+IDBcIiwgKCkgPT4ge1xyXG4gICAgICBjb25zdCBwID0gc2VyaWFsaXplci5wYXJzZShcIi9hL2NcIik7XHJcbiAgICAgIGNvbnN0IHQgPSBjcmVhdGUocC5yb290LmNoaWxkcmVuW1BSSU1BUllfT1VUTEVUXSwgMSwgcCwgW1wiYzJcIl0pO1xyXG4gICAgICBleHBlY3Qoc2VyaWFsaXplci5zZXJpYWxpemUodCkpLnRvRXF1YWwoXCIvYS9jL2MyXCIpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoXCJzaG91bGQgc3VwcG9ydCBnb2luZyB0byBhIHBhcmVudCAod2l0aGluIGEgc2VnbWVudClcIiwgKCkgPT4ge1xyXG4gICAgICBjb25zdCBwID0gc2VyaWFsaXplci5wYXJzZShcIi9hL2NcIik7XHJcbiAgICAgIGNvbnN0IHQgPSBjcmVhdGUocC5yb290LmNoaWxkcmVuW1BSSU1BUllfT1VUTEVUXSwgMSwgcCwgW1wiLi4vYzJcIl0pO1xyXG4gICAgICBleHBlY3Qoc2VyaWFsaXplci5zZXJpYWxpemUodCkpLnRvRXF1YWwoXCIvYS9jMlwiKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KFwic2hvdWxkIHdvcmsgd2hlbiBnaXZlbiAuLi9cIiwgKCkgPT4ge1xyXG4gICAgICBjb25zdCBwID0gc2VyaWFsaXplci5wYXJzZShcIi9hL2NcIik7XHJcbiAgICAgIGNvbnN0IHQgPSBjcmVhdGUocC5yb290LmNoaWxkcmVuW1BSSU1BUllfT1VUTEVUXSwgMSwgcCwgW1wiLi4vXCIsIFwiYzJcIl0pO1xyXG4gICAgICBleHBlY3Qoc2VyaWFsaXplci5zZXJpYWxpemUodCkpLnRvRXF1YWwoXCIvYS9jMlwiKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KFwic2hvdWxkIHN1cHBvcnQgc2V0dGluZyBtYXRyaXggcGFyYW1zXCIsICgpID0+IHtcclxuICAgICAgY29uc3QgcCA9IHNlcmlhbGl6ZXIucGFyc2UoXCIvYS8oYy8vbGVmdDpjcCkobGVmdDphcClcIik7XHJcbiAgICAgIGNvbnN0IHQgPSBjcmVhdGUocC5yb290LmNoaWxkcmVuW1BSSU1BUllfT1VUTEVUXSwgMCwgcCwgWycuLi8nLCB7eDogNX1dKTtcclxuICAgICAgZXhwZWN0KHNlcmlhbGl6ZXIuc2VyaWFsaXplKHQpKS50b0VxdWFsKFwiL2E7eD01KGxlZnQ6YXApXCIpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgeGl0KFwic2hvdWxkIHN1cHBvcnQgZ29pbmcgdG8gYSBwYXJlbnQgKGFjcm9zcyBzZWdtZW50cylcIiwgKCkgPT4ge1xyXG4gICAgICBjb25zdCBwID0gc2VyaWFsaXplci5wYXJzZShcIi9xLyhhLyhjLy9sZWZ0OmNwKS8vbGVmdDpxcCkobGVmdDphcClcIik7XHJcblxyXG4gICAgICBjb25zdCB0ID0gY3JlYXRlKHAucm9vdC5jaGlsZHJlbltQUklNQVJZX09VVExFVF0uY2hpbGRyZW5bUFJJTUFSWV9PVVRMRVRdLCAwLCBwLCBbJy4uLy4uL3EyJ10pO1xyXG4gICAgICBleHBlY3Qoc2VyaWFsaXplci5zZXJpYWxpemUodCkpLnRvRXF1YWwoXCIvcTIobGVmdDphcClcIik7XHJcbiAgICB9KTtcclxuXHJcbiAgICB4aXQoXCJzaG91bGQgbmF2aWdhdGUgdG8gdGhlIHJvb3RcIiwgKCkgPT4ge1xyXG4gICAgICBjb25zdCBwID0gc2VyaWFsaXplci5wYXJzZShcIi9hL2NcIik7XHJcbiAgICAgIGNvbnN0IHQgPSBjcmVhdGUocC5yb290LmNoaWxkcmVuW1BSSU1BUllfT1VUTEVUXSwgMCwgcCwgWycuLi8nXSk7XHJcbiAgICAgIGV4cGVjdChzZXJpYWxpemVyLnNlcmlhbGl6ZSh0KSkudG9FcXVhbChcIlwiKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KFwic2hvdWxkIHRocm93IHdoZW4gdG9vIG1hbnkgLi5cIiwgKCkgPT4ge1xyXG4gICAgICBjb25zdCBwID0gc2VyaWFsaXplci5wYXJzZShcIi9hLyhjLy9sZWZ0OmNwKShsZWZ0OmFwKVwiKTtcclxuICAgICAgZXhwZWN0KCgpID0+IGNyZWF0ZShwLnJvb3QuY2hpbGRyZW5bUFJJTUFSWV9PVVRMRVRdLCAwLCBwLCBbJy4uLy4uLyddKSkudG9UaHJvd0Vycm9yKFwiSW52YWxpZCBudW1iZXIgb2YgJy4uLydcIik7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgaXQoXCJzaG91bGQgc2V0IHF1ZXJ5IHBhcmFtc1wiLCAoKSA9PiB7XHJcbiAgICBjb25zdCBwID0gc2VyaWFsaXplci5wYXJzZShcIi9cIik7XHJcbiAgICBjb25zdCB0ID0gY3JlYXRlUm9vdChwLCBbXSwge2E6ICdoZXknfSk7XHJcbiAgICBleHBlY3QodC5xdWVyeVBhcmFtcykudG9FcXVhbCh7YTogJ2hleSd9KTtcclxuICB9KTtcclxuXHJcbiAgaXQoXCJzaG91bGQgc3RyaW5naWZ5IHF1ZXJ5IHBhcmFtc1wiLCAoKSA9PiB7XHJcbiAgICBjb25zdCBwID0gc2VyaWFsaXplci5wYXJzZShcIi9cIik7XHJcbiAgICBjb25zdCB0ID0gY3JlYXRlUm9vdChwLCBbXSwgPGFueT57YTogMX0pO1xyXG4gICAgZXhwZWN0KHQucXVlcnlQYXJhbXMpLnRvRXF1YWwoe2E6ICcxJ30pO1xyXG4gIH0pO1xyXG5cclxuICBpdChcInNob3VsZCByZXVzZSBvbGQgcXVlcnkgcGFyYW1zIHdoZW4gZ2l2ZW4gdW5kZWZpbmVkXCIsICgpID0+IHtcclxuICAgIGNvbnN0IHAgPSBzZXJpYWxpemVyLnBhcnNlKFwiLz9hPTFcIik7XHJcbiAgICBjb25zdCB0ID0gY3JlYXRlUm9vdChwLCBbXSwgdW5kZWZpbmVkKTtcclxuICAgIGV4cGVjdCh0LnF1ZXJ5UGFyYW1zKS50b0VxdWFsKHthOiAnMSd9KTtcclxuICB9KTtcclxuXHJcbiAgaXQoXCJzaG91bGQgc2V0IGZyYWdtZW50XCIsICgpID0+IHtcclxuICAgIGNvbnN0IHAgPSBzZXJpYWxpemVyLnBhcnNlKFwiL1wiKTtcclxuICAgIGNvbnN0IHQgPSBjcmVhdGVSb290KHAsIFtdLCB7fSwgXCJmcmFnbWVudFwiKTtcclxuICAgIGV4cGVjdCh0LmZyYWdtZW50KS50b0VxdWFsKFwiZnJhZ21lbnRcIik7XHJcbiAgfSk7XHJcblxyXG4gIGl0KFwic2hvdWxkIHJldXNlZCBvbGQgZnJhZ21lbnQgd2hlbiBnaXZlbiB1bmRlZmluZWRcIiwgKCkgPT4ge1xyXG4gICAgY29uc3QgcCA9IHNlcmlhbGl6ZXIucGFyc2UoXCIvI2ZyYWdtZW50XCIpO1xyXG4gICAgY29uc3QgdCA9IGNyZWF0ZVJvb3QocCwgW10sIHVuZGVmaW5lZCwgdW5kZWZpbmVkKTtcclxuICAgIGV4cGVjdCh0LmZyYWdtZW50KS50b0VxdWFsKFwiZnJhZ21lbnRcIik7XHJcbiAgfSk7XHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gY3JlYXRlUm9vdCh0cmVlOiBVcmxUcmVlLCBjb21tYW5kczogYW55W10sIHF1ZXJ5UGFyYW1zPzogUGFyYW1zLCBmcmFnbWVudD86IHN0cmluZykge1xyXG4gIGNvbnN0IHMgPSBuZXcgQWN0aXZhdGVkUm91dGVTbmFwc2hvdChbXSwgPGFueT57fSwgUFJJTUFSWV9PVVRMRVQsIFwic29tZUNvbXBvbmVudFwiLCBudWxsLCB0cmVlLnJvb3QsIC0xKTtcclxuICBjb25zdCBhID0gbmV3IEFjdGl2YXRlZFJvdXRlKG5ldyBCZWhhdmlvclN1YmplY3QobnVsbCksIG5ldyBCZWhhdmlvclN1YmplY3QobnVsbCksIFBSSU1BUllfT1VUTEVULCBcInNvbWVDb21wb25lbnRcIiwgcyk7XHJcbiAgYWR2YW5jZUFjdGl2YXRlZFJvdXRlKGEpO1xyXG4gIHJldHVybiBjcmVhdGVVcmxUcmVlKGEsIHRyZWUsIGNvbW1hbmRzLCBxdWVyeVBhcmFtcywgZnJhZ21lbnQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGUoc2VnbWVudDogVXJsU2VnbWVudCwgc3RhcnRJbmRleDogbnVtYmVyLCB0cmVlOiBVcmxUcmVlLCBjb21tYW5kczogYW55W10sIHF1ZXJ5UGFyYW1zPzogUGFyYW1zLCBmcmFnbWVudD86IHN0cmluZykge1xyXG4gIGlmICghc2VnbWVudCkge1xyXG4gICAgZXhwZWN0KHNlZ21lbnQpLnRvQmVEZWZpbmVkKCk7XHJcbiAgfVxyXG4gIGNvbnN0IHMgPSBuZXcgQWN0aXZhdGVkUm91dGVTbmFwc2hvdChbXSwgPGFueT57fSwgUFJJTUFSWV9PVVRMRVQsIFwic29tZUNvbXBvbmVudFwiLCBudWxsLCA8YW55PnNlZ21lbnQsIHN0YXJ0SW5kZXgpO1xyXG4gIGNvbnN0IGEgPSBuZXcgQWN0aXZhdGVkUm91dGUobmV3IEJlaGF2aW9yU3ViamVjdChudWxsKSwgbmV3IEJlaGF2aW9yU3ViamVjdChudWxsKSwgUFJJTUFSWV9PVVRMRVQsIFwic29tZUNvbXBvbmVudFwiLCBzKTtcclxuICBhZHZhbmNlQWN0aXZhdGVkUm91dGUoYSk7XHJcbiAgcmV0dXJuIGNyZWF0ZVVybFRyZWUoYSwgdHJlZSwgY29tbWFuZHMsIHF1ZXJ5UGFyYW1zLCBmcmFnbWVudCk7XHJcbn0iXX0=