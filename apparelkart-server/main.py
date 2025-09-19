from flask import Flask
from flask_cors import CORS
import pandas as pd
import engine

API_PREFIX = '/api'
PRODUCTS_PER_REQUEST = 100
RECOMMEND_COUNT = 5
df = pd.read_pickle('pickles/stg2_dedupe')
df = df.reset_index(drop=True)

app = Flask(__name__)
CORS(app, resources={rf'{API_PREFIX}/*': {"origins": "http://127.0.0.1:5173"}})

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
    app.run(debug=True)
