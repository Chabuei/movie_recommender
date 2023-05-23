# movie_recommender
![Videotogif](https://github.com/Chabuei/movie_recommender/assets/102859047/c7e3f397-1382-47cc-ae3e-b7a9a013feb7)

# URL
https://main.dn4fsdjjb0uc2.amplifyapp.com/(https://eishinishida.comが故障中のため、仮アドレスを適用しています)

# Overview
Word2Vecニューラルネットワークを用いた映画の推薦システム(Item2Vec)<br>
The recommender system implemented by  Word2Vec neural netword(Item2Vec)<br> 

# Requirement
このコードは実際にAWSにホスティングして動かしております。ローカル開発環境では動作するものではありませんので、あらかじめご了承下さい。また、CSSはレスポンシブ対応していないため、PC以外での利用はデザインが崩れる恐れがあります。<br>
This code is deployed and running on AWS now and then is not for running in local environment. And also, the design of this website is not responsible and couldn't run correctly except pc.<br>

Windows 11<br>
Node.js 16.14.0<br>
Python 3.9.0<br>

# Usage
1: 映画名検索機能やジャンル検索機能を使ってお好みの映画をクリックしましょう。<br>
2: 選んだ映画は左サイドバーにあるリストに登録されます。もし間違えてリストに追加してしまった場合はXボタンを押すと削除できます。<br>
3: お好みの映画を選んだらRecommendボタンを押しましょう。すると、あなたの好みに合った映画をItem2Vecが推薦してくれます。(※初回レコメンドのみ10秒ほどロード時間がかかりま す。)<br>

1: Please find and select your favorite movies and then click it.<br>
2: If you click a movie poster, it is registered in the list in left sidebar. If you accidently register a movie, you can remove it by clicking X button.<br>
3: If you finish selecting movies, just click Recommend button and then the list of movies which Item2Vec made for you based on your preference is displayed.<br>

# Detail
この



