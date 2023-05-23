import gensim
from DataLoader import DataLoader

class Item2Vec(): #DataLoaderから整形したデータを読み込んでオフライン学習指せている
    def __init__(self): #オフライン学習のためのデータの初期化
        self.vector_size = 35 #ベクトルの次元数？   
        self.epochs = 20 #反復回数
        self.window = 75 #予測(分布仮説)に用いる文字列の最大範囲(あんま多くしすぎるとフレッシュネスを無視してしまうが、movierecommendにフレッシュネスはあまり関係なさそう、長くしすぎると関係性が低いものを含んでしまいそれはノイズとなる)
        self.sg = 1 #skip-gramは前後文脈を無視し、中央の文中から単純に出現確立が高いものを関係がありそうなものとしてレコメンドする CBOWは前後関係から出現確立を学習する
        self.hs = 0
        self.min_count = 5
        self.model = []

        movies = DataLoader().load()
        self.movies_for_learning = movies[0]
        self.movies_for_evaluation = movies[1]

        self.movies_high_rating_for_learning = self.movies_for_learning[self.movies_for_learning['rating'] >= 4] #ratingが高いもののみを使うことでユーザの好みを間接的に表現する(ratingが低いものまで使ってしまうとユーザが低評価したものもword2vecが学習してしまい、これはユーザの好みをちゃんと学習できなくなる)

        for user_id, data in self.movies_high_rating_for_learning.groupby('user_id'):
            self.model.append(data.sort_values('timestamp')['movie_id'].tolist()) #つまり各々のユーザの閲覧履歴(movie_id)を学習のための文字列ととらえ、それを用いて一人一人のユーザをword2vecでベクトル化している

    def recommend(self): #ここでオフライン学習させ、また学習させたモデルにユーザの履歴を入力しそれを基にレコメンドを計算させている
        user2items = dict()

        """新しくmodelを生成する場合はこのコメントアウトを外す
        self.result = gensim.models.word2vec.Word2Vec(
            self.model,
            vector_size = self.vector_size,
            window = self.window,
            sg = self.sg,
            hs = self.hs,
            epochs = self.epochs,
            min_count = self.min_count
        )
        
        self.result.save("word2vec.model") #オフライン学習したモデルを書き出す
        """
        
        self.result = gensim.models.word2vec.Word2Vec.load('word2vec.model') #オフライン学習したモデルをインポート
        
        for user_id, data in self.movies_high_rating_for_learning.groupby('user_id'):
            input_data = []

            for movie_id in data.sort_values('timestamp')['movie_id'].tolist(): #ユーザの評価履歴のmovie_idをtimestampの昇順で並べてリスト化
                
                if movie_id in self.result.wv.key_to_index:
                    input_data.append(movie_id)

            if(len(input_data) == 0):
                user2items[user_id] = []
                continue

            recommended_movies = self.result.wv.most_similar(input_data, topn = 30) #user1人あたりにbest10のcos類似度を持つmovie_idがlist形式で代入される(全ユーザ分)
            user2items[user_id] = [d[0] for d in recommended_movies] #user1人あたりにbest10の類似度を持つmovie_idがlist形式で保持されており、最も類似度が高いものをuser2itemに格納している

        print(user2items[0]) #user2itemsにはビッグデータの全ユーザのためのレコメンドが入っているので、その中から最初の一人のユーザへのレコメンドを表示

        return self.movies_for_evaluation, user2items
    
Item2Vec().recommend()
        


