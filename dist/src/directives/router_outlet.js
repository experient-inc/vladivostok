var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require('@angular/core');
var router_outlet_map_1 = require('../router_outlet_map');
var shared_1 = require('../shared');
var RouterOutlet = (function () {
    function RouterOutlet(parentOutletMap, location, name) {
        this.location = location;
        parentOutletMap.registerOutlet(name ? name : shared_1.PRIMARY_OUTLET, this);
    }
    Object.defineProperty(RouterOutlet.prototype, "isActivated", {
        get: function () { return !!this.activated; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RouterOutlet.prototype, "component", {
        get: function () {
            if (!this.activated)
                throw new Error('Outlet is not activated');
            return this.activated.instance;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RouterOutlet.prototype, "activatedRoute", {
        get: function () {
            if (!this.activated)
                throw new Error('Outlet is not activated');
            return this._activatedRoute;
        },
        enumerable: true,
        configurable: true
    });
    RouterOutlet.prototype.deactivate = function () {
        if (this.activated) {
            this.activated.destroy();
            this.activated = null;
        }
    };
    RouterOutlet.prototype.activate = function (factory, activatedRoute, providers, outletMap) {
        this.outletMap = outletMap;
        this._activatedRoute = activatedRoute;
        var inj = core_1.ReflectiveInjector.fromResolvedProviders(providers, this.location.parentInjector);
        this.activated = this.location.createComponent(factory, this.location.length, inj, []);
    };
    RouterOutlet = __decorate([
        core_1.Directive({ selector: 'router-outlet' }),
        __param(2, core_1.Attribute('name')), 
        __metadata('design:paramtypes', [router_outlet_map_1.RouterOutletMap, core_1.ViewContainerRef, String])
    ], RouterOutlet);
    return RouterOutlet;
})();
exports.RouterOutlet = RouterOutlet;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX291dGxldC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kaXJlY3RpdmVzL3JvdXRlcl9vdXRsZXQudHMiXSwibmFtZXMiOlsiUm91dGVyT3V0bGV0IiwiUm91dGVyT3V0bGV0LmNvbnN0cnVjdG9yIiwiUm91dGVyT3V0bGV0LmlzQWN0aXZhdGVkIiwiUm91dGVyT3V0bGV0LmNvbXBvbmVudCIsIlJvdXRlck91dGxldC5hY3RpdmF0ZWRSb3V0ZSIsIlJvdXRlck91dGxldC5kZWFjdGl2YXRlIiwiUm91dGVyT3V0bGV0LmFjdGl2YXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxxQkFBcUksZUFBZSxDQUFDLENBQUE7QUFDckosa0NBQThCLHNCQUFzQixDQUFDLENBQUE7QUFFckQsdUJBQTZCLFdBQVcsQ0FBQyxDQUFBO0FBRXpDO0lBU0VBLHNCQUNJQSxlQUFnQ0EsRUFBVUEsUUFBMEJBLEVBQ2pEQSxJQUFZQTtRQURXQyxhQUFRQSxHQUFSQSxRQUFRQSxDQUFrQkE7UUFFdEVBLGVBQWVBLENBQUNBLGNBQWNBLENBQUNBLElBQUlBLEdBQUdBLElBQUlBLEdBQUdBLHVCQUFjQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQTtJQUNyRUEsQ0FBQ0E7SUFFREQsc0JBQUlBLHFDQUFXQTthQUFmQSxjQUE2QkUsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7OztPQUFBRjtJQUN2REEsc0JBQUlBLG1DQUFTQTthQUFiQTtZQUNFRyxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQTtnQkFBQ0EsTUFBTUEsSUFBSUEsS0FBS0EsQ0FBQ0EseUJBQXlCQSxDQUFDQSxDQUFDQTtZQUNoRUEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsUUFBUUEsQ0FBQ0E7UUFDakNBLENBQUNBOzs7T0FBQUg7SUFDREEsc0JBQUlBLHdDQUFjQTthQUFsQkE7WUFDRUksRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0E7Z0JBQUNBLE1BQU1BLElBQUlBLEtBQUtBLENBQUNBLHlCQUF5QkEsQ0FBQ0EsQ0FBQ0E7WUFDaEVBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBO1FBQzlCQSxDQUFDQTs7O09BQUFKO0lBRURBLGlDQUFVQSxHQUFWQTtRQUNFSyxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNuQkEsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsT0FBT0EsRUFBRUEsQ0FBQ0E7WUFDekJBLElBQUlBLENBQUNBLFNBQVNBLEdBQUdBLElBQUlBLENBQUNBO1FBQ3hCQSxDQUFDQTtJQUNIQSxDQUFDQTtJQUVETCwrQkFBUUEsR0FBUkEsVUFDSUEsT0FBOEJBLEVBQUVBLGNBQThCQSxFQUM5REEsU0FBdUNBLEVBQUVBLFNBQTBCQTtRQUNyRU0sSUFBSUEsQ0FBQ0EsU0FBU0EsR0FBR0EsU0FBU0EsQ0FBQ0E7UUFDM0JBLElBQUlBLENBQUNBLGVBQWVBLEdBQUdBLGNBQWNBLENBQUNBO1FBQ3RDQSxJQUFNQSxHQUFHQSxHQUFHQSx5QkFBa0JBLENBQUNBLHFCQUFxQkEsQ0FBQ0EsU0FBU0EsRUFBRUEsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsQ0FBQ0E7UUFDOUZBLElBQUlBLENBQUNBLFNBQVNBLEdBQUdBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLGVBQWVBLENBQUNBLE9BQU9BLEVBQUVBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLE1BQU1BLEVBQUVBLEdBQUdBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBO0lBQ3pGQSxDQUFDQTtJQXZDSE47UUFBQ0EsZ0JBQVNBLENBQUNBLEVBQUNBLFFBQVFBLEVBQUVBLGVBQWVBLEVBQUNBLENBQUNBO1FBV2pDQSxXQUFDQSxnQkFBU0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQUE7O3FCQTZCdkJBO0lBQURBLG1CQUFDQTtBQUFEQSxDQUFDQSxBQXhDRCxJQXdDQztBQXZDWSxvQkFBWSxlQXVDeEIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7QXR0cmlidXRlLCBDb21wb25lbnRGYWN0b3J5LCBDb21wb25lbnRSZWYsIERpcmVjdGl2ZSwgUmVmbGVjdGl2ZUluamVjdG9yLCBSZXNvbHZlZFJlZmxlY3RpdmVQcm92aWRlciwgVmlld0NvbnRhaW5lclJlZn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7Um91dGVyT3V0bGV0TWFwfSBmcm9tICcuLi9yb3V0ZXJfb3V0bGV0X21hcCc7XHJcbmltcG9ydCB7QWN0aXZhdGVkUm91dGV9IGZyb20gJy4uL3JvdXRlcl9zdGF0ZSc7XHJcbmltcG9ydCB7UFJJTUFSWV9PVVRMRVR9IGZyb20gJy4uL3NoYXJlZCc7XHJcblxyXG5ARGlyZWN0aXZlKHtzZWxlY3RvcjogJ3JvdXRlci1vdXRsZXQnfSlcclxuZXhwb3J0IGNsYXNzIFJvdXRlck91dGxldCB7XHJcbiAgcHJpdmF0ZSBhY3RpdmF0ZWQ6IENvbXBvbmVudFJlZjxhbnk+O1xyXG4gIHByaXZhdGUgX2FjdGl2YXRlZFJvdXRlOiBBY3RpdmF0ZWRSb3V0ZTtcclxuICBwdWJsaWMgb3V0bGV0TWFwOiBSb3V0ZXJPdXRsZXRNYXA7XHJcblxyXG4gIC8qKlxyXG4gICAqIEBpbnRlcm5hbFxyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgICBwYXJlbnRPdXRsZXRNYXA6IFJvdXRlck91dGxldE1hcCwgcHJpdmF0ZSBsb2NhdGlvbjogVmlld0NvbnRhaW5lclJlZixcclxuICAgICAgQEF0dHJpYnV0ZSgnbmFtZScpIG5hbWU6IHN0cmluZykge1xyXG4gICAgcGFyZW50T3V0bGV0TWFwLnJlZ2lzdGVyT3V0bGV0KG5hbWUgPyBuYW1lIDogUFJJTUFSWV9PVVRMRVQsIHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGlzQWN0aXZhdGVkKCk6IGJvb2xlYW4geyByZXR1cm4gISF0aGlzLmFjdGl2YXRlZDsgfVxyXG4gIGdldCBjb21wb25lbnQoKTogT2JqZWN0IHtcclxuICAgIGlmICghdGhpcy5hY3RpdmF0ZWQpIHRocm93IG5ldyBFcnJvcignT3V0bGV0IGlzIG5vdCBhY3RpdmF0ZWQnKTtcclxuICAgIHJldHVybiB0aGlzLmFjdGl2YXRlZC5pbnN0YW5jZTtcclxuICB9XHJcbiAgZ2V0IGFjdGl2YXRlZFJvdXRlKCk6IEFjdGl2YXRlZFJvdXRlIHtcclxuICAgIGlmICghdGhpcy5hY3RpdmF0ZWQpIHRocm93IG5ldyBFcnJvcignT3V0bGV0IGlzIG5vdCBhY3RpdmF0ZWQnKTtcclxuICAgIHJldHVybiB0aGlzLl9hY3RpdmF0ZWRSb3V0ZTtcclxuICB9XHJcblxyXG4gIGRlYWN0aXZhdGUoKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5hY3RpdmF0ZWQpIHtcclxuICAgICAgdGhpcy5hY3RpdmF0ZWQuZGVzdHJveSgpO1xyXG4gICAgICB0aGlzLmFjdGl2YXRlZCA9IG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhY3RpdmF0ZShcclxuICAgICAgZmFjdG9yeTogQ29tcG9uZW50RmFjdG9yeTxhbnk+LCBhY3RpdmF0ZWRSb3V0ZTogQWN0aXZhdGVkUm91dGUsXHJcbiAgICAgIHByb3ZpZGVyczogUmVzb2x2ZWRSZWZsZWN0aXZlUHJvdmlkZXJbXSwgb3V0bGV0TWFwOiBSb3V0ZXJPdXRsZXRNYXApOiB2b2lkIHtcclxuICAgIHRoaXMub3V0bGV0TWFwID0gb3V0bGV0TWFwO1xyXG4gICAgdGhpcy5fYWN0aXZhdGVkUm91dGUgPSBhY3RpdmF0ZWRSb3V0ZTtcclxuICAgIGNvbnN0IGluaiA9IFJlZmxlY3RpdmVJbmplY3Rvci5mcm9tUmVzb2x2ZWRQcm92aWRlcnMocHJvdmlkZXJzLCB0aGlzLmxvY2F0aW9uLnBhcmVudEluamVjdG9yKTtcclxuICAgIHRoaXMuYWN0aXZhdGVkID0gdGhpcy5sb2NhdGlvbi5jcmVhdGVDb21wb25lbnQoZmFjdG9yeSwgdGhpcy5sb2NhdGlvbi5sZW5ndGgsIGluaiwgW10pO1xyXG4gIH1cclxufVxyXG4iXX0=