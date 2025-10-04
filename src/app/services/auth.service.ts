import { Injectable } from '@angular/core';

interface LoginForm {
  user: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly user: String = 'admin';
  private readonly password: String = 'admin'
  token = '';
  
  constructor() {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      this.token = storedToken;
    }
  }

  isAuth() {
    console.log("Token = ", this.token)
    return this.token.length > 0;
  }

  login(loginForm: LoginForm): boolean {
    if (loginForm.user === this.user && loginForm.password === this.password) {
      this.token = Math.random().toString(36).substring(2);
      localStorage.setItem('token', this.token);
      return true;
    }
    this.token = '';
    localStorage.removeItem('token');
    return false;
  }

  logout() {
    this.token = '';
    localStorage.removeItem('token');
  }
}
