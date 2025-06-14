import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { User, UserRole, AuthResponse } from '../interfaces/user.interface';
import { environment } from '../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed && typeof parsed === 'object') {
            this.currentUserSubject.next(parsed);
          } else {
            localStorage.removeItem('currentUser');
          }
        } catch (e) {
          localStorage.removeItem('currentUser');
        }
      }
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  login(cedula: string, password: string): Observable<User> {
    return this.http.post<AuthResponse>(`/auth/login`, { cedula, password })
      .pipe(
        map((resp: AuthResponse) => {
          const user: User = {
            cedula: resp.cedula,
            nombre: resp.nombre,
            email: resp.email,
            telefono: resp.telefono,
            rol: resp.rol as UserRole,
            token: resp.token
          };
          return user;
        }),
        tap(user => {
          if (this.isBrowser) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            if (user.token) {
              localStorage.setItem('token', user.token);
            }
          }
          this.currentUserSubject.next(user);
        })
      );
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
  }

  updateUser(user: User): void {
    if (this.isBrowser) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
    this.currentUserSubject.next(user);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  hasRole(role: UserRole): boolean {
    const user = this.currentUserSubject.value;
    return user?.rol === role;
  }

  getToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem('token');
    }
    return null;
  }
} 