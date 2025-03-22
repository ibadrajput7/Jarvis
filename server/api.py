import openai

openai.api_key = "sk-proj-CnzxwC0PM5KIeHIPmrgmT3BlbkFJoTCuJMzbdAo8DuhlnPhz"

def ask_gpt(question):
    try:
        client = openai.OpenAI()  # Create OpenAI client
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": question}]
        )
        return response.choices[0].message.content  # Updated way to extract response

    except Exception as e:
        return f"❌ Error: {str(e)}"
