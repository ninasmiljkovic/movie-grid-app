import { Injectable } from '@angular/core';
import {map, Observable, of} from 'rxjs';
import {Movie, RatingId} from '../models/movie.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private sortedMovies: Movie[] = [];

  constructor(private http: HttpClient) {}

  getMovies(): Observable<Movie[]> {
    if (this.sortedMovies.length) {
      return of (this.sortedMovies);
    }
    return this.http.get<Movie[]>('assets/movies.json').pipe(
      map(movies => Object.values(movies.reduce(
        (acc, movie) => {
          if (!acc[movie.id]) {
            acc[movie.id] = movie;
          }
          return acc;
        },
        {} as Record<number, Movie>))),
      map(movies =>
      {
        this.sortedMovies = movies.sort((a: Movie, b: Movie) => this.getImdbRating(b) - this.getImdbRating(a));
        return this.sortedMovies;
      })
    );
  }

  private getImdbRating(movie: Movie): number {
    const imdb = movie.ratings.find(rating => rating.id === RatingId.IMDB);
    return imdb ? imdb.rating : 0;
  }
}
