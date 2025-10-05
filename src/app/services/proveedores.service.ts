import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Sponsor } from "../models/entities/Sponsor";

@Injectable({
    providedIn: 'root'
})
export class ProveedoresService {
    constructor() { }
    private readonly http = inject(HttpClient);

    getSponsor(): Observable<Sponsor[]>{
        return this.http.get<Sponsor[]>('/sponsors');
    }

    getSponsorById(id: number): Observable<Sponsor>{
        return this.http.get<Sponsor>(`/sponsors/${id}`);
    }

    postSponsor(sponsor: Sponsor): Observable<Sponsor>{
        return this.http.post<Sponsor>('/sponsors', sponsor);
    }

    putSponsor(sponsor: Sponsor): Observable<Sponsor>{
        return this.http.put<Sponsor>(`/sponsors/${sponsor.id}`, sponsor);
    }

    deleteSponsor(id: number): Observable<void>{
        return this.http.delete<void>(`/sponsors/${id}`);
    }

}