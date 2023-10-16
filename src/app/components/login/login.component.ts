import { Component } from '@angular/core';
import { User } from '@angular/fire/auth';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  formLogin: FormGroup;
  passwordVisible: boolean = false;

  registeredEmail: string | null = null;
  verificationCode: string = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private http: HttpClient
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
      this.registeredEmail = await this.userService.getRegisteredEmail();
      console.log(this.registeredEmail);
      console.log(user)
      if (user) {
        this.checkUserIsVerified(user);
      } else {
        console.error('No se pudo obtener el usuario después del registro');
      }
      // genera el codigo de verificacion cuando el usuario inicia sesion
      // y llama a la funcion para enviar el codigo al correo
        console.log('funcion async onSubmit');
    try {
      if (this.registeredEmail) {
        const VerifyCode = Math.floor(100000 + Math.random() * 900000);
        console.log('el email es: ' + this.registeredEmail+ " y el codigo es: "+VerifyCode);
        this.sendVerificationEmail(this.registeredEmail, VerifyCode);
      } else {
        console.error('No se pudo obtener el correo electrónico registrado');
      }
    } catch (error) {
      console.error('Error al enviar el código de verificación:', error);
    }
    } catch (error) {
      console.log('ERRROORRR')
      console.log('reedireccionando a /register');
      this.router.navigate(['/register']);
      console.log('Error en inicio de sesión o  cuenta no registrada: ', error);

      // Si hay un error de inicio de sesión, redirige al usuario a la página de registro.
    }

  }

  //funcion que captura el correo destino y el codigo de verificacion
  async sendVerificationEmail(email: string, code: number ) {
    try {
      console.log('funcion sendVerificationEmail, peticion http');
      console.log('el email es: ' + email+ " codigo: "+code);
      await this.http.post('http://localhost:3000/enviarCorreo', {
        email: email,
        secretcode: code
      }).toPromise();
    } catch (error) {
      console.error('Error al procesar el código de verificación:', error);
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
      this.router.navigate(['/verification-login']);
      console.log('redireccionando a verification-login');
    } else if (user) {
      this.router.navigate(['/verification-email']);
      console.log('redireccionando a verification-email');
    } else{
      this.router.navigate(['/register']);
      console.log('redireccionando a register; usuario no esxite');
    }
  }



  togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible;
    }
}
