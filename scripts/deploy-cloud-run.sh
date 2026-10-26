#!/usr/bin/env bash
# Build from the Dockerfile and deploy to Cloud Run with locked-down settings.
#
# Usage:
#   SERVICE=perk-finder REGION=australia-southeast1 ./scripts/deploy-cloud-run.sh
#
# The first run creates a dedicated service account with no IAM roles, so a
# compromised container cannot touch anything else in your project (the default
# compute service account has the broad Editor role).
set -euo pipefail

SERVICE="${SERVICE:-perk-finder}"
REGION="${REGION:-australia-southeast1}"
PROJECT="$(gcloud config get-value project 2>/dev/null)"
RUNTIME_SA="${SERVICE}-run@${PROJECT}.iam.gserviceaccount.com"

if [[ -z "$PROJECT" ]]; then
  echo "No gcloud project set. Run: gcloud config set project YOUR_PROJECT_ID" >&2
  exit 1
fi

if ! gcloud iam service-accounts describe "$RUNTIME_SA" >/dev/null 2>&1; then
  echo "Creating least-privilege runtime service account $RUNTIME_SA"
  gcloud iam service-accounts create "${SERVICE}-run" \
    --display-name="${SERVICE} Cloud Run runtime (no roles)"
fi

gcloud run deploy "$SERVICE" \
  --source . \
  --region "$REGION" \
  --service-account "$RUNTIME_SA" \
  --allow-unauthenticated \
  --port 8080 \
  --cpu 1 \
  --memory 512Mi \
  --concurrency 80 \
  --min-instances 0 \
  --max-instances 3 \
  --timeout 30s
