from langchain_together import ChatTogether
from langchain_core.messages import SystemMessage, HumanMessage
from extract_text import extract_text
import os, json

# Set Together API Key
os.environ["TOGETHER_API_KEY"] = (
    "5c43ff2c6dca3c24c45846105e7639e60428617f061d966091eb6a65a80256f2"
)

# Initialize Together API model
llm = ChatTogether(
    model="meta-llama/Llama-3.3-70B-Instruct-Turbo-Free", temperature=0.7
)  # Use "mistral-7b-instruct" for cheaper option


# Function to get LLM score for a resume
def score_resume(resume: str, jd: str):
    prompt = f"""
    You are an HR expert. Evaluate the following resume against the given job description and provide a score out of 100.

    **Job Description:**
    {jd}

    **Resume:**
    {resume}

    Provide a score from 0 to 100, where:
    - 100 = Perfect match
    - 80+ = Strong match
    - 60-80 = Moderate match
    - Below 60 = Weak match

    Strictly note that you only need to return the score as a number along with a reason in json format with the key "score" (which is a number) and "reason" (which is a string).
    """

    response = llm.invoke(
        [
            SystemMessage(content="You are an expert HR recruiter."),
            HumanMessage(content=prompt),
        ]
    )
    left = response.content.find("{")
    right = response.content.rfind("}") + 1
    return json.loads(response.content[left:right])


def get_scores(resumes: list[str], jd: str):
    resume_scores = [score_resume(resume, jd) for resume in resumes]
    return resume_scores
