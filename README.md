# github-tagged
Simple javascript project that allows managing starred github repositories.

Setup these key-value tuples at /server.env <br />
- CLIENT_ID=1844df0635b9d9710d9f // Github client_id application <br />
- CLIENT_SECRET={your_client_secret_github_value} <br />
- DATABASE_URL={your_mongodb_path} <br />
- GITHUB_API_URL=https://api.github.com

To run in development mode, open two terminal tabs <br />
inside server folder, run:<br />
 - npm install
 - npm run dev <br />
 
inside client folder, run:
 - npm install 
 - npm start
