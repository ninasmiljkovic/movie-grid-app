import {AfterViewInit, Component, ElementRef, EventEmitter, HostListener, ViewChild} from '@angular/core';
import { Movie } from '../../models/movie.model';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-movie-grid',
  standalone: false,
  templateUrl: './movie-grid.component.html',
  styleUrl: './movie-grid.component.scss'
})

export class MovieGridComponent implements AfterViewInit {
  @ViewChild('gridContainer', { static: false }) gridContainer!: ElementRef;

  movies: Movie[] = [];
  visibleMovies: Movie[] = [];
  initialLoadCount = 30;
  loadChunkSize = 48;
  selectedMovieIndex: number = -1;

  constructor(private movieService: MovieService) {
    this.movieService.getMovies().subscribe(data => {
      this.movies = data;
      this.visibleMovies = this.movies.slice(0, this.initialLoadCount); // Load first 30 movies
    });
  }

  ngAfterViewInit(): void {
    this.loadMoreMovies(); // Ensure more movies load if needed
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 800) {
      this.loadMoreMovies();
    }
  }

  loadMoreMovies(): void {
    if (this.visibleMovies.length < this.movies.length) {
      const nextChunk = this.movies.slice(this.visibleMovies.length, this.visibleMovies.length + this.loadChunkSize);
      this.visibleMovies = [...this.visibleMovies, ...nextChunk];
    }
  }

  arrowUpDownPressed = 0;
  arrowCooldown = 200;

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault();
          const now = Date.now();
          if(now - this.arrowUpDownPressed < this.arrowCooldown){ return }
          this.arrowUpDownPressed = now;
        }
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
        this.visibleMovies[0].isSelected = true;
        this.selectedMovieIndex = 0;
        return;
      }

      let newIndex = this.selectedMovieIndex;
      switch (key) {
        case 'ArrowUp':
          newIndex = Math.max(this.selectedMovieIndex - columns, 0);
          break;
        case 'ArrowDown':
          newIndex = Math.min(this.selectedMovieIndex + columns, this.visibleMovies.length - 1);
          break;
        case 'ArrowLeft':
          newIndex = Math.max(this.selectedMovieIndex - 1, 0);
          break;
        case 'ArrowRight':
          newIndex = Math.min(this.selectedMovieIndex + 1, this.visibleMovies.length - 1);
          break;
      }

      this.selectMovie(newIndex);
  }

  scrollIntoView() {
    // Scroll adjustment to keep the selected item in center
    const gridItems = this.gridContainer.nativeElement.querySelectorAll('.grid-item');

    gridItems[this.selectedMovieIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  selectMovie(index: number) {
    if (this.selectedMovieIndex !== -1) {
      this.visibleMovies[this.selectedMovieIndex].isSelected = false;
    }
    this.visibleMovies[index].isSelected = true;
    this.selectedMovieIndex = index;

    this.scrollIntoView();
  }

  trackByMovieId(index: number, movie: Movie): number {
    return movie.id;
  }
}
