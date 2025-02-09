import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";

//Todo: Loading this via routing, so ignoring the step of adding a selector ('app-signup-component')
@Component({
  templateUrl: "./signup.component.html",
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  isLoading: boolean = false;

  onLogin(form: NgForm) {
    console.log(form.value);
  }

}