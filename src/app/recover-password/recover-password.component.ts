import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styles: ['./styles/recover-password.component.sccs']
})
export class RecoverPasswordComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
  }

  onCancelar(){
    this.router.navigate(['/login']);
  }

}
