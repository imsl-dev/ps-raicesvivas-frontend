import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../models/entities/Usuario';
import { AuthService } from '../../../services/auth.service';
import { HttpService } from '../../../services/http.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {

  user?: Usuario

  rolFormateado: string = ""

  loading = true;

  error?: string;

  isMyProfile: boolean = false;

  constructor(
    private httpService: HttpService,
    private authService: AuthService,
    private route: ActivatedRoute) { }
  ngOnInit(): void {
    //cargar datos del perfil basado en usuario
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.httpService
      .getUsuarioById(id)
      .subscribe({
        next: (usuario) => {
          this.user = usuario;
          this.loading = false;
          this.rolFormateado = this.formatearRol(this.user.rol)
          //checkear si es mi perfil

          this.checkIsMyProfile()

        },
        error: () => {
          this.error = 'Error al cargar los datos de usuario'
          this.loading = false
        }
      })


  }

  formatearRol(rol: string) {
    const splitted = rol.toLocaleLowerCase().split("")

    const uppercase = splitted[0].toUpperCase()

    splitted.shift()

    return uppercase + splitted.join("")

  }

  checkIsMyProfile() {
    this.authService.obtenerUsuarioLogueado().subscribe(
      (usuario) => {
        if (this.user?.id == usuario.id) {
          this.isMyProfile = true;
        }
      }
    )

  }

}
