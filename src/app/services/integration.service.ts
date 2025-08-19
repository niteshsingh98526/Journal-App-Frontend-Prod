import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../model/login-request';
import { catchError, Observable, of } from 'rxjs';
import { LoginResponse } from '../model/login-response';
import { JournalEntry } from '../model/journal-entry';
import { UserEntry } from '../model/user-entry';
import { environment } from '../../environments/environment.prod';

//const API_URL = "http://localhost:8080/";

@Injectable({
  providedIn: 'root'
})
export class IntegrationService {

  private readonly API_URL = environment.apiUrl;

  constructor(private http:HttpClient) { }

  doLogin(request: LoginRequest):Observable<LoginResponse>{
    return this.http.post<LoginResponse>(`${this.API_URL}/public/login`, request)
  }

   // Get all journal entries
    getAllEntries(): Observable<JournalEntry[]> {
      return this.http.get<JournalEntry[]>(`${this.API_URL}/journal`)
    }
  
    // Get a single journal entry by ID
    getEntryById(id: number): Observable<JournalEntry> {
      return this.http.get<JournalEntry>(`${this.API_URL}/journal/id/${id}`);
    }
  
    // Create a new journal entry
    createEntry(entry: JournalEntry): Observable<JournalEntry> {
      return this.http.post<JournalEntry>(`${this.API_URL}/journal`, entry);
    }
  
    // Update an existing journal entry
    updateEntry(entry: JournalEntry): Observable<JournalEntry> {
      return this.http.put<JournalEntry>(`${this.API_URL}journal/id/${entry.id}`, entry);
    }
  
    // Delete a journal entry
    deleteEntry(id: number): Observable<void> {
      return this.http.delete<void>(`${this.API_URL}journal/id/${id}`);
    }

    // Public signup
    createUser(user: UserEntry): Observable<UserEntry> {
      return this.http.post<UserEntry>(`${this.API_URL}/public/signup`, user);
    }

    getCurrentUserGreeting(): Observable<string> {
    return this.http.get(`${this.API_URL}/users`, { responseType: 'text' }).pipe(
      catchError(error => {
        console.warn('Backend not available, using sample greeting:', error);
        return of('Hi , please login!');
      })
    );
  }

    // Current logged-in user profile
    getCurrentUser(): Observable<UserEntry> {
      return this.http.get<UserEntry>(`${this.API_URL}/users/me`);
    }

    // Admin APIs
    getAllUsers(): Observable<UserEntry[]> {
      return this.http.get<UserEntry[]>(`${this.API_URL}/admin/all-users`);
    }

    createNormalUser(user: UserEntry): Observable<UserEntry> {
      return this.http.post<UserEntry>(`${this.API_URL}/admin/create-user`, user);
    }

    createAdminUser(user: UserEntry): Observable<UserEntry> {
      return this.http.post<UserEntry>(`${this.API_URL}/public/create-admin-user`, user);
    }

    getUserById(id: number): Observable<UserEntry> {
      return this.http.get<UserEntry>(`${this.API_URL}/admin/user/${id}`);
    }

    getUserByName(name: string): Observable<UserEntry> {
      return this.http.get<UserEntry>(`${this.API_URL}/admin/user/by-name/${name}`);
    }

    searchUsersByUsername(q: string): Observable<UserEntry[]> {
      return this.http.get<UserEntry[]>(`${this.API_URL}/admin/search/by-username?q=${encodeURIComponent(q)}`);
    }

    searchUsersByEmail(q: string): Observable<UserEntry[]> {
      return this.http.get<UserEntry[]>(`${this.API_URL}/admin/search/by-email?q=${encodeURIComponent(q)}`);
    }

    updateUser(id: number, user: Partial<UserEntry>): Observable<UserEntry> {
      return this.http.put<UserEntry>(`${this.API_URL}/admin/user/${id}`, user);
    }

    updateUserRoles(id: number, roles: string[]): Observable<UserEntry> {
      return this.http.put<UserEntry>(`${this.API_URL}/admin/user/${id}/roles`, roles);
    }

    deleteUser(id: number): Observable<void> {
      return this.http.delete<void>(`${this.API_URL}/admin/user/${id}`);
    }

    // Forgot password
    requestPasswordReset(emailOrUsername: string): Observable<void> {
      return this.http.post<void>(`${this.API_URL}/public/password/forgot`, { emailOrUsername });
    }

    resetPassword(token: string, newPassword: string): Observable<void> {
      return this.http.post<void>(`${this.API_URL}/public/password/reset`, { token, newPassword });
    }

}
