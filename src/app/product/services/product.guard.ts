import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, Router, RouterStateSnapshot } from "@angular/router";
import { CreateComponent } from "src/app/provider/create/create.component";
import { LocalStorageUtils } from "src/app/utils/localstorage";

@Injectable()
export class ProductGuard implements CanActivate, CanDeactivate<CreateComponent> {
    
    localStorageUtils = new LocalStorageUtils();

    constructor(private router: Router){}

    canDeactivate(component: CreateComponent) {
        if(component.unsavedChanges) {
            return window.confirm('Tem certeza que deseja abandonar o preenchimento do formulario?');
        }        
        return true
    }

    canActivate(routeAc: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if(!this.localStorageUtils.obterTokenUsuario()){
            this.router.navigate(['/conta/login/'], { queryParams: { returnUrl: this.router.url }});
        }  

        let user = this.localStorageUtils.obterUsuario();

        let claim: any = routeAc.data[0];
        if (claim !== undefined) {
            let claim = routeAc.data[0]['claim'];

            if (claim) {
                if (!user.claims) {
                    this.navegateToAccessDanied();
                }
                
                let userClaims = user.claims.find(x => x.type === claim.nome);
                
                if(!userClaims){
                    this.navegateToAccessDanied();
                }
                
                let valoresClaim = userClaims.value as string;

                if (!valoresClaim.includes(claim.valor)) {
                    this.navegateToAccessDanied();
                }
            }
        }

        return true;  
    }

    navegateToAccessDanied() {
        this.router.navigate(['/acesso-negado']);
    }
}