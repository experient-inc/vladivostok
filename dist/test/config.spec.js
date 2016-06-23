var config_1 = require('../src/config');
describe('config', function () {
    describe("validateConfig", function () {
        it("should not throw when no errors", function () {
            config_1.validateConfig([
                { path: '', redirectTo: 'b' },
                { path: 'b', component: ComponentA }
            ]);
        });
        it("should throw when redirectTo and children are used together", function () {
            expect(function () {
                config_1.validateConfig([
                    {
                        path: 'a', redirectTo: 'b', children: [
                            { path: 'b', component: ComponentA }
                        ]
                    }
                ]);
            }).toThrowError("Invalid configuration of route 'a': redirectTo and children cannot be used together");
        });
        it("should throw when component and redirectTo are used together", function () {
            expect(function () {
                config_1.validateConfig([
                    { path: 'a', component: ComponentA, redirectTo: 'b' }
                ]);
            }).toThrowError("Invalid configuration of route 'a': redirectTo and component cannot be used together");
        });
        it("should throw when path is missing", function () {
            expect(function () {
                config_1.validateConfig([
                    { component: '', redirectTo: 'b' }
                ]);
            }).toThrowError("Invalid route configuration: routes must have path specified");
        });
        it("should throw when none of component and children or direct are missing", function () {
            expect(function () {
                config_1.validateConfig([
                    { path: 'a' }
                ]);
            }).toThrowError("Invalid configuration of route 'a': component, redirectTo, children must be provided");
        });
        it("should throw when path starts with a slash", function () {
            expect(function () {
                config_1.validateConfig([
                    { path: '/a', componenta: '', redirectTo: 'b' }
                ]);
            }).toThrowError("Invalid route configuration of route '/a': path cannot start with a slash");
        });
    });
});
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90ZXN0L2NvbmZpZy5zcGVjLnRzIl0sIm5hbWVzIjpbIkNvbXBvbmVudEEiLCJDb21wb25lbnRBLmNvbnN0cnVjdG9yIiwiQ29tcG9uZW50QiIsIkNvbXBvbmVudEIuY29uc3RydWN0b3IiLCJDb21wb25lbnRDIiwiQ29tcG9uZW50Qy5jb25zdHJ1Y3RvciJdLCJtYXBwaW5ncyI6IkFBQUEsdUJBQTZCLGVBQWUsQ0FBQyxDQUFBO0FBRTdDLFFBQVEsQ0FBQyxRQUFRLEVBQUU7SUFDakIsUUFBUSxDQUFDLGdCQUFnQixFQUFFO1FBQ3pCLEVBQUUsQ0FBQyxpQ0FBaUMsRUFBRTtZQUNwQyx1QkFBYyxDQUFDO2dCQUNiLEVBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFDO2dCQUMzQixFQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBQzthQUNuQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyw2REFBNkQsRUFBRTtZQUNoRSxNQUFNLENBQUM7Z0JBQ0wsdUJBQWMsQ0FBQztvQkFDYjt3QkFDRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFOzRCQUN0QyxFQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBQzt5QkFDbkM7cUJBQ0E7aUJBQ0YsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLHFGQUFxRixDQUFDLENBQUM7UUFDekcsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsOERBQThELEVBQUU7WUFDakUsTUFBTSxDQUFDO2dCQUNMLHVCQUFjLENBQUM7b0JBQ2IsRUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBQztpQkFDcEQsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLHNGQUFzRixDQUFDLENBQUM7UUFDMUcsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsbUNBQW1DLEVBQUU7WUFDdEMsTUFBTSxDQUFDO2dCQUNMLHVCQUFjLENBQUM7b0JBQ2IsRUFBQyxTQUFTLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUM7aUJBQ2pDLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyw4REFBOEQsQ0FBQyxDQUFDO1FBQ2xGLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHdFQUF3RSxFQUFFO1lBQzNFLE1BQU0sQ0FBQztnQkFDTCx1QkFBYyxDQUFDO29CQUNiLEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBQztpQkFDWixDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsc0ZBQXNGLENBQUMsQ0FBQztRQUMxRyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyw0Q0FBNEMsRUFBRTtZQUMvQyxNQUFNLENBQUM7Z0JBQ0wsdUJBQWMsQ0FBQztvQkFDUixFQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFDO2lCQUNuRCxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsMkVBQTJFLENBQUMsQ0FBQztRQUMvRixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFSDtJQUFBQTtJQUNBQyxDQUFDQTtJQUFERCxpQkFBQ0E7QUFBREEsQ0FBQ0EsQUFERCxJQUNDO0FBQ0Q7SUFBQUU7SUFDQUMsQ0FBQ0E7SUFBREQsaUJBQUNBO0FBQURBLENBQUNBLEFBREQsSUFDQztBQUNEO0lBQUFFO0lBQ0FDLENBQUNBO0lBQURELGlCQUFDQTtBQUFEQSxDQUFDQSxBQURELElBQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge3ZhbGlkYXRlQ29uZmlnfSBmcm9tICcuLi9zcmMvY29uZmlnJztcclxuXHJcbmRlc2NyaWJlKCdjb25maWcnLCAoKSA9PiB7XHJcbiAgZGVzY3JpYmUoXCJ2YWxpZGF0ZUNvbmZpZ1wiLCAoKSA9PiB7XHJcbiAgICBpdChcInNob3VsZCBub3QgdGhyb3cgd2hlbiBubyBlcnJvcnNcIiwgKCkgPT4ge1xyXG4gICAgICB2YWxpZGF0ZUNvbmZpZyhbXHJcbiAgICAgICAge3BhdGg6ICcnLCByZWRpcmVjdFRvOiAnYid9LFxyXG4gICAgICAgIHtwYXRoOiAnYicsIGNvbXBvbmVudDogQ29tcG9uZW50QX1cclxuICAgICAgXSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdChcInNob3VsZCB0aHJvdyB3aGVuIHJlZGlyZWN0VG8gYW5kIGNoaWxkcmVuIGFyZSB1c2VkIHRvZ2V0aGVyXCIsICgpID0+IHtcclxuICAgICAgZXhwZWN0KCgpID0+IHtcclxuICAgICAgICB2YWxpZGF0ZUNvbmZpZyhbXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHBhdGg6ICdhJywgcmVkaXJlY3RUbzogJ2InLCBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICB7cGF0aDogJ2InLCBjb21wb25lbnQ6IENvbXBvbmVudEF9XHJcbiAgICAgICAgICBdXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgXSk7XHJcbiAgICAgIH0pLnRvVGhyb3dFcnJvcihgSW52YWxpZCBjb25maWd1cmF0aW9uIG9mIHJvdXRlICdhJzogcmVkaXJlY3RUbyBhbmQgY2hpbGRyZW4gY2Fubm90IGJlIHVzZWQgdG9nZXRoZXJgKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KFwic2hvdWxkIHRocm93IHdoZW4gY29tcG9uZW50IGFuZCByZWRpcmVjdFRvIGFyZSB1c2VkIHRvZ2V0aGVyXCIsICgpID0+IHtcclxuICAgICAgZXhwZWN0KCgpID0+IHtcclxuICAgICAgICB2YWxpZGF0ZUNvbmZpZyhbXHJcbiAgICAgICAgICB7cGF0aDogJ2EnLCBjb21wb25lbnQ6IENvbXBvbmVudEEsIHJlZGlyZWN0VG86ICdiJ31cclxuICAgICAgICBdKTtcclxuICAgICAgfSkudG9UaHJvd0Vycm9yKGBJbnZhbGlkIGNvbmZpZ3VyYXRpb24gb2Ygcm91dGUgJ2EnOiByZWRpcmVjdFRvIGFuZCBjb21wb25lbnQgY2Fubm90IGJlIHVzZWQgdG9nZXRoZXJgKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KFwic2hvdWxkIHRocm93IHdoZW4gcGF0aCBpcyBtaXNzaW5nXCIsICgpID0+IHtcclxuICAgICAgZXhwZWN0KCgpID0+IHtcclxuICAgICAgICB2YWxpZGF0ZUNvbmZpZyhbXHJcbiAgICAgICAgICB7Y29tcG9uZW50OiAnJywgcmVkaXJlY3RUbzogJ2InfVxyXG4gICAgICAgIF0pO1xyXG4gICAgICB9KS50b1Rocm93RXJyb3IoYEludmFsaWQgcm91dGUgY29uZmlndXJhdGlvbjogcm91dGVzIG11c3QgaGF2ZSBwYXRoIHNwZWNpZmllZGApO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoXCJzaG91bGQgdGhyb3cgd2hlbiBub25lIG9mIGNvbXBvbmVudCBhbmQgY2hpbGRyZW4gb3IgZGlyZWN0IGFyZSBtaXNzaW5nXCIsICgpID0+IHtcclxuICAgICAgZXhwZWN0KCgpID0+IHtcclxuICAgICAgICB2YWxpZGF0ZUNvbmZpZyhbXHJcbiAgICAgICAgICB7cGF0aDogJ2EnfVxyXG4gICAgICAgIF0pO1xyXG4gICAgICB9KS50b1Rocm93RXJyb3IoYEludmFsaWQgY29uZmlndXJhdGlvbiBvZiByb3V0ZSAnYSc6IGNvbXBvbmVudCwgcmVkaXJlY3RUbywgY2hpbGRyZW4gbXVzdCBiZSBwcm92aWRlZGApO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoXCJzaG91bGQgdGhyb3cgd2hlbiBwYXRoIHN0YXJ0cyB3aXRoIGEgc2xhc2hcIiwgKCkgPT4ge1xyXG4gICAgICBleHBlY3QoKCkgPT4ge1xyXG4gICAgICAgIHZhbGlkYXRlQ29uZmlnKFtcclxuICAgICAgICAgIDxhbnk+e3BhdGg6ICcvYScsIGNvbXBvbmVudGE6ICcnLCByZWRpcmVjdFRvOiAnYid9XHJcbiAgICAgICAgXSk7XHJcbiAgICAgIH0pLnRvVGhyb3dFcnJvcihgSW52YWxpZCByb3V0ZSBjb25maWd1cmF0aW9uIG9mIHJvdXRlICcvYSc6IHBhdGggY2Fubm90IHN0YXJ0IHdpdGggYSBzbGFzaGApO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbn0pO1xyXG5cclxuY2xhc3MgQ29tcG9uZW50QSB7XHJcbn1cclxuY2xhc3MgQ29tcG9uZW50QiB7XHJcbn1cclxuY2xhc3MgQ29tcG9uZW50QyB7XHJcbn1cclxuIl19