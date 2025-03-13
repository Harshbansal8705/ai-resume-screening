from flask import Flask, request, jsonify
from flask_cors import CORS
from bert_filter import bert_filter
from extract_text import extract_text
from llm_filter import get_scores
from math import ceil
import numpy as np
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Create uploads directory if not exists
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

@app.route('/upload', methods=['POST'])
def upload_resumes():
    """Endpoint to upload resumes and process them"""
    if "job_description" not in request.form:
        return jsonify({"error": "Job description is required"}), 400
    
    job_description = request.form["job_description"]
    files = request.files.getlist("resumes")
    
    if not files:
        return jsonify({"error": "No resume files uploaded"}), 400

    file_paths = []
    for file in files:
        file_path = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
        file.save(file_path)
        file_paths.append(file_path)
    
    # Extract text from resumes
    resumes = [extract_text(path) for path in file_paths]
    
    # Get top resumes
    top_resumes_idx = bert_filter(job_description, resumes, k=ceil(len(resumes)))
    selected_resumes = np.array(resumes)[top_resumes_idx]
    
    # Get scores
    scores = get_scores(selected_resumes, job_description)
    
    return jsonify({
        "top_resumes": selected_resumes.tolist(),
        "scores": scores
    })

if __name__ == '__main__':
    app.run(debug=True)
