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
var testing_1 = require('@angular/core/testing');
var testing_2 = require('@angular/compiler/testing');
var core_2 = require('@angular/core');
var common_1 = require('@angular/common');
var testing_3 = require('@angular/common/testing');
var index_1 = require('../src/index');
require('rxjs/add/operator/map');
var of_1 = require('rxjs/observable/of');
testing_1.describe("Integration", function () {
    testing_1.beforeEachProviders(function () {
        var config = [
            { path: '', component: BlankCmp },
            { path: 'simple', component: SimpleCmp }
        ];
        return [
            index_1.RouterOutletMap,
            { provide: index_1.UrlSerializer, useClass: index_1.DefaultUrlSerializer },
            { provide: common_1.Location, useClass: testing_3.SpyLocation },
            {
                provide: index_1.Router,
                useFactory: function (resolver, urlSerializer, outletMap, location, injector) {
                    var r = new index_1.Router(RootCmp, resolver, urlSerializer, outletMap, location, injector, config);
                    r.initialNavigation();
                    return r;
                },
                deps: [core_2.ComponentResolver, index_1.UrlSerializer, index_1.RouterOutletMap, common_1.Location, core_1.Injector]
            },
            { provide: index_1.ActivatedRoute, useFactory: function (r) { return r.routerState.root; }, deps: [index_1.Router] },
        ];
    });
    testing_1.it('should navigate with a provided config', testing_1.fakeAsync(testing_1.inject([index_1.Router, testing_2.TestComponentBuilder, common_1.Location], function (router, tcb, location) {
        var fixture = tcb.createFakeAsync(RootCmp);
        advance(fixture);
        router.navigateByUrl('/simple');
        advance(fixture);
        testing_1.expect(location.path()).toEqual('/simple');
    })));
    testing_1.it('should update location when navigating', testing_1.fakeAsync(testing_1.inject([index_1.Router, testing_2.TestComponentBuilder, common_1.Location], function (router, tcb, location) {
        var fixture = tcb.createFakeAsync(RootCmp);
        advance(fixture);
        router.resetConfig([
            { path: 'team/:id', component: TeamCmp }
        ]);
        router.navigateByUrl('/team/22');
        advance(fixture);
        testing_1.expect(location.path()).toEqual('/team/22');
        router.navigateByUrl('/team/33');
        advance(fixture);
        testing_1.expect(location.path()).toEqual('/team/33');
    })));
    testing_1.it('should navigate back and forward', testing_1.fakeAsync(testing_1.inject([index_1.Router, testing_2.TestComponentBuilder, common_1.Location], function (router, tcb, location) {
        var fixture = tcb.createFakeAsync(RootCmp);
        advance(fixture);
        router.resetConfig([
            { path: 'team/:id', component: TeamCmp, children: [
                    { path: 'simple', component: SimpleCmp },
                    { path: 'user/:name', component: UserCmp }
                ] }
        ]);
        router.navigateByUrl('/team/33/simple');
        advance(fixture);
        testing_1.expect(location.path()).toEqual('/team/33/simple');
        router.navigateByUrl('/team/22/user/victor');
        advance(fixture);
        location.back();
        advance(fixture);
        testing_1.expect(location.path()).toEqual('/team/33/simple');
        location.forward();
        advance(fixture);
        testing_1.expect(location.path()).toEqual('/team/22/user/victor');
    })));
    testing_1.it('should navigate when locations changes', testing_1.fakeAsync(testing_1.inject([index_1.Router, testing_2.TestComponentBuilder, common_1.Location], function (router, tcb, location) {
        var fixture = tcb.createFakeAsync(RootCmp);
        advance(fixture);
        router.resetConfig([
            { path: 'team/:id', component: TeamCmp, children: [
                    { path: 'user/:name', component: UserCmp }
                ] }
        ]);
        router.navigateByUrl('/team/22/user/victor');
        advance(fixture);
        location.simulateHashChange("/team/22/user/fedor");
        advance(fixture);
        testing_1.expect(fixture.debugElement.nativeElement).toHaveText('team 22 { user fedor, right:  }');
    })));
    testing_1.it('should update the location when the matched route does not change', testing_1.fakeAsync(testing_1.inject([index_1.Router, testing_2.TestComponentBuilder, common_1.Location], function (router, tcb, location) {
        var fixture = tcb.createFakeAsync(RootCmp);
        advance(fixture);
        router.resetConfig([
            { path: '**', component: SimpleCmp }
        ]);
        router.navigateByUrl('/one/two');
        advance(fixture);
        testing_1.expect(location.path()).toEqual('/one/two');
        testing_1.expect(fixture.debugElement.nativeElement).toHaveText('simple');
        router.navigateByUrl('/three/four');
        advance(fixture);
        testing_1.expect(location.path()).toEqual('/three/four');
        testing_1.expect(fixture.debugElement.nativeElement).toHaveText('simple');
    })));
    testing_1.it('should support secondary routes', testing_1.fakeAsync(testing_1.inject([index_1.Router, testing_2.TestComponentBuilder], function (router, tcb) {
        var fixture = tcb.createFakeAsync(RootCmp);
        advance(fixture);
        router.resetConfig([
            { path: 'team/:id', component: TeamCmp, children: [
                    { path: 'user/:name', component: UserCmp },
                    { path: 'simple', component: SimpleCmp, outlet: 'right' }
                ] }
        ]);
        router.navigateByUrl('/team/22/(user/victor//right:simple)');
        advance(fixture);
        testing_1.expect(fixture.debugElement.nativeElement)
            .toHaveText('team 22 { user victor, right: simple }');
    })));
    testing_1.it('should deactivate outlets', testing_1.fakeAsync(testing_1.inject([index_1.Router, testing_2.TestComponentBuilder], function (router, tcb) {
        var fixture = tcb.createFakeAsync(RootCmp);
        advance(fixture);
        router.resetConfig([
            { path: 'team/:id', component: TeamCmp, children: [
                    { path: 'user/:name', component: UserCmp },
                    { path: 'simple', component: SimpleCmp, outlet: 'right' }
                ] }
        ]);
        router.navigateByUrl('/team/22/(user/victor//right:simple)');
        advance(fixture);
        router.navigateByUrl('/team/22/user/victor');
        advance(fixture);
        testing_1.expect(fixture.debugElement.nativeElement).toHaveText('team 22 { user victor, right:  }');
    })));
    testing_1.it('should deactivate nested outlets', testing_1.fakeAsync(testing_1.inject([index_1.Router, testing_2.TestComponentBuilder], function (router, tcb) {
        var fixture = tcb.createFakeAsync(RootCmp);
        advance(fixture);
        router.resetConfig([
            { path: 'team/:id', component: TeamCmp, children: [
                    { path: 'user/:name', component: UserCmp },
                    { path: 'simple', component: SimpleCmp, outlet: 'right' }
                ] },
            { path: '', component: BlankCmp }
        ]);
        router.navigateByUrl('/team/22/(user/victor//right:simple)');
        advance(fixture);
        router.navigateByUrl('/');
        advance(fixture);
        testing_1.expect(fixture.debugElement.nativeElement).toHaveText('');
    })));
    testing_1.it('should set query params and fragment', testing_1.fakeAsync(testing_1.inject([index_1.Router, testing_2.TestComponentBuilder], function (router, tcb) {
        var fixture = tcb.createFakeAsync(RootCmp);
        advance(fixture);
        router.resetConfig([
            { path: 'query', component: QueryParamsAndFragmentCmp }
        ]);
        router.navigateByUrl('/query?name=1#fragment1');
        advance(fixture);
        testing_1.expect(fixture.debugElement.nativeElement).toHaveText('query: 1 fragment: fragment1');
        router.navigateByUrl('/query?name=2#fragment2');
        advance(fixture);
        testing_1.expect(fixture.debugElement.nativeElement).toHaveText('query: 2 fragment: fragment2');
    })));
    testing_1.it('should push params only when they change', testing_1.fakeAsync(testing_1.inject([index_1.Router, testing_2.TestComponentBuilder], function (router, tcb) {
        var fixture = tcb.createFakeAsync(RootCmp);
        advance(fixture);
        router.resetConfig([
            { path: 'team/:id', component: TeamCmp, children: [
                    { path: 'user/:name', component: UserCmp }
                ] }
        ]);
        router.navigateByUrl('/team/22/user/victor');
        advance(fixture);
        var team = fixture.debugElement.children[1].componentInstance;
        var user = fixture.debugElement.children[1].children[1].componentInstance;
        testing_1.expect(team.recordedParams).toEqual([{ id: '22' }]);
        testing_1.expect(user.recordedParams).toEqual([{ name: 'victor' }]);
        router.navigateByUrl('/team/22/user/fedor');
        advance(fixture);
        testing_1.expect(team.recordedParams).toEqual([{ id: '22' }]);
        testing_1.expect(user.recordedParams).toEqual([{ name: 'victor' }, { name: 'fedor' }]);
    })));
    testing_1.it('should work when navigating to /', testing_1.fakeAsync(testing_1.inject([index_1.Router, testing_2.TestComponentBuilder], function (router, tcb) {
        var fixture = tcb.createFakeAsync(RootCmp);
        advance(fixture);
        router.resetConfig([
            { path: '', terminal: true, component: SimpleCmp },
            { path: 'user/:name', component: UserCmp }
        ]);
        router.navigateByUrl('/user/victor');
        advance(fixture);
        testing_1.expect(fixture.debugElement.nativeElement).toHaveText('user victor');
        router.navigateByUrl('/');
        advance(fixture);
        testing_1.expect(fixture.debugElement.nativeElement).toHaveText('simple');
    })));
    testing_1.it("should cancel in-flight navigations", testing_1.fakeAsync(testing_1.inject([index_1.Router, testing_2.TestComponentBuilder], function (router, tcb) {
        var fixture = tcb.createFakeAsync(RootCmp);
        advance(fixture);
        router.resetConfig([
            { path: 'user/:name', component: UserCmp }
        ]);
        var recordedEvents = [];
        router.events.forEach(function (e) { return recordedEvents.push(e); });
        router.navigateByUrl('/user/init');
        advance(fixture);
        var user = fixture.debugElement.children[1].componentInstance;
        var r1, r2;
        router.navigateByUrl('/user/victor').then(function (_) { return r1 = _; });
        router.navigateByUrl('/user/fedor').then(function (_) { return r2 = _; });
        advance(fixture);
        testing_1.expect(r1).toEqual(false);
        testing_1.expect(r2).toEqual(true);
        testing_1.expect(fixture.debugElement.nativeElement).toHaveText('user fedor');
        testing_1.expect(user.recordedParams).toEqual([{ name: 'init' }, { name: 'fedor' }]);
        expectEvents(recordedEvents, [
            [index_1.NavigationStart, '/user/init'],
            [index_1.RoutesRecognized, '/user/init'],
            [index_1.NavigationEnd, '/user/init'],
            [index_1.NavigationStart, '/user/victor'],
            [index_1.NavigationStart, '/user/fedor'],
            [index_1.NavigationCancel, '/user/victor'],
            [index_1.RoutesRecognized, '/user/fedor'],
            [index_1.NavigationEnd, '/user/fedor']
        ]);
    })));
    testing_1.it("should handle failed navigations gracefully", testing_1.fakeAsync(testing_1.inject([index_1.Router, testing_2.TestComponentBuilder], function (router, tcb) {
        var fixture = tcb.createFakeAsync(RootCmp);
        advance(fixture);
        router.resetConfig([
            { path: 'user/:name', component: UserCmp }
        ]);
        var recordedEvents = [];
        router.events.forEach(function (e) { return recordedEvents.push(e); });
        var e;
        router.navigateByUrl('/invalid').catch(function (_) { return e = _; });
        advance(fixture);
        testing_1.expect(e.message).toContain("Cannot match any routes");
        router.navigateByUrl('/user/fedor');
        advance(fixture);
        testing_1.expect(fixture.debugElement.nativeElement).toHaveText('user fedor');
        expectEvents(recordedEvents, [
            [index_1.NavigationStart, '/invalid'],
            [index_1.NavigationError, '/invalid'],
            [index_1.NavigationStart, '/user/fedor'],
            [index_1.RoutesRecognized, '/user/fedor'],
            [index_1.NavigationEnd, '/user/fedor']
        ]);
    })));
    testing_1.it('should replace state when path is equal to current path', testing_1.fakeAsync(testing_1.inject([index_1.Router, testing_2.TestComponentBuilder, common_1.Location], function (router, tcb, location) {
        var fixture = tcb.createFakeAsync(RootCmp);
        advance(fixture);
        router.resetConfig([
            { path: 'team/:id', component: TeamCmp, children: [
                    { path: 'simple', component: SimpleCmp },
                    { path: 'user/:name', component: UserCmp }
                ] }
        ]);
        router.navigateByUrl('/team/33/simple');
        advance(fixture);
        router.navigateByUrl('/team/22/user/victor');
        advance(fixture);
        router.navigateByUrl('/team/22/user/victor');
        advance(fixture);
        location.back();
        advance(fixture);
        testing_1.expect(location.path()).toEqual('/team/33/simple');
    })));
    testing_1.it('should handle componentless paths', testing_1.fakeAsync(testing_1.inject([index_1.Router, testing_2.TestComponentBuilder, common_1.Location], function (router, tcb, location) {
        var fixture = tcb.createFakeAsync(RootCmpWithTwoOutlets);
        advance(fixture);
        router.resetConfig([
            { path: 'parent/:id', children: [
                    { path: 'simple', component: SimpleCmp },
                    { path: 'user/:name', component: UserCmp, outlet: 'right' }
                ] },
            { path: 'user/:name', component: UserCmp }
        ]);
        router.navigateByUrl('/parent/11/(simple//right:user/victor)');
        advance(fixture);
        testing_1.expect(location.path()).toEqual('/parent/11/(simple//right:user/victor)');
        testing_1.expect(fixture.debugElement.nativeElement).toHaveText('primary {simple} right {user victor}');
        router.navigateByUrl('/parent/22/(simple//right:user/fedor)');
        advance(fixture);
        testing_1.expect(location.path()).toEqual('/parent/22/(simple//right:user/fedor)');
        testing_1.expect(fixture.debugElement.nativeElement).toHaveText('primary {simple} right {user fedor}');
        router.navigateByUrl('/user/victor');
        advance(fixture);
        testing_1.expect(location.path()).toEqual('/user/victor');
        testing_1.expect(fixture.debugElement.nativeElement).toHaveText('primary {user victor} right {}');
        router.navigateByUrl('/parent/11/(simple//right:user/victor)');
        advance(fixture);
        testing_1.expect(location.path()).toEqual('/parent/11/(simple//right:user/victor)');
        testing_1.expect(fixture.debugElement.nativeElement).toHaveText('primary {simple} right {user victor}');
    })));
    testing_1.describe("router links", function () {
        testing_1.it("should support string router links", testing_1.fakeAsync(testing_1.inject([index_1.Router, testing_2.TestComponentBuilder], function (router, tcb) {
            var fixture = tcb.createFakeAsync(RootCmp);
            advance(fixture);
            router.resetConfig([
                { path: 'team/:id', component: TeamCmp, children: [
                        { path: 'link', component: StringLinkCmp },
                        { path: 'simple', component: SimpleCmp }
                    ] }
            ]);
            router.navigateByUrl('/team/22/link');
            advance(fixture);
            testing_1.expect(fixture.debugElement.nativeElement).toHaveText('team 22 { link, right:  }');
            var native = fixture.debugElement.nativeElement.querySelector("a");
            testing_1.expect(native.getAttribute("href")).toEqual("/team/33/simple");
            native.click();
            advance(fixture);
            testing_1.expect(fixture.debugElement.nativeElement).toHaveText('team 33 { simple, right:  }');
        })));
        testing_1.it("should support absolute router links", testing_1.fakeAsync(testing_1.inject([index_1.Router, testing_2.TestComponentBuilder], function (router, tcb) {
            var fixture = tcb.createFakeAsync(RootCmp);
            advance(fixture);
            router.resetConfig([
                { path: 'team/:id', component: TeamCmp, children: [
                        { path: 'link', component: AbsoluteLinkCmp },
                        { path: 'simple', component: SimpleCmp }
                    ] }
            ]);
            router.navigateByUrl('/team/22/link');
            advance(fixture);
            testing_1.expect(fixture.debugElement.nativeElement).toHaveText('team 22 { link, right:  }');
            var native = fixture.debugElement.nativeElement.querySelector("a");
            testing_1.expect(native.getAttribute("href")).toEqual("/team/33/simple");
            native.click();
            advance(fixture);
            testing_1.expect(fixture.debugElement.nativeElement).toHaveText('team 33 { simple, right:  }');
        })));
        testing_1.it("should support relative router links", testing_1.fakeAsync(testing_1.inject([index_1.Router, testing_2.TestComponentBuilder], function (router, tcb) {
            var fixture = tcb.createFakeAsync(RootCmp);
            advance(fixture);
            router.resetConfig([
                { path: 'team/:id', component: TeamCmp, children: [
                        { path: 'link', component: RelativeLinkCmp },
                        { path: 'simple', component: SimpleCmp }
                    ] }
            ]);
            router.navigateByUrl('/team/22/link');
            advance(fixture);
            testing_1.expect(fixture.debugElement.nativeElement)
                .toHaveText('team 22 { link, right:  }');
            var native = fixture.debugElement.nativeElement.querySelector("a");
            testing_1.expect(native.getAttribute("href")).toEqual("/team/22/simple");
            native.click();
            advance(fixture);
            testing_1.expect(fixture.debugElement.nativeElement)
                .toHaveText('team 22 { simple, right:  }');
        })));
        testing_1.it("should support top-level link", testing_1.fakeAsync(testing_1.inject([index_1.Router, testing_2.TestComponentBuilder], function (router, tcb) {
            var fixture = tcb.createFakeAsync(AbsoluteLinkCmp);
            advance(fixture);
            testing_1.expect(fixture.debugElement.nativeElement).toHaveText('link');
        })));
        testing_1.it("should support query params and fragments", testing_1.fakeAsync(testing_1.inject([index_1.Router, common_1.Location, testing_2.TestComponentBuilder], function (router, location, tcb) {
            var fixture = tcb.createFakeAsync(RootCmp);
            advance(fixture);
            router.resetConfig([
                { path: 'team/:id', component: TeamCmp, children: [
                        { path: 'link', component: LinkWithQueryParamsAndFragment },
                        { path: 'simple', component: SimpleCmp }
                    ] }
            ]);
            router.navigateByUrl('/team/22/link');
            advance(fixture);
            var native = fixture.debugElement.nativeElement.querySelector("a");
            testing_1.expect(native.getAttribute("href")).toEqual("/team/22/simple?q=1#f");
            native.click();
            advance(fixture);
            testing_1.expect(fixture.debugElement.nativeElement)
                .toHaveText('team 22 { simple, right:  }');
            testing_1.expect(location.path()).toEqual('/team/22/simple?q=1#f');
        })));
    });
    testing_1.describe("redirects", function () {
        testing_1.it("should work", testing_1.fakeAsync(testing_1.inject([index_1.Router, testing_2.TestComponentBuilder, common_1.Location], function (router, tcb, location) {
            var fixture = tcb.createFakeAsync(RootCmp);
            advance(fixture);
            router.resetConfig([
                { path: 'old/team/:id', redirectTo: 'team/:id' },
                { path: 'team/:id', component: TeamCmp }
            ]);
            router.navigateByUrl('old/team/22');
            advance(fixture);
            testing_1.expect(location.path()).toEqual('/team/22');
        })));
    });
    testing_1.describe("guards", function () {
        testing_1.describe("CanActivate", function () {
            testing_1.describe("should not activate a route when CanActivate returns false", function () {
                testing_1.beforeEachProviders(function () { return [
                    { provide: 'alwaysFalse', useValue: function (a, b) { return false; } }
                ]; });
                testing_1.it('works', testing_1.fakeAsync(testing_1.inject([index_1.Router, testing_2.TestComponentBuilder, common_1.Location], function (router, tcb, location) {
                    var fixture = tcb.createFakeAsync(RootCmp);
                    advance(fixture);
                    router.resetConfig([
                        { path: 'team/:id', component: TeamCmp, canActivate: ["alwaysFalse"] }
                    ]);
                    router.navigateByUrl('/team/22');
                    advance(fixture);
                    testing_1.expect(location.path()).toEqual('/');
                })));
            });
            testing_1.describe("should not activate a route when CanActivate returns false (componentless route)", function () {
                testing_1.beforeEachProviders(function () { return [
                    { provide: 'alwaysFalse', useValue: function (a, b) { return false; } }
                ]; });
                testing_1.it('works', testing_1.fakeAsync(testing_1.inject([index_1.Router, testing_2.TestComponentBuilder, common_1.Location], function (router, tcb, location) {
                    var fixture = tcb.createFakeAsync(RootCmp);
                    advance(fixture);
                    router.resetConfig([
                        { path: 'parent', canActivate: ['alwaysFalse'], children: [
                                { path: 'team/:id', component: TeamCmp }
                            ] }
                    ]);
                    router.navigateByUrl('parent/team/22');
                    advance(fixture);
                    testing_1.expect(location.path()).toEqual('/');
                })));
            });
            testing_1.describe("should activate a route when CanActivate returns true", function () {
                testing_1.beforeEachProviders(function () { return [
                    { provide: 'alwaysTrue', useValue: function (a, s) { return true; } }
                ]; });
                testing_1.it('works', testing_1.fakeAsync(testing_1.inject([index_1.Router, testing_2.TestComponentBuilder, common_1.Location], function (router, tcb, location) {
                    var fixture = tcb.createFakeAsync(RootCmp);
                    advance(fixture);
                    router.resetConfig([
                        { path: 'team/:id', component: TeamCmp, canActivate: ["alwaysTrue"] }
                    ]);
                    router.navigateByUrl('/team/22');
                    advance(fixture);
                    testing_1.expect(location.path()).toEqual('/team/22');
                })));
            });
            testing_1.describe("should work when given a class", function () {
                var AlwaysTrue = (function () {
                    function AlwaysTrue() {
                    }
                    AlwaysTrue.prototype.canActivate = function (route, state) {
                        return true;
                    };
                    return AlwaysTrue;
                })();
                testing_1.beforeEachProviders(function () { return [AlwaysTrue]; });
                testing_1.it('works', testing_1.fakeAsync(testing_1.inject([index_1.Router, testing_2.TestComponentBuilder, common_1.Location], function (router, tcb, location) {
                    var fixture = tcb.createFakeAsync(RootCmp);
                    advance(fixture);
                    router.resetConfig([
                        { path: 'team/:id', component: TeamCmp, canActivate: [AlwaysTrue] }
                    ]);
                    router.navigateByUrl('/team/22');
                    advance(fixture);
                    testing_1.expect(location.path()).toEqual('/team/22');
                })));
            });
            testing_1.describe("should work when returns an observable", function () {
                testing_1.beforeEachProviders(function () { return [
                    { provide: 'CanActivate', useValue: function (a, b) {
                            return of_1.of(false);
                        } }
                ]; });
                testing_1.it('works', testing_1.fakeAsync(testing_1.inject([index_1.Router, testing_2.TestComponentBuilder, common_1.Location], function (router, tcb, location) {
                    var fixture = tcb.createFakeAsync(RootCmp);
                    advance(fixture);
                    router.resetConfig([
                        { path: 'team/:id', component: TeamCmp, canActivate: ['CanActivate'] }
                    ]);
                    router.navigateByUrl('/team/22');
                    advance(fixture);
                    testing_1.expect(location.path()).toEqual('/');
                })));
            });
        });
        testing_1.describe("CanDeactivate", function () {
            testing_1.describe("should not deactivate a route when CanDeactivate returns false", function () {
                testing_1.beforeEachProviders(function () { return [
                    { provide: 'CanDeactivateParent', useValue: function (c, a, b) {
                            return a.params['id'] === "22";
                        } },
                    { provide: 'CanDeactivateTeam', useValue: function (c, a, b) {
                            return c.route.snapshot.params['id'] === "22";
                        } },
                    { provide: 'CanDeactivateUser', useValue: function (c, a, b) {
                            return a.params['name'] === 'victor';
                        } }
                ]; });
                testing_1.it('works', testing_1.fakeAsync(testing_1.inject([index_1.Router, testing_2.TestComponentBuilder, common_1.Location], function (router, tcb, location) {
                    var fixture = tcb.createFakeAsync(RootCmp);
                    advance(fixture);
                    router.resetConfig([
                        { path: 'team/:id', component: TeamCmp, canDeactivate: ["CanDeactivateTeam"] }
                    ]);
                    router.navigateByUrl('/team/22');
                    advance(fixture);
                    testing_1.expect(location.path()).toEqual('/team/22');
                    router.navigateByUrl('/team/33');
                    advance(fixture);
                    testing_1.expect(location.path()).toEqual('/team/33');
                    router.navigateByUrl('/team/44');
                    advance(fixture);
                    testing_1.expect(location.path()).toEqual('/team/33');
                })));
                testing_1.it('works (componentless route)', testing_1.fakeAsync(testing_1.inject([index_1.Router, testing_2.TestComponentBuilder, common_1.Location], function (router, tcb, location) {
                    var fixture = tcb.createFakeAsync(RootCmp);
                    advance(fixture);
                    router.resetConfig([
                        { path: 'parent/:id', canDeactivate: ["CanDeactivateParent"], children: [
                                { path: 'simple', component: SimpleCmp }
                            ] }
                    ]);
                    router.navigateByUrl('/parent/22/simple');
                    advance(fixture);
                    testing_1.expect(location.path()).toEqual('/parent/22/simple');
                    router.navigateByUrl('/parent/33/simple');
                    advance(fixture);
                    testing_1.expect(location.path()).toEqual('/parent/33/simple');
                    router.navigateByUrl('/parent/44/simple');
                    advance(fixture);
                    testing_1.expect(location.path()).toEqual('/parent/33/simple');
                })));
                testing_1.it('works with a nested route', testing_1.fakeAsync(testing_1.inject([index_1.Router, testing_2.TestComponentBuilder, common_1.Location], function (router, tcb, location) {
                    var fixture = tcb.createFakeAsync(RootCmp);
                    advance(fixture);
                    router.resetConfig([
                        { path: 'team/:id', component: TeamCmp, children: [
                                { path: '', terminal: true, component: SimpleCmp },
                                { path: 'user/:name', component: UserCmp, canDeactivate: ["CanDeactivateUser"] }
                            ] }
                    ]);
                    router.navigateByUrl('/team/22/user/victor');
                    advance(fixture);
                    router.navigateByUrl('/team/33');
                    advance(fixture);
                    testing_1.expect(location.path()).toEqual('/team/33');
                    router.navigateByUrl('/team/33/user/fedor');
                    advance(fixture);
                    router.navigateByUrl('/team/44');
                    advance(fixture);
                    testing_1.expect(location.path()).toEqual('/team/33/user/fedor');
                })));
            });
            testing_1.describe("should work when given a class", function () {
                var AlwaysTrue = (function () {
                    function AlwaysTrue() {
                    }
                    AlwaysTrue.prototype.canDeactivate = function (component, route, state) {
                        return true;
                    };
                    return AlwaysTrue;
                })();
                testing_1.beforeEachProviders(function () { return [AlwaysTrue]; });
                testing_1.it('works', testing_1.fakeAsync(testing_1.inject([index_1.Router, testing_2.TestComponentBuilder, common_1.Location], function (router, tcb, location) {
                    var fixture = tcb.createFakeAsync(RootCmp);
                    advance(fixture);
                    router.resetConfig([
                        { path: 'team/:id', component: TeamCmp, canDeactivate: [AlwaysTrue] }
                    ]);
                    router.navigateByUrl('/team/22');
                    advance(fixture);
                    testing_1.expect(location.path()).toEqual('/team/22');
                    router.navigateByUrl('/team/33');
                    advance(fixture);
                    testing_1.expect(location.path()).toEqual('/team/33');
                })));
            });
        });
        testing_1.describe("should work when returns an observable", function () {
            testing_1.beforeEachProviders(function () { return [
                { provide: 'CanDeactivate', useValue: function (c, a, b) {
                        return of_1.of(false);
                    } }
            ]; });
            testing_1.it('works', testing_1.fakeAsync(testing_1.inject([index_1.Router, testing_2.TestComponentBuilder, common_1.Location], function (router, tcb, location) {
                var fixture = tcb.createFakeAsync(RootCmp);
                advance(fixture);
                router.resetConfig([
                    { path: 'team/:id', component: TeamCmp, canDeactivate: ['CanDeactivate'] }
                ]);
                router.navigateByUrl('/team/22');
                advance(fixture);
                testing_1.expect(location.path()).toEqual('/team/22');
                router.navigateByUrl('/team/33');
                advance(fixture);
                testing_1.expect(location.path()).toEqual('/team/22');
            })));
        });
    });
    testing_1.describe("routerActiveLink", function () {
        testing_1.it("should set the class when the link is active (exact = true)", testing_1.fakeAsync(testing_1.inject([index_1.Router, testing_2.TestComponentBuilder, common_1.Location], function (router, tcb, location) {
            var fixture = tcb.createFakeAsync(RootCmp);
            advance(fixture);
            router.resetConfig([
                { path: 'team/:id', component: TeamCmp, children: [
                        { path: 'link', component: DummyLinkCmp, children: [
                                { path: 'simple', component: SimpleCmp },
                                { path: '', component: BlankCmp }
                            ] }
                    ] }
            ]);
            router.navigateByUrl('/team/22/link');
            advance(fixture);
            testing_1.expect(location.path()).toEqual('/team/22/link');
            var native = fixture.debugElement.nativeElement.querySelector("a");
            testing_1.expect(native.className).toEqual("active");
            router.navigateByUrl('/team/22/link/simple');
            advance(fixture);
            testing_1.expect(location.path()).toEqual('/team/22/link/simple');
            testing_1.expect(native.className).toEqual("");
        })));
        testing_1.it("should set the class on a parent element when the link is active (exact = true)", testing_1.fakeAsync(testing_1.inject([index_1.Router, testing_2.TestComponentBuilder, common_1.Location], function (router, tcb, location) {
            var fixture = tcb.createFakeAsync(RootCmp);
            advance(fixture);
            router.resetConfig([
                { path: 'team/:id', component: TeamCmp, children: [
                        { path: 'link', component: DummyLinkWithParentCmp, children: [
                                { path: 'simple', component: SimpleCmp },
                                { path: '', component: BlankCmp }
                            ] }
                    ] }
            ]);
            router.navigateByUrl('/team/22/link');
            advance(fixture);
            testing_1.expect(location.path()).toEqual('/team/22/link');
            var native = fixture.debugElement.nativeElement.querySelector("link-parent");
            testing_1.expect(native.className).toEqual("active");
            router.navigateByUrl('/team/22/link/simple');
            advance(fixture);
            testing_1.expect(location.path()).toEqual('/team/22/link/simple');
            testing_1.expect(native.className).toEqual("");
        })));
        testing_1.it("should set the class when the link is active (exact = false)", testing_1.fakeAsync(testing_1.inject([index_1.Router, testing_2.TestComponentBuilder, common_1.Location], function (router, tcb, location) {
            var fixture = tcb.createFakeAsync(RootCmp);
            advance(fixture);
            router.resetConfig([
                { path: 'team/:id', component: TeamCmp, children: [
                        { path: 'link', component: DummyLinkCmp, children: [
                                { path: 'simple', component: SimpleCmp },
                                { path: '', component: BlankCmp }
                            ] }
                    ] }
            ]);
            router.navigateByUrl('/team/22/link;exact=false');
            advance(fixture);
            testing_1.expect(location.path()).toEqual('/team/22/link;exact=false');
            var native = fixture.debugElement.nativeElement.querySelector("a");
            testing_1.expect(native.className).toEqual("active");
            router.navigateByUrl('/team/22/link/simple');
            advance(fixture);
            testing_1.expect(location.path()).toEqual('/team/22/link/simple');
            testing_1.expect(native.className).toEqual("active");
        })));
    });
});
function expectEvents(events, pairs) {
    for (var i = 0; i < events.length; ++i) {
        testing_1.expect(events[i].constructor.name).toBe(pairs[i][0].name);
        testing_1.expect(events[i].url).toBe(pairs[i][1]);
    }
}
var StringLinkCmp = (function () {
    function StringLinkCmp() {
    }
    StringLinkCmp = __decorate([
        core_1.Component({
            selector: 'link-cmp',
            template: "<a routerLink=\"/team/33/simple\">link</a>",
            directives: index_1.ROUTER_DIRECTIVES
        }), 
        __metadata('design:paramtypes', [])
    ], StringLinkCmp);
    return StringLinkCmp;
})();
var AbsoluteLinkCmp = (function () {
    function AbsoluteLinkCmp() {
    }
    AbsoluteLinkCmp = __decorate([
        core_1.Component({
            selector: 'link-cmp',
            template: "<router-outlet></router-outlet><a [routerLink]=\"['/team/33/simple']\">link</a>",
            directives: index_1.ROUTER_DIRECTIVES
        }), 
        __metadata('design:paramtypes', [])
    ], AbsoluteLinkCmp);
    return AbsoluteLinkCmp;
})();
var DummyLinkCmp = (function () {
    function DummyLinkCmp(route) {
        this.exact = route.snapshot.params.exact !== 'false';
    }
    DummyLinkCmp = __decorate([
        core_1.Component({
            selector: 'link-cmp',
            template: "<router-outlet></router-outlet><a routerLinkActive=\"active\" [routerLinkActiveOptions]=\"{exact: exact}\" [routerLink]=\"['./']\">link</a>",
            directives: index_1.ROUTER_DIRECTIVES
        }), 
        __metadata('design:paramtypes', [index_1.ActivatedRoute])
    ], DummyLinkCmp);
    return DummyLinkCmp;
})();
var DummyLinkWithParentCmp = (function () {
    function DummyLinkWithParentCmp() {
    }
    DummyLinkWithParentCmp = __decorate([
        core_1.Component({
            selector: 'link-cmp',
            template: "<router-outlet></router-outlet><link-parent routerLinkActive=\"active\"><a [routerLink]=\"['./']\">link</a></link-parent>",
            directives: index_1.ROUTER_DIRECTIVES
        }), 
        __metadata('design:paramtypes', [])
    ], DummyLinkWithParentCmp);
    return DummyLinkWithParentCmp;
})();
var RelativeLinkCmp = (function () {
    function RelativeLinkCmp() {
    }
    RelativeLinkCmp = __decorate([
        core_1.Component({
            selector: 'link-cmp',
            template: "<a [routerLink]=\"['../simple']\">link</a>",
            directives: index_1.ROUTER_DIRECTIVES
        }), 
        __metadata('design:paramtypes', [])
    ], RelativeLinkCmp);
    return RelativeLinkCmp;
})();
var LinkWithQueryParamsAndFragment = (function () {
    function LinkWithQueryParamsAndFragment() {
    }
    LinkWithQueryParamsAndFragment = __decorate([
        core_1.Component({
            selector: 'link-cmp',
            template: "<a [routerLink]=\"['../simple']\" [queryParams]=\"{q: '1'}\" fragment=\"f\">link</a>",
            directives: index_1.ROUTER_DIRECTIVES
        }), 
        __metadata('design:paramtypes', [])
    ], LinkWithQueryParamsAndFragment);
    return LinkWithQueryParamsAndFragment;
})();
var SimpleCmp = (function () {
    function SimpleCmp() {
    }
    SimpleCmp = __decorate([
        core_1.Component({
            selector: 'simple-cmp',
            template: "simple",
            directives: index_1.ROUTER_DIRECTIVES
        }), 
        __metadata('design:paramtypes', [])
    ], SimpleCmp);
    return SimpleCmp;
})();
var BlankCmp = (function () {
    function BlankCmp() {
    }
    BlankCmp = __decorate([
        core_1.Component({
            selector: 'blank-cmp',
            template: "",
            directives: index_1.ROUTER_DIRECTIVES
        }), 
        __metadata('design:paramtypes', [])
    ], BlankCmp);
    return BlankCmp;
})();
var TeamCmp = (function () {
    function TeamCmp(route) {
        var _this = this;
        this.route = route;
        this.recordedParams = [];
        this.id = route.params.map(function (p) { return p['id']; });
        route.params.forEach(function (_) { return _this.recordedParams.push(_); });
    }
    TeamCmp = __decorate([
        core_1.Component({
            selector: 'team-cmp',
            template: "team {{id | async}} { <router-outlet></router-outlet>, right: <router-outlet name=\"right\"></router-outlet> }",
            directives: index_1.ROUTER_DIRECTIVES
        }), 
        __metadata('design:paramtypes', [index_1.ActivatedRoute])
    ], TeamCmp);
    return TeamCmp;
})();
var UserCmp = (function () {
    function UserCmp(route) {
        var _this = this;
        this.recordedParams = [];
        this.name = route.params.map(function (p) { return p['name']; });
        route.params.forEach(function (_) { return _this.recordedParams.push(_); });
    }
    UserCmp = __decorate([
        core_1.Component({
            selector: 'user-cmp',
            template: "user {{name | async}}",
            directives: [index_1.ROUTER_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [index_1.ActivatedRoute])
    ], UserCmp);
    return UserCmp;
})();
var QueryParamsAndFragmentCmp = (function () {
    function QueryParamsAndFragmentCmp(router) {
        this.name = router.routerState.queryParams.map(function (p) { return p['name']; });
        this.fragment = router.routerState.fragment;
    }
    QueryParamsAndFragmentCmp = __decorate([
        core_1.Component({
            selector: 'query-cmp',
            template: "query: {{name | async}} fragment: {{fragment | async}}",
            directives: [index_1.ROUTER_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [index_1.Router])
    ], QueryParamsAndFragmentCmp);
    return QueryParamsAndFragmentCmp;
})();
var RootCmp = (function () {
    function RootCmp() {
    }
    RootCmp = __decorate([
        core_1.Component({
            selector: 'root-cmp',
            template: "<router-outlet></router-outlet>",
            directives: [index_1.ROUTER_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [])
    ], RootCmp);
    return RootCmp;
})();
var RootCmpWithTwoOutlets = (function () {
    function RootCmpWithTwoOutlets() {
    }
    RootCmpWithTwoOutlets = __decorate([
        core_1.Component({
            selector: 'root-cmp',
            template: "primary {<router-outlet></router-outlet>} right {<router-outlet name=\"right\"></router-outlet>}",
            directives: [index_1.ROUTER_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [])
    ], RootCmpWithTwoOutlets);
    return RootCmpWithTwoOutlets;
})();
function advance(fixture) {
    testing_1.tick();
    fixture.detectChanges();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90ZXN0L3JvdXRlci5zcGVjLnRzIl0sIm5hbWVzIjpbIkFsd2F5c1RydWUiLCJBbHdheXNUcnVlLmNvbnN0cnVjdG9yIiwiQWx3YXlzVHJ1ZS5jYW5BY3RpdmF0ZSIsIkFsd2F5c1RydWUuY2FuRGVhY3RpdmF0ZSIsImV4cGVjdEV2ZW50cyIsIlN0cmluZ0xpbmtDbXAiLCJTdHJpbmdMaW5rQ21wLmNvbnN0cnVjdG9yIiwiQWJzb2x1dGVMaW5rQ21wIiwiQWJzb2x1dGVMaW5rQ21wLmNvbnN0cnVjdG9yIiwiRHVtbXlMaW5rQ21wIiwiRHVtbXlMaW5rQ21wLmNvbnN0cnVjdG9yIiwiRHVtbXlMaW5rV2l0aFBhcmVudENtcCIsIkR1bW15TGlua1dpdGhQYXJlbnRDbXAuY29uc3RydWN0b3IiLCJSZWxhdGl2ZUxpbmtDbXAiLCJSZWxhdGl2ZUxpbmtDbXAuY29uc3RydWN0b3IiLCJMaW5rV2l0aFF1ZXJ5UGFyYW1zQW5kRnJhZ21lbnQiLCJMaW5rV2l0aFF1ZXJ5UGFyYW1zQW5kRnJhZ21lbnQuY29uc3RydWN0b3IiLCJTaW1wbGVDbXAiLCJTaW1wbGVDbXAuY29uc3RydWN0b3IiLCJCbGFua0NtcCIsIkJsYW5rQ21wLmNvbnN0cnVjdG9yIiwiVGVhbUNtcCIsIlRlYW1DbXAuY29uc3RydWN0b3IiLCJVc2VyQ21wIiwiVXNlckNtcC5jb25zdHJ1Y3RvciIsIlF1ZXJ5UGFyYW1zQW5kRnJhZ21lbnRDbXAiLCJRdWVyeVBhcmFtc0FuZEZyYWdtZW50Q21wLmNvbnN0cnVjdG9yIiwiUm9vdENtcCIsIlJvb3RDbXAuY29uc3RydWN0b3IiLCJSb290Q21wV2l0aFR3b091dGxldHMiLCJSb290Q21wV2l0aFR3b091dGxldHMuY29uc3RydWN0b3IiLCJhZHZhbmNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxxQkFBa0MsZUFBZSxDQUFDLENBQUE7QUFDbEQsd0JBYU8sdUJBQXVCLENBQUMsQ0FBQTtBQUUvQix3QkFBcUQsMkJBQTJCLENBQUMsQ0FBQTtBQUNqRixxQkFBa0MsZUFBZSxDQUFDLENBQUE7QUFDbEQsdUJBQXlCLGlCQUFpQixDQUFDLENBQUE7QUFDM0Msd0JBQTRCLHlCQUF5QixDQUFDLENBQUE7QUFDdEQsc0JBQzJMLGNBQWMsQ0FBQyxDQUFBO0FBRTFNLFFBQU8sdUJBQXVCLENBQUMsQ0FBQTtBQUMvQixtQkFBaUIsb0JBQW9CLENBQUMsQ0FBQTtBQUV0QyxrQkFBUSxDQUFDLGFBQWEsRUFBRTtJQUV0Qiw2QkFBbUIsQ0FBQztRQUNsQixJQUFJLE1BQU0sR0FBaUI7WUFDekIsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUU7WUFDakMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUU7U0FDekMsQ0FBQztRQUVGLE1BQU0sQ0FBQztZQUNMLHVCQUFlO1lBQ2YsRUFBQyxPQUFPLEVBQUUscUJBQWEsRUFBRSxRQUFRLEVBQUUsNEJBQW9CLEVBQUM7WUFDeEQsRUFBQyxPQUFPLEVBQUUsaUJBQVEsRUFBRSxRQUFRLEVBQUUscUJBQVcsRUFBQztZQUMxQztnQkFDRSxPQUFPLEVBQUUsY0FBTTtnQkFDZixVQUFVLEVBQUUsVUFBQyxRQUEwQixFQUFFLGFBQTJCLEVBQUUsU0FBeUIsRUFBRSxRQUFpQixFQUFFLFFBQWlCO29CQUNuSSxJQUFNLENBQUMsR0FBRyxJQUFJLGNBQU0sQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztvQkFDOUYsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUM7b0JBQ3RCLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsQ0FBQztnQkFDRCxJQUFJLEVBQUUsQ0FBQyx3QkFBaUIsRUFBRSxxQkFBYSxFQUFFLHVCQUFlLEVBQUUsaUJBQVEsRUFBRSxlQUFRLENBQUM7YUFDOUU7WUFDRCxFQUFDLE9BQU8sRUFBRSxzQkFBYyxFQUFFLFVBQVUsRUFBRSxVQUFDLENBQVEsSUFBSyxPQUFBLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFsQixDQUFrQixFQUFFLElBQUksRUFBRSxDQUFDLGNBQU0sQ0FBQyxFQUFDO1NBQ3hGLENBQUM7SUFDSixDQUFDLENBQUMsQ0FBQztJQUVILFlBQUUsQ0FBQyx3Q0FBd0MsRUFDekMsbUJBQVMsQ0FBQyxnQkFBTSxDQUFDLENBQUMsY0FBTSxFQUFFLDhCQUFvQixFQUFFLGlCQUFRLENBQUMsRUFBRSxVQUFDLE1BQWEsRUFBRSxHQUF3QixFQUFFLFFBQWlCO1FBQ3BILElBQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDN0MsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRWpCLE1BQU0sQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDaEMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRWpCLGdCQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzdDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUdQLFlBQUUsQ0FBQyx3Q0FBd0MsRUFDekMsbUJBQVMsQ0FBQyxnQkFBTSxDQUFDLENBQUMsY0FBTSxFQUFFLDhCQUFvQixFQUFFLGlCQUFRLENBQUMsRUFBRSxVQUFDLE1BQWEsRUFBRSxHQUF3QixFQUFFLFFBQWlCO1FBQ3BILElBQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDN0MsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRWpCLE1BQU0sQ0FBQyxXQUFXLENBQUM7WUFDakIsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUU7U0FDekMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNqQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDakIsZ0JBQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFNUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNqQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFakIsZ0JBQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDOUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRVAsWUFBRSxDQUFDLGtDQUFrQyxFQUNuQyxtQkFBUyxDQUFDLGdCQUFNLENBQUMsQ0FBQyxjQUFNLEVBQUUsOEJBQW9CLEVBQUUsaUJBQVEsQ0FBQyxFQUFFLFVBQUMsTUFBYSxFQUFFLEdBQXdCLEVBQUUsUUFBaUI7UUFDcEgsSUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM3QyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFakIsTUFBTSxDQUFDLFdBQVcsQ0FBQztZQUNqQixFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUU7b0JBQ2hELEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFO29CQUN4QyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRTtpQkFDM0MsRUFBRTtTQUNKLENBQUMsQ0FBQztRQUdILE1BQU0sQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUN4QyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDakIsZ0JBQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUVuRCxNQUFNLENBQUMsYUFBYSxDQUFDLHNCQUFzQixDQUFDLENBQUM7UUFDN0MsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRWpCLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNoQixPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDakIsZ0JBQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUVuRCxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDbkIsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2pCLGdCQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLHNCQUFzQixDQUFDLENBQUM7SUFDMUQsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRVAsWUFBRSxDQUFDLHdDQUF3QyxFQUN6QyxtQkFBUyxDQUFDLGdCQUFNLENBQUMsQ0FBQyxjQUFNLEVBQUUsOEJBQW9CLEVBQUUsaUJBQVEsQ0FBQyxFQUFFLFVBQUMsTUFBYSxFQUFFLEdBQXdCLEVBQUUsUUFBaUI7UUFDcEgsSUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM3QyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFakIsTUFBTSxDQUFDLFdBQVcsQ0FBQztZQUNqQixFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUU7b0JBQ2hELEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFO2lCQUMzQyxFQUFFO1NBQ0osQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLGFBQWEsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1FBQzdDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUVYLFFBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1FBQzFELE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUVqQixnQkFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLENBQUMsVUFBVSxDQUFDLGlDQUFpQyxDQUFDLENBQUM7SUFDM0YsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRVAsWUFBRSxDQUFDLG1FQUFtRSxFQUNwRSxtQkFBUyxDQUFDLGdCQUFNLENBQUMsQ0FBQyxjQUFNLEVBQUUsOEJBQW9CLEVBQUUsaUJBQVEsQ0FBQyxFQUFFLFVBQUMsTUFBYSxFQUFFLEdBQXdCLEVBQUUsUUFBaUI7UUFDcEgsSUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM3QyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFakIsTUFBTSxDQUFDLFdBQVcsQ0FBQztZQUNqQixFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRTtTQUNyQyxDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2pDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNqQixnQkFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM1QyxnQkFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRWhFLE1BQU0sQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDcEMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2pCLGdCQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQy9DLGdCQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDbEUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRVAsWUFBRSxDQUFDLGlDQUFpQyxFQUNsQyxtQkFBUyxDQUFDLGdCQUFNLENBQUMsQ0FBQyxjQUFNLEVBQUUsOEJBQW9CLENBQUMsRUFBRSxVQUFDLE1BQWEsRUFBRSxHQUF3QjtRQUN2RixJQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzdDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUVqQixNQUFNLENBQUMsV0FBVyxDQUFDO1lBQ2pCLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRTtvQkFDaEQsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUU7b0JBQzFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUU7aUJBQzFELEVBQUU7U0FDSixDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsYUFBYSxDQUFDLHNDQUFzQyxDQUFDLENBQUM7UUFDN0QsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRWpCLGdCQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUM7YUFDdkMsVUFBVSxDQUFDLHdDQUF3QyxDQUFDLENBQUM7SUFDMUQsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRVAsWUFBRSxDQUFDLDJCQUEyQixFQUM1QixtQkFBUyxDQUFDLGdCQUFNLENBQUMsQ0FBQyxjQUFNLEVBQUUsOEJBQW9CLENBQUMsRUFBRSxVQUFDLE1BQWEsRUFBRSxHQUF3QjtRQUN2RixJQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzdDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUVqQixNQUFNLENBQUMsV0FBVyxDQUFDO1lBQ2pCLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRTtvQkFDaEQsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUU7b0JBQzFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUU7aUJBQzFELEVBQUU7U0FDSixDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsYUFBYSxDQUFDLHNDQUFzQyxDQUFDLENBQUM7UUFDN0QsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRWpCLE1BQU0sQ0FBQyxhQUFhLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUM3QyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFakIsZ0JBQU0sQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO0lBQzVGLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVQLFlBQUUsQ0FBQyxrQ0FBa0MsRUFDbkMsbUJBQVMsQ0FBQyxnQkFBTSxDQUFDLENBQUMsY0FBTSxFQUFFLDhCQUFvQixDQUFDLEVBQUUsVUFBQyxNQUFhLEVBQUUsR0FBd0I7UUFDdkYsSUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM3QyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFakIsTUFBTSxDQUFDLFdBQVcsQ0FBQztZQUNqQixFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUU7b0JBQ2hELEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFO29CQUMxQyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFO2lCQUMxRCxFQUFFO1lBQ0gsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUM7U0FDakMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLGFBQWEsQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO1FBQzdELE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUVqQixNQUFNLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzFCLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUVqQixnQkFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzVELENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVQLFlBQUUsQ0FBQyxzQ0FBc0MsRUFDdkMsbUJBQVMsQ0FBQyxnQkFBTSxDQUFDLENBQUMsY0FBTSxFQUFFLDhCQUFvQixDQUFDLEVBQUUsVUFBQyxNQUFhLEVBQUUsR0FBd0I7UUFDdkYsSUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM3QyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFakIsTUFBTSxDQUFDLFdBQVcsQ0FBQztZQUNqQixFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLHlCQUF5QixFQUFFO1NBQ3hELENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxhQUFhLENBQUMseUJBQXlCLENBQUMsQ0FBQztRQUNoRCxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDakIsZ0JBQU0sQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO1FBRXRGLE1BQU0sQ0FBQyxhQUFhLENBQUMseUJBQXlCLENBQUMsQ0FBQztRQUNoRCxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDakIsZ0JBQU0sQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO0lBQ3hGLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVQLFlBQUUsQ0FBQywwQ0FBMEMsRUFDM0MsbUJBQVMsQ0FBQyxnQkFBTSxDQUFDLENBQUMsY0FBTSxFQUFFLDhCQUFvQixDQUFDLEVBQUUsVUFBQyxNQUFhLEVBQUUsR0FBd0I7UUFDdkYsSUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM3QyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFakIsTUFBTSxDQUFDLFdBQVcsQ0FBQztZQUNqQixFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUU7b0JBQ2hELEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFO2lCQUMzQyxFQUFFO1NBQ0osQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLGFBQWEsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1FBQzdDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNqQixJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQztRQUNoRSxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUM7UUFFNUUsZ0JBQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBQyxFQUFFLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xELGdCQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUMsSUFBSSxFQUFFLFFBQVEsRUFBQyxDQUFDLENBQUMsQ0FBQztRQUV4RCxNQUFNLENBQUMsYUFBYSxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFDNUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRWpCLGdCQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUMsRUFBRSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUMsQ0FBQztRQUNsRCxnQkFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFDLElBQUksRUFBRSxRQUFRLEVBQUMsRUFBRSxFQUFDLElBQUksRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDLENBQUM7SUFDM0UsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRVAsWUFBRSxDQUFDLGtDQUFrQyxFQUNuQyxtQkFBUyxDQUFDLGdCQUFNLENBQUMsQ0FBQyxjQUFNLEVBQUUsOEJBQW9CLENBQUMsRUFBRSxVQUFDLE1BQWEsRUFBRSxHQUF3QjtRQUN2RixJQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzdDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUVqQixNQUFNLENBQUMsV0FBVyxDQUFDO1lBQ2pCLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUU7WUFDbEQsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUU7U0FDM0MsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNyQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFakIsZ0JBQU0sQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUVyRSxNQUFNLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzFCLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUVqQixnQkFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2xFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVQLFlBQUUsQ0FBQyxxQ0FBcUMsRUFDdEMsbUJBQVMsQ0FBQyxnQkFBTSxDQUFDLENBQUMsY0FBTSxFQUFFLDhCQUFvQixDQUFDLEVBQUUsVUFBQyxNQUFhLEVBQUUsR0FBd0I7UUFDdkYsSUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM3QyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFakIsTUFBTSxDQUFDLFdBQVcsQ0FBQztZQUNqQixFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRTtTQUMzQyxDQUFDLENBQUM7UUFFSCxJQUFNLGNBQWMsR0FBTyxFQUFFLENBQUM7UUFDOUIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUF0QixDQUFzQixDQUFDLENBQUM7UUFFbkQsTUFBTSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNuQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFakIsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUM7UUFFaEUsSUFBSSxFQUFNLEVBQUUsRUFBTSxDQUFDO1FBQ25CLE1BQU0sQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsRUFBRSxHQUFHLENBQUMsRUFBTixDQUFNLENBQUMsQ0FBQztRQUN2RCxNQUFNLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLEVBQUUsR0FBRyxDQUFDLEVBQU4sQ0FBTSxDQUFDLENBQUM7UUFDdEQsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRWpCLGdCQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzFCLGdCQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXpCLGdCQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDcEUsZ0JBQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFDLEVBQUUsRUFBQyxJQUFJLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXZFLFlBQVksQ0FBQyxjQUFjLEVBQUU7WUFDM0IsQ0FBQyx1QkFBZSxFQUFFLFlBQVksQ0FBQztZQUMvQixDQUFDLHdCQUFnQixFQUFFLFlBQVksQ0FBQztZQUNoQyxDQUFDLHFCQUFhLEVBQUUsWUFBWSxDQUFDO1lBRTdCLENBQUMsdUJBQWUsRUFBRSxjQUFjLENBQUM7WUFDakMsQ0FBQyx1QkFBZSxFQUFFLGFBQWEsQ0FBQztZQUVoQyxDQUFDLHdCQUFnQixFQUFFLGNBQWMsQ0FBQztZQUNsQyxDQUFDLHdCQUFnQixFQUFFLGFBQWEsQ0FBQztZQUNqQyxDQUFDLHFCQUFhLEVBQUUsYUFBYSxDQUFDO1NBQy9CLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVQLFlBQUUsQ0FBQyw2Q0FBNkMsRUFDOUMsbUJBQVMsQ0FBQyxnQkFBTSxDQUFDLENBQUMsY0FBTSxFQUFFLDhCQUFvQixDQUFDLEVBQUUsVUFBQyxNQUFhLEVBQUUsR0FBd0I7UUFDdkYsSUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM3QyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFakIsTUFBTSxDQUFDLFdBQVcsQ0FBQztZQUNqQixFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRTtTQUMzQyxDQUFDLENBQUM7UUFFSCxJQUFNLGNBQWMsR0FBTyxFQUFFLENBQUM7UUFDOUIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUF0QixDQUFzQixDQUFDLENBQUM7UUFFbkQsSUFBSSxDQUFLLENBQUM7UUFDVixNQUFNLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsR0FBRyxDQUFDLEVBQUwsQ0FBSyxDQUFDLENBQUM7UUFDbkQsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2pCLGdCQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1FBRXZELE1BQU0sQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDcEMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRWpCLGdCQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFcEUsWUFBWSxDQUFDLGNBQWMsRUFBRTtZQUMzQixDQUFDLHVCQUFlLEVBQUUsVUFBVSxDQUFDO1lBQzdCLENBQUMsdUJBQWUsRUFBRSxVQUFVLENBQUM7WUFFN0IsQ0FBQyx1QkFBZSxFQUFFLGFBQWEsQ0FBQztZQUNoQyxDQUFDLHdCQUFnQixFQUFFLGFBQWEsQ0FBQztZQUNqQyxDQUFDLHFCQUFhLEVBQUUsYUFBYSxDQUFDO1NBQy9CLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVQLFlBQUUsQ0FBQyx5REFBeUQsRUFDMUQsbUJBQVMsQ0FBQyxnQkFBTSxDQUFDLENBQUMsY0FBTSxFQUFFLDhCQUFvQixFQUFFLGlCQUFRLENBQUMsRUFBRSxVQUFDLE1BQWEsRUFBRSxHQUF3QixFQUFFLFFBQWlCO1FBQ3BILElBQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDN0MsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRWpCLE1BQU0sQ0FBQyxXQUFXLENBQUM7WUFDakIsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFO29CQUNoRCxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRTtvQkFDeEMsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUU7aUJBQzNDLEVBQUU7U0FDSixDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsYUFBYSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDeEMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRWpCLE1BQU0sQ0FBQyxhQUFhLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUM3QyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFakIsTUFBTSxDQUFDLGFBQWEsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1FBQzdDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUVqQixRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDaEIsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2pCLGdCQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDckQsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRVAsWUFBRSxDQUFDLG1DQUFtQyxFQUNwQyxtQkFBUyxDQUFDLGdCQUFNLENBQUMsQ0FBQyxjQUFNLEVBQUUsOEJBQW9CLEVBQUUsaUJBQVEsQ0FBQyxFQUFFLFVBQUMsTUFBYSxFQUFFLEdBQXdCLEVBQUUsUUFBaUI7UUFDcEgsSUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLGVBQWUsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1FBQzNELE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUVqQixNQUFNLENBQUMsV0FBVyxDQUFDO1lBQ2pCLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUU7b0JBQzlCLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFO29CQUN4QyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFO2lCQUM1RCxFQUFFO1lBQ0gsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUU7U0FDM0MsQ0FBQyxDQUFDO1FBSUgsTUFBTSxDQUFDLGFBQWEsQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO1FBQy9ELE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNqQixnQkFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO1FBQzFFLGdCQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQyxVQUFVLENBQUMsc0NBQXNDLENBQUMsQ0FBQztRQUc5RixNQUFNLENBQUMsYUFBYSxDQUFDLHVDQUF1QyxDQUFDLENBQUM7UUFDOUQsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2pCLGdCQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLHVDQUF1QyxDQUFDLENBQUM7UUFDekUsZ0JBQU0sQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO1FBRzdGLE1BQU0sQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDckMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2pCLGdCQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ2hELGdCQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQyxVQUFVLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztRQUd4RixNQUFNLENBQUMsYUFBYSxDQUFDLHdDQUF3QyxDQUFDLENBQUM7UUFDL0QsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2pCLGdCQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLHdDQUF3QyxDQUFDLENBQUM7UUFDMUUsZ0JBQU0sQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO0lBQ2hHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVQLGtCQUFRLENBQUMsY0FBYyxFQUFFO1FBQ3ZCLFlBQUUsQ0FBQyxvQ0FBb0MsRUFDckMsbUJBQVMsQ0FBQyxnQkFBTSxDQUFDLENBQUMsY0FBTSxFQUFFLDhCQUFvQixDQUFDLEVBQUUsVUFBQyxNQUFhLEVBQUUsR0FBd0I7WUFDdkYsSUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM3QyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFakIsTUFBTSxDQUFDLFdBQVcsQ0FBQztnQkFDakIsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFO3dCQUNoRCxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLGFBQWEsRUFBRTt3QkFDMUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUU7cUJBQ3pDLEVBQUU7YUFDSixDQUFDLENBQUM7WUFFSCxNQUFNLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ3RDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNqQixnQkFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLENBQUMsVUFBVSxDQUFDLDJCQUEyQixDQUFDLENBQUM7WUFFbkYsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3JFLGdCQUFNLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQy9ELE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNmLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUVqQixnQkFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLENBQUMsVUFBVSxDQUFDLDZCQUE2QixDQUFDLENBQUM7UUFDdkYsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRVAsWUFBRSxDQUFDLHNDQUFzQyxFQUN2QyxtQkFBUyxDQUFDLGdCQUFNLENBQUMsQ0FBQyxjQUFNLEVBQUUsOEJBQW9CLENBQUMsRUFBRSxVQUFDLE1BQWEsRUFBRSxHQUF3QjtZQUN2RixJQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzdDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUVqQixNQUFNLENBQUMsV0FBVyxDQUFDO2dCQUNqQixFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUU7d0JBQ2hELEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsZUFBZSxFQUFFO3dCQUM1QyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRTtxQkFDekMsRUFBRTthQUNKLENBQUMsQ0FBQztZQUVILE1BQU0sQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDdEMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ2pCLGdCQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQyxVQUFVLENBQUMsMkJBQTJCLENBQUMsQ0FBQztZQUVuRixJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDckUsZ0JBQU0sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDL0QsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2YsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRWpCLGdCQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQyxVQUFVLENBQUMsNkJBQTZCLENBQUMsQ0FBQztRQUN2RixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFUCxZQUFFLENBQUMsc0NBQXNDLEVBQ3ZDLG1CQUFTLENBQUMsZ0JBQU0sQ0FBQyxDQUFDLGNBQU0sRUFBRSw4QkFBb0IsQ0FBQyxFQUFFLFVBQUMsTUFBYSxFQUFFLEdBQXdCO1lBQ3ZGLElBQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDN0MsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRWpCLE1BQU0sQ0FBQyxXQUFXLENBQUM7Z0JBQ2pCLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRTt3QkFDaEQsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxlQUFlLEVBQUU7d0JBQzVDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFO3FCQUN6QyxFQUFFO2FBQ0osQ0FBQyxDQUFDO1lBRUgsTUFBTSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUN0QyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDakIsZ0JBQU0sQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQztpQkFDdkMsVUFBVSxDQUFDLDJCQUEyQixDQUFDLENBQUM7WUFFM0MsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3JFLGdCQUFNLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQy9ELE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNmLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUVqQixnQkFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDO2lCQUN2QyxVQUFVLENBQUMsNkJBQTZCLENBQUMsQ0FBQztRQUMvQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFUCxZQUFFLENBQUMsK0JBQStCLEVBQ2hDLG1CQUFTLENBQUMsZ0JBQU0sQ0FBQyxDQUFDLGNBQU0sRUFBRSw4QkFBb0IsQ0FBQyxFQUFFLFVBQUMsTUFBYSxFQUFFLEdBQXdCO1lBQ3ZGLElBQUksT0FBTyxHQUFHLEdBQUcsQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDbkQsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRWpCLGdCQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDaEUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRVAsWUFBRSxDQUFDLDJDQUEyQyxFQUM1QyxtQkFBUyxDQUFDLGdCQUFNLENBQUMsQ0FBQyxjQUFNLEVBQUUsaUJBQVEsRUFBRSw4QkFBb0IsQ0FBQyxFQUFFLFVBQUMsTUFBYSxFQUFFLFFBQWlCLEVBQUUsR0FBd0I7WUFDcEgsSUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM3QyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFakIsTUFBTSxDQUFDLFdBQVcsQ0FBQztnQkFDakIsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFO3dCQUNoRCxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLDhCQUE4QixFQUFFO3dCQUMzRCxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRTtxQkFDekMsRUFBRTthQUNKLENBQUMsQ0FBQztZQUVILE1BQU0sQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDdEMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRWpCLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNyRSxnQkFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsdUJBQXVCLENBQUMsQ0FBQztZQUNyRSxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDZixPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFakIsZ0JBQU0sQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQztpQkFDdkMsVUFBVSxDQUFDLDZCQUE2QixDQUFDLENBQUM7WUFFN0MsZ0JBQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUMzRCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDVCxDQUFDLENBQUMsQ0FBQztJQUVILGtCQUFRLENBQUMsV0FBVyxFQUFFO1FBQ3BCLFlBQUUsQ0FBQyxhQUFhLEVBQUUsbUJBQVMsQ0FBQyxnQkFBTSxDQUFDLENBQUMsY0FBTSxFQUFFLDhCQUFvQixFQUFFLGlCQUFRLENBQUMsRUFBRSxVQUFDLE1BQWEsRUFBRSxHQUF3QixFQUFFLFFBQWlCO1lBQ3RJLElBQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDN0MsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRWpCLE1BQU0sQ0FBQyxXQUFXLENBQUM7Z0JBQ2pCLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFO2dCQUNoRCxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRTthQUN6QyxDQUFDLENBQUM7WUFFSCxNQUFNLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ3BDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUVqQixnQkFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM5QyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztJQUVILGtCQUFRLENBQUMsUUFBUSxFQUFFO1FBQ2pCLGtCQUFRLENBQUMsYUFBYSxFQUFFO1lBQ3RCLGtCQUFRLENBQUMsNERBQTRELEVBQUU7Z0JBQ3JFLDZCQUFtQixDQUFDLGNBQU0sT0FBQTtvQkFDeEIsRUFBQyxPQUFPLEVBQUUsYUFBYSxFQUFFLFFBQVEsRUFBRSxVQUFDLENBQUssRUFBRSxDQUFLLElBQUssT0FBQSxLQUFLLEVBQUwsQ0FBSyxFQUFDO2lCQUM1RCxFQUZ5QixDQUV6QixDQUFDLENBQUM7Z0JBRUgsWUFBRSxDQUFDLE9BQU8sRUFDUixtQkFBUyxDQUFDLGdCQUFNLENBQUMsQ0FBQyxjQUFNLEVBQUUsOEJBQW9CLEVBQUUsaUJBQVEsQ0FBQyxFQUFFLFVBQUMsTUFBYSxFQUFFLEdBQXdCLEVBQUUsUUFBaUI7b0JBQ3BILElBQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQzdDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFFakIsTUFBTSxDQUFDLFdBQVcsQ0FBQzt3QkFDakIsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLENBQUMsYUFBYSxDQUFDLEVBQUU7cUJBQ3ZFLENBQUMsQ0FBQztvQkFFSCxNQUFNLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO29CQUNqQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBRWpCLGdCQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUN2QyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDVCxDQUFDLENBQUMsQ0FBQztZQUVILGtCQUFRLENBQUMsa0ZBQWtGLEVBQUU7Z0JBQzNGLDZCQUFtQixDQUFDLGNBQU0sT0FBQTtvQkFDeEIsRUFBQyxPQUFPLEVBQUUsYUFBYSxFQUFFLFFBQVEsRUFBRSxVQUFDLENBQUssRUFBRSxDQUFLLElBQUssT0FBQSxLQUFLLEVBQUwsQ0FBSyxFQUFDO2lCQUM1RCxFQUZ5QixDQUV6QixDQUFDLENBQUM7Z0JBRUgsWUFBRSxDQUFDLE9BQU8sRUFDUixtQkFBUyxDQUFDLGdCQUFNLENBQUMsQ0FBQyxjQUFNLEVBQUUsOEJBQW9CLEVBQUUsaUJBQVEsQ0FBQyxFQUFFLFVBQUMsTUFBYSxFQUFFLEdBQXdCLEVBQUUsUUFBaUI7b0JBQ3BILElBQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQzdDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFFakIsTUFBTSxDQUFDLFdBQVcsQ0FBQzt3QkFDakIsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxDQUFDLGFBQWEsQ0FBQyxFQUFFLFFBQVEsRUFBRTtnQ0FDeEQsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUU7NkJBQ3pDLEVBQUM7cUJBQ0gsQ0FBQyxDQUFDO29CQUVILE1BQU0sQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztvQkFDdkMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUVqQixnQkFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDdkMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1QsQ0FBQyxDQUFDLENBQUM7WUFFSCxrQkFBUSxDQUFDLHVEQUF1RCxFQUFFO2dCQUNoRSw2QkFBbUIsQ0FBQyxjQUFNLE9BQUE7b0JBQ3hCLEVBQUMsT0FBTyxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsVUFBQyxDQUF3QixFQUFFLENBQXFCLElBQUssT0FBQSxJQUFJLEVBQUosQ0FBSSxFQUFDO2lCQUM3RixFQUZ5QixDQUV6QixDQUFDLENBQUM7Z0JBRUgsWUFBRSxDQUFDLE9BQU8sRUFDUixtQkFBUyxDQUFDLGdCQUFNLENBQUMsQ0FBQyxjQUFNLEVBQUUsOEJBQW9CLEVBQUUsaUJBQVEsQ0FBQyxFQUFFLFVBQUMsTUFBYSxFQUFFLEdBQXdCLEVBQUUsUUFBaUI7b0JBQ3BILElBQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQzdDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFFakIsTUFBTSxDQUFDLFdBQVcsQ0FBQzt3QkFDakIsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLENBQUMsWUFBWSxDQUFDLEVBQUU7cUJBQ3RFLENBQUMsQ0FBQztvQkFFSCxNQUFNLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO29CQUNqQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBRWpCLGdCQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUM5QyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDVCxDQUFDLENBQUMsQ0FBQztZQUVILGtCQUFRLENBQUMsZ0NBQWdDLEVBQUU7Z0JBQ3pDO29CQUFBQTtvQkFJQUMsQ0FBQ0E7b0JBSENELGdDQUFXQSxHQUFYQSxVQUFZQSxLQUE0QkEsRUFBRUEsS0FBeUJBO3dCQUNqRUUsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7b0JBQ2RBLENBQUNBO29CQUNIRixpQkFBQ0E7Z0JBQURBLENBQUNBLEFBSkQsSUFJQztnQkFFRCw2QkFBbUIsQ0FBQyxjQUFNLE9BQUEsQ0FBQyxVQUFVLENBQUMsRUFBWixDQUFZLENBQUMsQ0FBQztnQkFFeEMsWUFBRSxDQUFDLE9BQU8sRUFDUixtQkFBUyxDQUFDLGdCQUFNLENBQUMsQ0FBQyxjQUFNLEVBQUUsOEJBQW9CLEVBQUUsaUJBQVEsQ0FBQyxFQUFFLFVBQUMsTUFBYSxFQUFFLEdBQXdCLEVBQUUsUUFBaUI7b0JBQ3BILElBQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQzdDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFFakIsTUFBTSxDQUFDLFdBQVcsQ0FBQzt3QkFDakIsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUU7cUJBQ3BFLENBQUMsQ0FBQztvQkFFSCxNQUFNLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO29CQUNqQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBRWpCLGdCQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUM5QyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDVCxDQUFDLENBQUMsQ0FBQztZQUVILGtCQUFRLENBQUMsd0NBQXdDLEVBQUU7Z0JBQ2pELDZCQUFtQixDQUFDLGNBQU0sT0FBQTtvQkFDeEIsRUFBQyxPQUFPLEVBQUUsYUFBYSxFQUFFLFFBQVEsRUFBRSxVQUFDLENBQXdCLEVBQUUsQ0FBcUI7NEJBQ2pGLE1BQU0sQ0FBQyxPQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7d0JBQ25CLENBQUMsRUFBQztpQkFDSCxFQUp5QixDQUl6QixDQUFDLENBQUM7Z0JBRUgsWUFBRSxDQUFDLE9BQU8sRUFDUixtQkFBUyxDQUFDLGdCQUFNLENBQUMsQ0FBQyxjQUFNLEVBQUUsOEJBQW9CLEVBQUUsaUJBQVEsQ0FBQyxFQUFFLFVBQUMsTUFBYSxFQUFFLEdBQXdCLEVBQUUsUUFBaUI7b0JBQ3BILElBQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQzdDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFFakIsTUFBTSxDQUFDLFdBQVcsQ0FBQzt3QkFDakIsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLENBQUMsYUFBYSxDQUFDLEVBQUU7cUJBQ3ZFLENBQUMsQ0FBQztvQkFFSCxNQUFNLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO29CQUNqQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQ2pCLGdCQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUN2QyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDUixDQUFDLENBQUMsQ0FBQztRQUNOLENBQUMsQ0FBQyxDQUFDO1FBRUgsa0JBQVEsQ0FBQyxlQUFlLEVBQUU7WUFDeEIsa0JBQVEsQ0FBQyxnRUFBZ0UsRUFBRTtnQkFDekUsNkJBQW1CLENBQUMsY0FBTSxPQUFBO29CQUN4QixFQUFDLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxRQUFRLEVBQUUsVUFBQyxDQUFLLEVBQUUsQ0FBd0IsRUFBRSxDQUFxQjs0QkFDaEcsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDO3dCQUNqQyxDQUFDLEVBQUM7b0JBQ0YsRUFBQyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsUUFBUSxFQUFFLFVBQUMsQ0FBSyxFQUFFLENBQXdCLEVBQUUsQ0FBcUI7NEJBQzlGLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDO3dCQUNoRCxDQUFDLEVBQUM7b0JBQ0YsRUFBQyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsUUFBUSxFQUFFLFVBQUMsQ0FBSyxFQUFFLENBQXdCLEVBQUUsQ0FBcUI7NEJBQzlGLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLFFBQVEsQ0FBQzt3QkFDdkMsQ0FBQyxFQUFDO2lCQUNILEVBVnlCLENBVXpCLENBQUMsQ0FBQztnQkFFSCxZQUFFLENBQUMsT0FBTyxFQUNSLG1CQUFTLENBQUMsZ0JBQU0sQ0FBQyxDQUFDLGNBQU0sRUFBRSw4QkFBb0IsRUFBRSxpQkFBUSxDQUFDLEVBQUUsVUFBQyxNQUFhLEVBQUUsR0FBd0IsRUFBRSxRQUFpQjtvQkFDcEgsSUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDN0MsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUVqQixNQUFNLENBQUMsV0FBVyxDQUFDO3dCQUNqQixFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFO3FCQUMvRSxDQUFDLENBQUM7b0JBRUgsTUFBTSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFDakMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUNqQixnQkFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFFNUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFDakMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUNqQixnQkFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFFNUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFDakMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUNqQixnQkFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDOUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUVQLFlBQUUsQ0FBQyw2QkFBNkIsRUFDOUIsbUJBQVMsQ0FBQyxnQkFBTSxDQUFDLENBQUMsY0FBTSxFQUFFLDhCQUFvQixFQUFFLGlCQUFRLENBQUMsRUFBRSxVQUFDLE1BQWEsRUFBRSxHQUF3QixFQUFFLFFBQWlCO29CQUNwSCxJQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUM3QyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBRWpCLE1BQU0sQ0FBQyxXQUFXLENBQUM7d0JBQ2pCLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxhQUFhLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFLFFBQVEsRUFBRTtnQ0FDdEUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUU7NkJBQ3pDLEVBQUU7cUJBQ0osQ0FBQyxDQUFDO29CQUVILE1BQU0sQ0FBQyxhQUFhLENBQUMsbUJBQW1CLENBQUMsQ0FBQztvQkFDMUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUNqQixnQkFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO29CQUVyRCxNQUFNLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUFDLENBQUM7b0JBQzFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDakIsZ0JBQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQztvQkFFckQsTUFBTSxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO29CQUMxQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQ2pCLGdCQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUM7Z0JBQ3ZELENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFUCxZQUFFLENBQUMsMkJBQTJCLEVBQzVCLG1CQUFTLENBQUMsZ0JBQU0sQ0FBQyxDQUFDLGNBQU0sRUFBRSw4QkFBb0IsRUFBRSxpQkFBUSxDQUFDLEVBQUUsVUFBQyxNQUFhLEVBQUUsR0FBd0IsRUFBRSxRQUFpQjtvQkFDcEgsSUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDN0MsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUVqQixNQUFNLENBQUMsV0FBVyxDQUFDO3dCQUNqQixFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUU7Z0NBQ2hELEVBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUM7Z0NBQ2hELEVBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxDQUFDLG1CQUFtQixDQUFDLEVBQUU7NkJBQ2hGLEVBQUM7cUJBQ0gsQ0FBQyxDQUFDO29CQUVILE1BQU0sQ0FBQyxhQUFhLENBQUMsc0JBQXNCLENBQUMsQ0FBQztvQkFDN0MsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUdqQixNQUFNLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO29CQUNqQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQ2pCLGdCQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO29CQUU1QyxNQUFNLENBQUMsYUFBYSxDQUFDLHFCQUFxQixDQUFDLENBQUM7b0JBQzVDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFHakIsTUFBTSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFDakMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUNqQixnQkFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO2dCQUN6RCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDVCxDQUFDLENBQUMsQ0FBQztZQUVILGtCQUFRLENBQUMsZ0NBQWdDLEVBQUU7Z0JBQ3pDO29CQUFBQTtvQkFJQUMsQ0FBQ0E7b0JBSENELGtDQUFhQSxHQUFiQSxVQUFjQSxTQUFrQkEsRUFBRUEsS0FBNEJBLEVBQUVBLEtBQXlCQTt3QkFDdkZHLE1BQU1BLENBQUNBLElBQUlBLENBQUNBO29CQUNkQSxDQUFDQTtvQkFDSEgsaUJBQUNBO2dCQUFEQSxDQUFDQSxBQUpELElBSUM7Z0JBRUQsNkJBQW1CLENBQUMsY0FBTSxPQUFBLENBQUMsVUFBVSxDQUFDLEVBQVosQ0FBWSxDQUFDLENBQUM7Z0JBRXhDLFlBQUUsQ0FBQyxPQUFPLEVBQ1IsbUJBQVMsQ0FBQyxnQkFBTSxDQUFDLENBQUMsY0FBTSxFQUFFLDhCQUFvQixFQUFFLGlCQUFRLENBQUMsRUFBRSxVQUFDLE1BQWEsRUFBRSxHQUF3QixFQUFFLFFBQWlCO29CQUNwSCxJQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUM3QyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBRWpCLE1BQU0sQ0FBQyxXQUFXLENBQUM7d0JBQ2pCLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFO3FCQUN0RSxDQUFDLENBQUM7b0JBRUgsTUFBTSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFDakMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUNqQixnQkFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFFNUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFDakMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUNqQixnQkFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDOUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1QsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILGtCQUFRLENBQUMsd0NBQXdDLEVBQUU7WUFDakQsNkJBQW1CLENBQUMsY0FBTSxPQUFBO2dCQUN4QixFQUFDLE9BQU8sRUFBRSxlQUFlLEVBQUUsUUFBUSxFQUFFLFVBQUMsQ0FBUyxFQUFFLENBQXdCLEVBQUUsQ0FBcUI7d0JBQzlGLE1BQU0sQ0FBQyxPQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ25CLENBQUMsRUFBQzthQUNILEVBSnlCLENBSXpCLENBQUMsQ0FBQztZQUVILFlBQUUsQ0FBQyxPQUFPLEVBQ1IsbUJBQVMsQ0FBQyxnQkFBTSxDQUFDLENBQUMsY0FBTSxFQUFFLDhCQUFvQixFQUFFLGlCQUFRLENBQUMsRUFBRSxVQUFDLE1BQWEsRUFBRSxHQUF3QixFQUFFLFFBQWlCO2dCQUNwSCxJQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUM3QyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBRWpCLE1BQU0sQ0FBQyxXQUFXLENBQUM7b0JBQ2pCLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxDQUFDLGVBQWUsQ0FBQyxFQUFFO2lCQUMzRSxDQUFDLENBQUM7Z0JBRUgsTUFBTSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDakMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNqQixnQkFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFFNUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDakMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNqQixnQkFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUM5QyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDVCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsa0JBQVEsQ0FBQyxrQkFBa0IsRUFBRTtRQUMzQixZQUFFLENBQUMsNkRBQTZELEVBQzlELG1CQUFTLENBQUMsZ0JBQU0sQ0FBQyxDQUFDLGNBQU0sRUFBRSw4QkFBb0IsRUFBRSxpQkFBUSxDQUFDLEVBQUUsVUFBQyxNQUFhLEVBQUUsR0FBd0IsRUFBRSxRQUFpQjtZQUN0SCxJQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzdDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUVqQixNQUFNLENBQUMsV0FBVyxDQUFDO2dCQUNqQixFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUU7d0JBQ2hELEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRTtnQ0FDakQsRUFBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUM7Z0NBQ3RDLEVBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFDOzZCQUNoQyxFQUFFO3FCQUNKLEVBQUU7YUFDSixDQUFDLENBQUM7WUFFSCxNQUFNLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ3RDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNqQixnQkFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUVqRCxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDckUsZ0JBQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRTNDLE1BQU0sQ0FBQyxhQUFhLENBQUMsc0JBQXNCLENBQUMsQ0FBQztZQUM3QyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDakIsZ0JBQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQztZQUN4RCxnQkFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRUwsWUFBRSxDQUFDLGlGQUFpRixFQUNsRixtQkFBUyxDQUFDLGdCQUFNLENBQUMsQ0FBQyxjQUFNLEVBQUUsOEJBQW9CLEVBQUUsaUJBQVEsQ0FBQyxFQUFFLFVBQUMsTUFBYSxFQUFFLEdBQXdCLEVBQUUsUUFBaUI7WUFDdEgsSUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM3QyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFakIsTUFBTSxDQUFDLFdBQVcsQ0FBQztnQkFDakIsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFO3dCQUNoRCxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLHNCQUFzQixFQUFFLFFBQVEsRUFBRTtnQ0FDM0QsRUFBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUM7Z0NBQ3RDLEVBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFDOzZCQUNoQyxFQUFFO3FCQUNKLEVBQUU7YUFDSixDQUFDLENBQUM7WUFFSCxNQUFNLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ3RDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNqQixnQkFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUVqRCxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDL0UsZ0JBQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRTNDLE1BQU0sQ0FBQyxhQUFhLENBQUMsc0JBQXNCLENBQUMsQ0FBQztZQUM3QyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDakIsZ0JBQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQztZQUN4RCxnQkFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRUwsWUFBRSxDQUFDLDhEQUE4RCxFQUMvRCxtQkFBUyxDQUFDLGdCQUFNLENBQUMsQ0FBQyxjQUFNLEVBQUUsOEJBQW9CLEVBQUUsaUJBQVEsQ0FBQyxFQUFFLFVBQUMsTUFBYSxFQUFFLEdBQXdCLEVBQUUsUUFBaUI7WUFDcEgsSUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM3QyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFakIsTUFBTSxDQUFDLFdBQVcsQ0FBQztnQkFDakIsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFO3dCQUNoRCxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUU7Z0NBQ2pELEVBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFDO2dDQUN0QyxFQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBQzs2QkFDaEMsRUFBRTtxQkFDSixFQUFFO2FBQ0osQ0FBQyxDQUFDO1lBRUgsTUFBTSxDQUFDLGFBQWEsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO1lBQ2xELE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNqQixnQkFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO1lBRTdELElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNyRSxnQkFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFM0MsTUFBTSxDQUFDLGFBQWEsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1lBQzdDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNqQixnQkFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1lBQ3hELGdCQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM3QyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFVCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsc0JBQXNCLE1BQWMsRUFBRSxLQUFZO0lBQ2hESSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxNQUFNQSxFQUFFQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQTtRQUN2Q0EsZ0JBQU1BLENBQU9BLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLFdBQVlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO1FBQ2pFQSxnQkFBTUEsQ0FBT0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBRUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFDakRBLENBQUNBO0FBQ0hBLENBQUNBO0FBRUQ7SUFBQUM7SUFLcUJDLENBQUNBO0lBTHRCRDtRQUFDQSxnQkFBU0EsQ0FBQ0E7WUFDVEEsUUFBUUEsRUFBRUEsVUFBVUE7WUFDcEJBLFFBQVFBLEVBQUVBLDRDQUEwQ0E7WUFDcERBLFVBQVVBLEVBQUVBLHlCQUFpQkE7U0FDOUJBLENBQUNBOztzQkFDb0JBO0lBQURBLG9CQUFDQTtBQUFEQSxDQUFDQSxBQUx0QixJQUtzQjtBQUV0QjtJQUFBRTtJQUt1QkMsQ0FBQ0E7SUFMeEJEO1FBQUNBLGdCQUFTQSxDQUFDQTtZQUNUQSxRQUFRQSxFQUFFQSxVQUFVQTtZQUNwQkEsUUFBUUEsRUFBRUEsaUZBQStFQTtZQUN6RkEsVUFBVUEsRUFBRUEseUJBQWlCQTtTQUM5QkEsQ0FBQ0E7O3dCQUNzQkE7SUFBREEsc0JBQUNBO0FBQURBLENBQUNBLEFBTHhCLElBS3dCO0FBRXhCO0lBT0VFLHNCQUFZQSxLQUFxQkE7UUFFL0JDLElBQUlBLENBQUNBLEtBQUtBLEdBQVNBLEtBQUtBLENBQUNBLFFBQVFBLENBQUNBLE1BQU9BLENBQUNBLEtBQUtBLEtBQUtBLE9BQU9BLENBQUNBO0lBQzlEQSxDQUFDQTtJQVZIRDtRQUFDQSxnQkFBU0EsQ0FBQ0E7WUFDVEEsUUFBUUEsRUFBRUEsVUFBVUE7WUFDcEJBLFFBQVFBLEVBQUVBLDZJQUF1SUE7WUFDakpBLFVBQVVBLEVBQUVBLHlCQUFpQkE7U0FDOUJBLENBQUNBOztxQkFPREE7SUFBREEsbUJBQUNBO0FBQURBLENBQUNBLEFBWEQsSUFXQztBQUVEO0lBQUFFO0lBTUFDLENBQUNBO0lBTkREO1FBQUNBLGdCQUFTQSxDQUFDQTtZQUNUQSxRQUFRQSxFQUFFQSxVQUFVQTtZQUNwQkEsUUFBUUEsRUFBRUEsMkhBQXVIQTtZQUNqSUEsVUFBVUEsRUFBRUEseUJBQWlCQTtTQUM5QkEsQ0FBQ0E7OytCQUVEQTtJQUFEQSw2QkFBQ0E7QUFBREEsQ0FBQ0EsQUFORCxJQU1DO0FBRUQ7SUFBQUU7SUFLdUJDLENBQUNBO0lBTHhCRDtRQUFDQSxnQkFBU0EsQ0FBQ0E7WUFDVEEsUUFBUUEsRUFBRUEsVUFBVUE7WUFDcEJBLFFBQVFBLEVBQUVBLDRDQUEwQ0E7WUFDcERBLFVBQVVBLEVBQUVBLHlCQUFpQkE7U0FDOUJBLENBQUNBOzt3QkFDc0JBO0lBQURBLHNCQUFDQTtBQUFEQSxDQUFDQSxBQUx4QixJQUt3QjtBQUV4QjtJQUFBRTtJQUtzQ0MsQ0FBQ0E7SUFMdkNEO1FBQUNBLGdCQUFTQSxDQUFDQTtZQUNUQSxRQUFRQSxFQUFFQSxVQUFVQTtZQUNwQkEsUUFBUUEsRUFBRUEsc0ZBQWdGQTtZQUMxRkEsVUFBVUEsRUFBRUEseUJBQWlCQTtTQUM5QkEsQ0FBQ0E7O3VDQUNxQ0E7SUFBREEscUNBQUNBO0FBQURBLENBQUNBLEFBTHZDLElBS3VDO0FBRXZDO0lBQUFFO0lBTUFDLENBQUNBO0lBTkREO1FBQUNBLGdCQUFTQSxDQUFDQTtZQUNUQSxRQUFRQSxFQUFFQSxZQUFZQTtZQUN0QkEsUUFBUUEsRUFBRUEsUUFBUUE7WUFDbEJBLFVBQVVBLEVBQUVBLHlCQUFpQkE7U0FDOUJBLENBQUNBOztrQkFFREE7SUFBREEsZ0JBQUNBO0FBQURBLENBQUNBLEFBTkQsSUFNQztBQUVEO0lBQUFFO0lBTUFDLENBQUNBO0lBTkREO1FBQUNBLGdCQUFTQSxDQUFDQTtZQUNUQSxRQUFRQSxFQUFFQSxXQUFXQTtZQUNyQkEsUUFBUUEsRUFBRUEsRUFBRUE7WUFDWkEsVUFBVUEsRUFBRUEseUJBQWlCQTtTQUM5QkEsQ0FBQ0E7O2lCQUVEQTtJQUFEQSxlQUFDQTtBQUFEQSxDQUFDQSxBQU5ELElBTUM7QUFFRDtJQVNFRSxpQkFBbUJBLEtBQXFCQTtRQVQxQ0MsaUJBYUNBO1FBSm9CQSxVQUFLQSxHQUFMQSxLQUFLQSxDQUFnQkE7UUFGeENBLG1CQUFjQSxHQUFhQSxFQUFFQSxDQUFDQTtRQUc1QkEsSUFBSUEsQ0FBQ0EsRUFBRUEsR0FBR0EsS0FBS0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsVUFBQUEsQ0FBQ0EsSUFBSUEsT0FBQUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBUEEsQ0FBT0EsQ0FBQ0EsQ0FBQ0E7UUFDekNBLEtBQUtBLENBQUNBLE1BQU1BLENBQUNBLE9BQU9BLENBQUNBLFVBQUFBLENBQUNBLElBQUlBLE9BQUFBLEtBQUlBLENBQUNBLGNBQWNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLEVBQTNCQSxDQUEyQkEsQ0FBQ0EsQ0FBQ0E7SUFDekRBLENBQUNBO0lBWkhEO1FBQUNBLGdCQUFTQSxDQUFDQTtZQUNUQSxRQUFRQSxFQUFFQSxVQUFVQTtZQUNwQkEsUUFBUUEsRUFBRUEsZ0hBQThHQTtZQUN4SEEsVUFBVUEsRUFBRUEseUJBQWlCQTtTQUM5QkEsQ0FBQ0E7O2dCQVNEQTtJQUFEQSxjQUFDQTtBQUFEQSxDQUFDQSxBQWJELElBYUM7QUFFRDtJQVNFRSxpQkFBWUEsS0FBcUJBO1FBVG5DQyxpQkFhQ0E7UUFOQ0EsbUJBQWNBLEdBQWFBLEVBQUVBLENBQUNBO1FBRzVCQSxJQUFJQSxDQUFDQSxJQUFJQSxHQUFHQSxLQUFLQSxDQUFDQSxNQUFNQSxDQUFDQSxHQUFHQSxDQUFDQSxVQUFBQSxDQUFDQSxJQUFJQSxPQUFBQSxDQUFDQSxDQUFDQSxNQUFNQSxDQUFDQSxFQUFUQSxDQUFTQSxDQUFDQSxDQUFDQTtRQUM3Q0EsS0FBS0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsVUFBQUEsQ0FBQ0EsSUFBSUEsT0FBQUEsS0FBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBM0JBLENBQTJCQSxDQUFDQSxDQUFDQTtJQUN6REEsQ0FBQ0E7SUFaSEQ7UUFBQ0EsZ0JBQVNBLENBQUNBO1lBQ1RBLFFBQVFBLEVBQUVBLFVBQVVBO1lBQ3BCQSxRQUFRQSxFQUFFQSx1QkFBdUJBO1lBQ2pDQSxVQUFVQSxFQUFFQSxDQUFDQSx5QkFBaUJBLENBQUNBO1NBQ2hDQSxDQUFDQTs7Z0JBU0RBO0lBQURBLGNBQUNBO0FBQURBLENBQUNBLEFBYkQsSUFhQztBQUVEO0lBU0VFLG1DQUFZQSxNQUFjQTtRQUN4QkMsSUFBSUEsQ0FBQ0EsSUFBSUEsR0FBR0EsTUFBTUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsV0FBV0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsVUFBQUEsQ0FBQ0EsSUFBSUEsT0FBQUEsQ0FBQ0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsRUFBVEEsQ0FBU0EsQ0FBQ0EsQ0FBQ0E7UUFDL0RBLElBQUlBLENBQUNBLFFBQVFBLEdBQUdBLE1BQU1BLENBQUNBLFdBQVdBLENBQUNBLFFBQVFBLENBQUNBO0lBQzlDQSxDQUFDQTtJQVpIRDtRQUFDQSxnQkFBU0EsQ0FBQ0E7WUFDVEEsUUFBUUEsRUFBRUEsV0FBV0E7WUFDckJBLFFBQVFBLEVBQUVBLHdEQUF3REE7WUFDbEVBLFVBQVVBLEVBQUVBLENBQUNBLHlCQUFpQkEsQ0FBQ0E7U0FDaENBLENBQUNBOztrQ0FTREE7SUFBREEsZ0NBQUNBO0FBQURBLENBQUNBLEFBYkQsSUFhQztBQUVEO0lBQUFFO0lBS2VDLENBQUNBO0lBTGhCRDtRQUFDQSxnQkFBU0EsQ0FBQ0E7WUFDVEEsUUFBUUEsRUFBRUEsVUFBVUE7WUFDcEJBLFFBQVFBLEVBQUVBLGlDQUFpQ0E7WUFDM0NBLFVBQVVBLEVBQUVBLENBQUNBLHlCQUFpQkEsQ0FBQ0E7U0FDaENBLENBQUNBOztnQkFDY0E7SUFBREEsY0FBQ0E7QUFBREEsQ0FBQ0EsQUFMaEIsSUFLZ0I7QUFFaEI7SUFBQUU7SUFLNkJDLENBQUNBO0lBTDlCRDtRQUFDQSxnQkFBU0EsQ0FBQ0E7WUFDVEEsUUFBUUEsRUFBRUEsVUFBVUE7WUFDcEJBLFFBQVFBLEVBQUVBLGtHQUFnR0E7WUFDMUdBLFVBQVVBLEVBQUVBLENBQUNBLHlCQUFpQkEsQ0FBQ0E7U0FDaENBLENBQUNBOzs4QkFDNEJBO0lBQURBLDRCQUFDQTtBQUFEQSxDQUFDQSxBQUw5QixJQUs4QjtBQUU5QixpQkFBaUIsT0FBOEI7SUFDN0NFLGNBQUlBLEVBQUVBLENBQUNBO0lBQ1BBLE9BQU9BLENBQUNBLGFBQWFBLEVBQUVBLENBQUNBO0FBQzFCQSxDQUFDQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9uZW50LCBJbmplY3Rvcn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7XHJcbiAgZGVzY3JpYmUsXHJcbiAgZGRlc2NyaWJlLFxyXG4gIHhkZXNjcmliZSxcclxuICBpdCxcclxuICBpaXQsXHJcbiAgeGl0LFxyXG4gIGV4cGVjdCxcclxuICBiZWZvcmVFYWNoLFxyXG4gIGJlZm9yZUVhY2hQcm92aWRlcnMsXHJcbiAgaW5qZWN0LFxyXG4gIGZha2VBc3luYyxcclxuICB0aWNrXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZS90ZXN0aW5nJztcclxuXHJcbmltcG9ydCB7VGVzdENvbXBvbmVudEJ1aWxkZXIsIENvbXBvbmVudEZpeHR1cmV9IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyL3Rlc3RpbmcnO1xyXG5pbXBvcnQgeyBDb21wb25lbnRSZXNvbHZlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBMb2NhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7IFNweUxvY2F0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL3Rlc3RpbmcnO1xyXG5pbXBvcnQgeyBVcmxTZXJpYWxpemVyLCBEZWZhdWx0VXJsU2VyaWFsaXplciwgUm91dGVyT3V0bGV0TWFwLCBSb3V0ZXIsIEFjdGl2YXRlZFJvdXRlLCBST1VURVJfRElSRUNUSVZFUywgUGFyYW1zLFxyXG4gIFJvdXRlclN0YXRlU25hcHNob3QsIEFjdGl2YXRlZFJvdXRlU25hcHNob3QsIENhbkFjdGl2YXRlLCBDYW5EZWFjdGl2YXRlLCBFdmVudCwgTmF2aWdhdGlvblN0YXJ0LCBOYXZpZ2F0aW9uRW5kLCBOYXZpZ2F0aW9uQ2FuY2VsLCBOYXZpZ2F0aW9uRXJyb3IsIFJvdXRlc1JlY29nbml6ZWQsIFJvdXRlckNvbmZpZyB9IGZyb20gJy4uL3NyYy9pbmRleCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzL09ic2VydmFibGUnO1xyXG5pbXBvcnQgJ3J4anMvYWRkL29wZXJhdG9yL21hcCc7XHJcbmltcG9ydCB7b2Z9IGZyb20gJ3J4anMvb2JzZXJ2YWJsZS9vZic7XHJcblxyXG5kZXNjcmliZShcIkludGVncmF0aW9uXCIsICgpID0+IHtcclxuXHJcbiAgYmVmb3JlRWFjaFByb3ZpZGVycygoKSA9PiB7XHJcbiAgICBsZXQgY29uZmlnOiBSb3V0ZXJDb25maWcgPSBbXHJcbiAgICAgIHsgcGF0aDogJycsIGNvbXBvbmVudDogQmxhbmtDbXAgfSxcclxuICAgICAgeyBwYXRoOiAnc2ltcGxlJywgY29tcG9uZW50OiBTaW1wbGVDbXAgfVxyXG4gICAgXTtcclxuXHJcbiAgICByZXR1cm4gW1xyXG4gICAgICBSb3V0ZXJPdXRsZXRNYXAsXHJcbiAgICAgIHtwcm92aWRlOiBVcmxTZXJpYWxpemVyLCB1c2VDbGFzczogRGVmYXVsdFVybFNlcmlhbGl6ZXJ9LFxyXG4gICAgICB7cHJvdmlkZTogTG9jYXRpb24sIHVzZUNsYXNzOiBTcHlMb2NhdGlvbn0sXHJcbiAgICAgIHtcclxuICAgICAgICBwcm92aWRlOiBSb3V0ZXIsXHJcbiAgICAgICAgdXNlRmFjdG9yeTogKHJlc29sdmVyOkNvbXBvbmVudFJlc29sdmVyLCB1cmxTZXJpYWxpemVyOlVybFNlcmlhbGl6ZXIsIG91dGxldE1hcDpSb3V0ZXJPdXRsZXRNYXAsIGxvY2F0aW9uOkxvY2F0aW9uLCBpbmplY3RvcjpJbmplY3RvcikgPT4ge1xyXG4gICAgICAgICAgY29uc3QgciA9IG5ldyBSb3V0ZXIoUm9vdENtcCwgcmVzb2x2ZXIsIHVybFNlcmlhbGl6ZXIsIG91dGxldE1hcCwgbG9jYXRpb24sIGluamVjdG9yLCBjb25maWcpO1xyXG4gICAgICAgICAgci5pbml0aWFsTmF2aWdhdGlvbigpO1xyXG4gICAgICAgICAgcmV0dXJuIHI7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZXBzOiBbQ29tcG9uZW50UmVzb2x2ZXIsIFVybFNlcmlhbGl6ZXIsIFJvdXRlck91dGxldE1hcCwgTG9jYXRpb24sIEluamVjdG9yXVxyXG4gICAgICB9LFxyXG4gICAgICB7cHJvdmlkZTogQWN0aXZhdGVkUm91dGUsIHVzZUZhY3Rvcnk6IChyOlJvdXRlcikgPT4gci5yb3V0ZXJTdGF0ZS5yb290LCBkZXBzOiBbUm91dGVyXX0sXHJcbiAgICBdO1xyXG4gIH0pO1xyXG5cclxuICBpdCgnc2hvdWxkIG5hdmlnYXRlIHdpdGggYSBwcm92aWRlZCBjb25maWcnLFxyXG4gICAgZmFrZUFzeW5jKGluamVjdChbUm91dGVyLCBUZXN0Q29tcG9uZW50QnVpbGRlciwgTG9jYXRpb25dLCAocm91dGVyOlJvdXRlciwgdGNiOlRlc3RDb21wb25lbnRCdWlsZGVyLCBsb2NhdGlvbjpMb2NhdGlvbikgPT4ge1xyXG4gICAgICBjb25zdCBmaXh0dXJlID0gdGNiLmNyZWF0ZUZha2VBc3luYyhSb290Q21wKTtcclxuICAgICAgYWR2YW5jZShmaXh0dXJlKTtcclxuXHJcbiAgICAgIHJvdXRlci5uYXZpZ2F0ZUJ5VXJsKCcvc2ltcGxlJyk7XHJcbiAgICAgIGFkdmFuY2UoZml4dHVyZSk7XHJcblxyXG4gICAgICBleHBlY3QobG9jYXRpb24ucGF0aCgpKS50b0VxdWFsKCcvc2ltcGxlJyk7XHJcbiAgICB9KSkpO1xyXG5cclxuXHJcbiAgaXQoJ3Nob3VsZCB1cGRhdGUgbG9jYXRpb24gd2hlbiBuYXZpZ2F0aW5nJyxcclxuICAgIGZha2VBc3luYyhpbmplY3QoW1JvdXRlciwgVGVzdENvbXBvbmVudEJ1aWxkZXIsIExvY2F0aW9uXSwgKHJvdXRlcjpSb3V0ZXIsIHRjYjpUZXN0Q29tcG9uZW50QnVpbGRlciwgbG9jYXRpb246TG9jYXRpb24pID0+IHtcclxuICAgICAgY29uc3QgZml4dHVyZSA9IHRjYi5jcmVhdGVGYWtlQXN5bmMoUm9vdENtcCk7XHJcbiAgICAgIGFkdmFuY2UoZml4dHVyZSk7XHJcblxyXG4gICAgICByb3V0ZXIucmVzZXRDb25maWcoW1xyXG4gICAgICAgIHsgcGF0aDogJ3RlYW0vOmlkJywgY29tcG9uZW50OiBUZWFtQ21wIH1cclxuICAgICAgXSk7XHJcblxyXG4gICAgICByb3V0ZXIubmF2aWdhdGVCeVVybCgnL3RlYW0vMjInKTtcclxuICAgICAgYWR2YW5jZShmaXh0dXJlKTtcclxuICAgICAgZXhwZWN0KGxvY2F0aW9uLnBhdGgoKSkudG9FcXVhbCgnL3RlYW0vMjInKTtcclxuXHJcbiAgICAgIHJvdXRlci5uYXZpZ2F0ZUJ5VXJsKCcvdGVhbS8zMycpO1xyXG4gICAgICBhZHZhbmNlKGZpeHR1cmUpO1xyXG5cclxuICAgICAgZXhwZWN0KGxvY2F0aW9uLnBhdGgoKSkudG9FcXVhbCgnL3RlYW0vMzMnKTtcclxuICAgIH0pKSk7XHJcblxyXG4gIGl0KCdzaG91bGQgbmF2aWdhdGUgYmFjayBhbmQgZm9yd2FyZCcsXHJcbiAgICBmYWtlQXN5bmMoaW5qZWN0KFtSb3V0ZXIsIFRlc3RDb21wb25lbnRCdWlsZGVyLCBMb2NhdGlvbl0sIChyb3V0ZXI6Um91dGVyLCB0Y2I6VGVzdENvbXBvbmVudEJ1aWxkZXIsIGxvY2F0aW9uOkxvY2F0aW9uKSA9PiB7XHJcbiAgICAgIGNvbnN0IGZpeHR1cmUgPSB0Y2IuY3JlYXRlRmFrZUFzeW5jKFJvb3RDbXApO1xyXG4gICAgICBhZHZhbmNlKGZpeHR1cmUpO1xyXG5cclxuICAgICAgcm91dGVyLnJlc2V0Q29uZmlnKFtcclxuICAgICAgICB7IHBhdGg6ICd0ZWFtLzppZCcsIGNvbXBvbmVudDogVGVhbUNtcCwgY2hpbGRyZW46IFtcclxuICAgICAgICAgIHsgcGF0aDogJ3NpbXBsZScsIGNvbXBvbmVudDogU2ltcGxlQ21wIH0sXHJcbiAgICAgICAgICB7IHBhdGg6ICd1c2VyLzpuYW1lJywgY29tcG9uZW50OiBVc2VyQ21wIH1cclxuICAgICAgICBdIH1cclxuICAgICAgXSk7XHJcblxyXG5cclxuICAgICAgcm91dGVyLm5hdmlnYXRlQnlVcmwoJy90ZWFtLzMzL3NpbXBsZScpO1xyXG4gICAgICBhZHZhbmNlKGZpeHR1cmUpO1xyXG4gICAgICBleHBlY3QobG9jYXRpb24ucGF0aCgpKS50b0VxdWFsKCcvdGVhbS8zMy9zaW1wbGUnKTtcclxuXHJcbiAgICAgIHJvdXRlci5uYXZpZ2F0ZUJ5VXJsKCcvdGVhbS8yMi91c2VyL3ZpY3RvcicpO1xyXG4gICAgICBhZHZhbmNlKGZpeHR1cmUpO1xyXG5cclxuICAgICAgbG9jYXRpb24uYmFjaygpO1xyXG4gICAgICBhZHZhbmNlKGZpeHR1cmUpO1xyXG4gICAgICBleHBlY3QobG9jYXRpb24ucGF0aCgpKS50b0VxdWFsKCcvdGVhbS8zMy9zaW1wbGUnKTtcclxuXHJcbiAgICAgIGxvY2F0aW9uLmZvcndhcmQoKTtcclxuICAgICAgYWR2YW5jZShmaXh0dXJlKTtcclxuICAgICAgZXhwZWN0KGxvY2F0aW9uLnBhdGgoKSkudG9FcXVhbCgnL3RlYW0vMjIvdXNlci92aWN0b3InKTtcclxuICAgIH0pKSk7XHJcblxyXG4gIGl0KCdzaG91bGQgbmF2aWdhdGUgd2hlbiBsb2NhdGlvbnMgY2hhbmdlcycsXHJcbiAgICBmYWtlQXN5bmMoaW5qZWN0KFtSb3V0ZXIsIFRlc3RDb21wb25lbnRCdWlsZGVyLCBMb2NhdGlvbl0sIChyb3V0ZXI6Um91dGVyLCB0Y2I6VGVzdENvbXBvbmVudEJ1aWxkZXIsIGxvY2F0aW9uOkxvY2F0aW9uKSA9PiB7XHJcbiAgICAgIGNvbnN0IGZpeHR1cmUgPSB0Y2IuY3JlYXRlRmFrZUFzeW5jKFJvb3RDbXApO1xyXG4gICAgICBhZHZhbmNlKGZpeHR1cmUpO1xyXG5cclxuICAgICAgcm91dGVyLnJlc2V0Q29uZmlnKFtcclxuICAgICAgICB7IHBhdGg6ICd0ZWFtLzppZCcsIGNvbXBvbmVudDogVGVhbUNtcCwgY2hpbGRyZW46IFtcclxuICAgICAgICAgIHsgcGF0aDogJ3VzZXIvOm5hbWUnLCBjb21wb25lbnQ6IFVzZXJDbXAgfVxyXG4gICAgICAgIF0gfVxyXG4gICAgICBdKTtcclxuXHJcbiAgICAgIHJvdXRlci5uYXZpZ2F0ZUJ5VXJsKCcvdGVhbS8yMi91c2VyL3ZpY3RvcicpO1xyXG4gICAgICBhZHZhbmNlKGZpeHR1cmUpO1xyXG5cclxuICAgICAgKDxhbnk+bG9jYXRpb24pLnNpbXVsYXRlSGFzaENoYW5nZShcIi90ZWFtLzIyL3VzZXIvZmVkb3JcIik7XHJcbiAgICAgIGFkdmFuY2UoZml4dHVyZSk7XHJcblxyXG4gICAgICBleHBlY3QoZml4dHVyZS5kZWJ1Z0VsZW1lbnQubmF0aXZlRWxlbWVudCkudG9IYXZlVGV4dCgndGVhbSAyMiB7IHVzZXIgZmVkb3IsIHJpZ2h0OiAgfScpO1xyXG4gICAgfSkpKTtcclxuXHJcbiAgaXQoJ3Nob3VsZCB1cGRhdGUgdGhlIGxvY2F0aW9uIHdoZW4gdGhlIG1hdGNoZWQgcm91dGUgZG9lcyBub3QgY2hhbmdlJyxcclxuICAgIGZha2VBc3luYyhpbmplY3QoW1JvdXRlciwgVGVzdENvbXBvbmVudEJ1aWxkZXIsIExvY2F0aW9uXSwgKHJvdXRlcjpSb3V0ZXIsIHRjYjpUZXN0Q29tcG9uZW50QnVpbGRlciwgbG9jYXRpb246TG9jYXRpb24pID0+IHtcclxuICAgICAgY29uc3QgZml4dHVyZSA9IHRjYi5jcmVhdGVGYWtlQXN5bmMoUm9vdENtcCk7XHJcbiAgICAgIGFkdmFuY2UoZml4dHVyZSk7XHJcblxyXG4gICAgICByb3V0ZXIucmVzZXRDb25maWcoW1xyXG4gICAgICAgIHsgcGF0aDogJyoqJywgY29tcG9uZW50OiBTaW1wbGVDbXAgfVxyXG4gICAgICBdKTtcclxuXHJcbiAgICAgIHJvdXRlci5uYXZpZ2F0ZUJ5VXJsKCcvb25lL3R3bycpO1xyXG4gICAgICBhZHZhbmNlKGZpeHR1cmUpO1xyXG4gICAgICBleHBlY3QobG9jYXRpb24ucGF0aCgpKS50b0VxdWFsKCcvb25lL3R3bycpO1xyXG4gICAgICBleHBlY3QoZml4dHVyZS5kZWJ1Z0VsZW1lbnQubmF0aXZlRWxlbWVudCkudG9IYXZlVGV4dCgnc2ltcGxlJyk7XHJcblxyXG4gICAgICByb3V0ZXIubmF2aWdhdGVCeVVybCgnL3RocmVlL2ZvdXInKTtcclxuICAgICAgYWR2YW5jZShmaXh0dXJlKTtcclxuICAgICAgZXhwZWN0KGxvY2F0aW9uLnBhdGgoKSkudG9FcXVhbCgnL3RocmVlL2ZvdXInKTtcclxuICAgICAgZXhwZWN0KGZpeHR1cmUuZGVidWdFbGVtZW50Lm5hdGl2ZUVsZW1lbnQpLnRvSGF2ZVRleHQoJ3NpbXBsZScpO1xyXG4gICAgfSkpKTtcclxuXHJcbiAgaXQoJ3Nob3VsZCBzdXBwb3J0IHNlY29uZGFyeSByb3V0ZXMnLFxyXG4gICAgZmFrZUFzeW5jKGluamVjdChbUm91dGVyLCBUZXN0Q29tcG9uZW50QnVpbGRlcl0sIChyb3V0ZXI6Um91dGVyLCB0Y2I6VGVzdENvbXBvbmVudEJ1aWxkZXIpID0+IHtcclxuICAgICAgY29uc3QgZml4dHVyZSA9IHRjYi5jcmVhdGVGYWtlQXN5bmMoUm9vdENtcCk7XHJcbiAgICAgIGFkdmFuY2UoZml4dHVyZSk7XHJcblxyXG4gICAgICByb3V0ZXIucmVzZXRDb25maWcoW1xyXG4gICAgICAgIHsgcGF0aDogJ3RlYW0vOmlkJywgY29tcG9uZW50OiBUZWFtQ21wLCBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgeyBwYXRoOiAndXNlci86bmFtZScsIGNvbXBvbmVudDogVXNlckNtcCB9LFxyXG4gICAgICAgICAgeyBwYXRoOiAnc2ltcGxlJywgY29tcG9uZW50OiBTaW1wbGVDbXAsIG91dGxldDogJ3JpZ2h0JyB9XHJcbiAgICAgICAgXSB9XHJcbiAgICAgIF0pO1xyXG5cclxuICAgICAgcm91dGVyLm5hdmlnYXRlQnlVcmwoJy90ZWFtLzIyLyh1c2VyL3ZpY3Rvci8vcmlnaHQ6c2ltcGxlKScpO1xyXG4gICAgICBhZHZhbmNlKGZpeHR1cmUpO1xyXG5cclxuICAgICAgZXhwZWN0KGZpeHR1cmUuZGVidWdFbGVtZW50Lm5hdGl2ZUVsZW1lbnQpXHJcbiAgICAgICAgLnRvSGF2ZVRleHQoJ3RlYW0gMjIgeyB1c2VyIHZpY3RvciwgcmlnaHQ6IHNpbXBsZSB9Jyk7XHJcbiAgICB9KSkpO1xyXG5cclxuICBpdCgnc2hvdWxkIGRlYWN0aXZhdGUgb3V0bGV0cycsXHJcbiAgICBmYWtlQXN5bmMoaW5qZWN0KFtSb3V0ZXIsIFRlc3RDb21wb25lbnRCdWlsZGVyXSwgKHJvdXRlcjpSb3V0ZXIsIHRjYjpUZXN0Q29tcG9uZW50QnVpbGRlcikgPT4ge1xyXG4gICAgICBjb25zdCBmaXh0dXJlID0gdGNiLmNyZWF0ZUZha2VBc3luYyhSb290Q21wKTtcclxuICAgICAgYWR2YW5jZShmaXh0dXJlKTtcclxuXHJcbiAgICAgIHJvdXRlci5yZXNldENvbmZpZyhbXHJcbiAgICAgICAgeyBwYXRoOiAndGVhbS86aWQnLCBjb21wb25lbnQ6IFRlYW1DbXAsIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICB7IHBhdGg6ICd1c2VyLzpuYW1lJywgY29tcG9uZW50OiBVc2VyQ21wIH0sXHJcbiAgICAgICAgICB7IHBhdGg6ICdzaW1wbGUnLCBjb21wb25lbnQ6IFNpbXBsZUNtcCwgb3V0bGV0OiAncmlnaHQnIH1cclxuICAgICAgICBdIH1cclxuICAgICAgXSk7XHJcblxyXG4gICAgICByb3V0ZXIubmF2aWdhdGVCeVVybCgnL3RlYW0vMjIvKHVzZXIvdmljdG9yLy9yaWdodDpzaW1wbGUpJyk7XHJcbiAgICAgIGFkdmFuY2UoZml4dHVyZSk7XHJcblxyXG4gICAgICByb3V0ZXIubmF2aWdhdGVCeVVybCgnL3RlYW0vMjIvdXNlci92aWN0b3InKTtcclxuICAgICAgYWR2YW5jZShmaXh0dXJlKTtcclxuXHJcbiAgICAgIGV4cGVjdChmaXh0dXJlLmRlYnVnRWxlbWVudC5uYXRpdmVFbGVtZW50KS50b0hhdmVUZXh0KCd0ZWFtIDIyIHsgdXNlciB2aWN0b3IsIHJpZ2h0OiAgfScpO1xyXG4gICAgfSkpKTtcclxuXHJcbiAgaXQoJ3Nob3VsZCBkZWFjdGl2YXRlIG5lc3RlZCBvdXRsZXRzJyxcclxuICAgIGZha2VBc3luYyhpbmplY3QoW1JvdXRlciwgVGVzdENvbXBvbmVudEJ1aWxkZXJdLCAocm91dGVyOlJvdXRlciwgdGNiOlRlc3RDb21wb25lbnRCdWlsZGVyKSA9PiB7XHJcbiAgICAgIGNvbnN0IGZpeHR1cmUgPSB0Y2IuY3JlYXRlRmFrZUFzeW5jKFJvb3RDbXApO1xyXG4gICAgICBhZHZhbmNlKGZpeHR1cmUpO1xyXG5cclxuICAgICAgcm91dGVyLnJlc2V0Q29uZmlnKFtcclxuICAgICAgICB7IHBhdGg6ICd0ZWFtLzppZCcsIGNvbXBvbmVudDogVGVhbUNtcCwgY2hpbGRyZW46IFtcclxuICAgICAgICAgIHsgcGF0aDogJ3VzZXIvOm5hbWUnLCBjb21wb25lbnQ6IFVzZXJDbXAgfSxcclxuICAgICAgICAgIHsgcGF0aDogJ3NpbXBsZScsIGNvbXBvbmVudDogU2ltcGxlQ21wLCBvdXRsZXQ6ICdyaWdodCcgfVxyXG4gICAgICAgIF0gfSxcclxuICAgICAgICB7IHBhdGg6ICcnLCBjb21wb25lbnQ6IEJsYW5rQ21wfVxyXG4gICAgICBdKTtcclxuXHJcbiAgICAgIHJvdXRlci5uYXZpZ2F0ZUJ5VXJsKCcvdGVhbS8yMi8odXNlci92aWN0b3IvL3JpZ2h0OnNpbXBsZSknKTtcclxuICAgICAgYWR2YW5jZShmaXh0dXJlKTtcclxuXHJcbiAgICAgIHJvdXRlci5uYXZpZ2F0ZUJ5VXJsKCcvJyk7XHJcbiAgICAgIGFkdmFuY2UoZml4dHVyZSk7XHJcblxyXG4gICAgICBleHBlY3QoZml4dHVyZS5kZWJ1Z0VsZW1lbnQubmF0aXZlRWxlbWVudCkudG9IYXZlVGV4dCgnJyk7XHJcbiAgICB9KSkpO1xyXG5cclxuICBpdCgnc2hvdWxkIHNldCBxdWVyeSBwYXJhbXMgYW5kIGZyYWdtZW50JyxcclxuICAgIGZha2VBc3luYyhpbmplY3QoW1JvdXRlciwgVGVzdENvbXBvbmVudEJ1aWxkZXJdLCAocm91dGVyOlJvdXRlciwgdGNiOlRlc3RDb21wb25lbnRCdWlsZGVyKSA9PiB7XHJcbiAgICAgIGNvbnN0IGZpeHR1cmUgPSB0Y2IuY3JlYXRlRmFrZUFzeW5jKFJvb3RDbXApO1xyXG4gICAgICBhZHZhbmNlKGZpeHR1cmUpO1xyXG5cclxuICAgICAgcm91dGVyLnJlc2V0Q29uZmlnKFtcclxuICAgICAgICB7IHBhdGg6ICdxdWVyeScsIGNvbXBvbmVudDogUXVlcnlQYXJhbXNBbmRGcmFnbWVudENtcCB9XHJcbiAgICAgIF0pO1xyXG5cclxuICAgICAgcm91dGVyLm5hdmlnYXRlQnlVcmwoJy9xdWVyeT9uYW1lPTEjZnJhZ21lbnQxJyk7XHJcbiAgICAgIGFkdmFuY2UoZml4dHVyZSk7XHJcbiAgICAgIGV4cGVjdChmaXh0dXJlLmRlYnVnRWxlbWVudC5uYXRpdmVFbGVtZW50KS50b0hhdmVUZXh0KCdxdWVyeTogMSBmcmFnbWVudDogZnJhZ21lbnQxJyk7XHJcblxyXG4gICAgICByb3V0ZXIubmF2aWdhdGVCeVVybCgnL3F1ZXJ5P25hbWU9MiNmcmFnbWVudDInKTtcclxuICAgICAgYWR2YW5jZShmaXh0dXJlKTtcclxuICAgICAgZXhwZWN0KGZpeHR1cmUuZGVidWdFbGVtZW50Lm5hdGl2ZUVsZW1lbnQpLnRvSGF2ZVRleHQoJ3F1ZXJ5OiAyIGZyYWdtZW50OiBmcmFnbWVudDInKTtcclxuICAgIH0pKSk7XHJcblxyXG4gIGl0KCdzaG91bGQgcHVzaCBwYXJhbXMgb25seSB3aGVuIHRoZXkgY2hhbmdlJyxcclxuICAgIGZha2VBc3luYyhpbmplY3QoW1JvdXRlciwgVGVzdENvbXBvbmVudEJ1aWxkZXJdLCAocm91dGVyOlJvdXRlciwgdGNiOlRlc3RDb21wb25lbnRCdWlsZGVyKSA9PiB7XHJcbiAgICAgIGNvbnN0IGZpeHR1cmUgPSB0Y2IuY3JlYXRlRmFrZUFzeW5jKFJvb3RDbXApO1xyXG4gICAgICBhZHZhbmNlKGZpeHR1cmUpO1xyXG5cclxuICAgICAgcm91dGVyLnJlc2V0Q29uZmlnKFtcclxuICAgICAgICB7IHBhdGg6ICd0ZWFtLzppZCcsIGNvbXBvbmVudDogVGVhbUNtcCwgY2hpbGRyZW46IFtcclxuICAgICAgICAgIHsgcGF0aDogJ3VzZXIvOm5hbWUnLCBjb21wb25lbnQ6IFVzZXJDbXAgfVxyXG4gICAgICAgIF0gfVxyXG4gICAgICBdKTtcclxuXHJcbiAgICAgIHJvdXRlci5uYXZpZ2F0ZUJ5VXJsKCcvdGVhbS8yMi91c2VyL3ZpY3RvcicpO1xyXG4gICAgICBhZHZhbmNlKGZpeHR1cmUpO1xyXG4gICAgICBjb25zdCB0ZWFtID0gZml4dHVyZS5kZWJ1Z0VsZW1lbnQuY2hpbGRyZW5bMV0uY29tcG9uZW50SW5zdGFuY2U7XHJcbiAgICAgIGNvbnN0IHVzZXIgPSBmaXh0dXJlLmRlYnVnRWxlbWVudC5jaGlsZHJlblsxXS5jaGlsZHJlblsxXS5jb21wb25lbnRJbnN0YW5jZTtcclxuXHJcbiAgICAgIGV4cGVjdCh0ZWFtLnJlY29yZGVkUGFyYW1zKS50b0VxdWFsKFt7aWQ6ICcyMid9XSk7XHJcbiAgICAgIGV4cGVjdCh1c2VyLnJlY29yZGVkUGFyYW1zKS50b0VxdWFsKFt7bmFtZTogJ3ZpY3Rvcid9XSk7XHJcblxyXG4gICAgICByb3V0ZXIubmF2aWdhdGVCeVVybCgnL3RlYW0vMjIvdXNlci9mZWRvcicpO1xyXG4gICAgICBhZHZhbmNlKGZpeHR1cmUpO1xyXG5cclxuICAgICAgZXhwZWN0KHRlYW0ucmVjb3JkZWRQYXJhbXMpLnRvRXF1YWwoW3tpZDogJzIyJ31dKTtcclxuICAgICAgZXhwZWN0KHVzZXIucmVjb3JkZWRQYXJhbXMpLnRvRXF1YWwoW3tuYW1lOiAndmljdG9yJ30sIHtuYW1lOiAnZmVkb3InfV0pO1xyXG4gICAgfSkpKTtcclxuXHJcbiAgaXQoJ3Nob3VsZCB3b3JrIHdoZW4gbmF2aWdhdGluZyB0byAvJyxcclxuICAgIGZha2VBc3luYyhpbmplY3QoW1JvdXRlciwgVGVzdENvbXBvbmVudEJ1aWxkZXJdLCAocm91dGVyOlJvdXRlciwgdGNiOlRlc3RDb21wb25lbnRCdWlsZGVyKSA9PiB7XHJcbiAgICAgIGNvbnN0IGZpeHR1cmUgPSB0Y2IuY3JlYXRlRmFrZUFzeW5jKFJvb3RDbXApO1xyXG4gICAgICBhZHZhbmNlKGZpeHR1cmUpO1xyXG4gICAgICBcclxuICAgICAgcm91dGVyLnJlc2V0Q29uZmlnKFtcclxuICAgICAgICB7IHBhdGg6ICcnLCB0ZXJtaW5hbDogdHJ1ZSwgY29tcG9uZW50OiBTaW1wbGVDbXAgfSxcclxuICAgICAgICB7IHBhdGg6ICd1c2VyLzpuYW1lJywgY29tcG9uZW50OiBVc2VyQ21wIH1cclxuICAgICAgXSk7XHJcblxyXG4gICAgICByb3V0ZXIubmF2aWdhdGVCeVVybCgnL3VzZXIvdmljdG9yJyk7XHJcbiAgICAgIGFkdmFuY2UoZml4dHVyZSk7XHJcblxyXG4gICAgICBleHBlY3QoZml4dHVyZS5kZWJ1Z0VsZW1lbnQubmF0aXZlRWxlbWVudCkudG9IYXZlVGV4dCgndXNlciB2aWN0b3InKTtcclxuXHJcbiAgICAgIHJvdXRlci5uYXZpZ2F0ZUJ5VXJsKCcvJyk7XHJcbiAgICAgIGFkdmFuY2UoZml4dHVyZSk7XHJcblxyXG4gICAgICBleHBlY3QoZml4dHVyZS5kZWJ1Z0VsZW1lbnQubmF0aXZlRWxlbWVudCkudG9IYXZlVGV4dCgnc2ltcGxlJyk7XHJcbiAgICB9KSkpO1xyXG5cclxuICBpdChcInNob3VsZCBjYW5jZWwgaW4tZmxpZ2h0IG5hdmlnYXRpb25zXCIsXHJcbiAgICBmYWtlQXN5bmMoaW5qZWN0KFtSb3V0ZXIsIFRlc3RDb21wb25lbnRCdWlsZGVyXSwgKHJvdXRlcjpSb3V0ZXIsIHRjYjpUZXN0Q29tcG9uZW50QnVpbGRlcikgPT4ge1xyXG4gICAgICBjb25zdCBmaXh0dXJlID0gdGNiLmNyZWF0ZUZha2VBc3luYyhSb290Q21wKTtcclxuICAgICAgYWR2YW5jZShmaXh0dXJlKTtcclxuXHJcbiAgICAgIHJvdXRlci5yZXNldENvbmZpZyhbXHJcbiAgICAgICAgeyBwYXRoOiAndXNlci86bmFtZScsIGNvbXBvbmVudDogVXNlckNtcCB9XHJcbiAgICAgIF0pO1xyXG5cclxuICAgICAgY29uc3QgcmVjb3JkZWRFdmVudHM6YW55ID0gW107XHJcbiAgICAgIHJvdXRlci5ldmVudHMuZm9yRWFjaChlID0+IHJlY29yZGVkRXZlbnRzLnB1c2goZSkpO1xyXG5cclxuICAgICAgcm91dGVyLm5hdmlnYXRlQnlVcmwoJy91c2VyL2luaXQnKTtcclxuICAgICAgYWR2YW5jZShmaXh0dXJlKTtcclxuXHJcbiAgICAgIGNvbnN0IHVzZXIgPSBmaXh0dXJlLmRlYnVnRWxlbWVudC5jaGlsZHJlblsxXS5jb21wb25lbnRJbnN0YW5jZTtcclxuXHJcbiAgICAgIGxldCByMTphbnksIHIyOmFueTtcclxuICAgICAgcm91dGVyLm5hdmlnYXRlQnlVcmwoJy91c2VyL3ZpY3RvcicpLnRoZW4oXyA9PiByMSA9IF8pO1xyXG4gICAgICByb3V0ZXIubmF2aWdhdGVCeVVybCgnL3VzZXIvZmVkb3InKS50aGVuKF8gPT4gcjIgPSBfKTtcclxuICAgICAgYWR2YW5jZShmaXh0dXJlKTtcclxuXHJcbiAgICAgIGV4cGVjdChyMSkudG9FcXVhbChmYWxzZSk7IC8vIHJldHVybnMgZmFsc2UgYmVjYXVzZSBpdCB3YXMgY2FuY2VsZWRcclxuICAgICAgZXhwZWN0KHIyKS50b0VxdWFsKHRydWUpOyAvLyByZXR1cm5zIHRydWUgYmVjYXVzZSBpdCB3YXMgc3VjY2Vzc2Z1bFxyXG5cclxuICAgICAgZXhwZWN0KGZpeHR1cmUuZGVidWdFbGVtZW50Lm5hdGl2ZUVsZW1lbnQpLnRvSGF2ZVRleHQoJ3VzZXIgZmVkb3InKTtcclxuICAgICAgZXhwZWN0KHVzZXIucmVjb3JkZWRQYXJhbXMpLnRvRXF1YWwoW3tuYW1lOiAnaW5pdCd9LCB7bmFtZTogJ2ZlZG9yJ31dKTtcclxuXHJcbiAgICAgIGV4cGVjdEV2ZW50cyhyZWNvcmRlZEV2ZW50cywgW1xyXG4gICAgICAgIFtOYXZpZ2F0aW9uU3RhcnQsICcvdXNlci9pbml0J10sXHJcbiAgICAgICAgW1JvdXRlc1JlY29nbml6ZWQsICcvdXNlci9pbml0J10sXHJcbiAgICAgICAgW05hdmlnYXRpb25FbmQsICcvdXNlci9pbml0J10sXHJcblxyXG4gICAgICAgIFtOYXZpZ2F0aW9uU3RhcnQsICcvdXNlci92aWN0b3InXSxcclxuICAgICAgICBbTmF2aWdhdGlvblN0YXJ0LCAnL3VzZXIvZmVkb3InXSxcclxuXHJcbiAgICAgICAgW05hdmlnYXRpb25DYW5jZWwsICcvdXNlci92aWN0b3InXSxcclxuICAgICAgICBbUm91dGVzUmVjb2duaXplZCwgJy91c2VyL2ZlZG9yJ10sXHJcbiAgICAgICAgW05hdmlnYXRpb25FbmQsICcvdXNlci9mZWRvciddXHJcbiAgICAgIF0pO1xyXG4gICAgfSkpKTtcclxuXHJcbiAgaXQoXCJzaG91bGQgaGFuZGxlIGZhaWxlZCBuYXZpZ2F0aW9ucyBncmFjZWZ1bGx5XCIsXHJcbiAgICBmYWtlQXN5bmMoaW5qZWN0KFtSb3V0ZXIsIFRlc3RDb21wb25lbnRCdWlsZGVyXSwgKHJvdXRlcjpSb3V0ZXIsIHRjYjpUZXN0Q29tcG9uZW50QnVpbGRlcikgPT4ge1xyXG4gICAgICBjb25zdCBmaXh0dXJlID0gdGNiLmNyZWF0ZUZha2VBc3luYyhSb290Q21wKTtcclxuICAgICAgYWR2YW5jZShmaXh0dXJlKTtcclxuXHJcbiAgICAgIHJvdXRlci5yZXNldENvbmZpZyhbXHJcbiAgICAgICAgeyBwYXRoOiAndXNlci86bmFtZScsIGNvbXBvbmVudDogVXNlckNtcCB9XHJcbiAgICAgIF0pO1xyXG5cclxuICAgICAgY29uc3QgcmVjb3JkZWRFdmVudHM6YW55ID0gW107XHJcbiAgICAgIHJvdXRlci5ldmVudHMuZm9yRWFjaChlID0+IHJlY29yZGVkRXZlbnRzLnB1c2goZSkpO1xyXG5cclxuICAgICAgbGV0IGU6YW55O1xyXG4gICAgICByb3V0ZXIubmF2aWdhdGVCeVVybCgnL2ludmFsaWQnKS5jYXRjaChfID0+IGUgPSBfKTtcclxuICAgICAgYWR2YW5jZShmaXh0dXJlKTtcclxuICAgICAgZXhwZWN0KGUubWVzc2FnZSkudG9Db250YWluKFwiQ2Fubm90IG1hdGNoIGFueSByb3V0ZXNcIik7XHJcblxyXG4gICAgICByb3V0ZXIubmF2aWdhdGVCeVVybCgnL3VzZXIvZmVkb3InKTtcclxuICAgICAgYWR2YW5jZShmaXh0dXJlKTtcclxuXHJcbiAgICAgIGV4cGVjdChmaXh0dXJlLmRlYnVnRWxlbWVudC5uYXRpdmVFbGVtZW50KS50b0hhdmVUZXh0KCd1c2VyIGZlZG9yJyk7XHJcblxyXG4gICAgICBleHBlY3RFdmVudHMocmVjb3JkZWRFdmVudHMsIFtcclxuICAgICAgICBbTmF2aWdhdGlvblN0YXJ0LCAnL2ludmFsaWQnXSxcclxuICAgICAgICBbTmF2aWdhdGlvbkVycm9yLCAnL2ludmFsaWQnXSxcclxuXHJcbiAgICAgICAgW05hdmlnYXRpb25TdGFydCwgJy91c2VyL2ZlZG9yJ10sXHJcbiAgICAgICAgW1JvdXRlc1JlY29nbml6ZWQsICcvdXNlci9mZWRvciddLFxyXG4gICAgICAgIFtOYXZpZ2F0aW9uRW5kLCAnL3VzZXIvZmVkb3InXVxyXG4gICAgICBdKTtcclxuICAgIH0pKSk7XHJcblxyXG4gIGl0KCdzaG91bGQgcmVwbGFjZSBzdGF0ZSB3aGVuIHBhdGggaXMgZXF1YWwgdG8gY3VycmVudCBwYXRoJyxcclxuICAgIGZha2VBc3luYyhpbmplY3QoW1JvdXRlciwgVGVzdENvbXBvbmVudEJ1aWxkZXIsIExvY2F0aW9uXSwgKHJvdXRlcjpSb3V0ZXIsIHRjYjpUZXN0Q29tcG9uZW50QnVpbGRlciwgbG9jYXRpb246TG9jYXRpb24pID0+IHtcclxuICAgICAgY29uc3QgZml4dHVyZSA9IHRjYi5jcmVhdGVGYWtlQXN5bmMoUm9vdENtcCk7XHJcbiAgICAgIGFkdmFuY2UoZml4dHVyZSk7XHJcblxyXG4gICAgICByb3V0ZXIucmVzZXRDb25maWcoW1xyXG4gICAgICAgIHsgcGF0aDogJ3RlYW0vOmlkJywgY29tcG9uZW50OiBUZWFtQ21wLCBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgeyBwYXRoOiAnc2ltcGxlJywgY29tcG9uZW50OiBTaW1wbGVDbXAgfSxcclxuICAgICAgICAgIHsgcGF0aDogJ3VzZXIvOm5hbWUnLCBjb21wb25lbnQ6IFVzZXJDbXAgfVxyXG4gICAgICAgIF0gfVxyXG4gICAgICBdKTtcclxuXHJcbiAgICAgIHJvdXRlci5uYXZpZ2F0ZUJ5VXJsKCcvdGVhbS8zMy9zaW1wbGUnKTtcclxuICAgICAgYWR2YW5jZShmaXh0dXJlKTtcclxuXHJcbiAgICAgIHJvdXRlci5uYXZpZ2F0ZUJ5VXJsKCcvdGVhbS8yMi91c2VyL3ZpY3RvcicpO1xyXG4gICAgICBhZHZhbmNlKGZpeHR1cmUpO1xyXG5cclxuICAgICAgcm91dGVyLm5hdmlnYXRlQnlVcmwoJy90ZWFtLzIyL3VzZXIvdmljdG9yJyk7XHJcbiAgICAgIGFkdmFuY2UoZml4dHVyZSk7XHJcblxyXG4gICAgICBsb2NhdGlvbi5iYWNrKCk7XHJcbiAgICAgIGFkdmFuY2UoZml4dHVyZSk7XHJcbiAgICAgIGV4cGVjdChsb2NhdGlvbi5wYXRoKCkpLnRvRXF1YWwoJy90ZWFtLzMzL3NpbXBsZScpO1xyXG4gICAgfSkpKTtcclxuXHJcbiAgaXQoJ3Nob3VsZCBoYW5kbGUgY29tcG9uZW50bGVzcyBwYXRocycsXHJcbiAgICBmYWtlQXN5bmMoaW5qZWN0KFtSb3V0ZXIsIFRlc3RDb21wb25lbnRCdWlsZGVyLCBMb2NhdGlvbl0sIChyb3V0ZXI6Um91dGVyLCB0Y2I6VGVzdENvbXBvbmVudEJ1aWxkZXIsIGxvY2F0aW9uOkxvY2F0aW9uKSA9PiB7XHJcbiAgICAgIGNvbnN0IGZpeHR1cmUgPSB0Y2IuY3JlYXRlRmFrZUFzeW5jKFJvb3RDbXBXaXRoVHdvT3V0bGV0cyk7XHJcbiAgICAgIGFkdmFuY2UoZml4dHVyZSk7XHJcblxyXG4gICAgICByb3V0ZXIucmVzZXRDb25maWcoW1xyXG4gICAgICAgIHsgcGF0aDogJ3BhcmVudC86aWQnLCBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgeyBwYXRoOiAnc2ltcGxlJywgY29tcG9uZW50OiBTaW1wbGVDbXAgfSxcclxuICAgICAgICAgIHsgcGF0aDogJ3VzZXIvOm5hbWUnLCBjb21wb25lbnQ6IFVzZXJDbXAsIG91dGxldDogJ3JpZ2h0JyB9XHJcbiAgICAgICAgXSB9LFxyXG4gICAgICAgIHsgcGF0aDogJ3VzZXIvOm5hbWUnLCBjb21wb25lbnQ6IFVzZXJDbXAgfVxyXG4gICAgICBdKTtcclxuXHJcblxyXG4gICAgICAvLyBuYXZpZ2F0ZSB0byBhIGNvbXBvbmVudGxlc3Mgcm91dGVcclxuICAgICAgcm91dGVyLm5hdmlnYXRlQnlVcmwoJy9wYXJlbnQvMTEvKHNpbXBsZS8vcmlnaHQ6dXNlci92aWN0b3IpJyk7XHJcbiAgICAgIGFkdmFuY2UoZml4dHVyZSk7XHJcbiAgICAgIGV4cGVjdChsb2NhdGlvbi5wYXRoKCkpLnRvRXF1YWwoJy9wYXJlbnQvMTEvKHNpbXBsZS8vcmlnaHQ6dXNlci92aWN0b3IpJyk7XHJcbiAgICAgIGV4cGVjdChmaXh0dXJlLmRlYnVnRWxlbWVudC5uYXRpdmVFbGVtZW50KS50b0hhdmVUZXh0KCdwcmltYXJ5IHtzaW1wbGV9IHJpZ2h0IHt1c2VyIHZpY3Rvcn0nKTtcclxuXHJcbiAgICAgIC8vIG5hdmlnYXRlIHRvIHRoZSBzYW1lIHJvdXRlIHdpdGggZGlmZmVyZW50IHBhcmFtcyAocmV1c2UpXHJcbiAgICAgIHJvdXRlci5uYXZpZ2F0ZUJ5VXJsKCcvcGFyZW50LzIyLyhzaW1wbGUvL3JpZ2h0OnVzZXIvZmVkb3IpJyk7XHJcbiAgICAgIGFkdmFuY2UoZml4dHVyZSk7XHJcbiAgICAgIGV4cGVjdChsb2NhdGlvbi5wYXRoKCkpLnRvRXF1YWwoJy9wYXJlbnQvMjIvKHNpbXBsZS8vcmlnaHQ6dXNlci9mZWRvciknKTtcclxuICAgICAgZXhwZWN0KGZpeHR1cmUuZGVidWdFbGVtZW50Lm5hdGl2ZUVsZW1lbnQpLnRvSGF2ZVRleHQoJ3ByaW1hcnkge3NpbXBsZX0gcmlnaHQge3VzZXIgZmVkb3J9Jyk7XHJcblxyXG4gICAgICAvLyBuYXZpZ2F0ZSB0byBhIG5vcm1hbCByb3V0ZSAoY2hlY2sgZGVhY3RpdmF0aW9uKVxyXG4gICAgICByb3V0ZXIubmF2aWdhdGVCeVVybCgnL3VzZXIvdmljdG9yJyk7XHJcbiAgICAgIGFkdmFuY2UoZml4dHVyZSk7XHJcbiAgICAgIGV4cGVjdChsb2NhdGlvbi5wYXRoKCkpLnRvRXF1YWwoJy91c2VyL3ZpY3RvcicpO1xyXG4gICAgICBleHBlY3QoZml4dHVyZS5kZWJ1Z0VsZW1lbnQubmF0aXZlRWxlbWVudCkudG9IYXZlVGV4dCgncHJpbWFyeSB7dXNlciB2aWN0b3J9IHJpZ2h0IHt9Jyk7XHJcblxyXG4gICAgICAvLyBuYXZpZ2F0ZSBiYWNrIHRvIGEgY29tcG9uZW50bGVzcyByb3V0ZVxyXG4gICAgICByb3V0ZXIubmF2aWdhdGVCeVVybCgnL3BhcmVudC8xMS8oc2ltcGxlLy9yaWdodDp1c2VyL3ZpY3RvciknKTtcclxuICAgICAgYWR2YW5jZShmaXh0dXJlKTtcclxuICAgICAgZXhwZWN0KGxvY2F0aW9uLnBhdGgoKSkudG9FcXVhbCgnL3BhcmVudC8xMS8oc2ltcGxlLy9yaWdodDp1c2VyL3ZpY3RvciknKTtcclxuICAgICAgZXhwZWN0KGZpeHR1cmUuZGVidWdFbGVtZW50Lm5hdGl2ZUVsZW1lbnQpLnRvSGF2ZVRleHQoJ3ByaW1hcnkge3NpbXBsZX0gcmlnaHQge3VzZXIgdmljdG9yfScpO1xyXG4gICAgfSkpKTtcclxuXHJcbiAgZGVzY3JpYmUoXCJyb3V0ZXIgbGlua3NcIiwgKCkgPT4ge1xyXG4gICAgaXQoXCJzaG91bGQgc3VwcG9ydCBzdHJpbmcgcm91dGVyIGxpbmtzXCIsXHJcbiAgICAgIGZha2VBc3luYyhpbmplY3QoW1JvdXRlciwgVGVzdENvbXBvbmVudEJ1aWxkZXJdLCAocm91dGVyOlJvdXRlciwgdGNiOlRlc3RDb21wb25lbnRCdWlsZGVyKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZml4dHVyZSA9IHRjYi5jcmVhdGVGYWtlQXN5bmMoUm9vdENtcCk7XHJcbiAgICAgICAgYWR2YW5jZShmaXh0dXJlKTtcclxuXHJcbiAgICAgICAgcm91dGVyLnJlc2V0Q29uZmlnKFtcclxuICAgICAgICAgIHsgcGF0aDogJ3RlYW0vOmlkJywgY29tcG9uZW50OiBUZWFtQ21wLCBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICB7IHBhdGg6ICdsaW5rJywgY29tcG9uZW50OiBTdHJpbmdMaW5rQ21wIH0sXHJcbiAgICAgICAgICAgIHsgcGF0aDogJ3NpbXBsZScsIGNvbXBvbmVudDogU2ltcGxlQ21wIH1cclxuICAgICAgICAgIF0gfVxyXG4gICAgICAgIF0pO1xyXG5cclxuICAgICAgICByb3V0ZXIubmF2aWdhdGVCeVVybCgnL3RlYW0vMjIvbGluaycpO1xyXG4gICAgICAgIGFkdmFuY2UoZml4dHVyZSk7XHJcbiAgICAgICAgZXhwZWN0KGZpeHR1cmUuZGVidWdFbGVtZW50Lm5hdGl2ZUVsZW1lbnQpLnRvSGF2ZVRleHQoJ3RlYW0gMjIgeyBsaW5rLCByaWdodDogIH0nKTtcclxuXHJcbiAgICAgICAgY29uc3QgbmF0aXZlID0gZml4dHVyZS5kZWJ1Z0VsZW1lbnQubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiYVwiKTtcclxuICAgICAgICBleHBlY3QobmF0aXZlLmdldEF0dHJpYnV0ZShcImhyZWZcIikpLnRvRXF1YWwoXCIvdGVhbS8zMy9zaW1wbGVcIik7XHJcbiAgICAgICAgbmF0aXZlLmNsaWNrKCk7XHJcbiAgICAgICAgYWR2YW5jZShmaXh0dXJlKTtcclxuXHJcbiAgICAgICAgZXhwZWN0KGZpeHR1cmUuZGVidWdFbGVtZW50Lm5hdGl2ZUVsZW1lbnQpLnRvSGF2ZVRleHQoJ3RlYW0gMzMgeyBzaW1wbGUsIHJpZ2h0OiAgfScpO1xyXG4gICAgICB9KSkpO1xyXG5cclxuICAgIGl0KFwic2hvdWxkIHN1cHBvcnQgYWJzb2x1dGUgcm91dGVyIGxpbmtzXCIsXHJcbiAgICAgIGZha2VBc3luYyhpbmplY3QoW1JvdXRlciwgVGVzdENvbXBvbmVudEJ1aWxkZXJdLCAocm91dGVyOlJvdXRlciwgdGNiOlRlc3RDb21wb25lbnRCdWlsZGVyKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZml4dHVyZSA9IHRjYi5jcmVhdGVGYWtlQXN5bmMoUm9vdENtcCk7XHJcbiAgICAgICAgYWR2YW5jZShmaXh0dXJlKTtcclxuXHJcbiAgICAgICAgcm91dGVyLnJlc2V0Q29uZmlnKFtcclxuICAgICAgICAgIHsgcGF0aDogJ3RlYW0vOmlkJywgY29tcG9uZW50OiBUZWFtQ21wLCBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICB7IHBhdGg6ICdsaW5rJywgY29tcG9uZW50OiBBYnNvbHV0ZUxpbmtDbXAgfSxcclxuICAgICAgICAgICAgeyBwYXRoOiAnc2ltcGxlJywgY29tcG9uZW50OiBTaW1wbGVDbXAgfVxyXG4gICAgICAgICAgXSB9XHJcbiAgICAgICAgXSk7XHJcblxyXG4gICAgICAgIHJvdXRlci5uYXZpZ2F0ZUJ5VXJsKCcvdGVhbS8yMi9saW5rJyk7XHJcbiAgICAgICAgYWR2YW5jZShmaXh0dXJlKTtcclxuICAgICAgICBleHBlY3QoZml4dHVyZS5kZWJ1Z0VsZW1lbnQubmF0aXZlRWxlbWVudCkudG9IYXZlVGV4dCgndGVhbSAyMiB7IGxpbmssIHJpZ2h0OiAgfScpO1xyXG5cclxuICAgICAgICBjb25zdCBuYXRpdmUgPSBmaXh0dXJlLmRlYnVnRWxlbWVudC5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJhXCIpO1xyXG4gICAgICAgIGV4cGVjdChuYXRpdmUuZ2V0QXR0cmlidXRlKFwiaHJlZlwiKSkudG9FcXVhbChcIi90ZWFtLzMzL3NpbXBsZVwiKTtcclxuICAgICAgICBuYXRpdmUuY2xpY2soKTtcclxuICAgICAgICBhZHZhbmNlKGZpeHR1cmUpO1xyXG5cclxuICAgICAgICBleHBlY3QoZml4dHVyZS5kZWJ1Z0VsZW1lbnQubmF0aXZlRWxlbWVudCkudG9IYXZlVGV4dCgndGVhbSAzMyB7IHNpbXBsZSwgcmlnaHQ6ICB9Jyk7XHJcbiAgICAgIH0pKSk7XHJcblxyXG4gICAgaXQoXCJzaG91bGQgc3VwcG9ydCByZWxhdGl2ZSByb3V0ZXIgbGlua3NcIixcclxuICAgICAgZmFrZUFzeW5jKGluamVjdChbUm91dGVyLCBUZXN0Q29tcG9uZW50QnVpbGRlcl0sIChyb3V0ZXI6Um91dGVyLCB0Y2I6VGVzdENvbXBvbmVudEJ1aWxkZXIpID0+IHtcclxuICAgICAgICBjb25zdCBmaXh0dXJlID0gdGNiLmNyZWF0ZUZha2VBc3luYyhSb290Q21wKTtcclxuICAgICAgICBhZHZhbmNlKGZpeHR1cmUpO1xyXG5cclxuICAgICAgICByb3V0ZXIucmVzZXRDb25maWcoW1xyXG4gICAgICAgICAgeyBwYXRoOiAndGVhbS86aWQnLCBjb21wb25lbnQ6IFRlYW1DbXAsIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgIHsgcGF0aDogJ2xpbmsnLCBjb21wb25lbnQ6IFJlbGF0aXZlTGlua0NtcCB9LFxyXG4gICAgICAgICAgICB7IHBhdGg6ICdzaW1wbGUnLCBjb21wb25lbnQ6IFNpbXBsZUNtcCB9XHJcbiAgICAgICAgICBdIH1cclxuICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgcm91dGVyLm5hdmlnYXRlQnlVcmwoJy90ZWFtLzIyL2xpbmsnKTtcclxuICAgICAgICBhZHZhbmNlKGZpeHR1cmUpO1xyXG4gICAgICAgIGV4cGVjdChmaXh0dXJlLmRlYnVnRWxlbWVudC5uYXRpdmVFbGVtZW50KVxyXG4gICAgICAgICAgLnRvSGF2ZVRleHQoJ3RlYW0gMjIgeyBsaW5rLCByaWdodDogIH0nKTtcclxuXHJcbiAgICAgICAgY29uc3QgbmF0aXZlID0gZml4dHVyZS5kZWJ1Z0VsZW1lbnQubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiYVwiKTtcclxuICAgICAgICBleHBlY3QobmF0aXZlLmdldEF0dHJpYnV0ZShcImhyZWZcIikpLnRvRXF1YWwoXCIvdGVhbS8yMi9zaW1wbGVcIik7XHJcbiAgICAgICAgbmF0aXZlLmNsaWNrKCk7XHJcbiAgICAgICAgYWR2YW5jZShmaXh0dXJlKTtcclxuXHJcbiAgICAgICAgZXhwZWN0KGZpeHR1cmUuZGVidWdFbGVtZW50Lm5hdGl2ZUVsZW1lbnQpXHJcbiAgICAgICAgICAudG9IYXZlVGV4dCgndGVhbSAyMiB7IHNpbXBsZSwgcmlnaHQ6ICB9Jyk7XHJcbiAgICAgIH0pKSk7XHJcblxyXG4gICAgaXQoXCJzaG91bGQgc3VwcG9ydCB0b3AtbGV2ZWwgbGlua1wiLFxyXG4gICAgICBmYWtlQXN5bmMoaW5qZWN0KFtSb3V0ZXIsIFRlc3RDb21wb25lbnRCdWlsZGVyXSwgKHJvdXRlcjpSb3V0ZXIsIHRjYjpUZXN0Q29tcG9uZW50QnVpbGRlcikgPT4ge1xyXG4gICAgICAgIGxldCBmaXh0dXJlID0gdGNiLmNyZWF0ZUZha2VBc3luYyhBYnNvbHV0ZUxpbmtDbXApO1xyXG4gICAgICAgIGFkdmFuY2UoZml4dHVyZSk7XHJcblxyXG4gICAgICAgIGV4cGVjdChmaXh0dXJlLmRlYnVnRWxlbWVudC5uYXRpdmVFbGVtZW50KS50b0hhdmVUZXh0KCdsaW5rJyk7XHJcbiAgICAgIH0pKSk7XHJcblxyXG4gICAgaXQoXCJzaG91bGQgc3VwcG9ydCBxdWVyeSBwYXJhbXMgYW5kIGZyYWdtZW50c1wiLFxyXG4gICAgICBmYWtlQXN5bmMoaW5qZWN0KFtSb3V0ZXIsIExvY2F0aW9uLCBUZXN0Q29tcG9uZW50QnVpbGRlcl0sIChyb3V0ZXI6Um91dGVyLCBsb2NhdGlvbjpMb2NhdGlvbiwgdGNiOlRlc3RDb21wb25lbnRCdWlsZGVyKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZml4dHVyZSA9IHRjYi5jcmVhdGVGYWtlQXN5bmMoUm9vdENtcCk7XHJcbiAgICAgICAgYWR2YW5jZShmaXh0dXJlKTtcclxuXHJcbiAgICAgICAgcm91dGVyLnJlc2V0Q29uZmlnKFtcclxuICAgICAgICAgIHsgcGF0aDogJ3RlYW0vOmlkJywgY29tcG9uZW50OiBUZWFtQ21wLCBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICB7IHBhdGg6ICdsaW5rJywgY29tcG9uZW50OiBMaW5rV2l0aFF1ZXJ5UGFyYW1zQW5kRnJhZ21lbnQgfSxcclxuICAgICAgICAgICAgeyBwYXRoOiAnc2ltcGxlJywgY29tcG9uZW50OiBTaW1wbGVDbXAgfVxyXG4gICAgICAgICAgXSB9XHJcbiAgICAgICAgXSk7XHJcblxyXG4gICAgICAgIHJvdXRlci5uYXZpZ2F0ZUJ5VXJsKCcvdGVhbS8yMi9saW5rJyk7XHJcbiAgICAgICAgYWR2YW5jZShmaXh0dXJlKTtcclxuXHJcbiAgICAgICAgY29uc3QgbmF0aXZlID0gZml4dHVyZS5kZWJ1Z0VsZW1lbnQubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiYVwiKTtcclxuICAgICAgICBleHBlY3QobmF0aXZlLmdldEF0dHJpYnV0ZShcImhyZWZcIikpLnRvRXF1YWwoXCIvdGVhbS8yMi9zaW1wbGU/cT0xI2ZcIik7XHJcbiAgICAgICAgbmF0aXZlLmNsaWNrKCk7XHJcbiAgICAgICAgYWR2YW5jZShmaXh0dXJlKTtcclxuXHJcbiAgICAgICAgZXhwZWN0KGZpeHR1cmUuZGVidWdFbGVtZW50Lm5hdGl2ZUVsZW1lbnQpXHJcbiAgICAgICAgICAudG9IYXZlVGV4dCgndGVhbSAyMiB7IHNpbXBsZSwgcmlnaHQ6ICB9Jyk7XHJcblxyXG4gICAgICAgIGV4cGVjdChsb2NhdGlvbi5wYXRoKCkpLnRvRXF1YWwoJy90ZWFtLzIyL3NpbXBsZT9xPTEjZicpO1xyXG4gICAgICB9KSkpO1xyXG4gIH0pO1xyXG5cclxuICBkZXNjcmliZShcInJlZGlyZWN0c1wiLCAoKSA9PiB7XHJcbiAgICBpdChcInNob3VsZCB3b3JrXCIsIGZha2VBc3luYyhpbmplY3QoW1JvdXRlciwgVGVzdENvbXBvbmVudEJ1aWxkZXIsIExvY2F0aW9uXSwgKHJvdXRlcjpSb3V0ZXIsIHRjYjpUZXN0Q29tcG9uZW50QnVpbGRlciwgbG9jYXRpb246TG9jYXRpb24pID0+IHtcclxuICAgICAgY29uc3QgZml4dHVyZSA9IHRjYi5jcmVhdGVGYWtlQXN5bmMoUm9vdENtcCk7XHJcbiAgICAgIGFkdmFuY2UoZml4dHVyZSk7XHJcblxyXG4gICAgICByb3V0ZXIucmVzZXRDb25maWcoW1xyXG4gICAgICAgIHsgcGF0aDogJ29sZC90ZWFtLzppZCcsIHJlZGlyZWN0VG86ICd0ZWFtLzppZCcgfSxcclxuICAgICAgICB7IHBhdGg6ICd0ZWFtLzppZCcsIGNvbXBvbmVudDogVGVhbUNtcCB9XHJcbiAgICAgIF0pO1xyXG5cclxuICAgICAgcm91dGVyLm5hdmlnYXRlQnlVcmwoJ29sZC90ZWFtLzIyJyk7XHJcbiAgICAgIGFkdmFuY2UoZml4dHVyZSk7XHJcblxyXG4gICAgICBleHBlY3QobG9jYXRpb24ucGF0aCgpKS50b0VxdWFsKCcvdGVhbS8yMicpO1xyXG4gICAgfSkpKTtcclxuICB9KTtcclxuXHJcbiAgZGVzY3JpYmUoXCJndWFyZHNcIiwgKCkgPT4ge1xyXG4gICAgZGVzY3JpYmUoXCJDYW5BY3RpdmF0ZVwiLCAoKSA9PiB7XHJcbiAgICAgIGRlc2NyaWJlKFwic2hvdWxkIG5vdCBhY3RpdmF0ZSBhIHJvdXRlIHdoZW4gQ2FuQWN0aXZhdGUgcmV0dXJucyBmYWxzZVwiLCAoKSA9PiB7XHJcbiAgICAgICAgYmVmb3JlRWFjaFByb3ZpZGVycygoKSA9PiBbXHJcbiAgICAgICAgICB7cHJvdmlkZTogJ2Fsd2F5c0ZhbHNlJywgdXNlVmFsdWU6IChhOmFueSwgYjphbnkpID0+IGZhbHNlfVxyXG4gICAgICAgIF0pO1xyXG5cclxuICAgICAgICBpdCgnd29ya3MnLFxyXG4gICAgICAgICAgZmFrZUFzeW5jKGluamVjdChbUm91dGVyLCBUZXN0Q29tcG9uZW50QnVpbGRlciwgTG9jYXRpb25dLCAocm91dGVyOlJvdXRlciwgdGNiOlRlc3RDb21wb25lbnRCdWlsZGVyLCBsb2NhdGlvbjpMb2NhdGlvbikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBmaXh0dXJlID0gdGNiLmNyZWF0ZUZha2VBc3luYyhSb290Q21wKTtcclxuICAgICAgICAgICAgYWR2YW5jZShmaXh0dXJlKTtcclxuXHJcbiAgICAgICAgICAgIHJvdXRlci5yZXNldENvbmZpZyhbXHJcbiAgICAgICAgICAgICAgeyBwYXRoOiAndGVhbS86aWQnLCBjb21wb25lbnQ6IFRlYW1DbXAsIGNhbkFjdGl2YXRlOiBbXCJhbHdheXNGYWxzZVwiXSB9XHJcbiAgICAgICAgICAgIF0pO1xyXG5cclxuICAgICAgICAgICAgcm91dGVyLm5hdmlnYXRlQnlVcmwoJy90ZWFtLzIyJyk7XHJcbiAgICAgICAgICAgIGFkdmFuY2UoZml4dHVyZSk7XHJcblxyXG4gICAgICAgICAgICBleHBlY3QobG9jYXRpb24ucGF0aCgpKS50b0VxdWFsKCcvJyk7XHJcbiAgICAgICAgICB9KSkpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGRlc2NyaWJlKFwic2hvdWxkIG5vdCBhY3RpdmF0ZSBhIHJvdXRlIHdoZW4gQ2FuQWN0aXZhdGUgcmV0dXJucyBmYWxzZSAoY29tcG9uZW50bGVzcyByb3V0ZSlcIiwgKCkgPT4ge1xyXG4gICAgICAgIGJlZm9yZUVhY2hQcm92aWRlcnMoKCkgPT4gW1xyXG4gICAgICAgICAge3Byb3ZpZGU6ICdhbHdheXNGYWxzZScsIHVzZVZhbHVlOiAoYTphbnksIGI6YW55KSA9PiBmYWxzZX1cclxuICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgaXQoJ3dvcmtzJyxcclxuICAgICAgICAgIGZha2VBc3luYyhpbmplY3QoW1JvdXRlciwgVGVzdENvbXBvbmVudEJ1aWxkZXIsIExvY2F0aW9uXSwgKHJvdXRlcjpSb3V0ZXIsIHRjYjpUZXN0Q29tcG9uZW50QnVpbGRlciwgbG9jYXRpb246TG9jYXRpb24pID0+IHtcclxuICAgICAgICAgICAgY29uc3QgZml4dHVyZSA9IHRjYi5jcmVhdGVGYWtlQXN5bmMoUm9vdENtcCk7XHJcbiAgICAgICAgICAgIGFkdmFuY2UoZml4dHVyZSk7XHJcblxyXG4gICAgICAgICAgICByb3V0ZXIucmVzZXRDb25maWcoW1xyXG4gICAgICAgICAgICAgIHsgcGF0aDogJ3BhcmVudCcsIGNhbkFjdGl2YXRlOiBbJ2Fsd2F5c0ZhbHNlJ10sIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgICAgICB7IHBhdGg6ICd0ZWFtLzppZCcsIGNvbXBvbmVudDogVGVhbUNtcCB9XHJcbiAgICAgICAgICAgICAgXX1cclxuICAgICAgICAgICAgXSk7XHJcblxyXG4gICAgICAgICAgICByb3V0ZXIubmF2aWdhdGVCeVVybCgncGFyZW50L3RlYW0vMjInKTtcclxuICAgICAgICAgICAgYWR2YW5jZShmaXh0dXJlKTtcclxuXHJcbiAgICAgICAgICAgIGV4cGVjdChsb2NhdGlvbi5wYXRoKCkpLnRvRXF1YWwoJy8nKTtcclxuICAgICAgICAgIH0pKSk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgZGVzY3JpYmUoXCJzaG91bGQgYWN0aXZhdGUgYSByb3V0ZSB3aGVuIENhbkFjdGl2YXRlIHJldHVybnMgdHJ1ZVwiLCAoKSA9PiB7XHJcbiAgICAgICAgYmVmb3JlRWFjaFByb3ZpZGVycygoKSA9PiBbXHJcbiAgICAgICAgICB7cHJvdmlkZTogJ2Fsd2F5c1RydWUnLCB1c2VWYWx1ZTogKGE6QWN0aXZhdGVkUm91dGVTbmFwc2hvdCwgczpSb3V0ZXJTdGF0ZVNuYXBzaG90KSA9PiB0cnVlfVxyXG4gICAgICAgIF0pO1xyXG5cclxuICAgICAgICBpdCgnd29ya3MnLFxyXG4gICAgICAgICAgZmFrZUFzeW5jKGluamVjdChbUm91dGVyLCBUZXN0Q29tcG9uZW50QnVpbGRlciwgTG9jYXRpb25dLCAocm91dGVyOlJvdXRlciwgdGNiOlRlc3RDb21wb25lbnRCdWlsZGVyLCBsb2NhdGlvbjpMb2NhdGlvbikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBmaXh0dXJlID0gdGNiLmNyZWF0ZUZha2VBc3luYyhSb290Q21wKTtcclxuICAgICAgICAgICAgYWR2YW5jZShmaXh0dXJlKTtcclxuXHJcbiAgICAgICAgICAgIHJvdXRlci5yZXNldENvbmZpZyhbXHJcbiAgICAgICAgICAgICAgeyBwYXRoOiAndGVhbS86aWQnLCBjb21wb25lbnQ6IFRlYW1DbXAsIGNhbkFjdGl2YXRlOiBbXCJhbHdheXNUcnVlXCJdIH1cclxuICAgICAgICAgICAgXSk7XHJcblxyXG4gICAgICAgICAgICByb3V0ZXIubmF2aWdhdGVCeVVybCgnL3RlYW0vMjInKTtcclxuICAgICAgICAgICAgYWR2YW5jZShmaXh0dXJlKTtcclxuXHJcbiAgICAgICAgICAgIGV4cGVjdChsb2NhdGlvbi5wYXRoKCkpLnRvRXF1YWwoJy90ZWFtLzIyJyk7XHJcbiAgICAgICAgICB9KSkpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGRlc2NyaWJlKFwic2hvdWxkIHdvcmsgd2hlbiBnaXZlbiBhIGNsYXNzXCIsICgpID0+IHtcclxuICAgICAgICBjbGFzcyBBbHdheXNUcnVlIGltcGxlbWVudHMgQ2FuQWN0aXZhdGUge1xyXG4gICAgICAgICAgY2FuQWN0aXZhdGUocm91dGU6QWN0aXZhdGVkUm91dGVTbmFwc2hvdCwgc3RhdGU6Um91dGVyU3RhdGVTbmFwc2hvdCk6Ym9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYmVmb3JlRWFjaFByb3ZpZGVycygoKSA9PiBbQWx3YXlzVHJ1ZV0pO1xyXG5cclxuICAgICAgICBpdCgnd29ya3MnLFxyXG4gICAgICAgICAgZmFrZUFzeW5jKGluamVjdChbUm91dGVyLCBUZXN0Q29tcG9uZW50QnVpbGRlciwgTG9jYXRpb25dLCAocm91dGVyOlJvdXRlciwgdGNiOlRlc3RDb21wb25lbnRCdWlsZGVyLCBsb2NhdGlvbjpMb2NhdGlvbikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBmaXh0dXJlID0gdGNiLmNyZWF0ZUZha2VBc3luYyhSb290Q21wKTtcclxuICAgICAgICAgICAgYWR2YW5jZShmaXh0dXJlKTtcclxuXHJcbiAgICAgICAgICAgIHJvdXRlci5yZXNldENvbmZpZyhbXHJcbiAgICAgICAgICAgICAgeyBwYXRoOiAndGVhbS86aWQnLCBjb21wb25lbnQ6IFRlYW1DbXAsIGNhbkFjdGl2YXRlOiBbQWx3YXlzVHJ1ZV0gfVxyXG4gICAgICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgICAgIHJvdXRlci5uYXZpZ2F0ZUJ5VXJsKCcvdGVhbS8yMicpO1xyXG4gICAgICAgICAgICBhZHZhbmNlKGZpeHR1cmUpO1xyXG5cclxuICAgICAgICAgICAgZXhwZWN0KGxvY2F0aW9uLnBhdGgoKSkudG9FcXVhbCgnL3RlYW0vMjInKTtcclxuICAgICAgICAgIH0pKSk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgZGVzY3JpYmUoXCJzaG91bGQgd29yayB3aGVuIHJldHVybnMgYW4gb2JzZXJ2YWJsZVwiLCAoKSA9PiB7XHJcbiAgICAgICAgYmVmb3JlRWFjaFByb3ZpZGVycygoKSA9PiBbXHJcbiAgICAgICAgICB7cHJvdmlkZTogJ0NhbkFjdGl2YXRlJywgdXNlVmFsdWU6IChhOkFjdGl2YXRlZFJvdXRlU25hcHNob3QsIGI6Um91dGVyU3RhdGVTbmFwc2hvdCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gb2YoZmFsc2UpO1xyXG4gICAgICAgICAgfX1cclxuICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgaXQoJ3dvcmtzJyxcclxuICAgICAgICAgIGZha2VBc3luYyhpbmplY3QoW1JvdXRlciwgVGVzdENvbXBvbmVudEJ1aWxkZXIsIExvY2F0aW9uXSwgKHJvdXRlcjpSb3V0ZXIsIHRjYjpUZXN0Q29tcG9uZW50QnVpbGRlciwgbG9jYXRpb246TG9jYXRpb24pID0+IHtcclxuICAgICAgICAgICAgY29uc3QgZml4dHVyZSA9IHRjYi5jcmVhdGVGYWtlQXN5bmMoUm9vdENtcCk7XHJcbiAgICAgICAgICAgIGFkdmFuY2UoZml4dHVyZSk7XHJcblxyXG4gICAgICAgICAgICByb3V0ZXIucmVzZXRDb25maWcoW1xyXG4gICAgICAgICAgICAgIHsgcGF0aDogJ3RlYW0vOmlkJywgY29tcG9uZW50OiBUZWFtQ21wLCBjYW5BY3RpdmF0ZTogWydDYW5BY3RpdmF0ZSddIH1cclxuICAgICAgICAgICAgXSk7XHJcblxyXG4gICAgICAgICAgICByb3V0ZXIubmF2aWdhdGVCeVVybCgnL3RlYW0vMjInKTtcclxuICAgICAgICAgICAgYWR2YW5jZShmaXh0dXJlKTtcclxuICAgICAgICAgICAgZXhwZWN0KGxvY2F0aW9uLnBhdGgoKSkudG9FcXVhbCgnLycpO1xyXG4gICAgICAgICAgfSkpKTtcclxuICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoXCJDYW5EZWFjdGl2YXRlXCIsICgpID0+IHtcclxuICAgICAgZGVzY3JpYmUoXCJzaG91bGQgbm90IGRlYWN0aXZhdGUgYSByb3V0ZSB3aGVuIENhbkRlYWN0aXZhdGUgcmV0dXJucyBmYWxzZVwiLCAoKSA9PiB7XHJcbiAgICAgICAgYmVmb3JlRWFjaFByb3ZpZGVycygoKSA9PiBbXHJcbiAgICAgICAgICB7cHJvdmlkZTogJ0NhbkRlYWN0aXZhdGVQYXJlbnQnLCB1c2VWYWx1ZTogKGM6YW55LCBhOkFjdGl2YXRlZFJvdXRlU25hcHNob3QsIGI6Um91dGVyU3RhdGVTbmFwc2hvdCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gYS5wYXJhbXNbJ2lkJ10gPT09IFwiMjJcIjtcclxuICAgICAgICAgIH19LFxyXG4gICAgICAgICAge3Byb3ZpZGU6ICdDYW5EZWFjdGl2YXRlVGVhbScsIHVzZVZhbHVlOiAoYzphbnksIGE6QWN0aXZhdGVkUm91dGVTbmFwc2hvdCwgYjpSb3V0ZXJTdGF0ZVNuYXBzaG90KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBjLnJvdXRlLnNuYXBzaG90LnBhcmFtc1snaWQnXSA9PT0gXCIyMlwiO1xyXG4gICAgICAgICAgfX0sXHJcbiAgICAgICAgICB7cHJvdmlkZTogJ0NhbkRlYWN0aXZhdGVVc2VyJywgdXNlVmFsdWU6IChjOmFueSwgYTpBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90LCBiOlJvdXRlclN0YXRlU25hcHNob3QpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGEucGFyYW1zWyduYW1lJ10gPT09ICd2aWN0b3InO1xyXG4gICAgICAgICAgfX1cclxuICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgaXQoJ3dvcmtzJyxcclxuICAgICAgICAgIGZha2VBc3luYyhpbmplY3QoW1JvdXRlciwgVGVzdENvbXBvbmVudEJ1aWxkZXIsIExvY2F0aW9uXSwgKHJvdXRlcjpSb3V0ZXIsIHRjYjpUZXN0Q29tcG9uZW50QnVpbGRlciwgbG9jYXRpb246TG9jYXRpb24pID0+IHtcclxuICAgICAgICAgICAgY29uc3QgZml4dHVyZSA9IHRjYi5jcmVhdGVGYWtlQXN5bmMoUm9vdENtcCk7XHJcbiAgICAgICAgICAgIGFkdmFuY2UoZml4dHVyZSk7XHJcblxyXG4gICAgICAgICAgICByb3V0ZXIucmVzZXRDb25maWcoW1xyXG4gICAgICAgICAgICAgIHsgcGF0aDogJ3RlYW0vOmlkJywgY29tcG9uZW50OiBUZWFtQ21wLCBjYW5EZWFjdGl2YXRlOiBbXCJDYW5EZWFjdGl2YXRlVGVhbVwiXSB9XHJcbiAgICAgICAgICAgIF0pO1xyXG5cclxuICAgICAgICAgICAgcm91dGVyLm5hdmlnYXRlQnlVcmwoJy90ZWFtLzIyJyk7XHJcbiAgICAgICAgICAgIGFkdmFuY2UoZml4dHVyZSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChsb2NhdGlvbi5wYXRoKCkpLnRvRXF1YWwoJy90ZWFtLzIyJyk7XHJcblxyXG4gICAgICAgICAgICByb3V0ZXIubmF2aWdhdGVCeVVybCgnL3RlYW0vMzMnKTtcclxuICAgICAgICAgICAgYWR2YW5jZShmaXh0dXJlKTtcclxuICAgICAgICAgICAgZXhwZWN0KGxvY2F0aW9uLnBhdGgoKSkudG9FcXVhbCgnL3RlYW0vMzMnKTtcclxuXHJcbiAgICAgICAgICAgIHJvdXRlci5uYXZpZ2F0ZUJ5VXJsKCcvdGVhbS80NCcpO1xyXG4gICAgICAgICAgICBhZHZhbmNlKGZpeHR1cmUpO1xyXG4gICAgICAgICAgICBleHBlY3QobG9jYXRpb24ucGF0aCgpKS50b0VxdWFsKCcvdGVhbS8zMycpO1xyXG4gICAgICAgICAgfSkpKTtcclxuXHJcbiAgICAgICAgaXQoJ3dvcmtzIChjb21wb25lbnRsZXNzIHJvdXRlKScsXHJcbiAgICAgICAgICBmYWtlQXN5bmMoaW5qZWN0KFtSb3V0ZXIsIFRlc3RDb21wb25lbnRCdWlsZGVyLCBMb2NhdGlvbl0sIChyb3V0ZXI6Um91dGVyLCB0Y2I6VGVzdENvbXBvbmVudEJ1aWxkZXIsIGxvY2F0aW9uOkxvY2F0aW9uKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZpeHR1cmUgPSB0Y2IuY3JlYXRlRmFrZUFzeW5jKFJvb3RDbXApO1xyXG4gICAgICAgICAgICBhZHZhbmNlKGZpeHR1cmUpO1xyXG5cclxuICAgICAgICAgICAgcm91dGVyLnJlc2V0Q29uZmlnKFtcclxuICAgICAgICAgICAgICB7IHBhdGg6ICdwYXJlbnQvOmlkJywgY2FuRGVhY3RpdmF0ZTogW1wiQ2FuRGVhY3RpdmF0ZVBhcmVudFwiXSwgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAgICAgIHsgcGF0aDogJ3NpbXBsZScsIGNvbXBvbmVudDogU2ltcGxlQ21wIH1cclxuICAgICAgICAgICAgICBdIH1cclxuICAgICAgICAgICAgXSk7XHJcblxyXG4gICAgICAgICAgICByb3V0ZXIubmF2aWdhdGVCeVVybCgnL3BhcmVudC8yMi9zaW1wbGUnKTtcclxuICAgICAgICAgICAgYWR2YW5jZShmaXh0dXJlKTtcclxuICAgICAgICAgICAgZXhwZWN0KGxvY2F0aW9uLnBhdGgoKSkudG9FcXVhbCgnL3BhcmVudC8yMi9zaW1wbGUnKTtcclxuXHJcbiAgICAgICAgICAgIHJvdXRlci5uYXZpZ2F0ZUJ5VXJsKCcvcGFyZW50LzMzL3NpbXBsZScpO1xyXG4gICAgICAgICAgICBhZHZhbmNlKGZpeHR1cmUpO1xyXG4gICAgICAgICAgICBleHBlY3QobG9jYXRpb24ucGF0aCgpKS50b0VxdWFsKCcvcGFyZW50LzMzL3NpbXBsZScpO1xyXG5cclxuICAgICAgICAgICAgcm91dGVyLm5hdmlnYXRlQnlVcmwoJy9wYXJlbnQvNDQvc2ltcGxlJyk7XHJcbiAgICAgICAgICAgIGFkdmFuY2UoZml4dHVyZSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChsb2NhdGlvbi5wYXRoKCkpLnRvRXF1YWwoJy9wYXJlbnQvMzMvc2ltcGxlJyk7XHJcbiAgICAgICAgICB9KSkpO1xyXG5cclxuICAgICAgICBpdCgnd29ya3Mgd2l0aCBhIG5lc3RlZCByb3V0ZScsXHJcbiAgICAgICAgICBmYWtlQXN5bmMoaW5qZWN0KFtSb3V0ZXIsIFRlc3RDb21wb25lbnRCdWlsZGVyLCBMb2NhdGlvbl0sIChyb3V0ZXI6Um91dGVyLCB0Y2I6VGVzdENvbXBvbmVudEJ1aWxkZXIsIGxvY2F0aW9uOkxvY2F0aW9uKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZpeHR1cmUgPSB0Y2IuY3JlYXRlRmFrZUFzeW5jKFJvb3RDbXApO1xyXG4gICAgICAgICAgICBhZHZhbmNlKGZpeHR1cmUpO1xyXG5cclxuICAgICAgICAgICAgcm91dGVyLnJlc2V0Q29uZmlnKFtcclxuICAgICAgICAgICAgICB7IHBhdGg6ICd0ZWFtLzppZCcsIGNvbXBvbmVudDogVGVhbUNtcCwgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAgICAgIHtwYXRoOiAnJywgdGVybWluYWw6IHRydWUsIGNvbXBvbmVudDogU2ltcGxlQ21wfSxcclxuICAgICAgICAgICAgICAgIHtwYXRoOiAndXNlci86bmFtZScsIGNvbXBvbmVudDogVXNlckNtcCwgY2FuRGVhY3RpdmF0ZTogW1wiQ2FuRGVhY3RpdmF0ZVVzZXJcIl0gfVxyXG4gICAgICAgICAgICAgIF19XHJcbiAgICAgICAgICAgIF0pO1xyXG5cclxuICAgICAgICAgICAgcm91dGVyLm5hdmlnYXRlQnlVcmwoJy90ZWFtLzIyL3VzZXIvdmljdG9yJyk7XHJcbiAgICAgICAgICAgIGFkdmFuY2UoZml4dHVyZSk7XHJcblxyXG4gICAgICAgICAgICAvLyB0aGlzIHdvcmtzIGJlY2F1c2Ugd2UgY2FuIGRlYWN0aXZhdGUgdmljdG9yXHJcbiAgICAgICAgICAgIHJvdXRlci5uYXZpZ2F0ZUJ5VXJsKCcvdGVhbS8zMycpO1xyXG4gICAgICAgICAgICBhZHZhbmNlKGZpeHR1cmUpO1xyXG4gICAgICAgICAgICBleHBlY3QobG9jYXRpb24ucGF0aCgpKS50b0VxdWFsKCcvdGVhbS8zMycpO1xyXG5cclxuICAgICAgICAgICAgcm91dGVyLm5hdmlnYXRlQnlVcmwoJy90ZWFtLzMzL3VzZXIvZmVkb3InKTtcclxuICAgICAgICAgICAgYWR2YW5jZShmaXh0dXJlKTtcclxuXHJcbiAgICAgICAgICAgIC8vIHRoaXMgZG9lc24ndCB3b3JrIGNhdXNlIHdlIGNhbm5vdCBkZWFjdGl2YXRlIGZlZG9yXHJcbiAgICAgICAgICAgIHJvdXRlci5uYXZpZ2F0ZUJ5VXJsKCcvdGVhbS80NCcpO1xyXG4gICAgICAgICAgICBhZHZhbmNlKGZpeHR1cmUpO1xyXG4gICAgICAgICAgICBleHBlY3QobG9jYXRpb24ucGF0aCgpKS50b0VxdWFsKCcvdGVhbS8zMy91c2VyL2ZlZG9yJyk7XHJcbiAgICAgICAgICB9KSkpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGRlc2NyaWJlKFwic2hvdWxkIHdvcmsgd2hlbiBnaXZlbiBhIGNsYXNzXCIsICgpID0+IHtcclxuICAgICAgICBjbGFzcyBBbHdheXNUcnVlIGltcGxlbWVudHMgQ2FuRGVhY3RpdmF0ZTxUZWFtQ21wPiB7XHJcbiAgICAgICAgICBjYW5EZWFjdGl2YXRlKGNvbXBvbmVudDogVGVhbUNtcCwgcm91dGU6QWN0aXZhdGVkUm91dGVTbmFwc2hvdCwgc3RhdGU6Um91dGVyU3RhdGVTbmFwc2hvdCk6Ym9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYmVmb3JlRWFjaFByb3ZpZGVycygoKSA9PiBbQWx3YXlzVHJ1ZV0pO1xyXG5cclxuICAgICAgICBpdCgnd29ya3MnLFxyXG4gICAgICAgICAgZmFrZUFzeW5jKGluamVjdChbUm91dGVyLCBUZXN0Q29tcG9uZW50QnVpbGRlciwgTG9jYXRpb25dLCAocm91dGVyOlJvdXRlciwgdGNiOlRlc3RDb21wb25lbnRCdWlsZGVyLCBsb2NhdGlvbjpMb2NhdGlvbikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBmaXh0dXJlID0gdGNiLmNyZWF0ZUZha2VBc3luYyhSb290Q21wKTtcclxuICAgICAgICAgICAgYWR2YW5jZShmaXh0dXJlKTtcclxuXHJcbiAgICAgICAgICAgIHJvdXRlci5yZXNldENvbmZpZyhbXHJcbiAgICAgICAgICAgICAgeyBwYXRoOiAndGVhbS86aWQnLCBjb21wb25lbnQ6IFRlYW1DbXAsIGNhbkRlYWN0aXZhdGU6IFtBbHdheXNUcnVlXSB9XHJcbiAgICAgICAgICAgIF0pO1xyXG5cclxuICAgICAgICAgICAgcm91dGVyLm5hdmlnYXRlQnlVcmwoJy90ZWFtLzIyJyk7XHJcbiAgICAgICAgICAgIGFkdmFuY2UoZml4dHVyZSk7XHJcbiAgICAgICAgICAgIGV4cGVjdChsb2NhdGlvbi5wYXRoKCkpLnRvRXF1YWwoJy90ZWFtLzIyJyk7XHJcblxyXG4gICAgICAgICAgICByb3V0ZXIubmF2aWdhdGVCeVVybCgnL3RlYW0vMzMnKTtcclxuICAgICAgICAgICAgYWR2YW5jZShmaXh0dXJlKTtcclxuICAgICAgICAgICAgZXhwZWN0KGxvY2F0aW9uLnBhdGgoKSkudG9FcXVhbCgnL3RlYW0vMzMnKTtcclxuICAgICAgICAgIH0pKSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoXCJzaG91bGQgd29yayB3aGVuIHJldHVybnMgYW4gb2JzZXJ2YWJsZVwiLCAoKSA9PiB7XHJcbiAgICAgIGJlZm9yZUVhY2hQcm92aWRlcnMoKCkgPT4gW1xyXG4gICAgICAgIHtwcm92aWRlOiAnQ2FuRGVhY3RpdmF0ZScsIHVzZVZhbHVlOiAoYzpUZWFtQ21wLCBhOkFjdGl2YXRlZFJvdXRlU25hcHNob3QsIGI6Um91dGVyU3RhdGVTbmFwc2hvdCkgPT4ge1xyXG4gICAgICAgICAgcmV0dXJuIG9mKGZhbHNlKTtcclxuICAgICAgICB9fVxyXG4gICAgICBdKTtcclxuXHJcbiAgICAgIGl0KCd3b3JrcycsXHJcbiAgICAgICAgZmFrZUFzeW5jKGluamVjdChbUm91dGVyLCBUZXN0Q29tcG9uZW50QnVpbGRlciwgTG9jYXRpb25dLCAocm91dGVyOlJvdXRlciwgdGNiOlRlc3RDb21wb25lbnRCdWlsZGVyLCBsb2NhdGlvbjpMb2NhdGlvbikgPT4ge1xyXG4gICAgICAgICAgY29uc3QgZml4dHVyZSA9IHRjYi5jcmVhdGVGYWtlQXN5bmMoUm9vdENtcCk7XHJcbiAgICAgICAgICBhZHZhbmNlKGZpeHR1cmUpO1xyXG5cclxuICAgICAgICAgIHJvdXRlci5yZXNldENvbmZpZyhbXHJcbiAgICAgICAgICAgIHsgcGF0aDogJ3RlYW0vOmlkJywgY29tcG9uZW50OiBUZWFtQ21wLCBjYW5EZWFjdGl2YXRlOiBbJ0NhbkRlYWN0aXZhdGUnXSB9XHJcbiAgICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgICByb3V0ZXIubmF2aWdhdGVCeVVybCgnL3RlYW0vMjInKTtcclxuICAgICAgICAgIGFkdmFuY2UoZml4dHVyZSk7XHJcbiAgICAgICAgICBleHBlY3QobG9jYXRpb24ucGF0aCgpKS50b0VxdWFsKCcvdGVhbS8yMicpO1xyXG5cclxuICAgICAgICAgIHJvdXRlci5uYXZpZ2F0ZUJ5VXJsKCcvdGVhbS8zMycpO1xyXG4gICAgICAgICAgYWR2YW5jZShmaXh0dXJlKTtcclxuICAgICAgICAgIGV4cGVjdChsb2NhdGlvbi5wYXRoKCkpLnRvRXF1YWwoJy90ZWFtLzIyJyk7XHJcbiAgICAgICAgfSkpKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBkZXNjcmliZShcInJvdXRlckFjdGl2ZUxpbmtcIiwgKCkgPT4ge1xyXG4gICAgaXQoXCJzaG91bGQgc2V0IHRoZSBjbGFzcyB3aGVuIHRoZSBsaW5rIGlzIGFjdGl2ZSAoZXhhY3QgPSB0cnVlKVwiLFxyXG4gICAgICBmYWtlQXN5bmMoaW5qZWN0KFtSb3V0ZXIsIFRlc3RDb21wb25lbnRCdWlsZGVyLCBMb2NhdGlvbl0sIChyb3V0ZXI6Um91dGVyLCB0Y2I6VGVzdENvbXBvbmVudEJ1aWxkZXIsIGxvY2F0aW9uOkxvY2F0aW9uKSA9PiB7XHJcbiAgICAgIGNvbnN0IGZpeHR1cmUgPSB0Y2IuY3JlYXRlRmFrZUFzeW5jKFJvb3RDbXApO1xyXG4gICAgICBhZHZhbmNlKGZpeHR1cmUpO1xyXG5cclxuICAgICAgcm91dGVyLnJlc2V0Q29uZmlnKFtcclxuICAgICAgICB7IHBhdGg6ICd0ZWFtLzppZCcsIGNvbXBvbmVudDogVGVhbUNtcCwgY2hpbGRyZW46IFtcclxuICAgICAgICAgIHsgcGF0aDogJ2xpbmsnLCBjb21wb25lbnQ6IER1bW15TGlua0NtcCwgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAge3BhdGg6ICdzaW1wbGUnLCBjb21wb25lbnQ6IFNpbXBsZUNtcH0sXHJcbiAgICAgICAgICAgIHtwYXRoOiAnJywgY29tcG9uZW50OiBCbGFua0NtcH1cclxuICAgICAgICAgIF0gfVxyXG4gICAgICAgIF0gfVxyXG4gICAgICBdKTtcclxuXHJcbiAgICAgIHJvdXRlci5uYXZpZ2F0ZUJ5VXJsKCcvdGVhbS8yMi9saW5rJyk7XHJcbiAgICAgIGFkdmFuY2UoZml4dHVyZSk7XHJcbiAgICAgIGV4cGVjdChsb2NhdGlvbi5wYXRoKCkpLnRvRXF1YWwoJy90ZWFtLzIyL2xpbmsnKTtcclxuXHJcbiAgICAgIGNvbnN0IG5hdGl2ZSA9IGZpeHR1cmUuZGVidWdFbGVtZW50Lm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcihcImFcIik7XHJcbiAgICAgIGV4cGVjdChuYXRpdmUuY2xhc3NOYW1lKS50b0VxdWFsKFwiYWN0aXZlXCIpO1xyXG5cclxuICAgICAgcm91dGVyLm5hdmlnYXRlQnlVcmwoJy90ZWFtLzIyL2xpbmsvc2ltcGxlJyk7XHJcbiAgICAgIGFkdmFuY2UoZml4dHVyZSk7XHJcbiAgICAgIGV4cGVjdChsb2NhdGlvbi5wYXRoKCkpLnRvRXF1YWwoJy90ZWFtLzIyL2xpbmsvc2ltcGxlJyk7XHJcbiAgICAgIGV4cGVjdChuYXRpdmUuY2xhc3NOYW1lKS50b0VxdWFsKFwiXCIpO1xyXG4gICAgfSkpKTtcclxuXHJcbiAgICBpdChcInNob3VsZCBzZXQgdGhlIGNsYXNzIG9uIGEgcGFyZW50IGVsZW1lbnQgd2hlbiB0aGUgbGluayBpcyBhY3RpdmUgKGV4YWN0ID0gdHJ1ZSlcIixcclxuICAgICAgZmFrZUFzeW5jKGluamVjdChbUm91dGVyLCBUZXN0Q29tcG9uZW50QnVpbGRlciwgTG9jYXRpb25dLCAocm91dGVyOlJvdXRlciwgdGNiOlRlc3RDb21wb25lbnRCdWlsZGVyLCBsb2NhdGlvbjpMb2NhdGlvbikgPT4ge1xyXG4gICAgICBjb25zdCBmaXh0dXJlID0gdGNiLmNyZWF0ZUZha2VBc3luYyhSb290Q21wKTtcclxuICAgICAgYWR2YW5jZShmaXh0dXJlKTtcclxuXHJcbiAgICAgIHJvdXRlci5yZXNldENvbmZpZyhbXHJcbiAgICAgICAgeyBwYXRoOiAndGVhbS86aWQnLCBjb21wb25lbnQ6IFRlYW1DbXAsIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICB7IHBhdGg6ICdsaW5rJywgY29tcG9uZW50OiBEdW1teUxpbmtXaXRoUGFyZW50Q21wLCBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICB7cGF0aDogJ3NpbXBsZScsIGNvbXBvbmVudDogU2ltcGxlQ21wfSxcclxuICAgICAgICAgICAge3BhdGg6ICcnLCBjb21wb25lbnQ6IEJsYW5rQ21wfVxyXG4gICAgICAgICAgXSB9XHJcbiAgICAgICAgXSB9XHJcbiAgICAgIF0pO1xyXG5cclxuICAgICAgcm91dGVyLm5hdmlnYXRlQnlVcmwoJy90ZWFtLzIyL2xpbmsnKTtcclxuICAgICAgYWR2YW5jZShmaXh0dXJlKTtcclxuICAgICAgZXhwZWN0KGxvY2F0aW9uLnBhdGgoKSkudG9FcXVhbCgnL3RlYW0vMjIvbGluaycpO1xyXG5cclxuICAgICAgY29uc3QgbmF0aXZlID0gZml4dHVyZS5kZWJ1Z0VsZW1lbnQubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKFwibGluay1wYXJlbnRcIik7XHJcbiAgICAgIGV4cGVjdChuYXRpdmUuY2xhc3NOYW1lKS50b0VxdWFsKFwiYWN0aXZlXCIpO1xyXG5cclxuICAgICAgcm91dGVyLm5hdmlnYXRlQnlVcmwoJy90ZWFtLzIyL2xpbmsvc2ltcGxlJyk7XHJcbiAgICAgIGFkdmFuY2UoZml4dHVyZSk7XHJcbiAgICAgIGV4cGVjdChsb2NhdGlvbi5wYXRoKCkpLnRvRXF1YWwoJy90ZWFtLzIyL2xpbmsvc2ltcGxlJyk7XHJcbiAgICAgIGV4cGVjdChuYXRpdmUuY2xhc3NOYW1lKS50b0VxdWFsKFwiXCIpO1xyXG4gICAgfSkpKTtcclxuXHJcbiAgICBpdChcInNob3VsZCBzZXQgdGhlIGNsYXNzIHdoZW4gdGhlIGxpbmsgaXMgYWN0aXZlIChleGFjdCA9IGZhbHNlKVwiLFxyXG4gICAgICBmYWtlQXN5bmMoaW5qZWN0KFtSb3V0ZXIsIFRlc3RDb21wb25lbnRCdWlsZGVyLCBMb2NhdGlvbl0sIChyb3V0ZXI6Um91dGVyLCB0Y2I6VGVzdENvbXBvbmVudEJ1aWxkZXIsIGxvY2F0aW9uOkxvY2F0aW9uKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZml4dHVyZSA9IHRjYi5jcmVhdGVGYWtlQXN5bmMoUm9vdENtcCk7XHJcbiAgICAgICAgYWR2YW5jZShmaXh0dXJlKTtcclxuXHJcbiAgICAgICAgcm91dGVyLnJlc2V0Q29uZmlnKFtcclxuICAgICAgICAgIHsgcGF0aDogJ3RlYW0vOmlkJywgY29tcG9uZW50OiBUZWFtQ21wLCBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICB7IHBhdGg6ICdsaW5rJywgY29tcG9uZW50OiBEdW1teUxpbmtDbXAsIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgICAge3BhdGg6ICdzaW1wbGUnLCBjb21wb25lbnQ6IFNpbXBsZUNtcH0sXHJcbiAgICAgICAgICAgICAge3BhdGg6ICcnLCBjb21wb25lbnQ6IEJsYW5rQ21wfVxyXG4gICAgICAgICAgICBdIH1cclxuICAgICAgICAgIF0gfVxyXG4gICAgICAgIF0pO1xyXG5cclxuICAgICAgICByb3V0ZXIubmF2aWdhdGVCeVVybCgnL3RlYW0vMjIvbGluaztleGFjdD1mYWxzZScpO1xyXG4gICAgICAgIGFkdmFuY2UoZml4dHVyZSk7XHJcbiAgICAgICAgZXhwZWN0KGxvY2F0aW9uLnBhdGgoKSkudG9FcXVhbCgnL3RlYW0vMjIvbGluaztleGFjdD1mYWxzZScpO1xyXG5cclxuICAgICAgICBjb25zdCBuYXRpdmUgPSBmaXh0dXJlLmRlYnVnRWxlbWVudC5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJhXCIpO1xyXG4gICAgICAgIGV4cGVjdChuYXRpdmUuY2xhc3NOYW1lKS50b0VxdWFsKFwiYWN0aXZlXCIpO1xyXG5cclxuICAgICAgICByb3V0ZXIubmF2aWdhdGVCeVVybCgnL3RlYW0vMjIvbGluay9zaW1wbGUnKTtcclxuICAgICAgICBhZHZhbmNlKGZpeHR1cmUpO1xyXG4gICAgICAgIGV4cGVjdChsb2NhdGlvbi5wYXRoKCkpLnRvRXF1YWwoJy90ZWFtLzIyL2xpbmsvc2ltcGxlJyk7XHJcbiAgICAgICAgZXhwZWN0KG5hdGl2ZS5jbGFzc05hbWUpLnRvRXF1YWwoXCJhY3RpdmVcIik7XHJcbiAgICAgIH0pKSk7XHJcblxyXG4gIH0pO1xyXG59KTtcclxuXHJcbmZ1bmN0aW9uIGV4cGVjdEV2ZW50cyhldmVudHM6RXZlbnRbXSwgcGFpcnM6IGFueVtdKSB7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBldmVudHMubGVuZ3RoOyArK2kpIHtcclxuICAgIGV4cGVjdCgoPGFueT5ldmVudHNbaV0uY29uc3RydWN0b3IpLm5hbWUpLnRvQmUocGFpcnNbaV1bMF0ubmFtZSk7XHJcbiAgICBleHBlY3QoKDxhbnk+ZXZlbnRzW2ldKS51cmwpLnRvQmUocGFpcnNbaV1bMV0pO1xyXG4gIH1cclxufVxyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdsaW5rLWNtcCcsXHJcbiAgdGVtcGxhdGU6IGA8YSByb3V0ZXJMaW5rPVwiL3RlYW0vMzMvc2ltcGxlXCI+bGluazwvYT5gLFxyXG4gIGRpcmVjdGl2ZXM6IFJPVVRFUl9ESVJFQ1RJVkVTXHJcbn0pXHJcbmNsYXNzIFN0cmluZ0xpbmtDbXAge31cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbGluay1jbXAnLFxyXG4gIHRlbXBsYXRlOiBgPHJvdXRlci1vdXRsZXQ+PC9yb3V0ZXItb3V0bGV0PjxhIFtyb3V0ZXJMaW5rXT1cIlsnL3RlYW0vMzMvc2ltcGxlJ11cIj5saW5rPC9hPmAsXHJcbiAgZGlyZWN0aXZlczogUk9VVEVSX0RJUkVDVElWRVNcclxufSlcclxuY2xhc3MgQWJzb2x1dGVMaW5rQ21wIHt9XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2xpbmstY21wJyxcclxuICB0ZW1wbGF0ZTogYDxyb3V0ZXItb3V0bGV0Pjwvcm91dGVyLW91dGxldD48YSByb3V0ZXJMaW5rQWN0aXZlPVwiYWN0aXZlXCIgW3JvdXRlckxpbmtBY3RpdmVPcHRpb25zXT1cIntleGFjdDogZXhhY3R9XCIgW3JvdXRlckxpbmtdPVwiWycuLyddXCI+bGluazwvYT5gLFxyXG4gIGRpcmVjdGl2ZXM6IFJPVVRFUl9ESVJFQ1RJVkVTXHJcbn0pXHJcbmNsYXNzIER1bW15TGlua0NtcCB7XHJcbiAgcHJpdmF0ZSBleGFjdDogYm9vbGVhbjtcclxuICBjb25zdHJ1Y3Rvcihyb3V0ZTogQWN0aXZhdGVkUm91dGUpIHtcclxuICAgIC8vIGNvbnZlcnQgJ2ZhbHNlJyBpbnRvIGZhbHNlXHJcbiAgICB0aGlzLmV4YWN0ID0gKDxhbnk+cm91dGUuc25hcHNob3QucGFyYW1zKS5leGFjdCAhPT0gJ2ZhbHNlJztcclxuICB9XHJcbn1cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbGluay1jbXAnLFxyXG4gIHRlbXBsYXRlOiBgPHJvdXRlci1vdXRsZXQ+PC9yb3V0ZXItb3V0bGV0PjxsaW5rLXBhcmVudCByb3V0ZXJMaW5rQWN0aXZlPVwiYWN0aXZlXCI+PGEgW3JvdXRlckxpbmtdPVwiWycuLyddXCI+bGluazwvYT48L2xpbmstcGFyZW50PmAsXHJcbiAgZGlyZWN0aXZlczogUk9VVEVSX0RJUkVDVElWRVNcclxufSlcclxuY2xhc3MgRHVtbXlMaW5rV2l0aFBhcmVudENtcCB7XHJcbn1cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbGluay1jbXAnLFxyXG4gIHRlbXBsYXRlOiBgPGEgW3JvdXRlckxpbmtdPVwiWycuLi9zaW1wbGUnXVwiPmxpbms8L2E+YCxcclxuICBkaXJlY3RpdmVzOiBST1VURVJfRElSRUNUSVZFU1xyXG59KVxyXG5jbGFzcyBSZWxhdGl2ZUxpbmtDbXAge31cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbGluay1jbXAnLFxyXG4gIHRlbXBsYXRlOiBgPGEgW3JvdXRlckxpbmtdPVwiWycuLi9zaW1wbGUnXVwiIFtxdWVyeVBhcmFtc109XCJ7cTogJzEnfVwiIGZyYWdtZW50PVwiZlwiPmxpbms8L2E+YCxcclxuICBkaXJlY3RpdmVzOiBST1VURVJfRElSRUNUSVZFU1xyXG59KVxyXG5jbGFzcyBMaW5rV2l0aFF1ZXJ5UGFyYW1zQW5kRnJhZ21lbnQge31cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnc2ltcGxlLWNtcCcsXHJcbiAgdGVtcGxhdGU6IGBzaW1wbGVgLFxyXG4gIGRpcmVjdGl2ZXM6IFJPVVRFUl9ESVJFQ1RJVkVTXHJcbn0pXHJcbmNsYXNzIFNpbXBsZUNtcCB7XHJcbn1cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYmxhbmstY21wJyxcclxuICB0ZW1wbGF0ZTogYGAsXHJcbiAgZGlyZWN0aXZlczogUk9VVEVSX0RJUkVDVElWRVNcclxufSlcclxuY2xhc3MgQmxhbmtDbXAge1xyXG59XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ3RlYW0tY21wJyxcclxuICB0ZW1wbGF0ZTogYHRlYW0ge3tpZCB8IGFzeW5jfX0geyA8cm91dGVyLW91dGxldD48L3JvdXRlci1vdXRsZXQ+LCByaWdodDogPHJvdXRlci1vdXRsZXQgbmFtZT1cInJpZ2h0XCI+PC9yb3V0ZXItb3V0bGV0PiB9YCxcclxuICBkaXJlY3RpdmVzOiBST1VURVJfRElSRUNUSVZFU1xyXG59KVxyXG5jbGFzcyBUZWFtQ21wIHtcclxuICBpZDogT2JzZXJ2YWJsZTxzdHJpbmc+O1xyXG4gIHJlY29yZGVkUGFyYW1zOiBQYXJhbXNbXSA9IFtdO1xyXG5cclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcm91dGU6IEFjdGl2YXRlZFJvdXRlKSB7XHJcbiAgICB0aGlzLmlkID0gcm91dGUucGFyYW1zLm1hcChwID0+IHBbJ2lkJ10pO1xyXG4gICAgcm91dGUucGFyYW1zLmZvckVhY2goXyA9PiB0aGlzLnJlY29yZGVkUGFyYW1zLnB1c2goXykpO1xyXG4gIH1cclxufVxyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICd1c2VyLWNtcCcsXHJcbiAgdGVtcGxhdGU6IGB1c2VyIHt7bmFtZSB8IGFzeW5jfX1gLFxyXG4gIGRpcmVjdGl2ZXM6IFtST1VURVJfRElSRUNUSVZFU11cclxufSlcclxuY2xhc3MgVXNlckNtcCB7XHJcbiAgbmFtZTogT2JzZXJ2YWJsZTxzdHJpbmc+O1xyXG4gIHJlY29yZGVkUGFyYW1zOiBQYXJhbXNbXSA9IFtdO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihyb3V0ZTogQWN0aXZhdGVkUm91dGUpIHtcclxuICAgIHRoaXMubmFtZSA9IHJvdXRlLnBhcmFtcy5tYXAocCA9PiBwWyduYW1lJ10pO1xyXG4gICAgcm91dGUucGFyYW1zLmZvckVhY2goXyA9PiB0aGlzLnJlY29yZGVkUGFyYW1zLnB1c2goXykpO1xyXG4gIH1cclxufVxyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdxdWVyeS1jbXAnLFxyXG4gIHRlbXBsYXRlOiBgcXVlcnk6IHt7bmFtZSB8IGFzeW5jfX0gZnJhZ21lbnQ6IHt7ZnJhZ21lbnQgfCBhc3luY319YCxcclxuICBkaXJlY3RpdmVzOiBbUk9VVEVSX0RJUkVDVElWRVNdXHJcbn0pXHJcbmNsYXNzIFF1ZXJ5UGFyYW1zQW5kRnJhZ21lbnRDbXAge1xyXG4gIG5hbWU6IE9ic2VydmFibGU8c3RyaW5nPjtcclxuICBmcmFnbWVudDogT2JzZXJ2YWJsZTxzdHJpbmc+O1xyXG5cclxuICBjb25zdHJ1Y3Rvcihyb3V0ZXI6IFJvdXRlcikge1xyXG4gICAgdGhpcy5uYW1lID0gcm91dGVyLnJvdXRlclN0YXRlLnF1ZXJ5UGFyYW1zLm1hcChwID0+IHBbJ25hbWUnXSk7XHJcbiAgICB0aGlzLmZyYWdtZW50ID0gcm91dGVyLnJvdXRlclN0YXRlLmZyYWdtZW50O1xyXG4gIH1cclxufVxyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdyb290LWNtcCcsXHJcbiAgdGVtcGxhdGU6IGA8cm91dGVyLW91dGxldD48L3JvdXRlci1vdXRsZXQ+YCxcclxuICBkaXJlY3RpdmVzOiBbUk9VVEVSX0RJUkVDVElWRVNdXHJcbn0pXHJcbmNsYXNzIFJvb3RDbXAge31cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAncm9vdC1jbXAnLFxyXG4gIHRlbXBsYXRlOiBgcHJpbWFyeSB7PHJvdXRlci1vdXRsZXQ+PC9yb3V0ZXItb3V0bGV0Pn0gcmlnaHQgezxyb3V0ZXItb3V0bGV0IG5hbWU9XCJyaWdodFwiPjwvcm91dGVyLW91dGxldD59YCxcclxuICBkaXJlY3RpdmVzOiBbUk9VVEVSX0RJUkVDVElWRVNdXHJcbn0pXHJcbmNsYXNzIFJvb3RDbXBXaXRoVHdvT3V0bGV0cyB7fVxyXG5cclxuZnVuY3Rpb24gYWR2YW5jZShmaXh0dXJlOiBDb21wb25lbnRGaXh0dXJlPGFueT4pOiB2b2lkIHtcclxuICB0aWNrKCk7XHJcbiAgZml4dHVyZS5kZXRlY3RDaGFuZ2VzKCk7XHJcbn1cclxuIl19