#!/usr/bin/env bash
# Build from the Dockerfile and deploy to Cloud Run (Sydney) with locked-down settings.
#
# Usage (e.g. in Google Cloud Shell):
#   ./scripts/deploy-cloud-run.sh
#
# Defaults to project perkfinder-512800 in australia-southeast1. If SERVICE is
# not set and exactly one Cloud Run service already exists there, that service
# is updated in place; otherwise a service called "perk-finder" is used.
#
# The first run creates a dedicated service account with no IAM roles, so a
# compromised container cannot touch anything else in the project (the default
# compute service account has the broad Editor role).
set -euo pipefail

PROJECT="${PROJECT:-perkfinder-512800}"
REGION="${REGION:-australia-southeast1}"

gcloud config set project "$PROJECT" >/dev/null

if [[ -z "${SERVICE:-}" ]]; then
  mapfile -t existing < <(gcloud run services list --region "$REGION" --format="value(metadata.name)")
  if [[ ${#existing[@]} -eq 1 ]]; then
    SERVICE="${existing[0]}"
  elif [[ ${#existing[@]} -gt 1 ]]; then
    echo "Several Cloud Run services found in $REGION: ${existing[*]}" >&2
    echo "Re-run with SERVICE=<name> ./scripts/deploy-cloud-run.sh" >&2
    exit 1
  else
    SERVICE="perk-finder"
  fi
fi
echo "Deploying service '$SERVICE' to project $PROJECT in $REGION"

gcloud services enable run.googleapis.com cloudbuild.googleapis.com \
  artifactregistry.googleapis.com iam.googleapis.com

# Service account ids must be 6-30 chars, lowercase.
SA_NAME="$(echo "${SERVICE}-run" | tr '[:upper:]' '[:lower:]' | cut -c1-30)"
RUNTIME_SA="${SA_NAME}@${PROJECT}.iam.gserviceaccount.com"

if ! gcloud iam service-accounts describe "$RUNTIME_SA" >/dev/null 2>&1; then
  echo "Creating least-privilege runtime service account $RUNTIME_SA"
  gcloud iam service-accounts create "$SA_NAME" \
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

URL="$(gcloud run services describe "$SERVICE" --region "$REGION" --format='value(status.url)')"
echo
echo "Live at: $URL"
echo "Security headers:"
curl -sI "$URL" | grep -iE "content-security-policy|strict-transport|x-frame-options" || true
