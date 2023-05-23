import json
import sys

sys.path.append("/mnt/efs/lib/python")

import gensim

def lambda_handler(event, context):
    index = 0
    query = event.get('queryStringParameters')
    recommender_input = []
    recommender_output_list = []
    recommender_output_array = []
    
    if(query['items'] and len(query['items']) > 0):
        items = query['items']
        user_inputs = items.split(',')
        
        for user_input in user_inputs:
            user_inputs[index] = int(user_input)
            index += 1
    else:
        for i in range(10):
            recommender_output_array.append(0)
        
        return {
        'statusCode': 200,
        'body': json.dumps(recommender_output_array)
        }
    
    model = gensim.models.word2vec.Word2Vec.load('./word2vec.model')

    for movie_id in user_inputs:
        if movie_id in model.wv.key_to_index:
            recommender_input.append(movie_id)

    try:        
        recommender_output_list = model.wv.most_similar(recommender_input, topn = 10)

        for item in recommender_output_list:
            recommender_output_array.append(item[0])
            
        return {
        'statusCode': 200,
        'body': json.dumps(recommender_output_array)
        }

    except ValueError:
        for i in range(10):
            recommender_output_array.append(0)
    
        return {
            'statusCode': 200,
            'body': json.dumps(recommender_output_array)
        }