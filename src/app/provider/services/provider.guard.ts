import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { LocalStorageUtils } from "src/app/utils/localstorage";

@Injectable()
export class ProviderGuardService implements CanActivate{

    localStorageUtils = new LocalStorageUtils();

    constructor(private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        if (!this.localStorageUtils.obterTokenUsuario()) {
            this.router.navigate(['/conta/login'])
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