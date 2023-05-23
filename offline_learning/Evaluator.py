import numpy as np
from Item2Vec import Item2Vec

class Evaluator():#ここでは生成したモデルの性能をprecision@kという指標を用いて評価している(precision@kとは、ユーザに推薦した相手の中にどれぐらいの割合で実際にユーザが気にいたアイテムが含まれているかを表す)
    def precision_k(self, movies_for_evaluation, user2items):
        scores = []        
        
        for user_id, data in movies_for_evaluation.groupby('user_id'):
            movie_answers = data['movie_id'].tolist() 
 
            try:
                precision = len(set(movie_answers) & set(user2items[user_id])) / 10
                scores.append(precision)

            except:
                continue
        
        print(np.mean(scores))

datas = Item2Vec().recommend()
Evaluator().precision_k(datas[0], datas[1])
