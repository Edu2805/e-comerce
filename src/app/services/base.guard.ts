import { ActivatedRouteSnapshot, Router } from "@angular/router";
import { LocalStorageUtils } from "../utils/localstorage";

export abstract class BaseGuard {

    private localStorageUtils = new LocalStorageUtils();

    constructor(protected router: Router){}
    
    protected validateClaims(routeAc: ActivatedRouteSnapshot) : boolean {

        if(!this.localStorageUtils.obterTokenUsuario()){
            this.router.navigate(['/conta/login/'], { queryParams: { returnUrl: this.router.url }});
        }  

        let user = this.localStorageUtils.obterUsuario();
        let claim: any = routeAc.data[0];

        if (claim !== undefined) {
            let claim = routeAc.data[0]['claim'];

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

    private navegateToAccessDenied() {
        this.router.navigate(['/acesso-negado']);
    }    
}
