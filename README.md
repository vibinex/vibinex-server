# Vibinex Website

This is the project for the [Vibinex website](https://vibinex.com) and the primary backend for the [Vibinex Browser Extension](https://github.com/Alokit-Innovations/chrome-extension). It's a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Introduction

Vibinex Code Review enriches the GitHub, Bitbucket and GitLab pull-request/merge-request UI with data from the git history.
By making the UI more personalized to the contributors of the project using Vibinex, tech teams can increase the quality of their
code reviews, increase the overall code awareness and ownership in the team and reduce the time and effort it takes to review a pull request.

Vibinex Code Review offers these features:

1. Automatic assignment of reviewers on any pull request based on authorship
2. Comments on the pull-request indicating percentage weightage of approvals of different reviewers as well as completion rates.
3. Personalized highlighting of relevant pull requests, files and code-hunks in the pull request that are revent to the contributor. (This feature is only enabled for users who have installed the browser extension).

## Architecture

The primary frontend of the Vibinex Code Review tool is the browser extension.
There are two backends:

1. **On-prem Rust service**: stores the whole repository and processes the code and git history to assign reviewers, add comments and extract the meta data required for personalized highlighting.
2. **NextJS backend**: Serves as the backend for the browser extension. It handles authentication, authorization, analytics, meta-data storage and security. This server also hosts the website on [vibinex.com](https://vibinex.com).

## Contribute

### Repository setup
1. Fork this repository using the GitHub GUI.
2. Clone your fork of the repository:
```sh
git clone https://github.com/<your_username>/vibinex-server.git
```

or, if you use `SSH` cloning:

```sh
git clone git@github.com:<your_username>/vibinex-server.git
```
3. Create a new branch with your user-prefixed branch name. <br>_Optional: If you are working on an issue, you can directly use the issue number as the branch name._
```sh
git checkout -b <your_username>/<your_branch_name>
```

### Install dependencies
Enter the repository folder and install dependencies:
```sh
npm install
# or
yarn
```

### Start NextJS server

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

### Connect to Test environment

Create a `.env.local` file in the root directory and add the following in it:

```bash
# NextAuthJS
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=

# Github Login
GITHUB_CLIENT_ID=78eb181cacd859319797
GITHUB_CLIENT_SECRET=c6efe816493a0b553ef20364134a3009b724b402

# Bitbucket Login
BITBUCKET_CLIENT_ID=
BITBUCKET_CLIENT_SECRET=

# Bitbucket OAuth consumer
BITBUCKET_OAUTH_CLIENT_ID=

# GitLab Login
GITLAB_CLIENT_ID=
GITLAB_CLIENT_SECRET=

# PostGreSQL Connection
PGSQL_USER=postgres
PGSQL_PASSWORD=vibi@test-pg
PGSQL_HOST=127.0.0.1
PGSQL_PORT=5432
PGSQL_DATABASE=test-db
```

(TODO: Add steps for downloading the `cloud-sql-proxy` script)

Now run the following command is a different terminal:

```bash
./cloud-sql-proxy --port 5432 vibi-test-394606:asia-south1:test-db --gcloud-auth
```

This will enable you to connect with our test database hosted on your localhost.

The environment file also contains client ID and client secret for the Vibinex-Test OAuth App so that you can use the entire website locally
by logging in using GitHub.
You can create your own Bitbucket or GitLab OAuth consumers and add your client-id and client-secrets in the `.env.local` file to test them out.

### Running Unit Tests

Unit tests written using jest library can be run using:

```bash
npm test
```
