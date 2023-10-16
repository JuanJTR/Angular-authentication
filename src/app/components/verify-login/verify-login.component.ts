import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { HttpClient } from '@angular/common/http';

//const { sendVerificationEmail } = require('./enviarCorreo.js'); // Ruta relativa al archivo enviarCorreo.js
declare var enviarCorreo: any; // Declarar la variable que contiene la función del archivo externo
//const { sendVerificationEmail } = require ('../../../auth-node/enviarCorreo.js');



@Component({
  selector: 'app-verify-login',
  templateUrl: './verify-login.component.html',
  styleUrls: ['./verify-login.component.css']
})
export class VerifyLoginComponent implements OnDestroy {
  registeredEmail: string | null = null;
  verificationCode: string = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private http: HttpClient  ) {
    this.init();
    
  }

  
  async init() {
    this.registeredEmail = await this.userService.getRegisteredEmail();
    this.verificationCode = '';
  }

async onSubmit() {
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

  
}

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

// verifica si el codigo ingresado es valido
  onVerify() {
    console.log('verificando codigo (verify-login). . . .')
  if (this.registeredEmail && this.verificationCode) {
    this.userService.verifyCode(this.verificationCode, this.registeredEmail)
      .then((isVerified) => {
        if (isVerified) {
          console.log('codigo correcto!')
          this.router.navigate(['/home']);
        } else {
          console.error('Código de verificación incorrecto');
        }
      })
      .catch(error => console.error('Error al verificar el código:', error));
  } else {
    console.error('No se pudo obtener el correo electrónico registrado o el código de verificación');
  }
}


  ngOnDestroy() {
    this.userService.logout();
  }
}
