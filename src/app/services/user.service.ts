import { Injectable } from '@angular/core';
import { 
  Auth, createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, signOut, signInWithPopup, 
  GoogleAuthProvider, sendEmailVerification, fetchSignInMethodsForEmail} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(public auth: Auth) { }

  //funcion para enviar link de verificacion al email registrado
  public async sendEmailVerificationAfterRegistration(userCredential: any): Promise<void> {
    const user = userCredential.user;
    return sendEmailVerification(user);
  }

  async register({ email, password }: any) {
    const signInMethods = await fetchSignInMethodsForEmail(this.auth,email)
    
    if (signInMethods.length === 0) {
      // El correo no está registrado, procede a registrar
      return createUserWithEmailAndPassword(this.auth, email, password)
          //si el registro es correcto llama a la funcion que envia el correo de verificacion
        .then(this.sendEmailVerificationAfterRegistration);
      } else {
      (this.sendEmailVerificationAfterRegistration);
      // El correo ya está registrado, puedes manejar esto de acuerdo a tus necesidades
      throw new Error('El correo ya está registrado');
    }
  }  

  login({ email, password }: any) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  loginWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  logout() {
    return signOut(this.auth);
  }

  // funcion para capturar email registrado y mostrarlo en mensaje
  async getRegisteredEmail() {
    const user = this.auth.currentUser;
    return user ? user.email : null;
  }

  // ...

public async sendVerificationEmail(email: string, verificationCode: string): Promise<void> {
  // Implementación de la función sendVerificationEmail
}

public async verifyCode(verificationCode: string, email: string): Promise<boolean> {
  // Implementación de la función verifyCode
  
  // Supongamos que isCodeCorrect es un valor booleano que determina si el código es correcto
  const isCodeCorrect = true; // Aquí deberías realizar la lógica de verificación

  return isCodeCorrect; // Devolver el resultado como una promesa resuelta
}


// ...


}
