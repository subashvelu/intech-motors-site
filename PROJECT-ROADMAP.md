# AWS DevOps project roadmap (free-tier friendly)

Goal: 5 to 6 small, finished, well-documented projects. Recruiters prefer **few good projects with a README, a diagram and a live link** over many empty repos.

## Golden rules for the free tier
1. **Budget alert first** (you already have one). Check Billing → Bills every week.
2. Prefer **serverless and static** services: S3, CloudFront, Lambda, API Gateway, DynamoDB, SNS, CloudWatch.
3. **Avoid things that cost money by the hour**: NAT Gateway, Load Balancers, RDS, EKS, Fargate, idle Elastic IPs / public IPv4. If a project needs one, build it, take screenshots, then **destroy it the same day**.
4. Define everything as code, so `terraform destroy` or deleting the stack removes it all.
5. The new AWS Free plan lasts about 6 months or until credits run out. **Plan your projects inside that window.**
6. Never commit keys, `.csv` key files, or `.env` files. Use OIDC.
7. **Do not rename a repo that an IAM role trusts** (the repo name is inside the OIDC trust rule). If you must, update the stack's `GitHubRepo` parameter first.

## Projects in order

| # | Project | Services / tools | Why recruiters like it | Cost risk |
|---|---|---|---|---|
| 1 | ✅ **Intech Motors site: S3 + CloudFront + CI/CD** | S3, CloudFront, IAM, OIDC, CloudFormation, GitHub Actions | Real client, real traffic, security-aware pipeline | Very low |
| 2 | **Terraform rewrite of project 1** (remote state in S3, modules, `plan` on pull requests) | Terraform, S3 backend, GitHub Actions | Terraform is the most requested IaC skill | Very low |
| 3 | **Serverless quote-request API** for Intech: form → API Gateway → Lambda (Python) → DynamoDB → SNS email to the owner | Lambda, API Gateway, DynamoDB, SNS, SAM or Terraform | Shows backend + event-driven design on a real use case | Low |
| 4 | **DevSecOps checks**: add Checkov (IaC scan), Trivy, Dependabot, branch protection and a required PR review to projects 1–3 | GitHub Actions, Checkov, Trivy | "Shift-left security" is a hot interview topic | None |
| 5 | **Dockerised app on EC2 with automated deploy** (build image in Actions, push to ECR, deploy with SSM or SSH, Nginx reverse proxy) | Docker, ECR, EC2 (t3.micro), SSM | Containers + Linux + deployment | Medium: stop or destroy after the demo |
| 6 | **Monitoring as code**: CloudWatch dashboard and alarms (CloudFront 5xx, Lambda errors, budget) sending SNS alerts | CloudWatch, SNS, Budgets | Observability, the other half of DevOps | Very low |
| 7 | **Kubernetes + GitOps, local and free**: kind or k3s on your laptop, Helm chart, Argo CD syncing from GitHub | Kubernetes, Helm, Argo CD | Many job posts ask for Kubernetes | None (runs locally) |

**Suggested order:** 2 → 3 → 4 → 6 → 5 → 7. Aim for one project every 2 to 3 weeks.

## What every project repo must have
- A README with: one-line summary, **architecture diagram** (Mermaid), live link or demo GIF, tech badges, how to run it, **security decisions**, **problems you solved**
- Short, meaningful commit messages (`add alarm for CloudFront 5xx`, not `update`)
- A repo **description, website link and topics** in the About box
- No secrets, no key files, `.gitignore` in place

## Naming (kebab-case, says what it is)
`aws-terraform-static-site`, `aws-serverless-quote-api`, `devsecops-pipeline-demo`, `docker-ec2-cicd`, `cloudwatch-alerts-as-code`, `k8s-gitops-argocd`

## Resume bullets you can use today (all true for project 1)
- Deployed a production website for a local business on **AWS (S3, CloudFront, IAM)** with infrastructure defined in **CloudFormation**.
- Built a **CI/CD pipeline with GitHub Actions** that validates and deploys on every push, authenticating to AWS through **OIDC** with a least-privilege role (no stored access keys).
- Diagnosed and fixed an OIDC trust failure caused by GitHub's new subject-claim format, and resolved a CloudFront account-verification block through AWS Support.
- Built an **offline-capable PWA** for invoicing (PIN lock, PDF generation, backup/restore) used by the shop owner.

## Interview stories already in your pocket
1. *"Tell me about a time you debugged something hard."* → the OIDC `sub` claim story.
2. *"How do you keep credentials safe?"* → OIDC, push protection, `.gitignore`, key rotation.
3. *"How do you control cloud cost?"* → budget alert, free-tier-only services, destroy after demo.
