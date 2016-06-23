var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var common_1 = require('@angular/common');
var core_1 = require('@angular/core');
var router_1 = require('../router');
var router_state_1 = require('../router_state');
var RouterLink = (function () {
    function RouterLink(router, route, locationStrategy) {
        this.router = router;
        this.route = route;
        this.locationStrategy = locationStrategy;
        this.commands = [];
    }
    Object.defineProperty(RouterLink.prototype, "routerLink", {
        set: function (data) {
            if (Array.isArray(data)) {
                this.commands = data;
            }
            else {
                this.commands = [data];
            }
        },
        enumerable: true,
        configurable: true
    });
    RouterLink.prototype.ngOnChanges = function (changes) { this.updateTargetUrlAndHref(); };
    RouterLink.prototype.onClick = function (button, ctrlKey, metaKey) {
        if (button !== 0 || ctrlKey || metaKey) {
            return true;
        }
        if (typeof this.target === 'string' && this.target != '_self') {
            return true;
        }
        this.router.navigateByUrl(this.urlTree);
        return false;
    };
    RouterLink.prototype.updateTargetUrlAndHref = function () {
        this.urlTree = this.router.createUrlTree(this.commands, { relativeTo: this.route, queryParams: this.queryParams, fragment: this.fragment });
        if (this.urlTree) {
            this.href = this.locationStrategy.prepareExternalUrl(this.router.serializeUrl(this.urlTree));
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], RouterLink.prototype, "target", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], RouterLink.prototype, "queryParams", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], RouterLink.prototype, "fragment", void 0);
    __decorate([
        core_1.HostBinding(), 
        __metadata('design:type', String)
    ], RouterLink.prototype, "href", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object), 
        __metadata('design:paramtypes', [Object])
    ], RouterLink.prototype, "routerLink", null);
    __decorate([
        core_1.HostListener('click', ['$event.button', '$event.ctrlKey', '$event.metaKey']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Number, Boolean, Boolean]), 
        __metadata('design:returntype', Boolean)
    ], RouterLink.prototype, "onClick", null);
    RouterLink = __decorate([
        core_1.Directive({ selector: '[routerLink]' }), 
        __metadata('design:paramtypes', [router_1.Router, router_state_1.ActivatedRoute, common_1.LocationStrategy])
    ], RouterLink);
    return RouterLink;
})();
exports.RouterLink = RouterLink;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX2xpbmsuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZGlyZWN0aXZlcy9yb3V0ZXJfbGluay50cyJdLCJuYW1lcyI6WyJSb3V0ZXJMaW5rIiwiUm91dGVyTGluay5jb25zdHJ1Y3RvciIsIlJvdXRlckxpbmsucm91dGVyTGluayIsIlJvdXRlckxpbmsubmdPbkNoYW5nZXMiLCJSb3V0ZXJMaW5rLm9uQ2xpY2siLCJSb3V0ZXJMaW5rLnVwZGF0ZVRhcmdldFVybEFuZEhyZWYiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLHVCQUErQixpQkFBaUIsQ0FBQyxDQUFBO0FBQ2pELHFCQUFxRSxlQUFlLENBQUMsQ0FBQTtBQUVyRix1QkFBcUIsV0FBVyxDQUFDLENBQUE7QUFDakMsNkJBQTZCLGlCQUFpQixDQUFDLENBQUE7QUE4Qi9DO0lBZUVBLG9CQUNZQSxNQUFjQSxFQUFVQSxLQUFxQkEsRUFDN0NBLGdCQUFrQ0E7UUFEbENDLFdBQU1BLEdBQU5BLE1BQU1BLENBQVFBO1FBQVVBLFVBQUtBLEdBQUxBLEtBQUtBLENBQWdCQTtRQUM3Q0EscUJBQWdCQSxHQUFoQkEsZ0JBQWdCQSxDQUFrQkE7UUFkdENBLGFBQVFBLEdBQVVBLEVBQUVBLENBQUNBO0lBY29CQSxDQUFDQTtJQUVsREQsc0JBQ0lBLGtDQUFVQTthQURkQSxVQUNlQSxJQUFrQkE7WUFDL0JFLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLE9BQU9BLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUN4QkEsSUFBSUEsQ0FBQ0EsUUFBUUEsR0FBUUEsSUFBSUEsQ0FBQ0E7WUFDNUJBLENBQUNBO1lBQUNBLElBQUlBLENBQUNBLENBQUNBO2dCQUNOQSxJQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtZQUN6QkEsQ0FBQ0E7UUFDSEEsQ0FBQ0E7OztPQUFBRjtJQUVEQSxnQ0FBV0EsR0FBWEEsVUFBWUEsT0FBV0EsSUFBU0csSUFBSUEsQ0FBQ0Esc0JBQXNCQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtJQUdoRUgsNEJBQU9BLEdBRFBBLFVBQ1FBLE1BQWNBLEVBQUVBLE9BQWdCQSxFQUFFQSxPQUFnQkE7UUFDeERJLEVBQUVBLENBQUNBLENBQUNBLE1BQU1BLEtBQUtBLENBQUNBLElBQUlBLE9BQU9BLElBQUlBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBO1lBQ3ZDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtRQUNkQSxDQUFDQTtRQUVEQSxFQUFFQSxDQUFDQSxDQUFDQSxPQUFPQSxJQUFJQSxDQUFDQSxNQUFNQSxLQUFLQSxRQUFRQSxJQUFJQSxJQUFJQSxDQUFDQSxNQUFNQSxJQUFJQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUM5REEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7UUFDZEEsQ0FBQ0E7UUFFREEsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0E7UUFDeENBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBO0lBQ2ZBLENBQUNBO0lBRU9KLDJDQUFzQkEsR0FBOUJBO1FBQ0VLLElBQUlBLENBQUNBLE9BQU9BLEdBQUdBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLGFBQWFBLENBQ3BDQSxJQUFJQSxDQUFDQSxRQUFRQSxFQUNiQSxFQUFDQSxVQUFVQSxFQUFFQSxJQUFJQSxDQUFDQSxLQUFLQSxFQUFFQSxXQUFXQSxFQUFFQSxJQUFJQSxDQUFDQSxXQUFXQSxFQUFFQSxRQUFRQSxFQUFFQSxJQUFJQSxDQUFDQSxRQUFRQSxFQUFDQSxDQUFDQSxDQUFDQTtRQUN0RkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDakJBLElBQUlBLENBQUNBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLGdCQUFnQkEsQ0FBQ0Esa0JBQWtCQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxZQUFZQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUMvRkEsQ0FBQ0E7SUFDSEEsQ0FBQ0E7SUFqRERMO1FBQUNBLFlBQUtBLEVBQUVBOztPQUFDQSw4QkFBTUEsVUFBU0E7SUFFeEJBO1FBQUNBLFlBQUtBLEVBQUVBOztPQUFDQSxtQ0FBV0EsVUFBcUJBO0lBQ3pDQTtRQUFDQSxZQUFLQSxFQUFFQTs7T0FBQ0EsZ0NBQVFBLFVBQVNBO0lBRzFCQTtRQUFDQSxrQkFBV0EsRUFBRUE7O09BQUNBLDRCQUFJQSxVQUFTQTtJQVc1QkE7UUFBQ0EsWUFBS0EsRUFBRUE7OztPQUNKQSxrQ0FBVUEsUUFNYkE7SUFJREE7UUFBQ0EsbUJBQVlBLENBQUNBLE9BQU9BLEVBQUVBLENBQUNBLGVBQWVBLEVBQUVBLGdCQUFnQkEsRUFBRUEsZ0JBQWdCQSxDQUFDQSxDQUFDQTs7OztPQUM3RUEsK0JBQU9BLFFBV05BO0lBMUNIQTtRQUFDQSxnQkFBU0EsQ0FBQ0EsRUFBQ0EsUUFBUUEsRUFBRUEsY0FBY0EsRUFBQ0EsQ0FBQ0E7O21CQW9EckNBO0lBQURBLGlCQUFDQTtBQUFEQSxDQUFDQSxBQXBERCxJQW9EQztBQW5EWSxrQkFBVSxhQW1EdEIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TG9jYXRpb25TdHJhdGVneX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuaW1wb3J0IHtEaXJlY3RpdmUsIEhvc3RCaW5kaW5nLCBIb3N0TGlzdGVuZXIsIElucHV0LCBPbkNoYW5nZXN9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHtSb3V0ZXJ9IGZyb20gJy4uL3JvdXRlcic7XHJcbmltcG9ydCB7QWN0aXZhdGVkUm91dGV9IGZyb20gJy4uL3JvdXRlcl9zdGF0ZSc7XHJcbmltcG9ydCB7VXJsVHJlZX0gZnJvbSAnLi4vdXJsX3RyZWUnO1xyXG5cclxuXHJcblxyXG4vKipcclxuICogVGhlIFJvdXRlckxpbmsgZGlyZWN0aXZlIGxldHMgeW91IGxpbmsgdG8gc3BlY2lmaWMgcGFydHMgb2YgeW91ciBhcHAuXHJcbiAqXHJcbiAqIENvbnNpZGVyIHRoZSBmb2xsb3dpbmcgcm91dGUgY29uZmlndXJhdGlvbjpcclxuXHJcbiAqIGBgYFxyXG4gKiBbeyBwYXRoOiAnL3VzZXInLCBjb21wb25lbnQ6IFVzZXJDbXAgfV1cclxuICogYGBgXHJcbiAqXHJcbiAqIFdoZW4gbGlua2luZyB0byB0aGlzIGBVc2VyYCByb3V0ZSwgeW91IGNhbiB3cml0ZTpcclxuICpcclxuICogYGBgXHJcbiAqIDxhIFtyb3V0ZXJMaW5rXT1cIlsnL3VzZXInXVwiPmxpbmsgdG8gdXNlciBjb21wb25lbnQ8L2E+XHJcbiAqIGBgYFxyXG4gKlxyXG4gKiBSb3V0ZXJMaW5rIGV4cGVjdHMgdGhlIHZhbHVlIHRvIGJlIGFuIGFycmF5IG9mIHBhdGggc2VnbWVudHMsIGZvbGxvd2VkIGJ5IHRoZSBwYXJhbXNcclxuICogZm9yIHRoYXQgbGV2ZWwgb2Ygcm91dGluZy4gRm9yIGluc3RhbmNlIGBbJy90ZWFtJywge3RlYW1JZDogMX0sICd1c2VyJywge3VzZXJJZDogMn1dYFxyXG4gKiBtZWFucyB0aGF0IHdlIHdhbnQgdG8gZ2VuZXJhdGUgYSBsaW5rIHRvIGAvdGVhbTt0ZWFtSWQ9MS91c2VyO3VzZXJJZD0yYC5cclxuICpcclxuICogVGhlIGZpcnN0IHNlZ21lbnQgbmFtZSBjYW4gYmUgcHJlcGVuZGVkIHdpdGggYC9gLCBgLi9gLCBvciBgLi4vYC5cclxuICogSWYgdGhlIHNlZ21lbnQgYmVnaW5zIHdpdGggYC9gLCB0aGUgcm91dGVyIHdpbGwgbG9vayB1cCB0aGUgcm91dGUgZnJvbSB0aGUgcm9vdCBvZiB0aGUgYXBwLlxyXG4gKiBJZiB0aGUgc2VnbWVudCBiZWdpbnMgd2l0aCBgLi9gLCBvciBkb2Vzbid0IGJlZ2luIHdpdGggYSBzbGFzaCwgdGhlIHJvdXRlciB3aWxsXHJcbiAqIGluc3RlYWQgbG9vayBpbiB0aGUgY3VycmVudCBjb21wb25lbnQncyBjaGlsZHJlbiBmb3IgdGhlIHJvdXRlLlxyXG4gKiBBbmQgaWYgdGhlIHNlZ21lbnQgYmVnaW5zIHdpdGggYC4uL2AsIHRoZSByb3V0ZXIgd2lsbCBnbyB1cCBvbmUgbGV2ZWwuXHJcbiAqL1xyXG5ARGlyZWN0aXZlKHtzZWxlY3RvcjogJ1tyb3V0ZXJMaW5rXSd9KVxyXG5leHBvcnQgY2xhc3MgUm91dGVyTGluayBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XHJcbiAgQElucHV0KCkgdGFyZ2V0OiBzdHJpbmc7XHJcbiAgcHJpdmF0ZSBjb21tYW5kczogYW55W10gPSBbXTtcclxuICBASW5wdXQoKSBxdWVyeVBhcmFtczoge1trOiBzdHJpbmddOiBhbnl9O1xyXG4gIEBJbnB1dCgpIGZyYWdtZW50OiBzdHJpbmc7XHJcblxyXG4gIC8vIHRoZSB1cmwgZGlzcGxheWVkIG9uIHRoZSBhbmNob3IgZWxlbWVudC5cclxuICBASG9zdEJpbmRpbmcoKSBocmVmOiBzdHJpbmc7XHJcblxyXG4gIHVybFRyZWU6IFVybFRyZWU7XHJcblxyXG4gIC8qKlxyXG4gICAqIEBpbnRlcm5hbFxyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgICBwcml2YXRlIHJvdXRlcjogUm91dGVyLCBwcml2YXRlIHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSxcclxuICAgICAgcHJpdmF0ZSBsb2NhdGlvblN0cmF0ZWd5OiBMb2NhdGlvblN0cmF0ZWd5KSB7fVxyXG5cclxuICBASW5wdXQoKVxyXG4gIHNldCByb3V0ZXJMaW5rKGRhdGE6IGFueVtdfHN0cmluZykge1xyXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkpIHtcclxuICAgICAgdGhpcy5jb21tYW5kcyA9IDxhbnk+ZGF0YTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuY29tbWFuZHMgPSBbZGF0YV07XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiB7fSk6IGFueSB7IHRoaXMudXBkYXRlVGFyZ2V0VXJsQW5kSHJlZigpOyB9XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ2NsaWNrJywgWyckZXZlbnQuYnV0dG9uJywgJyRldmVudC5jdHJsS2V5JywgJyRldmVudC5tZXRhS2V5J10pXHJcbiAgb25DbGljayhidXR0b246IG51bWJlciwgY3RybEtleTogYm9vbGVhbiwgbWV0YUtleTogYm9vbGVhbik6IGJvb2xlYW4ge1xyXG4gICAgaWYgKGJ1dHRvbiAhPT0gMCB8fCBjdHJsS2V5IHx8IG1ldGFLZXkpIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHR5cGVvZiB0aGlzLnRhcmdldCA9PT0gJ3N0cmluZycgJiYgdGhpcy50YXJnZXQgIT0gJ19zZWxmJykge1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZUJ5VXJsKHRoaXMudXJsVHJlZSk7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHVwZGF0ZVRhcmdldFVybEFuZEhyZWYoKTogdm9pZCB7XHJcbiAgICB0aGlzLnVybFRyZWUgPSB0aGlzLnJvdXRlci5jcmVhdGVVcmxUcmVlKFxyXG4gICAgICAgIHRoaXMuY29tbWFuZHMsXHJcbiAgICAgICAge3JlbGF0aXZlVG86IHRoaXMucm91dGUsIHF1ZXJ5UGFyYW1zOiB0aGlzLnF1ZXJ5UGFyYW1zLCBmcmFnbWVudDogdGhpcy5mcmFnbWVudH0pO1xyXG4gICAgaWYgKHRoaXMudXJsVHJlZSkge1xyXG4gICAgICB0aGlzLmhyZWYgPSB0aGlzLmxvY2F0aW9uU3RyYXRlZ3kucHJlcGFyZUV4dGVybmFsVXJsKHRoaXMucm91dGVyLnNlcmlhbGl6ZVVybCh0aGlzLnVybFRyZWUpKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19