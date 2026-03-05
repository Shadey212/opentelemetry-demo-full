#!/usr/bin/env bash
set -euo pipefail

# ──────────────────────────────────────────────────────────────────────────────
# otel-demo-v2 — Full deployment to AWS EKS with Better Stack
# ──────────────────────────────────────────────────────────────────────────────

CLUSTER_NAME="otel-demo-v2"
REGION="us-east-2"
NAMESPACE="otel-demo"
APP_VERSION="2.2.0"

echo "==> Connecting to cluster $CLUSTER_NAME..."
aws eks update-kubeconfig --name "$CLUSTER_NAME" --region "$REGION"

echo "==> Creating namespace..."
kubectl apply -f "$(dirname "$0")/secrets.yaml"

echo ""
echo "⚠️  IMPORTANT: Have you filled in all REPLACE_ME values in k8s/secrets.yaml?"
echo "   Press Enter to continue or Ctrl+C to abort and fill them in first."
read -r

echo "==> Installing Helm repos..."
helm repo add open-telemetry https://open-telemetry.github.io/opentelemetry-helm-charts
helm repo add better-stack https://betterstackhq.github.io/collector-helm-chart
helm repo update

echo "==> Deploying OpenTelemetry Demo (with Better Stack values)..."
helm upgrade --install opentelemetry-demo open-telemetry/opentelemetry-demo \
  --namespace "$NAMESPACE" \
  --create-namespace \
  --version 0.37.0 \
  --values "$(dirname "$0")/values-betterstack.yaml" \
  --set "default.envOverride[0].value=$APP_VERSION" \
  --wait \
  --timeout 10m

echo "==> Installing Better Stack Collector..."
helm upgrade --install better-stack-collector better-stack/collector \
  --namespace "$NAMESPACE" \
  --set collector.env.COLLECTOR_SECRET="$BETTERSTACK_COLLECTOR_SECRET" \
  --wait \
  --timeout 5m

echo ""
echo "✅ Deployment complete!"
echo ""
echo "==> Waiting for LoadBalancer IP..."
kubectl get svc -n "$NAMESPACE" opentelemetry-demo-frontendproxy --watch &
WATCH_PID=$!
sleep 30
kill $WATCH_PID 2>/dev/null || true

EXTERNAL_IP=$(kubectl get svc -n "$NAMESPACE" opentelemetry-demo-frontendproxy \
  -o jsonpath='{.status.loadBalancer.ingress[0].hostname}' 2>/dev/null || \
  kubectl get svc -n "$NAMESPACE" opentelemetry-demo-frontendproxy \
  -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "pending")

echo ""
echo "🌐 Frontend URL: http://$EXTERNAL_IP"
echo "📊 Better Stack: https://telemetry.betterstack.com"
echo ""
echo "Next steps:"
echo "  1. Copy the frontend URL to Better Stack Uptime for monitoring"
echo "  2. Add heartbeat URLs per service (share them and we'll configure)"
echo "  3. Verify data flowing in Better Stack → Logs & Traces"
