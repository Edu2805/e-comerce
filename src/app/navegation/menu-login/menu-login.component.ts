import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-login',
  templateUrl: './menu-login.component.html'
})
export class MenuLoginComponent {

  token: string = "";
  user: any;
  email: string = "";

  constructor(private router: Router) {  }

  usuarioLogado(): boolean {
    

    return true;
  }

  logout() {

    this.router.navigate(['/home']);
  }
}
