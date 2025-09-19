from flask import Flask, send_from_directory
# from flask_cors import CORS
import os
import pandas as pd
import engine

IS_DEV = False
PORT = os.getenv('PORT', '5000')
MODEL = os.getenv('MODEL', 'bow')
API_PREFIX = '/api'
PRODUCTS_PER_REQUEST = 100
RECOMMEND_COUNT = 5

df = pd.read_pickle('pickles/stg2_dedupe')
df = df.reset_index(drop=True)

app = Flask(__name__, static_folder='./static', static_url_path='/')
# CORS(app, resources={rf'{API_PREFIX}/*': {"origins": "http://127.0.0.1:5173"}})

@app.route('/')
def get_index_page():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/product')
def get_product_page():
    return send_from_directory(app.static_folder, 'index.html')

@app.route(f'{API_PREFIX}/')
def get_root():
    return {
        'success': True,
        'message': 'Welcome to ApparelKart API',
        'endpoints': [f'{API_PREFIX}/product/<asin_code>', f'{API_PREFIX}/products']
    }

@app.route(f'{API_PREFIX}/products', methods=['GET'])
def get_products():
    return {
        'success': True,
        'message': 'Fetched all products',
        'payload': df.sample(n=PRODUCTS_PER_REQUEST).to_dict(orient='records'),
    }

@app.route(f'{API_PREFIX}/product/<asin_code>', methods=['GET'])
def get_product(asin_code):
    rows = df.loc[df['asin'] == asin_code]
    if len(rows) == 0:
        return {
            'success': False,
            'message': 'Could not find product',
        }
    
    product = rows.iloc[0].to_dict()
    index = rows.index.tolist()[0]
    recommended_indices = None
    if MODEL == 'bow':
        recommended_indices = engine.bow_model(index, RECOMMEND_COUNT)
    elif MODEL == 'tfidf':
        recommended_indices = engine.tfidf_model(index, RECOMMEND_COUNT)
    else:
        recommended_indices = engine.bow_model(index, RECOMMEND_COUNT)
    recommended_products = df.loc[recommended_indices].to_dict(orient='records')
    
    return {
        'success': True,
        'message': 'Fetched product',
        'payload': {
            'product': product,
            'recommendations': recommended_products,
        },
    }

if __name__ == '__main__':
    app.run(debug=IS_DEV, port=PORT)
