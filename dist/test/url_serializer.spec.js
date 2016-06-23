var url_serializer_1 = require('../src/url_serializer');
var shared_1 = require('../src/shared');
describe('url serializer', function () {
    var url = new url_serializer_1.DefaultUrlSerializer();
    it('should parse the root url', function () {
        var tree = url.parse("/");
        expectSegment(tree.root, "");
        expect(url.serialize(tree)).toEqual("/");
    });
    it('should parse non-empty urls', function () {
        var tree = url.parse("one/two");
        expectSegment(tree.root.children[shared_1.PRIMARY_OUTLET], "one/two");
        expect(url.serialize(tree)).toEqual("/one/two");
    });
    it("should parse multiple secondary segments", function () {
        var tree = url.parse("/one/two(left:three//right:four)");
        expectSegment(tree.root.children[shared_1.PRIMARY_OUTLET], "one/two");
        expectSegment(tree.root.children['left'], "three");
        expectSegment(tree.root.children['right'], "four");
        expect(url.serialize(tree)).toEqual("/one/two(left:three//right:four)");
    });
    it("should parse segments with empty paths", function () {
        var tree = url.parse("/one/two/(;a=1//right:;b=2)");
        var c = tree.root.children[shared_1.PRIMARY_OUTLET];
        expectSegment(tree.root.children[shared_1.PRIMARY_OUTLET], "one/two", true);
        expect(c.children[shared_1.PRIMARY_OUTLET].pathsWithParams[0].path).toEqual('');
        expect(c.children[shared_1.PRIMARY_OUTLET].pathsWithParams[0].parameters).toEqual({ a: '1' });
        expect(c.children['right'].pathsWithParams[0].path).toEqual('');
        expect(c.children['right'].pathsWithParams[0].parameters).toEqual({ b: '2' });
        expect(url.serialize(tree)).toEqual("/one/two/(;a=1//right:;b=2)");
    });
    it("should parse segments with empty paths (only aux)", function () {
        var tree = url.parse("/one/two/(right:;b=2)");
        var c = tree.root.children[shared_1.PRIMARY_OUTLET];
        expectSegment(tree.root.children[shared_1.PRIMARY_OUTLET], "one/two", true);
        expect(c.children['right'].pathsWithParams[0].path).toEqual('');
        expect(c.children['right'].pathsWithParams[0].parameters).toEqual({ b: '2' });
        expect(url.serialize(tree)).toEqual("/one/two/(right:;b=2)");
    });
    it("should parse scoped secondary segments", function () {
        var tree = url.parse("/one/(two//left:three)");
        var primary = tree.root.children[shared_1.PRIMARY_OUTLET];
        expectSegment(primary, "one", true);
        expectSegment(primary.children[shared_1.PRIMARY_OUTLET], "two");
        expectSegment(primary.children["left"], "three");
        expect(url.serialize(tree)).toEqual("/one/(two//left:three)");
    });
    it("should parse scoped secondary segments with unscoped ones", function () {
        var tree = url.parse("/one/(two//left:three)(right:four)");
        var primary = tree.root.children[shared_1.PRIMARY_OUTLET];
        expectSegment(primary, "one", true);
        expectSegment(primary.children[shared_1.PRIMARY_OUTLET], "two");
        expectSegment(primary.children["left"], "three");
        expectSegment(tree.root.children["right"], "four");
        expect(url.serialize(tree)).toEqual("/one/(two//left:three)(right:four)");
    });
    it("should parse secondary segments that have children", function () {
        var tree = url.parse("/one(left:two/three)");
        expectSegment(tree.root.children[shared_1.PRIMARY_OUTLET], "one");
        expectSegment(tree.root.children['left'], "two/three");
        expect(url.serialize(tree)).toEqual("/one(left:two/three)");
    });
    it("should parse an empty secondary segment group", function () {
        var tree = url.parse("/one()");
        expectSegment(tree.root.children[shared_1.PRIMARY_OUTLET], "one");
        expect(url.serialize(tree)).toEqual("/one");
    });
    it("should parse key-value matrix params", function () {
        var tree = url.parse("/one;a=11a;b=11b(left:two;c=22//right:three;d=33)");
        expectSegment(tree.root.children[shared_1.PRIMARY_OUTLET], "one;a=11a;b=11b");
        expectSegment(tree.root.children["left"], "two;c=22");
        expectSegment(tree.root.children["right"], "three;d=33");
        expect(url.serialize(tree)).toEqual("/one;a=11a;b=11b(left:two;c=22//right:three;d=33)");
    });
    it("should parse key only matrix params", function () {
        var tree = url.parse("/one;a");
        expectSegment(tree.root.children[shared_1.PRIMARY_OUTLET], "one;a=true");
        expect(url.serialize(tree)).toEqual("/one;a=true");
    });
    it("should parse query params", function () {
        var tree = url.parse("/one?a=1&b=2");
        expect(tree.queryParams).toEqual({ a: '1', b: '2' });
    });
    it("should parse query params when with parenthesis", function () {
        var tree = url.parse("/one?a=(11)&b=(22)");
        expect(tree.queryParams).toEqual({ a: '(11)', b: '(22)' });
    });
    it("should parse key only query params", function () {
        var tree = url.parse("/one?a");
        expect(tree.queryParams).toEqual({ a: 'true' });
    });
    it("should serializer query params", function () {
        var tree = url.parse("/one?a");
        expect(url.serialize(tree)).toEqual("/one?a=true");
    });
    it("should parse fragment", function () {
        var tree = url.parse("/one#two");
        expect(tree.fragment).toEqual("two");
        expect(url.serialize(tree)).toEqual("/one#two");
    });
    it("should parse empty fragment", function () {
        var tree = url.parse("/one#");
        expect(tree.fragment).toEqual("");
        expect(url.serialize(tree)).toEqual("/one#");
    });
});
function expectSegment(segment, expected, hasChildren) {
    if (hasChildren === void 0) { hasChildren = false; }
    var p = segment.pathsWithParams.map(function (p) { return url_serializer_1.serializePath(p); }).join("/");
    expect(p).toEqual(expected);
    expect(Object.keys(segment.children).length > 0).toEqual(hasChildren);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXJsX3NlcmlhbGl6ZXIuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3QvdXJsX3NlcmlhbGl6ZXIuc3BlYy50cyJdLCJuYW1lcyI6WyJleHBlY3RTZWdtZW50Il0sIm1hcHBpbmdzIjoiQUFBQSwrQkFBa0QsdUJBQXVCLENBQUMsQ0FBQTtBQUUxRSx1QkFBNkIsZUFBZSxDQUFDLENBQUE7QUFFN0MsUUFBUSxDQUFDLGdCQUFnQixFQUFFO0lBQ3pCLElBQU0sR0FBRyxHQUFHLElBQUkscUNBQW9CLEVBQUUsQ0FBQztJQUV2QyxFQUFFLENBQUMsMkJBQTJCLEVBQUU7UUFDOUIsSUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUU1QixhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztRQUM3QixNQUFNLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMzQyxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyw2QkFBNkIsRUFBRTtRQUNoQyxJQUFNLElBQUksR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2xDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyx1QkFBYyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDN0QsTUFBTSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDbEQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsMENBQTBDLEVBQUU7UUFDN0MsSUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO1FBRTNELGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEs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Q0EsZUFBZUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsVUFBQUEsQ0FBQ0EsSUFBSUEsT0FBQUEsOEJBQWFBLENBQUNBLENBQUNBLENBQUNBLEVBQWhCQSxDQUFnQkEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7SUFDdkVBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLE9BQU9BLENBQUNBLFFBQVFBLENBQUNBLENBQUNBO0lBQzVCQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQSxNQUFNQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxPQUFPQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQTtBQUN4RUEsQ0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0RlZmF1bHRVcmxTZXJpYWxpemVyLCBzZXJpYWxpemVQYXRofSBmcm9tICcuLi9zcmMvdXJsX3NlcmlhbGl6ZXInO1xyXG5pbXBvcnQge1VybFNlZ21lbnR9IGZyb20gJy4uL3NyYy91cmxfdHJlZSc7XHJcbmltcG9ydCB7UFJJTUFSWV9PVVRMRVR9IGZyb20gJy4uL3NyYy9zaGFyZWQnO1xyXG5cclxuZGVzY3JpYmUoJ3VybCBzZXJpYWxpemVyJywgKCkgPT4ge1xyXG4gIGNvbnN0IHVybCA9IG5ldyBEZWZhdWx0VXJsU2VyaWFsaXplcigpO1xyXG5cclxuICBpdCgnc2hvdWxkIHBhcnNlIHRoZSByb290IHVybCcsICgpID0+IHtcclxuICAgIGNvbnN0IHRyZWUgPSB1cmwucGFyc2UoXCIvXCIpO1xyXG4gICAgXHJcbiAgICBleHBlY3RTZWdtZW50KHRyZWUucm9vdCwgXCJcIik7XHJcbiAgICBleHBlY3QodXJsLnNlcmlhbGl6ZSh0cmVlKSkudG9FcXVhbChcIi9cIik7XHJcbiAgfSk7XHJcblxyXG4gIGl0KCdzaG91bGQgcGFyc2Ugbm9uLWVtcHR5IHVybHMnLCAoKSA9PiB7XHJcbiAgICBjb25zdCB0cmVlID0gdXJsLnBhcnNlKFwib25lL3R3b1wiKTtcclxuICAgIGV4cGVjdFNlZ21lbnQodHJlZS5yb290LmNoaWxkcmVuW1BSSU1BUllfT1VUTEVUXSwgXCJvbmUvdHdvXCIpO1xyXG4gICAgZXhwZWN0KHVybC5zZXJpYWxpemUodHJlZSkpLnRvRXF1YWwoXCIvb25lL3R3b1wiKTtcclxuICB9KTtcclxuXHJcbiAgaXQoXCJzaG91bGQgcGFyc2UgbXVsdGlwbGUgc2Vjb25kYXJ5IHNlZ21lbnRzXCIsICgpID0+IHtcclxuICAgIGNvbnN0IHRyZWUgPSB1cmwucGFyc2UoXCIvb25lL3R3byhsZWZ0OnRocmVlLy9yaWdodDpmb3VyKVwiKTtcclxuXHJcbiAgICBleHBlY3RTZWdtZW50KHRyZWUucm9vdC5jaGlsZHJlbltQUklNQVJZX09VVExFVF0sIFwib25lL3R3b1wiKTtcclxuICAgIGV4cGVjdFNlZ21lbnQodHJlZS5yb290LmNoaWxkcmVuWydsZWZ0J10sIFwidGhyZWVcIik7XHJcbiAgICBleHBlY3RTZWdtZW50KHRyZWUucm9vdC5jaGlsZHJlblsncmlnaHQnXSwgXCJmb3VyXCIpO1xyXG5cclxuICAgIGV4cGVjdCh1cmwuc2VyaWFsaXplKHRyZWUpKS50b0VxdWFsKFwiL29uZS90d28obGVmdDp0aHJlZS8vcmlnaHQ6Zm91cilcIik7XHJcbiAgfSk7XHJcblxyXG4gIGl0KFwic2hvdWxkIHBhcnNlIHNlZ21lbnRzIHdpdGggZW1wdHkgcGF0aHNcIiwgKCkgPT4ge1xyXG4gICAgY29uc3QgdHJlZSA9IHVybC5wYXJzZShcIi9vbmUvdHdvLyg7YT0xLy9yaWdodDo7Yj0yKVwiKTtcclxuXHJcbiAgICBjb25zdCBjID0gdHJlZS5yb290LmNoaWxkcmVuW1BSSU1BUllfT1VUTEVUXTtcclxuICAgIGV4cGVjdFNlZ21lbnQodHJlZS5yb290LmNoaWxkcmVuW1BSSU1BUllfT1VUTEVUXSwgXCJvbmUvdHdvXCIsIHRydWUpO1xyXG5cclxuICAgIGV4cGVjdChjLmNoaWxkcmVuW1BSSU1BUllfT1VUTEVUXS5wYXRoc1dpdGhQYXJhbXNbMF0ucGF0aCkudG9FcXVhbCgnJyk7XHJcbiAgICBleHBlY3QoYy5jaGlsZHJlbltQUklNQVJZX09VVExFVF0ucGF0aHNXaXRoUGFyYW1zWzBdLnBhcmFtZXRlcnMpLnRvRXF1YWwoe2E6ICcxJ30pO1xyXG5cclxuICAgIGV4cGVjdChjLmNoaWxkcmVuWydyaWdodCddLnBhdGhzV2l0aFBhcmFtc1swXS5wYXRoKS50b0VxdWFsKCcnKTtcclxuICAgIGV4cGVjdChjLmNoaWxkcmVuWydyaWdodCddLnBhdGhzV2l0aFBhcmFtc1swXS5wYXJhbWV0ZXJzKS50b0VxdWFsKHtiOiAnMid9KTtcclxuXHJcbiAgICBleHBlY3QodXJsLnNlcmlhbGl6ZSh0cmVlKSkudG9FcXVhbChcIi9vbmUvdHdvLyg7YT0xLy9yaWdodDo7Yj0yKVwiKTtcclxuICB9KTtcclxuXHJcbiAgaXQoXCJzaG91bGQgcGFyc2Ugc2VnbWVudHMgd2l0aCBlbXB0eSBwYXRocyAob25seSBhdXgpXCIsICgpID0+IHtcclxuICAgIGNvbnN0IHRyZWUgPSB1cmwucGFyc2UoXCIvb25lL3R3by8ocmlnaHQ6O2I9MilcIik7XHJcblxyXG4gICAgY29uc3QgYyA9IHRyZWUucm9vdC5jaGlsZHJlbltQUklNQVJZX09VVExFVF07XHJcbiAgICBleHBlY3RTZWdtZW50KHRyZWUucm9vdC5jaGlsZHJlbltQUklNQVJZX09VVExFVF0sIFwib25lL3R3b1wiLCB0cnVlKTtcclxuXHJcbiAgICBleHBlY3QoYy5jaGlsZHJlblsncmlnaHQnXS5wYXRoc1dpdGhQYXJhbXNbMF0ucGF0aCkudG9FcXVhbCgnJyk7XHJcbiAgICBleHBlY3QoYy5jaGlsZHJlblsncmlnaHQnXS5wYXRoc1dpdGhQYXJhbXNbMF0ucGFyYW1ldGVycykudG9FcXVhbCh7YjogJzInfSk7XHJcblxyXG4gICAgZXhwZWN0KHVybC5zZXJpYWxpemUodHJlZSkpLnRvRXF1YWwoXCIvb25lL3R3by8ocmlnaHQ6O2I9MilcIik7XHJcbiAgfSk7XHJcblxyXG4gIGl0KFwic2hvdWxkIHBhcnNlIHNjb3BlZCBzZWNvbmRhcnkgc2VnbWVudHNcIiwgKCkgPT4ge1xyXG4gICAgY29uc3QgdHJlZSA9IHVybC5wYXJzZShcIi9vbmUvKHR3by8vbGVmdDp0aHJlZSlcIik7XHJcblxyXG4gICAgY29uc3QgcHJpbWFyeSA9IHRyZWUucm9vdC5jaGlsZHJlbltQUklNQVJZX09VVExFVF07XHJcbiAgICBleHBlY3RTZWdtZW50KHByaW1hcnksIFwib25lXCIsIHRydWUpO1xyXG5cclxuICAgIGV4cGVjdFNlZ21lbnQocHJpbWFyeS5jaGlsZHJlbltQUklNQVJZX09VVExFVF0sIFwidHdvXCIpO1xyXG4gICAgZXhwZWN0U2VnbWVudChwcmltYXJ5LmNoaWxkcmVuW1wibGVmdFwiXSwgXCJ0aHJlZVwiKTtcclxuXHJcbiAgICBleHBlY3QodXJsLnNlcmlhbGl6ZSh0cmVlKSkudG9FcXVhbChcIi9vbmUvKHR3by8vbGVmdDp0aHJlZSlcIik7XHJcbiAgfSk7XHJcblxyXG4gIGl0KFwic2hvdWxkIHBhcnNlIHNjb3BlZCBzZWNvbmRhcnkgc2VnbWVudHMgd2l0aCB1bnNjb3BlZCBvbmVzXCIsICgpID0+IHtcclxuICAgIGNvbnN0IHRyZWUgPSB1cmwucGFyc2UoXCIvb25lLyh0d28vL2xlZnQ6dGhyZWUpKHJpZ2h0OmZvdXIpXCIpO1xyXG5cclxuICAgIGNvbnN0IHByaW1hcnkgPSB0cmVlLnJvb3QuY2hpbGRyZW5bUFJJTUFSWV9PVVRMRVRdO1xyXG4gICAgZXhwZWN0U2VnbWVudChwcmltYXJ5LCBcIm9uZVwiLCB0cnVlKTtcclxuICAgIGV4cGVjdFNlZ21lbnQocHJpbWFyeS5jaGlsZHJlbltQUklNQVJZX09VVExFVF0sIFwidHdvXCIpO1xyXG4gICAgZXhwZWN0U2VnbWVudChwcmltYXJ5LmNoaWxkcmVuW1wibGVmdFwiXSwgXCJ0aHJlZVwiKTtcclxuICAgIGV4cGVjdFNlZ21lbnQodHJlZS5yb290LmNoaWxkcmVuW1wicmlnaHRcIl0sIFwiZm91clwiKTtcclxuXHJcbiAgICBleHBlY3QodXJsLnNlcmlhbGl6ZSh0cmVlKSkudG9FcXVhbChcIi9vbmUvKHR3by8vbGVmdDp0aHJlZSkocmlnaHQ6Zm91cilcIik7XHJcbiAgfSk7XHJcblxyXG4gIGl0KFwic2hvdWxkIHBhcnNlIHNlY29uZGFyeSBzZWdtZW50cyB0aGF0IGhhdmUgY2hpbGRyZW5cIiwgKCkgPT4ge1xyXG4gICAgY29uc3QgdHJlZSA9IHVybC5wYXJzZShcIi9vbmUobGVmdDp0d28vdGhyZWUpXCIpO1xyXG5cclxuICAgIGV4cGVjdFNlZ21lbnQodHJlZS5yb290LmNoaWxkcmVuW1BSSU1BUllfT1VUTEVUXSwgXCJvbmVcIik7XHJcbiAgICBleHBlY3RTZWdtZW50KHRyZWUucm9vdC5jaGlsZHJlblsnbGVmdCddLCBcInR3by90aHJlZVwiKTtcclxuXHJcbiAgICBleHBlY3QodXJsLnNlcmlhbGl6ZSh0cmVlKSkudG9FcXVhbChcIi9vbmUobGVmdDp0d28vdGhyZWUpXCIpO1xyXG4gIH0pO1xyXG5cclxuICBpdChcInNob3VsZCBwYXJzZSBhbiBlbXB0eSBzZWNvbmRhcnkgc2VnbWVudCBncm91cFwiLCAoKSA9PiB7XHJcbiAgICBjb25zdCB0cmVlID0gdXJsLnBhcnNlKFwiL29uZSgpXCIpO1xyXG5cclxuICAgIGV4cGVjdFNlZ21lbnQodHJlZS5yb290LmNoaWxkcmVuW1BSSU1BUllfT1VUTEVUXSwgXCJvbmVcIik7XHJcblxyXG4gICAgZXhwZWN0KHVybC5zZXJpYWxpemUodHJlZSkpLnRvRXF1YWwoXCIvb25lXCIpO1xyXG4gIH0pO1xyXG5cclxuICBpdChcInNob3VsZCBwYXJzZSBrZXktdmFsdWUgbWF0cml4IHBhcmFtc1wiLCAoKSA9PiB7XHJcbiAgICBjb25zdCB0cmVlID0gdXJsLnBhcnNlKFwiL29uZTthPTExYTtiPTExYihsZWZ0OnR3bztjPTIyLy9yaWdodDp0aHJlZTtkPTMzKVwiKTtcclxuXHJcbiAgICBleHBlY3RTZWdtZW50KHRyZWUucm9vdC5jaGlsZHJlbltQUklNQVJZX09VVExFVF0sIFwib25lO2E9MTFhO2I9MTFiXCIpO1xyXG4gICAgZXhwZWN0U2VnbWVudCh0cmVlLnJvb3QuY2hpbGRyZW5bXCJsZWZ0XCJdLCBcInR3bztjPTIyXCIpO1xyXG4gICAgZXhwZWN0U2VnbWVudCh0cmVlLnJvb3QuY2hpbGRyZW5bXCJyaWdodFwiXSwgXCJ0aHJlZTtkPTMzXCIpO1xyXG5cclxuICAgIGV4cGVjdCh1cmwuc2VyaWFsaXplKHRyZWUpKS50b0VxdWFsKFwiL29uZTthPTExYTtiPTExYihsZWZ0OnR3bztjPTIyLy9yaWdodDp0aHJlZTtkPTMzKVwiKTtcclxuICB9KTtcclxuXHJcbiAgaXQoXCJzaG91bGQgcGFyc2Uga2V5IG9ubHkgbWF0cml4IHBhcmFtc1wiLCAoKSA9PiB7XHJcbiAgICBjb25zdCB0cmVlID0gdXJsLnBhcnNlKFwiL29uZTthXCIpO1xyXG5cclxuICAgIGV4cGVjdFNlZ21lbnQodHJlZS5yb290LmNoaWxkcmVuW1BSSU1BUllfT1VUTEVUXSwgXCJvbmU7YT10cnVlXCIpO1xyXG5cclxuICAgIGV4cGVjdCh1cmwuc2VyaWFsaXplKHRyZWUpKS50b0VxdWFsKFwiL29uZTthPXRydWVcIik7XHJcbiAgfSk7XHJcblxyXG4gIGl0KFwic2hvdWxkIHBhcnNlIHF1ZXJ5IHBhcmFtc1wiLCAoKSA9PiB7XHJcbiAgICBjb25zdCB0cmVlID0gdXJsLnBhcnNlKFwiL29uZT9hPTEmYj0yXCIpO1xyXG4gICAgZXhwZWN0KHRyZWUucXVlcnlQYXJhbXMpLnRvRXF1YWwoe2E6ICcxJywgYjogJzInfSk7XHJcbiAgfSk7XHJcblxyXG4gIGl0KFwic2hvdWxkIHBhcnNlIHF1ZXJ5IHBhcmFtcyB3aGVuIHdpdGggcGFyZW50aGVzaXNcIiwgKCkgPT4ge1xyXG4gICAgY29uc3QgdHJlZSA9IHVybC5wYXJzZShcIi9vbmU/YT0oMTEpJmI9KDIyKVwiKTtcclxuICAgIGV4cGVjdCh0cmVlLnF1ZXJ5UGFyYW1zKS50b0VxdWFsKHthOiAnKDExKScsIGI6ICcoMjIpJ30pO1xyXG4gIH0pO1xyXG5cclxuICBpdChcInNob3VsZCBwYXJzZSBrZXkgb25seSBxdWVyeSBwYXJhbXNcIiwgKCkgPT4ge1xyXG4gICAgY29uc3QgdHJlZSA9IHVybC5wYXJzZShcIi9vbmU/YVwiKTtcclxuICAgIGV4cGVjdCh0cmVlLnF1ZXJ5UGFyYW1zKS50b0VxdWFsKHthOiAndHJ1ZSd9KTtcclxuICB9KTtcclxuXHJcbiAgaXQoXCJzaG91bGQgc2VyaWFsaXplciBxdWVyeSBwYXJhbXNcIiwgKCkgPT4ge1xyXG4gICAgY29uc3QgdHJlZSA9IHVybC5wYXJzZShcIi9vbmU/YVwiKTtcclxuICAgIGV4cGVjdCh1cmwuc2VyaWFsaXplKHRyZWUpKS50b0VxdWFsKFwiL29uZT9hPXRydWVcIik7XHJcbiAgfSk7XHJcblxyXG4gIGl0KFwic2hvdWxkIHBhcnNlIGZyYWdtZW50XCIsICgpID0+IHtcclxuICAgIGNvbnN0IHRyZWUgPSB1cmwucGFyc2UoXCIvb25lI3R3b1wiKTtcclxuICAgIGV4cGVjdCh0cmVlLmZyYWdtZW50KS50b0VxdWFsKFwidHdvXCIpO1xyXG4gICAgZXhwZWN0KHVybC5zZXJpYWxpemUodHJlZSkpLnRvRXF1YWwoXCIvb25lI3R3b1wiKTtcclxuICB9KTtcclxuXHJcbiAgaXQoXCJzaG91bGQgcGFyc2UgZW1wdHkgZnJhZ21lbnRcIiwgKCkgPT4ge1xyXG4gICAgY29uc3QgdHJlZSA9IHVybC5wYXJzZShcIi9vbmUjXCIpO1xyXG4gICAgZXhwZWN0KHRyZWUuZnJhZ21lbnQpLnRvRXF1YWwoXCJcIik7XHJcbiAgICBleHBlY3QodXJsLnNlcmlhbGl6ZSh0cmVlKSkudG9FcXVhbChcIi9vbmUjXCIpO1xyXG4gIH0pO1xyXG59KTtcclxuXHJcbmZ1bmN0aW9uIGV4cGVjdFNlZ21lbnQoc2VnbWVudDpVcmxTZWdtZW50LCBleHBlY3RlZDpzdHJpbmcsIGhhc0NoaWxkcmVuOiBib29sZWFuID0gZmFsc2UpOnZvaWQge1xyXG4gIGNvbnN0IHAgPSBzZWdtZW50LnBhdGhzV2l0aFBhcmFtcy5tYXAocCA9PiBzZXJpYWxpemVQYXRoKHApKS5qb2luKFwiL1wiKTtcclxuICBleHBlY3QocCkudG9FcXVhbChleHBlY3RlZCk7XHJcbiAgZXhwZWN0KE9iamVjdC5rZXlzKHNlZ21lbnQuY2hpbGRyZW4pLmxlbmd0aCA+IDApLnRvRXF1YWwoaGFzQ2hpbGRyZW4pO1xyXG59XHJcbiJdfQ==