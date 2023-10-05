import { Component } from '@angular/core';
import { User } from '@angular/fire/auth';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  formLogin: FormGroup;
  passwordVisible: boolean = false;


  constructor(
    private userService: UserService,
    private router: Router
  ) {
    this.formLogin = new FormGroup({
      email: new FormControl(),
      password: new FormControl()
    })
  }

  async onLogin() {
    try {
      const userCredential = await this.userService.login(this.formLogin.value);
      const user = userCredential.user;
      if (user) {
        this.checkUserIsVerified(user);
      } else {
        console.error('No se pudo obtener el usuario después del registro');
      }
    } catch (error) {
      console.log('reedireccionando a /register');
      this.router.navigate(['/register']);
      console.log('Error en inicio de sesión o  cuenta no registrada: ', error);

      // Si hay un error de inicio de sesión, redirige al usuario a la página de registro.
    }
  }

  onClick() {
    this.userService.loginWithGoogle()
      .then(response => {
        console.log(response);
        this.router.navigate(['/home']);
      })
      .catch(error => console.log(error))
  }

  private checkUserIsVerified(user: User) {
    if (user && user.emailVerified) {
      this.router.navigate(['/home']);
      console.log('redireccionando a home');
    } else if (user) {
      this.router.navigate(['/verification-email']);
      console.log('redireccionando a verification-email');
    } else {
      this.router.navigate(['/register']);
      console.log('redireccionando a register');
    }
  }

  togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible;
    }
}
