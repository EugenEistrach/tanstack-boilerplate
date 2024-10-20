# Deployments

## Docker (self-hosted for example)

This can be deployed to any platform that supports docker. Check the
`Dockerfile` for reference.

## Fly.io

Those steps should deploy the app and create the volume for sqlite, etc.:

1. brew install flyctl
2. fly auth login
3. fly launch

Make sure to add all the secrets to the fly app after and redeploy.

```
fly secrets set SESSION_SECRET=
fly secrets set REDIS_URL=
fly secrets set GITHUB_CLIENT_ID=
fly secrets set GITHUB_CLIENT_SECRET=
fly secrets set RESEND_API_KEY=
fly secrets set EMAIL_FROM=
```

**There is a github action that will deploy the app to fly.io. A secret needs to
be set in github secrets for the action to work.**
