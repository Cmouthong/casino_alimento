import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map, catchError, throwError } from 'rxjs';
import { User, UserRole } from '../interfaces/user.interface';
import { AuthResponse } from '../interfaces/auth.interface';
import { environment } from '../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
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
            this.clearStorage();
          }
        } catch (e) {
          this.clearStorage();
        }
      }
    }
  }

  private clearStorage(): void {
    if (this.isBrowser) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  login(cedula: string, password: string): Observable<User> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { cedula, password })
      .pipe(
        map((resp: AuthResponse) => {
          const user: User = {
            id: resp.id,
            cedula: resp.cedula,
            nombre: resp.nombre,
            email: resp.email,
            telefono: resp.telefono,
            rol: resp.rol,
            token: resp.token,
            activo: resp.activo,
            createdAt: new Date(resp.createdAt),
            updatedAt: new Date(resp.updatedAt)
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
        }),
        catchError((error: HttpErrorResponse) => {
          this.clearStorage();
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    this.clearStorage();
    this.currentUserSubject.next(null);
  }

  updateUser(user: User): void {
    if (this.isBrowser) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
    this.currentUserSubject.next(user);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value?.token;
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