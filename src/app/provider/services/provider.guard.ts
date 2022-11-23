import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, Router } from "@angular/router";
import { BaseGuard } from "src/app/services/base.guard";
import { CreateComponent } from "../create/create.component";

@Injectable()
export class ProviderGuardService extends BaseGuard implements CanActivate, CanDeactivate<CreateComponent> {

    constructor(protected override router: Router) { super(router); }

    canDeactivate(component: CreateComponent) {
        if (component.unsaveChanges) {
            return window.confirm('Tem certeza que deseja abandonar o preenchimento do formulário?');
        }
        return true;
    }

    canActivate(routeAc: ActivatedRouteSnapshot) {
        return super.validateClaims(routeAc);
    }

}