# Docker Scout CI/CD Integration Configuration

This document outlines the required secrets and environment variables for Docker Scout integration across different CI/CD platforms.

## 🔐 Required Secrets Configuration

### GitHub Actions (`.github/workflows/docker-scout.yml`)

Configure the following secrets in your GitHub repository settings:

```
REGISTRY_USER=<your-docker-hub-username>
REGISTRY_TOKEN=<docker-hub-access-token>
DOCKER_USER=<your-docker-hub-username>
DOCKER_PAT=<docker-hub-personal-access-token>
```

**Steps to configure:**
1. Go to GitHub Repository → Settings → Secrets and variables → Actions
2. Add each secret with the corresponding value
3. Ensure your Docker Hub account has access to the `ceptokrem` organization

### Azure DevOps (`azure-pipelines.yml`)

Configure the following variables in your Azure DevOps pipeline:

```
DOCKER_HUB_USER=<your-docker-hub-username>
DOCKER_HUB_PAT=<docker-hub-personal-access-token>
```

**Steps to configure:**
1. Go to Azure DevOps → Pipelines → Library → Variable groups
2. Create a new variable group named "docker-hub-creds"
3. Add the variables above (mark DOCKER_HUB_PAT as secret)
4. Link the variable group to your pipeline

### CircleCI (`.circleci/config.yml`)

Configure the following environment variables in CircleCI context:

```
DOCKER_HUB_USER=<your-docker-hub-username>
DOCKER_HUB_PAT=<docker-hub-personal-access-token>
```

**Steps to configure:**
1. Go to CircleCI → Organization Settings → Contexts
2. Create a context named "docker-hub-creds"
3. Add the environment variables above
4. Ensure your project is configured to use this context

## 🐳 Docker Hub Setup

### Personal Access Token Creation

1. Log in to Docker Hub
2. Go to Account Settings → Security → New Access Token
3. Create token with name: `gtek-dante-voice-chip-ci`
4. Copy the generated token (use this as `DOCKER_PAT` or `DOCKER_HUB_PAT`)

### Organization Access

Ensure your Docker Hub account has:
- Push access to `ceptokrem/gtek-dante-voice-chip` repository
- Docker Scout access (included with Docker Pro/Team/Business plans)

## 🔍 Docker Scout Configuration

### Organization Setup

```bash
# Configure Scout with your organization
docker scout config organization ceptokrem
```

### Environment Management

```bash
# Create environments for comparison
docker scout environment production ceptokrem/gtek-dante-voice-chip:latest
docker scout environment staging ceptokrem/gtek-dante-voice-chip:develop
```

## 🚀 Pipeline Features

### Security Scanning Features

1. **CVE Detection**: Scans for critical and high severity vulnerabilities
2. **Environment Comparison**: Compares PR builds against production baseline
3. **SARIF Upload**: Security results uploaded to GitHub Security tab
4. **Automated Blocking**: Pipelines fail on critical/high CVEs
5. **Recommendations**: Provides actionable security improvement suggestions

### Workflow Triggers

- **GitHub Actions**: Triggers on pushes to main/develop and all PRs
- **Azure DevOps**: Triggers on pushes to main branch
- **CircleCI**: Triggers on main, develop, and feature branches

### Image Management

- **Production Images**: Automatically recorded in Docker Scout environments
- **Development Images**: Built but not pushed on PR builds
- **Tagging Strategy**: SHA-based tags for traceability

## 🛠️ Testing the Setup

### Manual Scout Commands

```bash
# Test CVE scanning
docker scout cves ceptokrem/gtek-dante-voice-chip:latest

# Test environment comparison
docker scout compare --to-env production ceptokrem/gtek-dante-voice-chip:latest

# Test recommendations
docker scout recommendations ceptokrem/gtek-dante-voice-chip:latest
```

### Pipeline Validation

1. Create a test PR to trigger the security scans
2. Check pipeline logs for Docker Scout output
3. Verify security results appear in GitHub Security tab
4. Confirm environment recordings in Docker Scout dashboard

## 📋 Checklist

- [ ] Docker Hub account configured with organization access
- [ ] Personal Access Tokens created and stored securely
- [ ] CI/CD secrets configured in respective platforms
- [ ] Docker Scout organization configured (`ceptokrem`)
- [ ] Test pipelines executed successfully
- [ ] Security scans producing expected results
- [ ] Environment comparisons working correctly

## 🔧 Troubleshooting

### Common Issues

1. **Authentication Failed**: Verify Docker Hub credentials and token permissions
2. **Scout CLI Not Found**: Ensure installation step completes successfully
3. **Organization Access**: Confirm account has access to `ceptokrem` organization
4. **Environment Not Found**: Create production environment manually if needed

### Debug Commands

```bash
# Check Scout configuration
docker scout config

# Verify organization access
docker scout environment production

# Test authentication
docker scout whoami
```

This configuration provides comprehensive Docker Scout integration across all major CI/CD platforms with proper security scanning, environment management, and vulnerability reporting.