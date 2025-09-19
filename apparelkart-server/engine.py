import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import pairwise_distances

data = pd.read_pickle('./pickles/no_stopwords')
data = data.reset_index(drop=True)

bow_title_vectorizer = CountVectorizer()
bow_title_features = bow_title_vectorizer.fit_transform(data['title'])
print('BoW title features shape:', bow_title_features.get_shape())

tfidf_title_vectorizer = TfidfVectorizer(min_df=0.0)
tfidf_title_features = tfidf_title_vectorizer.fit_transform(data['title'])
print('TF-IDF title features shape:', tfidf_title_features.get_shape())

def bow_model(doc_id, n):
    # doc_id = item's id in data corpus
    # n = required number of recommendations
    
    distances = pairwise_distances(bow_title_features, bow_title_features[doc_id]) # euclidian distances btw current title (bow_title_features[doc_id]) and all other titles (bow_title_features)
    chosen_indices = np.argsort(distances.flatten())[1:n+1]
    return chosen_indices

def tfidf_model(doc_id, n):
    # doc_id = item's id in data corpus
    # n = required number of recommendations
    
    # distances = cosine_similarity(tfidf_title_features, tfidf_title_features[doc_id])
    distances = pairwise_distances(tfidf_title_features, tfidf_title_features[doc_id])
    chosen_indices = np.argsort(distances.flatten())[1:n+1]
    return chosen_indices