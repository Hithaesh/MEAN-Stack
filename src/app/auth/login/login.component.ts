import { Component } from "@angular/core";

//Todo: Loading this via routing, so ignoring the step of adding a selector ('app-login-component')
@Component({
  // selector: 'app-login-component'
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isLoading: boolean = false;

}