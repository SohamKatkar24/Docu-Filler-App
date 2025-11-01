Document Filler Application

This is a web application that fulfills the "Test Assignment" prompt. It accepts a .docx document template, identifies dynamic placeholders, and provides a conversational experience to fill in those placeholders. Finally, it generates a completed document for the user to download.

Live Application: https://docu-filler-app.vercel.app

How It Works

The application follows a simple, three-step user flow:

Upload: The user visits the live web app and uploads a .docx template file. This template must use Jinja2-style syntax for its placeholders (e.g., {{ COMPANY_NAME }}).

Parse & Fill: The backend API (hosted on Render) receives the template.

It uses python-docx to read all text from the document's paragraphs and tables.

A Regular Expression (Regex) scans this text to find all unique {{...}} placeholders.

The backend sends this list of placeholders to the React frontend.

The frontend dynamically builds a multi-step "conversational" form, asking the user for one value at a time.

Generate & Download:

Once the user fills all the fields, the frontend sends the completed data back to the backend.

The backend uses docxtpl to render this data into the original template, creating a new, filled-in document.

The backend provides a download link, which the frontend displays to the user.

Technology Stack

This project is built with a separate frontend and backend, both deployed to live cloud services.

Frontend (React)

Framework: React

API Client: Axios for making requests to the backend.

State Management: Built with React Hooks (useState).

Deployment: Hosted on Vercel at https://docu-filler-app.vercel.app

Backend (Python / Flask)

Framework: Flask for creating the REST API.

Document Parsing: python-docx to read text from the .docx file, including from tables.

Template Rendering: docxtpl to render the final document with the user's data.

API Endpoints:

POST /upload: Accepts the template, parses it for placeholders, and returns a list of questions.

POST /generate: Accepts the user's answers, renders the document, and returns a download link.

GET /download/<file_id>: Serves the final, generated document.

Deployment: Hosted on Render at https://docu-filler-app.onrender.com

How to Run This Project Locally

The application is hosted live at the link above. These instructions are for developers who wish to run the project on their local machine for testing or contribution.

Prerequisite: The Template

Obtain a .docx file (like the provided "Postmoney Safe" document).

Open the file in Microsoft Word or Google Docs.

Find all dynamic fields (e.g., [Company Name], $[_____________]) and replace them with unique Jinja2-style tags (e.g., {{ COMPANY_NAME }}, {{ PURCHASE_AMOUNT }}).

Save this file as template.docx. This is the file you will upload.

1. Backend Setup (Flask)

Navigate to the backend folder:

cd backend


Create and activate a virtual environment:

# Create the venv (Windows)
py -m venv venv
# Activate the venv (Windows PowerShell)
.\venv\Scripts\activate


Install dependencies:

pip install -r requirements.txt


Run the server:

py app.py


The backend will now be running at http://127.0.0.1:5000.

2. Frontend Setup (React)

Open a new terminal.

Navigate to the frontend folder:

cd frontend


Install dependencies:

npm install


Run the app:

npm start


Your browser will open to http://localhost:3000, where you can use the application.