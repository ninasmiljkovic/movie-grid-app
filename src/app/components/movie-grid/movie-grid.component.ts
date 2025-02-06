import { Component } from '@angular/core';
import {Movie} from '../../models/movie.model';
import {MovieService} from '../../services/movie.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-movie-grid',
  standalone: false,
  templateUrl: './movie-grid.component.html',
  styleUrl: './movie-grid.component.scss'
})

export class MovieGridComponent {
  movies$: Observable<Movie[]>;

  constructor(private movieService: MovieService) {
    this.movies$ = this.movieService.getMovies();
  }
}
