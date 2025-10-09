import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Sponsor } from "../models/entities/Sponsor";

@Injectable({
    providedIn: 'root'
})
export class SponsorService {
    constructor() { }
    private readonly http = inject(HttpClient);
     private readonly API_URL = 'http://localhost:8080/api/sponsors';

    getSponsor(): Observable<Sponsor[]>{
        return this.http.get<Sponsor[]>(this.API_URL);
    }

    getSponsorById(id: number): Observable<Sponsor>{
        return this.http.get<Sponsor>(`${this.API_URL}/${id}`);
    }

    postSponsor(sponsor: Sponsor): Observable<Sponsor>{
        return this.http.post<Sponsor>(this.API_URL, sponsor);
    }

    putSponsor(sponsor: Sponsor): Observable<Sponsor>{
        return this.http.put<Sponsor>(`${this.API_URL}/${sponsor.id}`, sponsor);
    }

    deleteSponsor(id: number): Observable<void>{
        return this.http.delete<void>(`${this.API_URL}/${id}`);
    }

}