import { Injectable } from "@angular/core";
import { CanActivate, CanDeactivate, Router } from "@angular/router";
import { LocalStorageUtils } from "src/app/utils/localstorage";
import { RegistrationComponent } from "../registration/registration.component";

@Injectable()
export class AccountGuard implements CanDeactivate<RegistrationComponent>, CanActivate{
    
    localStorageUtils = new LocalStorageUtils();

    constructor(private router: Router){}
    
    canDeactivate(component: RegistrationComponent) {
        if(component.unsavedChanges) {
            return window.confirm('Tem certeza que deseja abandonar o preenchimento do formulario?');
        }  

        return true
    }

    canActivate() {
        if(this.localStorageUtils.obterTokenUsuario()){
            this.router.navigate(['/home']);
        }

        return true;
    }

}