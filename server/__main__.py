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
userInfoCache = {}

@app.route("/api/user/<username>", methods=['GET'])
def user_info(username):
    print(username)

    if username in userInfoCache:
        return json.dumps(userInfoCache[username])
    else:
        return json.dumps({
        'error': 'User not found!'
        }), 404


@app.route("/api/user/<username>", methods=['POST'])
def sync_user(username):
    print(username)

    # Get all repositories
    projects = []
    user = g.get_user(username);
    userInfoCache[username] = {
        'synced_repos': 0,
        'url': user.url,
        'public_repos': user.public_repos,
        'projects': projects
    }
    for repo in user.get_repos():
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
        projects.append(proj)
        userInfoCache[username]['synced_repos'] += 1
        print(proj)
        print(userInfoCache[username])

    # 'Username %s' % username
    return json.dumps(projects)





if __name__ == "__main__":
    app.run(debug=True)