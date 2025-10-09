import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, timer } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ValidadorEmailDisponible {
    private API_URL = 'http://localhost:8080/api';

    constructor(private http: HttpClient) { }

    /**
     * Async validator that checks if an email is available.
     * Returns { emailTaken: true } if the email is already in use.
     */
    verificarEmailDisponible(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            if (!control.value) {
                return of(null); // empty → don't validate
            }

            // debounce 500ms before calling API
            return timer(500).pipe(
                switchMap(() =>
                    this.http.get<boolean>(`${this.API_URL}/auth/email/disponible`, {
                        params: { email: control.value }
                    })
                ),
                map((isAvailable: boolean) => (isAvailable ? null : { emailTaken: true })),
                catchError(() => of(null)) // don't block user if API fails
            );
        };
    }
}
