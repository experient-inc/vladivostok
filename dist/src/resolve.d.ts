import { ComponentResolver } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { RouterStateSnapshot } from './router_state';
export declare function resolve(resolver: ComponentResolver, state: RouterStateSnapshot): Observable<RouterStateSnapshot>;
