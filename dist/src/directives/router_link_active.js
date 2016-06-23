var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var router_1 = require('../router');
var url_tree_1 = require('../url_tree');
var router_link_1 = require('./router_link');
var RouterLinkActive = (function () {
    function RouterLinkActive(router, element, renderer) {
        var _this = this;
        this.router = router;
        this.element = element;
        this.renderer = renderer;
        this.classes = [];
        this.routerLinkActiveOptions = { exact: true };
        this.subscription = router.events.subscribe(function (s) {
            if (s instanceof router_1.NavigationEnd) {
                _this.update();
            }
        });
    }
    RouterLinkActive.prototype.ngAfterContentInit = function () {
        var _this = this;
        this.links.changes.subscribe(function (s) { return _this.update(); });
        this.update();
    };
    Object.defineProperty(RouterLinkActive.prototype, "routerLinkActive", {
        set: function (data) {
            if (Array.isArray(data)) {
                this.classes = data;
            }
            else {
                this.classes = data.split(' ');
            }
        },
        enumerable: true,
        configurable: true
    });
    RouterLinkActive.prototype.ngOnChanges = function (changes) { this.update(); };
    RouterLinkActive.prototype.ngOnDestroy = function () { this.subscription.unsubscribe(); };
    RouterLinkActive.prototype.update = function () {
        var _this = this;
        if (!this.links || this.links.length === 0)
            return;
        var currentUrlTree = this.router.parseUrl(this.router.url);
        var isActive = this.links.reduce(function (res, link) {
            return res || url_tree_1.containsTree(currentUrlTree, link.urlTree, _this.routerLinkActiveOptions.exact);
        }, false);
        this.classes.forEach(function (c) { return _this.renderer.setElementClass(_this.element.nativeElement, c, isActive); });
    };
    __decorate([
        core_1.ContentChildren(router_link_1.RouterLink), 
        __metadata('design:type', core_1.QueryList)
    ], RouterLinkActive.prototype, "links", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], RouterLinkActive.prototype, "routerLinkActiveOptions", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object), 
        __metadata('design:paramtypes', [Object])
    ], RouterLinkActive.prototype, "routerLinkActive", null);
    RouterLinkActive = __decorate([
        core_1.Directive({ selector: '[routerLinkActive]' }), 
        __metadata('design:paramtypes', [router_1.Router, core_1.ElementRef, core_1.Renderer])
    ], RouterLinkActive);
    return RouterLinkActive;
})();
exports.RouterLinkActive = RouterLinkActive;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX2xpbmtfYWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2RpcmVjdGl2ZXMvcm91dGVyX2xpbmtfYWN0aXZlLnRzIl0sIm5hbWVzIjpbIlJvdXRlckxpbmtBY3RpdmUiLCJSb3V0ZXJMaW5rQWN0aXZlLmNvbnN0cnVjdG9yIiwiUm91dGVyTGlua0FjdGl2ZS5uZ0FmdGVyQ29udGVudEluaXQiLCJSb3V0ZXJMaW5rQWN0aXZlLnJvdXRlckxpbmtBY3RpdmUiLCJSb3V0ZXJMaW5rQWN0aXZlLm5nT25DaGFuZ2VzIiwiUm91dGVyTGlua0FjdGl2ZS5uZ09uRGVzdHJveSIsIlJvdXRlckxpbmtBY3RpdmUudXBkYXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxxQkFBeUgsZUFBZSxDQUFDLENBQUE7QUFHekksdUJBQW9DLFdBQVcsQ0FBQyxDQUFBO0FBQ2hELHlCQUEyQixhQUFhLENBQUMsQ0FBQTtBQUV6Qyw0QkFBeUIsZUFBZSxDQUFDLENBQUE7QUFNekM7SUFXRUEsMEJBQW9CQSxNQUFjQSxFQUFVQSxPQUFtQkEsRUFBVUEsUUFBa0JBO1FBWDdGQyxpQkFnRENBO1FBckNxQkEsV0FBTUEsR0FBTkEsTUFBTUEsQ0FBUUE7UUFBVUEsWUFBT0EsR0FBUEEsT0FBT0EsQ0FBWUE7UUFBVUEsYUFBUUEsR0FBUkEsUUFBUUEsQ0FBVUE7UUFSbkZBLFlBQU9BLEdBQWFBLEVBQUVBLENBQUNBO1FBR2RBLDRCQUF1QkEsR0FBNEJBLEVBQUNBLEtBQUtBLEVBQUVBLElBQUlBLEVBQUNBLENBQUNBO1FBTWhGQSxJQUFJQSxDQUFDQSxZQUFZQSxHQUFHQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQSxTQUFTQSxDQUFDQSxVQUFBQSxDQUFDQTtZQUMzQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsWUFBWUEsc0JBQWFBLENBQUNBLENBQUNBLENBQUNBO2dCQUMvQkEsS0FBSUEsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0E7WUFDaEJBLENBQUNBO1FBQ0hBLENBQUNBLENBQUNBLENBQUNBO0lBQ0xBLENBQUNBO0lBRURELDZDQUFrQkEsR0FBbEJBO1FBQUFFLGlCQUdDQTtRQUZDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxPQUFPQSxDQUFDQSxTQUFTQSxDQUFDQSxVQUFBQSxDQUFDQSxJQUFJQSxPQUFBQSxLQUFJQSxDQUFDQSxNQUFNQSxFQUFFQSxFQUFiQSxDQUFhQSxDQUFDQSxDQUFDQTtRQUNqREEsSUFBSUEsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0E7SUFDaEJBLENBQUNBO0lBRURGLHNCQUNJQSw4Q0FBZ0JBO2FBRHBCQSxVQUNxQkEsSUFBcUJBO1lBQ3hDRyxFQUFFQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDeEJBLElBQUlBLENBQUNBLE9BQU9BLEdBQVFBLElBQUlBLENBQUNBO1lBQzNCQSxDQUFDQTtZQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtnQkFDTkEsSUFBSUEsQ0FBQ0EsT0FBT0EsR0FBR0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDakNBLENBQUNBO1FBQ0hBLENBQUNBOzs7T0FBQUg7SUFFREEsc0NBQVdBLEdBQVhBLFVBQVlBLE9BQVdBLElBQVNJLElBQUlBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO0lBQ2hESixzQ0FBV0EsR0FBWEEsY0FBcUJLLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLFdBQVdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO0lBRS9DTCxpQ0FBTUEsR0FBZEE7UUFBQU0saUJBV0NBO1FBVkNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLElBQUlBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLEtBQUtBLENBQUNBLENBQUNBO1lBQUNBLE1BQU1BLENBQUNBO1FBRW5EQSxJQUFNQSxjQUFjQSxHQUFHQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUM3REEsSUFBTUEsUUFBUUEsR0FBR0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsQ0FDOUJBLFVBQUNBLEdBQUdBLEVBQUVBLElBQUlBO21CQUNOQSxHQUFHQSxJQUFJQSx1QkFBWUEsQ0FBQ0EsY0FBY0EsRUFBRUEsSUFBSUEsQ0FBQ0EsT0FBT0EsRUFBRUEsS0FBSUEsQ0FBQ0EsdUJBQXVCQSxDQUFDQSxLQUFLQSxDQUFDQTtRQUFyRkEsQ0FBcUZBLEVBQ3pGQSxLQUFLQSxDQUFDQSxDQUFDQTtRQUVYQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxPQUFPQSxDQUNoQkEsVUFBQUEsQ0FBQ0EsSUFBSUEsT0FBQUEsS0FBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsS0FBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsYUFBYUEsRUFBRUEsQ0FBQ0EsRUFBRUEsUUFBUUEsQ0FBQ0EsRUFBdEVBLENBQXNFQSxDQUFDQSxDQUFDQTtJQUNuRkEsQ0FBQ0E7SUE3Q0ROO1FBQUNBLHNCQUFlQSxDQUFDQSx3QkFBVUEsQ0FBQ0E7O09BQVNBLG1DQUFLQSxVQUF3QkE7SUFJbEVBO1FBQUNBLFlBQUtBLEVBQUVBOztPQUFTQSxxREFBdUJBLFVBQTBDQTtJQWtCbEZBO1FBQUNBLFlBQUtBLEVBQUVBOzs7T0FDSkEsOENBQWdCQSxRQU1uQkE7SUEvQkhBO1FBQUNBLGdCQUFTQSxDQUFDQSxFQUFDQSxRQUFRQSxFQUFFQSxvQkFBb0JBLEVBQUNBLENBQUNBOzt5QkFnRDNDQTtJQUFEQSx1QkFBQ0E7QUFBREEsQ0FBQ0EsQUFoREQsSUFnREM7QUEvQ1ksd0JBQWdCLG1CQStDNUIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7QWZ0ZXJDb250ZW50SW5pdCwgQ29udGVudENoaWxkcmVuLCBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIElucHV0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgUXVlcnlMaXN0LCBSZW5kZXJlcn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7U3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzL1N1YnNjcmlwdGlvbic7XHJcblxyXG5pbXBvcnQge05hdmlnYXRpb25FbmQsIFJvdXRlcn0gZnJvbSAnLi4vcm91dGVyJztcclxuaW1wb3J0IHtjb250YWluc1RyZWV9IGZyb20gJy4uL3VybF90cmVlJztcclxuXHJcbmltcG9ydCB7Um91dGVyTGlua30gZnJvbSAnLi9yb3V0ZXJfbGluayc7XHJcblxyXG5pbnRlcmZhY2UgUm91dGVyTGlua0FjdGl2ZU9wdGlvbnMge1xyXG4gIGV4YWN0OiBib29sZWFuO1xyXG59XHJcblxyXG5ARGlyZWN0aXZlKHtzZWxlY3RvcjogJ1tyb3V0ZXJMaW5rQWN0aXZlXSd9KVxyXG5leHBvcnQgY2xhc3MgUm91dGVyTGlua0FjdGl2ZSBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgT25EZXN0cm95LCBBZnRlckNvbnRlbnRJbml0IHtcclxuICBAQ29udGVudENoaWxkcmVuKFJvdXRlckxpbmspIHByaXZhdGUgbGlua3M6IFF1ZXJ5TGlzdDxSb3V0ZXJMaW5rPjtcclxuICBwcml2YXRlIGNsYXNzZXM6IHN0cmluZ1tdID0gW107XHJcbiAgcHJpdmF0ZSBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcclxuXHJcbiAgQElucHV0KCkgcHJpdmF0ZSByb3V0ZXJMaW5rQWN0aXZlT3B0aW9uczogUm91dGVyTGlua0FjdGl2ZU9wdGlvbnMgPSB7ZXhhY3Q6IHRydWV9O1xyXG5cclxuICAvKipcclxuICAgKiBAaW50ZXJuYWxcclxuICAgKi9cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJvdXRlcjogUm91dGVyLCBwcml2YXRlIGVsZW1lbnQ6IEVsZW1lbnRSZWYsIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyKSB7XHJcbiAgICB0aGlzLnN1YnNjcmlwdGlvbiA9IHJvdXRlci5ldmVudHMuc3Vic2NyaWJlKHMgPT4ge1xyXG4gICAgICBpZiAocyBpbnN0YW5jZW9mIE5hdmlnYXRpb25FbmQpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpOiB2b2lkIHtcclxuICAgIHRoaXMubGlua3MuY2hhbmdlcy5zdWJzY3JpYmUocyA9PiB0aGlzLnVwZGF0ZSgpKTtcclxuICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgfVxyXG5cclxuICBASW5wdXQoKVxyXG4gIHNldCByb3V0ZXJMaW5rQWN0aXZlKGRhdGE6IHN0cmluZ1tdfHN0cmluZykge1xyXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkpIHtcclxuICAgICAgdGhpcy5jbGFzc2VzID0gPGFueT5kYXRhO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5jbGFzc2VzID0gZGF0YS5zcGxpdCgnICcpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbmdPbkNoYW5nZXMoY2hhbmdlczoge30pOiBhbnkgeyB0aGlzLnVwZGF0ZSgpOyB9XHJcbiAgbmdPbkRlc3Ryb3koKTogYW55IHsgdGhpcy5zdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTsgfVxyXG5cclxuICBwcml2YXRlIHVwZGF0ZSgpOiB2b2lkIHtcclxuICAgIGlmICghdGhpcy5saW5rcyB8fCB0aGlzLmxpbmtzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xyXG5cclxuICAgIGNvbnN0IGN1cnJlbnRVcmxUcmVlID0gdGhpcy5yb3V0ZXIucGFyc2VVcmwodGhpcy5yb3V0ZXIudXJsKTtcclxuICAgIGNvbnN0IGlzQWN0aXZlID0gdGhpcy5saW5rcy5yZWR1Y2UoXHJcbiAgICAgICAgKHJlcywgbGluaykgPT5cclxuICAgICAgICAgICAgcmVzIHx8IGNvbnRhaW5zVHJlZShjdXJyZW50VXJsVHJlZSwgbGluay51cmxUcmVlLCB0aGlzLnJvdXRlckxpbmtBY3RpdmVPcHRpb25zLmV4YWN0KSxcclxuICAgICAgICBmYWxzZSk7XHJcblxyXG4gICAgdGhpcy5jbGFzc2VzLmZvckVhY2goXHJcbiAgICAgICAgYyA9PiB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyh0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCwgYywgaXNBY3RpdmUpKTtcclxuICB9XHJcbn1cclxuIl19