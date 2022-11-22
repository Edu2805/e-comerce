import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { LocalStorageUtils } from "src/app/utils/localstorage";
import { CreateComponent } from "../create/create.component";

@Injectable()
export class ProviderGuardService implements CanActivate, CanDeactivate<CreateComponent> {

    localStorageUtils = new LocalStorageUtils();

    constructor(private router: Router) {}

    canDeactivate(component: CreateComponent) {
        if (component.unsavedChanges) {
            return window.confirm('Tem certeza que deseja abandonar o preenchimento do formulário?');
        }
        return true;
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        if (!this.localStorageUtils.obterTokenUsuario()) {
            this.router.navigate(['/conta/login'], { queryParams: { returnUrl: this.router.url }})
        }

        let user = this.localStorageUtils.obterUsuario();
        let claim: any = route.data[0];

        if (claim !== undefined) {
            let claim = route.data[0]['claim'];

            if (claim) {
                if (!user.claims) {
                    this.navegateToAccessDenied();
                }
                
                let userClaims = user.claims.find(x => x.type === claim.name);

                if (!userClaims) {
                    this.navegateToAccessDenied();
                }

                let valuesClaims = userClaims.value as string;

                if (!valuesClaims.includes(claim.value)) {
                    this.navegateToAccessDenied();
                }
            }
        }

        return true;
    }

    navegateToAccessDenied() {
        this.router.navigate(['acesso-negado'])
    }

}