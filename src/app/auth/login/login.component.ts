import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";

//Todo: Loading this via routing, so ignoring the step of adding a selector ('app-login-component')
@Component({
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isLoading: boolean = false;

  onLogin(form: NgForm) {
    console.log(form.value);
  }

}