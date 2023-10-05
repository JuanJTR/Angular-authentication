import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { SendEmailComponent } from './components/send-email/send-email.component';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { VerifyLoginComponent } from './components/verify-login/verify-login.component';

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch:'full' },
  {
    path: 'home',
    component: HomeComponent,
    ...canActivate(() => redirectUnauthorizedTo(['/login']))
  },
  {path: 'login', component:LoginComponent},
  {path: 'register', component:RegisterComponent},
  {path: 'home', component:HomeComponent},
  {path: 'verification-email', component:SendEmailComponent},
  {path: 'verification-login', component:VerifyLoginComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
