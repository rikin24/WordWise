import google.generativeai as genai
import json
import pandas as pd

# Load JSON file
with open("jargon_data_expanded.json") as f:
    content = f.read()
    jargon_data = json.loads(content)  # This already returns a Python object — no need to decode again

# Load CSV file
user_submissions = pd.read_csv("user_submissions.csv")

# Simplify jargon_data into a dictionary of terms and definitions
jargon_dict = {
    item["term"]: item["definition"]
    for item in jargon_data
    if "term" in item and "definition" in item
}

# Build a supplemental dictionary from CSV
submitted_jargon = {
    row["term"]: {
        "definition": row["definition"],
        "example": row["example"]
    }
    for _, row in user_submissions.iterrows()
    if pd.notnull(row["term"]) and pd.notnull(row["definition"]) and pd.notnull(row["example"])
}

# Combine terms from both sources
combined_terms_text = "\n".join([
    f"{term}: {definition}" for term, definition in jargon_dict.items()
]) + "\n" + "\n".join([
    f"{term}: {details['definition']}" for term, details in submitted_jargon.items()
])

# Combine examples from both sources
combined_examples_text = "\n".join([
    details["example"] for details in submitted_jargon.values()
])


genai.configure(api_key="AIzaSyA2h30rLiYuSgzB13zJEwSpie1w3Wlyui8")

model = genai.GenerativeModel(
    model_name="gemini-2.0-flash",
    system_instruction=f"""You are a translation engine specializing in corporate jargon.
    Reference the following terms if relevant, but feel free to improvise beyond them.

    --- Terms ---
    {combined_terms_text}

    --- Examples ---
    {combined_examples_text}

    Translate the following plain sentence into corporate consulting jargon:
    "We need to fix the website because it's slow."
    """
)

response = model.generate_content("Translate to corporate consulting jargon: We need to fix the website because it's slow.")
print(response.text)
