import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, Router } from "@angular/router";
import { CreateComponent } from "../create/create.component";
import { BaseGuard } from "src/app/services/base.guard";

@Injectable()
export class ProductGuard extends BaseGuard implements CanActivate, CanDeactivate<CreateComponent> {

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