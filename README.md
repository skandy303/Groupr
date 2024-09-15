# Groupr
## Motivation 
It is often difficult to form groups for school projects. This can be due to multiple reasons; group members may have different schedules, skillsets or work ethics. Groupr aims to remediate this by facilitating informed group making for school projects. Students will be able to use Groupr to share information about themselves with other students in their class and ultimately form a group that is a good fit for all of them.

## Installation

### Pre-commit hooks
We use pre-commit hooks that will run before your commits to format and lint the code.

To get started install mookme which we use to run pre-commit checks

1. Run `npm install`
2. Now setup `.git/hooks` by running `npx mookme init --only-hook`
3. When it asks for what hooks to setup, select pre-commit hooks
4. Change a file and try making a commit, you should see formatting and linting run before it

### Backend Setup

**This Project uses python 3.10.7**

1. Setting up a python virtual environment is highly recommended
- In the root directory type `python3 -m venv env`
- Activate the environment
  - on linux run `source ./env/bin/activate`
2. Install the dependencies `pip install -r backend/requirements.txt`
3. Run the server `python backend/manage.py runserver`
### Frontend Setup
All steps should be carried out in the frontend directory.

1. Run `npm install` inside frontend folder
2. Run `npm run start` to start dev server

To run formatter, run `npm run format`; this will format your code using prettier. You may be able to setup your editor to run this one write.
To run linter, run `npm run lint`; this will lint your code for type errors etc. 

Alternatively, run `npm run check` to run the formatter and linter subsequently in one command.

### Docker Setup
Docker can optionally be used to simplify getting the frontend and backend up.

1. You need to install the frontend locally due to a bug with crossenv and also to lint. It's useful to install the backend locally as well per instructions above so you can format code. 
2. Run `docker-compose up --build`; this will build the images and run the containers; you will need docker-compose and docker installed. In the future you can just run `docker-compose up`.
3. If you need to run migrations, you can run them locally which will require having installed django locally. We're using a shared volume so the container will have the changes to the database. If you want to run migrations in the container directly without setting up locally, just run `docker-compose run backend ./manage.py migrate`. 

## Contribution

The project follows Git flow. Feature branches can have any name but should be merged to develop through PRs. Feature branches should be rebased on dev before merge. All feature development will go through code review; a checklist for minimum criteria to merge code is provided in the PR template when PRs are made. Jira will be used to track issues. Releases to main will be done at the end of each sprint. 

