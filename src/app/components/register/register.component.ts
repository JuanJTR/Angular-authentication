import { Component, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  formReg: FormGroup;
  passwordVisible: boolean = false;

  constructor(
    public userService: UserService,
    private router: Router,
  ) {
    this.formReg = new FormGroup({
      email: new FormControl(),
      password: new FormControl()
    })
  }

  ngOnInit(): void {
  }

  // registro especifico por usuario
  // onSubmit() {
  //   this.userService.register(this.formReg.value)
  //     .then(response => {
  //       console.log(response);
  //       this.router.navigate(['/login']);
  //     })
  //     .catch(error => console.log(error));
  // }

  onSubmit() {
  this.userService.register(this.formReg.value)
    .then((response) => {
      console.log(response);
      return this.userService.auth.currentUser; // Obtener el usuario actual
    })
    .then((user) => {
      if (user) {
        console.log (user)
        this.checkUserIsVerified(user); // Verificar si el usuario está verificado
      } else {
        // Si el usuario no está disponible por alguna razón, manejarlo aquí
        console.error('No se pudo obtener el usuario después del registro');
      }
    })
    .catch(error => {
      console.log('Error en registro o el usuario ya esta registrado:', error);
      this.router.navigate(['/login']); // Redirigir a la página de login en caso de error
    });
  }


  // registro con google
  onClick() {
    this.userService.loginWithGoogle()
      .then(response => {
        console.log(response);
        this.router.navigate(['/login']);
      })
      .catch(error => console.log(error))
  }

  private checkUserIsVerified(user: User) {
    if (user && user.emailVerified) {
      //this.router.navigate(['/home']);
      console.log('redireccionando a login');
      this.router.navigate(['/login']);
    } else if (user) {
      this.router.navigate(['/verification-email']);
    } else {
      console.log('registro incorrecto');
    }
  }

    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible;
    }

}