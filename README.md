# Vibinex Website
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fvibinex.com)](https://vibinex.com)
![Website version](https://img.shields.io/github/package-json/v/vibinex/vibinex-server)
![Website activity](https://img.shields.io/github/commit-activity/y/vibinex/vibinex-server)
![Website contributors](https://img.shields.io/github/contributors/vibinex/vibinex-server)
[![License](https://img.shields.io/badge/license-AGPLv3-purple)](https://github.com/vibinex/vibinex-server/blob/main/LICENSE)

This is the project for the [Vibinex website](https://vibinex.com) and the primary backend for the [Vibinex Browser Extension](https://github.com/vibinex/chrome-extension). It's a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

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

### Configure the local environment

Copy the non-secret template and generate a unique NextAuth secret:

```bash
cp .env.example .env.local
openssl rand -base64 32
```

Paste the generated value into `NEXTAUTH_SECRET` in `.env.local`. Never commit
`.env.local` or share its contents.

#### Create a GitHub OAuth app

Each contributor should use a separate development OAuth app instead of shared
credentials:

1. Open **GitHub → Settings → Developer settings → OAuth Apps → New OAuth App**.
2. Set **Homepage URL** to `http://localhost:3000`.
3. Set **Authorization callback URL** to
   `http://localhost:3000/api/auth/callback/github`.
4. Copy the app's Client ID into `GITHUB_CLIENT_ID` in `.env.local`.
5. Generate a client secret and copy it into `GITHUB_CLIENT_SECRET`. Keep this
   value only in your untracked `.env.local` file.

The local login requests only `read:user`, `user:email`, and `read:org` scopes.
`read:org` is needed to discover organization membership; the app does not need
repository or write permissions.

Bitbucket and GitLab login are optional. Create your own development OAuth
consumer/app for either provider and fill in the corresponding placeholders in
`.env.local`. Database values must likewise point to your own development
PostgreSQL/Supabase instance or be provisioned privately by a maintainer.

### Secret scanning

Pull requests and pushes are scanned by Gitleaks in CI. To scan the current
working tree locally without printing detected values:

```bash
docker run --rm -v "$PWD:/repo" zricethezav/gitleaks:v8.28.0 \
  dir /repo --redact --no-banner
```

If a secret is detected, revoke or rotate it first, remove it from tracked
files, and only then push the remediation. Never paste the value into an issue,
commit message, or CI log.

### Running Unit Tests

Unit tests written using jest library can be run using:

```bash
npm test
```
