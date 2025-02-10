import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MovieService } from './movie.service';
import { Movie, RatingId } from '../models/movie.model';
import {provideHttpClient} from '@angular/common/http';

describe('MovieService', () => {
  let service: MovieService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MovieService, provideHttpClient(),provideHttpClientTesting()]
    });

    service = TestBed.inject(MovieService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return sorted movies without duplicates when getMovies() is called', (done) => {
    const mockMovies: Movie[] = [
      {
        id: 2, title: 'Movie B', release_date: '2023-05-01', ratings: [{id: RatingId.IMDB, rating: 7.0}],
        poster_path: ''
      },
      {
        id: 1, title: 'Movie A', release_date: '2023-01-01', ratings: [{id: RatingId.IMDB, rating: 8.5}],
        poster_path: ''
      },
      {
        id: 2, title: 'Movie B Duplicate', release_date: '2023-05-01', ratings: [{id: RatingId.IMDB, rating: 7.0}],
        poster_path: ''
      }
    ];

    service.getMovies().subscribe(movies => {
      expect(movies.length).toBe(2); // Ensure duplicates are removed
      expect(movies[0].id).toBe(1); // Sorted by IMDb rating descending
      expect(movies[1].id).toBe(2);
      done();
    });

    const req = httpTestingController.expectOne('assets/movies.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockMovies);
  });

  it('should return cached movies if already fetched', (done) => {
    const mockMovies: Movie[] = [
      {
        id: 1, title: 'Movie A', release_date: '2023-01-01', ratings: [{id: RatingId.IMDB, rating: 8.5}],
        poster_path: ''
      }
    ];

    service["sortedMovies"] = mockMovies; // Directly assign cached movies
    service.getMovies().subscribe(movies => {
      expect(movies).toEqual(mockMovies);
      httpTestingController.expectNone('assets/movies.json'); // Ensure HTTP call is not made
      done();
    });
  });

  it('should return 0 IMDb rating if no IMDb rating is found', () => {
    const movieWithoutImdb: Movie = { id: 3, title: 'Movie C', release_date: '2023-06-01', ratings: [], poster_path: '' };
    expect(service["getImdbRating"](movieWithoutImdb)).toBe(0);

    const movieWithImdb: Movie = { id: 3, title: 'Movie C', release_date: '2023-06-01', ratings: [{ id: RatingId.IMDB, rating: 8.5 }], poster_path: '' };
    expect(service["getImdbRating"](movieWithImdb)).toBe(8.5);
  });

  afterEach(() => {
    httpTestingController.verify(); // Ensure no outstanding requests
  });
});
