import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormComponent } from "./form/form.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

}
