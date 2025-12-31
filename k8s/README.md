# AdvancedKTU - Kubernetes Manifests

Kubernetes (K8s) için production-ready manifestolar. 20 yıllık DevOps standardlarına uygun olarak hazırlanmıştır.

## 📋 Manifest Dosyaları

### 🔐 Security & Networking
- **00-namespace.yaml**: Namespace, ResourceQuota, LimitRange, NetworkPolicy
- **09-storage-security.yaml**: RBAC, StorageClass, Pod Security Policy

### 🗄️ Database
- **01-mongodb.yaml**: MongoDB StatefulSet, PVC, Service, backup

### 🔌 Microservices
- **02-auth-service.yaml**: Authentication Service (Deployment, HPA, PDB)
- **03-waste-service.yaml**: Waste Service (Deployment, HPA, PDB)
- **04-ai-service.yaml**: AI Service (Deployment, HPA, PDB)
- **05-frontend.yaml**: React Frontend (Deployment, HPA, PDB)

### 🌐 Networking & Routing
- **06-ingress.yaml**: Ingress (HTTPS, domain routing), LoadBalancer Service
- **10-cert-manager.yaml**: Let's Encrypt sertifikası konfigürasyonu

### 📊 Observability
- **07-monitoring.yaml**: Prometheus, ServiceMonitor, PrometheusRule, Node Exporter

### 🛠️ Operations
- **08-backup-maintenance.yaml**: CronJobs (backup, cleanup, health-check)
- **kustomization.yaml**: Build automation

---

## 🚀 Hızlı Başlangıç

### 1. Deploy Et
```bash
# Tüm kaynakları deploy et
kubectl apply -k k8s/

# Status kontrol et
kubectl get all -n advancedktu
```

### 2. Port Forward
```bash
kubectl port-forward svc/frontend 5174:5174 -n advancedktu
# Sonra: http://localhost:5174
```

### 3. Logs İzle
```bash
kubectl logs -n advancedktu -l app=auth-service -f
```

---

## 🌐 Domain Configuration (advancedktu.site)

### DNS Setup
```
advancedktu.site       A  <LoadBalancer-IP>
www.advancedktu.site   A  <LoadBalancer-IP>
api.advancedktu.site   A  <LoadBalancer-IP>
waste.advancedktu.site A  <LoadBalancer-IP>
ai.advancedktu.site    A  <LoadBalancer-IP>
```

### HTTPS Certificates (Let's Encrypt)
```bash
# cert-manager kurulumu
helm repo add jetstack https://charts.jetstack.io
helm install cert-manager jetstack/cert-manager \
  -n cert-manager --create-namespace --set installCRDs=true

# Otomatik sertifika istemesi (Ingress annotation ile)
# cert-manager.io/cluster-issuer: "letsencrypt-prod"

# Manual sertifika kontrol
kubectl get certificate -n advancedktu
kubectl describe certificate advancedktu-tls-cert -n advancedktu
```

### Service Endpoints
| Service | Domain | Port |
|---------|--------|------|
| Frontend | advancedktu.site | HTTPS (443) |
| Frontend | www.advancedktu.site | HTTPS (443) |
| Auth API | api.advancedktu.site | HTTPS (443) |
| Waste Service | waste.advancedktu.site | HTTPS (443) |
| AI Service | ai.advancedktu.site | HTTPS (443) |

---

```
┌─────────────────────────────────────────────────────────────┐
│                     Kubernetes Cluster                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │  Auth   │  │ Waste   │  │   AI    │  │Frontend │        │
│  │Service  │  │Service  │  │Service  │  │ (React) │        │
│  │ (Go)    │  │ (Go)    │  │(Node.js)│  │         │        │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘        │
│       │             │            │            │              │
│       └─────────────┼────────────┼────────────┘              │
│                     │            │                            │
│                  ┌──▼────────────▼──┐                         │
│                  │   MongoDB        │                         │
│                  │  StatefulSet     │                         │
│                  └──────┬───────────┘                         │
│                         │                                     │
│                  ┌──────▼───────────┐                         │
│                  │   Persistent     │                         │
│                  │   Volume (10Gi)  │                         │
│                  └──────────────────┘                         │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│  Backup, Monitoring, Scaling, Security                       │
│  - MongoDB backup (daily)                                    │
│  - HPA (Horizontal Pod Autoscaler)                           │
│  - NetworkPolicy (security)                                  │
│  - ResourceQuota (limits)                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Resource Allocation

### Memory & CPU Limits

| Service | CPU Req | CPU Limit | Mem Req | Mem Limit |
|---------|---------|-----------|---------|-----------|
| MongoDB | 250m | 1000m | 256Mi | 1Gi |
| Auth | 100m | 500m | 128Mi | 512Mi |
| Waste | 150m | 750m | 256Mi | 768Mi |
| AI | 250m | 1000m | 512Mi | 1Gi |
| Frontend | 100m | 500m | 128Mi | 256Mi |

**Total**: ~1.7 CPU / 2.5GB (requests), ~4.25 CPU / 4.1GB (limits)

---

## 🔄 Pod Replicas & Scaling

| Service | Min | Max | Scale Trigger |
|---------|-----|-----|------------------|
| Auth | 2 | 5 | CPU > 70% or Memory > 80% |
| Waste | 2 | 5 | CPU > 70% or Memory > 80% |
| AI | 2 | 5 | CPU > 70% or Memory > 80% |
| Frontend | 2 | 5 | CPU > 70% |

---

## 💾 Storage

| Volume | Type | Size | Mount Point | Purpose |
|--------|------|------|-------------|---------|
| mongodb-data | PVC | 10Gi | /data/db | Database data |
| mongodb-config | PVC | 1Gi | /data/configdb | MongoDB config |
| waste-uploads | PVC | 5Gi | /app/uploads | File uploads |
| backup-pvc | PVC | 20Gi | /backup | Backups |

---

## 🔐 Secrets & ConfigMaps

### Secrets (Şifreli)
- `mongodb-secret`: MONGO_INITDB_ROOT_USERNAME, MONGO_INITDB_ROOT_PASSWORD
- `auth-service-secret`: JWT_SECRET
- `ai-service-secret`: GEMINI_API_KEY
- `db-credentials`: MONGO_USERNAME, MONGO_PASSWORD

### ConfigMaps (Açık)
- `mongodb-config`: Database name, log level
- `auth-service-config`: Port, DB_NAME, environment
- `waste-service-config`: Port, service URLs
- `ai-service-config`: Port, NODE_ENV
- `frontend-config`: API URLs, nginx config
- `pod-log-config`: Log rotation rules
- `maintenance-scripts`: Backup/cleanup scripts

---

## 🛡️ Security Features

✅ **RBAC** - Role-based access control
✅ **NetworkPolicy** - Traffic isolation
✅ **PodSecurityPolicy** - Pod constraints
✅ **ResourceQuota** - Resource limits per namespace
✅ **Non-root user** - Containers run as non-root
✅ **Read-only filesystem** - Where possible
✅ **Secret management** - Encrypted secrets
✅ **Image scanning** - Private registry support

---

## 📈 Monitoring & Alerting

### Prometheus Metrics
- Pod CPU/Memory usage
- Pod restart rate
- Disk usage
- Network traffic
- Custom application metrics (if exposed)

### Alerts
- High memory usage (> 90%)
- High CPU usage (> 80%)
- Pod crash loops
- High restart rate

### Tools
- `prometheus` - Metrics collection
- `node-exporter` - Node metrics
- `alertmanager` - Alert routing (optional)

---

## 🔄 Backup Strategy

### Automatic Backups
```bash
# MongoDB backup (daily at 02:00 UTC)
- CronJob: mongodb-backup
- Retention: 30 days
- Storage: 20Gi PVC
```

### Manual Backup
```bash
kubectl exec mongodb-0 -n advancedktu -- mongodump \
  --uri="mongodb://admin:KtuMongoDB@password2024@localhost:27017/?authSource=admin" \
  --gzip --out=/data/db/backup
```

---

## 🔧 Customization

### Change Image Tags
Edit `kustomization.yaml`:
```yaml
images:
  - name: advancedktu/auth-service
    newTag: v1.1.0
```

### Change Replica Count
```bash
kubectl scale deployment auth-service --replicas=3 -n advancedktu
```

### Change Resources
Edit deployment spec:
```yaml
resources:
  requests:
    cpu: 200m      # Increase from 100m
    memory: 256Mi   # Increase from 128Mi
  limits:
    cpu: 1000m     # Increase from 500m
    memory: 1Gi    # Increase from 512Mi
```

---

## 🆘 Troubleshooting

See **DEPLOYMENT_GUIDE.md** for detailed troubleshooting.

Common issues:
- **Pod Pending**: Check ResourceQuota, StorageClass
- **CrashLoop**: Check logs, env variables, dependencies
- **Network issues**: Check NetworkPolicy, Service endpoints
- **Storage issues**: Check PVC, storage provisioner

---

## 📚 Documentation

- **DEPLOYMENT_GUIDE.md** - Detailed setup guide
- **QUICK_REFERENCE.md** - Common commands
- **00-namespace.yaml** - Namespace setup
- **README.md** - This file

---

## 🔗 External Resources

- [Kubernetes Official Docs](https://kubernetes.io/docs/)
- [Kubernetes Best Practices](https://kubernetes.io/docs/concepts/configuration/overview/)
- [MongoDB on Kubernetes](https://www.mongodb.com/kubernetes)
- [Helm Charts](https://helm.sh/)

---

## 📝 Production Checklist

- [ ] Image versions tagged and pushed
- [ ] Secrets set with production values
- [ ] Resource limits configured
- [ ] Backup strategy tested
- [ ] Monitoring enabled
- [ ] Network policies tested
- [ ] RBAC configured
- [ ] SSL/TLS certificates
- [ ] Health checks passing
- [ ] Disaster recovery plan

---

## 🤝 Support & Contribution

- Report issues: GitHub Issues
- Documentation: Improve docs
- Manifest improvements: Pull requests

---

**Created**: 2024
**Compatible with**: Kubernetes 1.22+
**Architecture**: Single node (scalable to multi-node)
**Production Ready**: Yes ✅
