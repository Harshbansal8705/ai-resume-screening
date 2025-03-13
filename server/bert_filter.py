from sentence_transformers import SentenceTransformer, util
from extract_text import extract_text
import numpy as np
from preprocess import preprocess_text
import os, time


def bert_filter(jd: str, resumes: list[str], k: int) -> np.ndarray:
    # Load pre-trained BERT model
    model = SentenceTransformer("all-mpnet-base-v2")
    # Encode text into embeddings
    resume_embeddings = model.encode([preprocess_text(resume) for resume in resumes])
    # print(resume_embeddings[-1])
    job_embedding = model.encode(preprocess_text(jd))
    # Compute Cosine Similarity
    similarity_scores = util.cos_sim(resume_embeddings, job_embedding)
    top_indices = similarity_scores.argsort(descending=True, axis=0)[:k]
    return top_indices.numpy().reshape(-1)
