import os
from flask import Flask
from github import Github
import json

# Create API server
app = Flask(__name__, static_url_path='', static_folder='../public')

g = Github(client_id='599e8c215234b7c8552a', client_secret='ad387c59e40c9a33c70b11e9b577d6808eb5ee5b')

@app.route('/')
def root():
    return app.send_static_file('index.html')

# API
@app.route("/api/user/<username>", methods=['GET', 'POST'])
def download_user(username):
    print(username)

    # Get all repositories
    projects = []
    for repo in g.get_user(username).get_repos():
        # Get languages for repositories
        langs = repo.get_languages();
        # print(repo.name)
        # print(langs)
        proj = {
            'name': repo.name,
            'description': repo.description,
            'language': repo.language,
            'languages': langs
        }
        print(proj)
        projects.append(proj)

    # 'Username %s' % username
    return json.dumps(projects)





if __name__ == "__main__":
    app.run(debug=True)