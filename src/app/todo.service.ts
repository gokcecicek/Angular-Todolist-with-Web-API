import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TodoService {


  constructor(private http: HttpClient) {}

  add(data) {

    return this.http.post('http://localhost:59903/api/Todo', data).pipe(map((t: any) => t.json()));
  }

  delete(id: number) {

    return this.http.delete('http://localhost:59903/api/Todo/' + id).pipe(map((t: any) => t.json()));

  }

  getAll() {
    return this.http.get('http://localhost:59903/api/Todo' ).pipe(map((t: any) => t.json()));
  }

  getSingle(id: number) {
    return this.http.get('http://localhost:59903/api/Todo/' + id).pipe(map((t: any) => t.json()));
  }

  update(data) {
    return this.http.put('http://localhost:59903/api/Todo', data).pipe(map((t: any) => t.json()));
  }

}
