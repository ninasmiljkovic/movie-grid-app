import { Component, ElementRef, EventEmitter, HostListener, ViewChild } from '@angular/core';
import { Movie } from '../../models/movie.model';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-movie-grid',
  standalone: false,
  templateUrl: './movie-grid.component.html',
  styleUrl: './movie-grid.component.scss'
})

export class MovieGridComponent {
  @ViewChild('gridContainer', { static: false }) gridContainer!: ElementRef;

  movieClicked = new EventEmitter<void>();
  movies: Movie[] = [];
  selectedMovieIndex: number = -1;

  constructor(private movieService: MovieService) {
    this.movieService.getMovies().subscribe(data => {
      this.movies = data;
    });
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
        this.navigate(event.key);
        break;
      case 'Enter':
        this.handleEnter();
        break;
      case 'Escape':
        this.handleEsc();
        break;
    }
  }

  handleEnter() {
    if (this.selectedMovieIndex) {
      this.movies[this.selectedMovieIndex].inFavorites = !this.movies[this.selectedMovieIndex].inFavorites;
    }
  }

  handleEsc() {
    if (this.selectedMovieIndex) {
      this.movies[this.selectedMovieIndex].isSelected = false;
      this.selectedMovieIndex = -1;
    }
  }

  navigate(key: string) {
    const columns = 6; // Assuming 6 columns in the grid

      if (this.selectedMovieIndex === -1) {
        this.movies[0].isSelected = true;
        this.selectedMovieIndex = 0;
        return;
      }

      let newIndex = this.selectedMovieIndex;
      switch (key) {
        case 'ArrowUp':
          newIndex = Math.max(this.selectedMovieIndex - columns, 0);
          break;
        case 'ArrowDown':
          newIndex = Math.min(this.selectedMovieIndex + columns, this.movies.length - 1);
          break;
        case 'ArrowLeft':
          newIndex = Math.max(this.selectedMovieIndex - 1, 0);
          break;
        case 'ArrowRight':
          newIndex = Math.min(this.selectedMovieIndex + 1, this.movies.length - 1);
          break;
      }

      this.selectMovie(newIndex);
  }

  scrollIntoView() {
    // Scroll adjustment to keep the selected item in center
    const gridItems = this.gridContainer.nativeElement.querySelectorAll('.grid-item');

    if (gridItems[this.selectedMovieIndex]) {
      setTimeout(() => {
        gridItems[this.selectedMovieIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
  }

  selectMovie(index: number) {
    this.movies[this.selectedMovieIndex].isSelected = false;
    this.movies[index].isSelected = true;
    this.selectedMovieIndex = index;

    this.scrollIntoView();
  }
}
