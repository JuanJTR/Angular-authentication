import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-verify-login',
  templateUrl: './verify-login.component.html',
  styleUrls: ['./verify-login.component.css']
})
export class VerifyLoginComponent {
  registeredEmail: string | null = null;

  constructor(
    private userService: UserService,
    private router: Router
  ) {
    this.init();
  }

  async init() {
    this.registeredEmail = await this.userService.getRegisteredEmail();
  }

  onSendOk() {
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    this.userService.logout();
  }

}
