import pandas as pd
from typing import Tuple

class DataLoader: #ここではmovielensで取得したビッグデータをオフライン学習するために整形している
    def __init__(self) -> None:
        self.test_items = 5
    
    def load(self) -> Tuple[pd.DataFrame, pd.DataFrame]:
        movies_cols = ['movie_id', 'title', 'genre']
        movies = pd.read_csv('./data/movies.dat', names = movies_cols, sep = "::", encoding = 'latin-1', engine = 'python') #pandasのdataframe型を返す
        movies['genre'] = movies['genre'].apply(lambda genre: genre.split('|')) #pythonで無名関数を作るにはlambdaを使う

        tags_cols = ['user_id', 'movie_id', 'tag', 'timestamp']
        tags = pd.read_csv('./data/tags.dat', names = tags_cols, sep = '::', engine = 'python')

        ratings_cols = ['user_id', 'movie_id', 'rating', 'timestamp']
        ratings = pd.read_csv('./data/scaled_ratings.dat', names = ratings_cols, sep = ':', engine = 'python')

        movies = movies.merge(tags.groupby('movie_id').aggregate({ 'tag': list }), on = 'movie_id', how = 'left') #moviesとtagsは1対多であり、tagをmovie_idごとでグループ化してlist化、それをmovie_idに左外部結合している
        movies = movies.merge(ratings, on = 'movie_id', how = 'left')
        movies['timestamp_ranking'] = movies.groupby('user_id')['timestamp'].rank(ascending = False, method = 'first')

        movies_for_learning = movies[movies['timestamp_ranking'] > self.test_items] #userの評価について、直近5件をabテスト用に用いる
        movies_for_evaluation = movies[movies['timestamp_ranking'] <= self.test_items] #userの評価について、それ以外を学習用に用いる
        
        return movies_for_learning, movies_for_evaluation
    
DataLoader().load()
