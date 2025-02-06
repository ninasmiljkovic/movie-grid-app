type RatingId = 'imdb' | 'popularity';

interface Rating {
  id: RatingId;
  rating: number;
}

export interface Movie {
  id: number;
  title: string;
  posterPath: string;
  releaseDate: string;
  ratings: Rating[];
}
