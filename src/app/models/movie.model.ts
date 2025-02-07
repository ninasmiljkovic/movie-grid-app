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
  poster_path: string;
  release_date: string;
  ratings: Rating[];
  inFavorites?: boolean;
  isSelected?: boolean;
}
