var url_serializer_1 = require('../src/url_serializer');
var url_tree_1 = require('../src/url_tree');
describe('UrlTree', function () {
    var serializer = new url_serializer_1.DefaultUrlSerializer();
    describe("containsTree", function () {
        describe("exact = true", function () {
            it("should return true when two tree are the same", function () {
                var url = "/one/(one//left:three)(right:four)";
                var t1 = serializer.parse(url);
                var t2 = serializer.parse(url);
                expect(url_tree_1.containsTree(t1, t2, true)).toBe(true);
                expect(url_tree_1.containsTree(t2, t1, true)).toBe(true);
            });
            it("should return false when paths are not the same", function () {
                var t1 = serializer.parse("/one/two(right:three)");
                var t2 = serializer.parse("/one/two2(right:three)");
                expect(url_tree_1.containsTree(t1, t2, true)).toBe(false);
            });
            it("should return false when container has an extra child", function () {
                var t1 = serializer.parse("/one/two(right:three)");
                var t2 = serializer.parse("/one/two");
                expect(url_tree_1.containsTree(t1, t2, true)).toBe(false);
            });
            it("should return false when containee has an extra child", function () {
                var t1 = serializer.parse("/one/two");
                var t2 = serializer.parse("/one/two(right:three)");
                expect(url_tree_1.containsTree(t1, t2, true)).toBe(false);
            });
        });
        describe("exact = false", function () {
            it("should return true when containee is missing a segment", function () {
                var t1 = serializer.parse("/one/(two//left:three)(right:four)");
                var t2 = serializer.parse("/one/(two//left:three)");
                expect(url_tree_1.containsTree(t1, t2, false)).toBe(true);
            });
            it("should return true when containee is missing some paths", function () {
                var t1 = serializer.parse("/one/two/three");
                var t2 = serializer.parse("/one/two");
                expect(url_tree_1.containsTree(t1, t2, false)).toBe(true);
            });
            it("should return true container has its paths splitted into multiple segments", function () {
                var t1 = serializer.parse("/one/(two//left:three)");
                var t2 = serializer.parse("/one/two");
                expect(url_tree_1.containsTree(t1, t2, false)).toBe(true);
            });
            it("should return false when containee has extra segments", function () {
                var t1 = serializer.parse("/one/two");
                var t2 = serializer.parse("/one/(two//left:three)");
                expect(url_tree_1.containsTree(t1, t2, false)).toBe(false);
            });
            it("should return containee has segments that the container does not have", function () {
                var t1 = serializer.parse("/one/(two//left:three)");
                var t2 = serializer.parse("/one/(two//right:four)");
                expect(url_tree_1.containsTree(t1, t2, false)).toBe(false);
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXJsX3RyZWUuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3QvdXJsX3RyZWUuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwrQkFBbUMsdUJBQXVCLENBQUMsQ0FBQTtBQUMzRCx5QkFBb0MsaUJBQWlCLENBQUMsQ0FBQTtBQUV0RCxRQUFRLENBQUMsU0FBUyxFQUFFO0lBQ2xCLElBQU0sVUFBVSxHQUFHLElBQUkscUNBQW9CLEVBQUUsQ0FBQztJQUU5QyxRQUFRLENBQUMsY0FBYyxFQUFFO1FBQ3ZCLFFBQVEsQ0FBQyxjQUFjLEVBQUU7WUFDdkIsRUFBRSxDQUFDLCtDQUErQyxFQUFFO2dCQUNsRCxJQUFNLEdBQUcsR0FBRyxvQ0FBb0MsQ0FBQztnQkFDakQsSUFBTSxFQUFFLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDakMsSUFBTSxFQUFFLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDakMsTUFBTSxDQUFDLHVCQUFZLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDOUMsTUFBTSxDQUFDLHVCQUFZLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNoRCxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyxpREFBaUQsRUFBRTtnQkFDcEQsSUFBTSxFQUFFLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO2dCQUNyRCxJQUFNLEVBQUUsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLHdCQUF3QixDQUFDLENBQUM7Z0JBQ3RELE1BQU0sQ0FBQyx1QkFBWSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJ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Q0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2xELENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtEZWZhdWx0VXJsU2VyaWFsaXplcn0gZnJvbSAnLi4vc3JjL3VybF9zZXJpYWxpemVyJztcclxuaW1wb3J0IHtVcmxUcmVlLCBjb250YWluc1RyZWV9IGZyb20gJy4uL3NyYy91cmxfdHJlZSc7XHJcblxyXG5kZXNjcmliZSgnVXJsVHJlZScsICgpID0+IHtcclxuICBjb25zdCBzZXJpYWxpemVyID0gbmV3IERlZmF1bHRVcmxTZXJpYWxpemVyKCk7XHJcblxyXG4gIGRlc2NyaWJlKFwiY29udGFpbnNUcmVlXCIsICgpID0+IHtcclxuICAgIGRlc2NyaWJlKFwiZXhhY3QgPSB0cnVlXCIsICgpID0+IHtcclxuICAgICAgaXQoXCJzaG91bGQgcmV0dXJuIHRydWUgd2hlbiB0d28gdHJlZSBhcmUgdGhlIHNhbWVcIiwgKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHVybCA9IFwiL29uZS8ob25lLy9sZWZ0OnRocmVlKShyaWdodDpmb3VyKVwiO1xyXG4gICAgICAgIGNvbnN0IHQxID0gc2VyaWFsaXplci5wYXJzZSh1cmwpO1xyXG4gICAgICAgIGNvbnN0IHQyID0gc2VyaWFsaXplci5wYXJzZSh1cmwpO1xyXG4gICAgICAgIGV4cGVjdChjb250YWluc1RyZWUodDEsIHQyLCB0cnVlKSkudG9CZSh0cnVlKTtcclxuICAgICAgICBleHBlY3QoY29udGFpbnNUcmVlKHQyLCB0MSwgdHJ1ZSkpLnRvQmUodHJ1ZSk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgaXQoXCJzaG91bGQgcmV0dXJuIGZhbHNlIHdoZW4gcGF0aHMgYXJlIG5vdCB0aGUgc2FtZVwiLCAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgdDEgPSBzZXJpYWxpemVyLnBhcnNlKFwiL29uZS90d28ocmlnaHQ6dGhyZWUpXCIpO1xyXG4gICAgICAgIGNvbnN0IHQyID0gc2VyaWFsaXplci5wYXJzZShcIi9vbmUvdHdvMihyaWdodDp0aHJlZSlcIik7XHJcbiAgICAgICAgZXhwZWN0KGNvbnRhaW5zVHJlZSh0MSwgdDIsIHRydWUpKS50b0JlKGZhbHNlKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpdChcInNob3VsZCByZXR1cm4gZmFsc2Ugd2hlbiBjb250YWluZXIgaGFzIGFuIGV4dHJhIGNoaWxkXCIsICgpID0+IHtcclxuICAgICAgICBjb25zdCB0MSA9IHNlcmlhbGl6ZXIucGFyc2UoXCIvb25lL3R3byhyaWdodDp0aHJlZSlcIik7XHJcbiAgICAgICAgY29uc3QgdDIgPSBzZXJpYWxpemVyLnBhcnNlKFwiL29uZS90d29cIik7XHJcbiAgICAgICAgZXhwZWN0KGNvbnRhaW5zVHJlZSh0MSwgdDIsIHRydWUpKS50b0JlKGZhbHNlKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpdChcInNob3VsZCByZXR1cm4gZmFsc2Ugd2hlbiBjb250YWluZWUgaGFzIGFuIGV4dHJhIGNoaWxkXCIsICgpID0+IHtcclxuICAgICAgICBjb25zdCB0MSA9IHNlcmlhbGl6ZXIucGFyc2UoXCIvb25lL3R3b1wiKTtcclxuICAgICAgICBjb25zdCB0MiA9IHNlcmlhbGl6ZXIucGFyc2UoXCIvb25lL3R3byhyaWdodDp0aHJlZSlcIik7XHJcbiAgICAgICAgZXhwZWN0KGNvbnRhaW5zVHJlZSh0MSwgdDIsIHRydWUpKS50b0JlKGZhbHNlKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZShcImV4YWN0ID0gZmFsc2VcIiwgKCkgPT4ge1xyXG4gICAgICBpdChcInNob3VsZCByZXR1cm4gdHJ1ZSB3aGVuIGNvbnRhaW5lZSBpcyBtaXNzaW5nIGEgc2VnbWVudFwiLCAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgdDEgPSBzZXJpYWxpemVyLnBhcnNlKFwiL29uZS8odHdvLy9sZWZ0OnRocmVlKShyaWdodDpmb3VyKVwiKTtcclxuICAgICAgICBjb25zdCB0MiA9IHNlcmlhbGl6ZXIucGFyc2UoXCIvb25lLyh0d28vL2xlZnQ6dGhyZWUpXCIpO1xyXG4gICAgICAgIGV4cGVjdChjb250YWluc1RyZWUodDEsIHQyLCBmYWxzZSkpLnRvQmUodHJ1ZSk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgaXQoXCJzaG91bGQgcmV0dXJuIHRydWUgd2hlbiBjb250YWluZWUgaXMgbWlzc2luZyBzb21lIHBhdGhzXCIsICgpID0+IHtcclxuICAgICAgICBjb25zdCB0MSA9IHNlcmlhbGl6ZXIucGFyc2UoXCIvb25lL3R3by90aHJlZVwiKTtcclxuICAgICAgICBjb25zdCB0MiA9IHNlcmlhbGl6ZXIucGFyc2UoXCIvb25lL3R3b1wiKTtcclxuICAgICAgICBleHBlY3QoY29udGFpbnNUcmVlKHQxLCB0MiwgZmFsc2UpKS50b0JlKHRydWUpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGl0KFwic2hvdWxkIHJldHVybiB0cnVlIGNvbnRhaW5lciBoYXMgaXRzIHBhdGhzIHNwbGl0dGVkIGludG8gbXVsdGlwbGUgc2VnbWVudHNcIiwgKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHQxID0gc2VyaWFsaXplci5wYXJzZShcIi9vbmUvKHR3by8vbGVmdDp0aHJlZSlcIik7XHJcbiAgICAgICAgY29uc3QgdDIgPSBzZXJpYWxpemVyLnBhcnNlKFwiL29uZS90d29cIik7XHJcbiAgICAgICAgZXhwZWN0KGNvbnRhaW5zVHJlZSh0MSwgdDIsIGZhbHNlKSkudG9CZSh0cnVlKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpdChcInNob3VsZCByZXR1cm4gZmFsc2Ugd2hlbiBjb250YWluZWUgaGFzIGV4dHJhIHNlZ21lbnRzXCIsICgpID0+IHtcclxuICAgICAgICBjb25zdCB0MSA9IHNlcmlhbGl6ZXIucGFyc2UoXCIvb25lL3R3b1wiKTtcclxuICAgICAgICBjb25zdCB0MiA9IHNlcmlhbGl6ZXIucGFyc2UoXCIvb25lLyh0d28vL2xlZnQ6dGhyZWUpXCIpO1xyXG4gICAgICAgIGV4cGVjdChjb250YWluc1RyZWUodDEsIHQyLCBmYWxzZSkpLnRvQmUoZmFsc2UpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGl0KFwic2hvdWxkIHJldHVybiBjb250YWluZWUgaGFzIHNlZ21lbnRzIHRoYXQgdGhlIGNvbnRhaW5lciBkb2VzIG5vdCBoYXZlXCIsICgpID0+IHtcclxuICAgICAgICBjb25zdCB0MSA9IHNlcmlhbGl6ZXIucGFyc2UoXCIvb25lLyh0d28vL2xlZnQ6dGhyZWUpXCIpO1xyXG4gICAgICAgIGNvbnN0IHQyID0gc2VyaWFsaXplci5wYXJzZShcIi9vbmUvKHR3by8vcmlnaHQ6Zm91cilcIik7XHJcbiAgICAgICAgZXhwZWN0KGNvbnRhaW5zVHJlZSh0MSwgdDIsIGZhbHNlKSkudG9CZShmYWxzZSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbn0pOyJdfQ==