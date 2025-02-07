import { Component, Input } from '@angular/core';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-movie-item',
  standalone: false,
  templateUrl: './movie-item.component.html',
  styleUrl: './movie-item.component.scss'
})
export class MovieItemComponent {
  @Input() movie!: Movie;

  toggleFavourites() {
    this.movie.inFavorites = !this.movie.inFavorites;
  }
}
