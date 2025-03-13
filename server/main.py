from bert_filter import bert_filter
from extract_text import extract_text
from llm_filter import get_scores
from math import ceil
import numpy as np

paths = ["../../Downloads/Resume.pdf", *[f"../../Downloads/sample{i}.pdf" for i in range(1, 9)]]
resumes = [extract_text(path) for path in paths]
job_description = """
About Us

Skit.ai is the pioneer Conversational AI company transforming collections with omnichannel GenAI-powered assistants. Skit.ai’s Collection Orchestration Platform, the world’s first solution, streamlines collection conversations by syncing channels and accounts. Skit.ai’s Large Collection Model (LCM), a collection LLM, powers the strategy engine to optimize interactions, enhance customer experiences, and boost bottom lines for enterprises. Skit.ai has received several awards and recognitions, including the BIG AI Excellence Award 2024, Stevie Gold Winner 2023 for Most Innovative Company by The International Business Awards, and Disruptive Technology of the Year 2022 by CCW. Skit.ai is headquartered in New York City, NY. Visit https://skit.ai/

Job Title: Software Engineer (Solutions)

Location: Bangalore (Onsite)

Work Type: Full-time

Responsibilities

 Collaborating with Delivery, Infra and Product teams
 Create solutions for problems that can't be solved using current product offerings
 Interacting with Client Tech/Business teams.
 Understanding client workflows and replicating the same using Skit's existing products where possible.
 Researching, diagnosing, troubleshooting and identifying solutions to resolve the client integration issues
 Taking ownership of API/Telephony integration issues reported and seeing problems through to resolution
 Understanding Tech issues involved in integration & providing resolution
 Automating operational tasks being done manually to increase efficiency

Requirements

 Ability to debug systems/calls using Logs/Traces
 Ability to write code using Python
 Willingness to collaborate with other teams/other roles.
 Willingness to learn and experiment with new languages and technologies.

Experience

 Professional experience of 0-2 years.
 Has experience with integrating or building HTTP APIs
 Has hands-on experience of working with Python
 Good communicator

Preferred Requirements

 Has experience working in any of Django Rest Framework, Redis, Celery
 Good understanding of various applied ML concepts and problems
 Has python programming experience on machine learning based projects

Technical

 Understanding of Computer Science fundamentals, using them to effectively design and write code in python.
 Hands-on experience developing microservices/projects in Python is preferrable.
 Hands-on experience working with RDBMS like PostgreSQL.
 Experience working with container platforms like Docker, Kubernetes is a plus.
 Experience with AWS or any comparable cloud technology is a plus.
"""
top_resumes = bert_filter(job_description, resumes, k=ceil(len(resumes)))
print(top_resumes)
# print(np.array(resumes)[top_resumes])
scores = get_scores(np.array(resumes)[top_resumes], job_description)
print(scores)