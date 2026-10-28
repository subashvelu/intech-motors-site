# Intech Motors website – AWS DevOps starter project

A static website hosted on AWS and deployed automatically from GitHub.

```
 You push code ─► GitHub ─► GitHub Actions ─► S3 (private) ─► CloudFront (HTTPS) ─► Visitors
                              │  (OIDC login, no passwords/keys stored)
                              └─ htmlhint check ─► s3 sync ─► cache invalidation
```

## What you will learn
- **S3** (private bucket) and **CloudFront** (CDN + HTTPS) with Origin Access Control
- **IAM**, least-privilege roles, and **OIDC** (GitHub logs in to AWS without access keys)
- **Infrastructure as Code** with CloudFormation (`infra/template.yaml`)
- **CI/CD** with GitHub Actions (`.github/workflows/deploy.yml`)

## Project files
```
index.html                      the website
assets/css, assets/js, assets/img
infra/template.yaml             all AWS resources (CloudFormation)
.github/workflows/deploy.yml    CI/CD pipeline
```

## Step 1 – Put the code on GitHub
1. Create a new **public or private** repo on github.com (example: `intech-motors-site`).
2. In this folder:
```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/intech-motors-site.git
git push -u origin main
```
(The first push will show a failed Action. That is normal, AWS is not set up yet.)

## Step 2 – AWS account (free)
1. Sign up at aws.amazon.com and choose the **Free plan**.
   - New accounts get about $100 in credits (up to $200 after onboarding tasks). The Free plan lasts up to 6 months or until credits are used, then you must upgrade to the Paid plan or the account closes. Check the current rules on AWS's Free Tier page, they change.
   - CloudFront has an always-free allowance (1 TB/month). This small site uses a tiny fraction of that.
2. **Secure it first:** turn on MFA for the root user, then create a budget alert (Billing → Budgets → "Zero spend budget" or $1).
3. Install the AWS CLI and run `aws configure` (use an IAM user or IAM Identity Center user, not the root user).

## Step 3 – Create the AWS infrastructure
```bash
aws cloudformation deploy \
  --template-file infra/template.yaml \
  --stack-name intech-site \
  --capabilities CAPABILITY_IAM \
  --region ap-south-1 \
  --parameter-overrides GitHubRepo=YOUR-USERNAME/intech-motors-site

aws cloudformation describe-stacks --stack-name intech-site \
  --region ap-south-1 --query "Stacks[0].Outputs" --output table
```
If it says the OIDC provider already exists, add `CreateOidcProvider=false` to `--parameter-overrides`.

## Step 4 – Connect GitHub to AWS
In your GitHub repo: **Settings → Secrets and variables → Actions**

| Type | Name | Value (from the stack outputs) |
|---|---|---|
| Secret | `AWS_ROLE_ARN` | DeployRoleArn |
| Secret | `S3_BUCKET` | S3Bucket |
| Secret | `CF_DISTRIBUTION_ID` | CloudFrontDistributionId |
| Variable | `AWS_REGION` | `ap-south-1` |

## Step 5 – Deploy
Go to **Actions → Deploy website to AWS → Run workflow** (or just push any change to `main`).
When it turns green, open the `WebsiteURL` output. It looks like `https://dxxxxxxxx.cloudfront.net`.

From now on: **edit → git push → live in about a minute.**

## Custom domain (optional, not free)
A domain name always costs money (yearly fee from the registrar). Free options:
- Use the `*.cloudfront.net` URL, or
- Host on **GitHub Pages** for a free `username.github.io/...` address.

To use a paid domain with this setup: request a free certificate in **ACM in us-east-1**, add your domain as an alternate domain name (CNAME) on the CloudFront distribution, then point the domain's DNS to the CloudFront URL. Note: Route 53 hosted zones cost about $0.50/month and are not free-tier. You can use your registrar's DNS or Cloudflare instead.

## Clean up (to avoid any charges)
```bash
aws s3 rm s3://YOUR-BUCKET-NAME --recursive
aws cloudformation delete-stack --stack-name intech-site --region ap-south-1
```

## Next steps to level up
1. Rewrite `infra/template.yaml` in **Terraform**.
2. Add a **CloudWatch alarm / budget alert** via IaC.
3. Add a staging site (separate stack, deploy from a `dev` branch).
4. Add the custom domain + ACM certificate to the template.
5. Add Lighthouse / link-check steps in the pipeline.
