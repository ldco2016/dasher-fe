# Aluna - Dashboard

## Features:

- Typescript
- React
- Material-UI with emotion
- Recharts as a D3 interface
- Eslint/Prettier with airbnb config
- Pre commit hooks with husky and pretty-quick
- Cypress for e2e and integration testing
- SWR (stale while revalidate)
- Storybook (component development in isolation) [todo]
- Jest for unit tests [todo]

## Dev Instance: [dev-dasher.knox.co](https://dev-dasher.knox.co/)

---

## Getting Started / Local development

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

```bash
npm install
npm run dev
```

Running Docker:

```bash
docker build --build-arg REACT_APP_CURRENT_COMMIT_SHA1=$(git rev-parse  HEAD) --tag aluna-dashboard .
docker run -p 3000:3000 aluna-dashboard

docker run -p 3000:3000 --env-file ./env.local aluna-dashboard
```

Cypress:

```bash
# Download cypress.env.json from Onepassword

# Integration test GUI
npm run cy:run:chrome // or firefox, edge

# Component test GUI
npx cypress open-ct
```

[API routes](https://nextjs.org/docs/api-routes/introduction) The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

### Aluna Logging

In order to help with the intial relaease, we've developed a quick and simple
logging API. The intention is to work similar to `console.log` but much
more non-tech-user-friendly with regards to output and user-review.

Notable features compared to console.log

- Persists the log between browser and session restarts
- Accessible via a in-app url (`/settings/logs`)
- Webpage based output facilitates users passing logs to us.
- Familiar `.info`, `.debug`, and `.error` type APIs.

#### Usage

The logging implementation is located in`libs/AlunaLogger`.
It has full typescript support. (type declarations and such)
You use it by importing the module, declaring the (usage) context.

And Making the standard `info`, `debug`, `error` calls.

```typescript
import AlunaLogger from './libs/AlunaLogger'

// ...

function FunctionalReactComponent(/*{...}*/) {
  // ... Hooks or such
  const logger = AlunaLogger('FunctionalReactComponent')

  // ...
  logger.info('my info message', { details: true })
  // ...
  logger.debug('my debug message', objectToinspect)
  // ...
  logger.error(
    'my error message',
    new Error('some error. Could be promise catch too')
  )
}
```

The Context (IE 'FunctionalReactComponent') will be added to
all messages.

## On-boarding Notes

The following is some high level info intended to be useful to someone on-boarding or new to this component.

This component is the frontend Dashboard. It's referred to as "Armada" (v1 and 2 or just v2?)

### Create `.env.local`

Derived from the next.js dep this allows us to set
environment vars. Example contents below (\*please envolve
this with the application)

```zsh
# REACT_APP_ makes items public.

REACT_APP_PUBLIC_ALUNA_API=https://dev-dasher.knox.co/api/v2
NEXTAUTH_URL=http://localhost:3000/
REACT_APP_SUPPORT_EMAIL_PROVIDERS=mailto:providers@alunacare.com
PUBLIC_GOOGLE_ANALYTICS=G-3MYGS4L189
REACT_APP_PUBLIC_GOOGLE_ANALYTICS=G-3MYGS4L189
REACT_APP_PUBLIC_CURRENT_COMMIT_SHA1="testid"
secret="<can be anything for local dev>"
```

## "Public" Environment Vars

There are two types - "Public" and "private" env vars.

Anything prefixed with `REACT_APP_` is public and goes to the
\_ENV.js that is available on the client. Be mindful of the data
in there as **PII or private** data should not be put there.

REACT_APP_CURRENT_COMMIT_SHA1 will show up on the app as 'testid' and when the docker container is built, the actual current commit SHA1 is passed in when docker build is run on GH actions.

Anything else is "server side" (the client will still have access
to the data but it's not as straight forward. See
[Nextjs.org/exposing-environment-variables-to-the-browser](https://nextjs.org/docs/basic-features/environment-variables#exposing-environment-variables-to-the-browser)
for more info.

### Tech Aspects

A login is required; you can create a login via running the app `npm run dev`
and going to http://localhost:3000/auth/signup
_Note_: Only works if you created the `.env.local` noted above.

**Note** that **only** Aluna related domains are usable.
Things like gmail or hotmail will be blocked.

This signup will give some basic access but a backend admin will need to give you either
a admin or doctor role.

### Troubleshooting

If npm install error out, make sure you have the right version of node and fresh node_modules

```zsh
node --version
# should be: v16.2.0
# Recommend using nvm to set node versions:
# nvm install v16.2.0 or nvm use v16.2.0

rm -rf node_modules && rm package-lock.json
npm install

# if successful then:
npm run dev

```

...
