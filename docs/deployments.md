# Deployment Guide

This guide covers all necessary steps to deploy your application to production.

## Prerequisites

1. **Turso Database**

   ```bash
   # Install Turso CLI
   brew install tursodatabase/tap/turso

   # Login to Turso
   turso auth login

   # Create database
   turso db create my-app-db

   # Get credentials
   turso db show my-app-db
   turso db tokens create my-app-db
   ```

2. **GitHub OAuth App**

   - Go to GitHub Developer Settings → OAuth Apps → New OAuth App
   - Set Homepage URL to your production URL
   - Set Authorization callback URL to `{PRODUCTION_URL}/auth/github/callback`
   - Save Client ID and Client Secret

3. **Discord OAuth App** (if using Discord auth)

   - Go to Discord Developer Portal → Applications → New Application
   - Under OAuth2, add redirect URL: `{PRODUCTION_URL}/auth/discord/callback`
   - Save Client ID and Client Secret

4. **Resend Account** (for emails)

   - Create account at [resend.com](https://resend.com)
   - Get API key from dashboard
   - Verify your domain for the sender email

5. **Trigger.dev Setup**

   ```bash
   # Install Trigger.dev CLI
   pnpm dlx @trigger.dev/cli@latest init

   # Follow the setup wizard and save:
   # - TRIGGER_API_KEY
   # - TRIGGER_API_URL (if self-hosted)
   ```

## Fly.io Deployment

1. **Install and Login**

   ```bash
   brew install flyctl
   fly auth login
   ```

2. **Create Application**

   ```bash
   fly launch
   ```

   - Say yes to copying existing config
   - Choose region closest to your users
   - Say no to immediate deployment

3. **Set Environment Variables**

   Stage your secrets first:

   ```bash
   # App Configuration
   fly secrets set --stage APPLICATION_URL=https://your-app.fly.dev
   fly secrets set --stage SESSION_SECRET=$(openssl rand -base64 32)

   # Database
   fly secrets set --stage TURSO_DATABASE_URL="libsql://your-db-url"
   fly secrets set --stage TURSO_AUTH_TOKEN="your-auth-token"

   # Authentication
   fly secrets set --stage GITHUB_CLIENT_ID="your-github-client-id"
   fly secrets set --stage GITHUB_CLIENT_SECRET="your-github-client-secret"
   fly secrets set --stage DISCORD_CLIENT_ID="your-discord-client-id"
   fly secrets set --stage DISCORD_CLIENT_SECRET="your-discord-client-secret"

   # Email
   fly secrets set --stage RESEND_API_KEY="your-resend-api-key"
   fly secrets set --stage EMAIL_FROM="your@verified-domain.com"

   # Admin Access
   fly secrets set --stage ADMIN_USER_EMAILS="admin1@example.com,admin2@example.com"

   # Trigger.dev
   fly secrets set --stage TRIGGER_API_KEY="your-trigger-api-key"
   fly secrets set --stage TRIGGER_API_URL="your-trigger-api-url" # if self-hosted
   ```

   Then deploy the staged secrets:

   ```bash
   fly secrets deploy
   ```

## GitHub Actions Setup

1. **Generate Fly.io Token**

   ```bash
   flyctl auth token
   ```

2. **Add GitHub Repository Secrets** Go to Settings → Secrets and variables →
   Actions and add:

   ```
   # Required
   FLY_API_TOKEN=           # From step 1

   # For Trigger.dev (if using)
   TRIGGER_ACCESS_TOKEN=    # Your Trigger.dev access token
   REGISTRY_USERNAME=       # Docker registry username
   REGISTRY_PASSWORD=       # Docker registry password
   ```

3. **Enable GitHub Actions**
   - Ensure `.github/workflows` directory exists
   - Push to `main` branch to trigger deployment

## Deployment Process

The GitHub Action will:

1. Run type checking, linting, and tests
2. Build the application
3. Deploy to Fly.io
4. Run health checks
5. Deploy Trigger.dev jobs (if configured)

## Monitoring

After deployment:

1. Check application logs: `fly logs`
2. Monitor status: `fly status`
3. Access console: `fly console`
4. Check Trigger.dev dashboard for job status

## Troubleshooting

1. **Database Issues**

   ```bash
   # Check database status
   turso db show my-app-db

   # Check database replicas
   turso db replicas list my-app-db
   ```

2. **Deployment Issues**

   ```bash
   # View detailed logs
   fly logs

   # SSH into the instance
   fly ssh console
   ```

3. **Trigger.dev Issues**
   - Check job runs in Trigger.dev dashboard
   - Verify API keys and URLs
   - Check job logs for errors
