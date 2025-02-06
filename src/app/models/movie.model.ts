export enum RatingId {
  IMDB = 'imdb',
  POPULARITY = 'popularity',
}

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
