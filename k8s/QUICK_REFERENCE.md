# AdvancedKTU - K8s Quick Reference

## 🎯 En Sık Kullanılan Komutlar

### Deploy
```bash
kubectl apply -k k8s/                          # Deploy tümü
kubectl delete -k k8s/                         # Sil tümü
kubectl get all -n advancedktu                 # Her şeyin durumu
```

### Debugging
```bash
kubectl logs <pod> -n advancedktu              # Log görme
kubectl exec -it <pod> -n advancedktu -- /bin/sh  # Pod'a gir
kubectl describe pod <pod> -n advancedktu      # Detay gör
kubectl get events -n advancedktu -w           # Events izle
```

### Monitoring
```bash
kubectl get pods -n advancedktu                # Pod listesi
kubectl top pods -n advancedktu                # CPU/Memory
kubectl get hpa -n advancedktu                 # Auto-scaler
kubectl get pvc -n advancedktu                 # Storage
```

### Port Forwarding
```bash
kubectl port-forward svc/auth-service 8080:8080 -n advancedktu
kubectl port-forward svc/waste-service 8081:8081 -n advancedktu
kubectl port-forward svc/ai-service 3000:3000 -n advancedktu
kubectl port-forward svc/frontend 5174:5174 -n advancedktu
```

### Scaling
```bash
kubectl scale deployment auth-service --replicas=3 -n advancedktu
kubectl autoscale deployment auth-service --min=2 --max=5 -n advancedktu
```

### Update
```bash
kubectl set image deployment/auth-service auth-service=advancedktu/auth-service:v1.1 -n advancedktu
kubectl rollout status deployment/auth-service -n advancedktu
kubectl rollout undo deployment/auth-service -n advancedktu
```

---

## 🐛 Sorun Giderme

| Sorun | Komut | Çözüm |
|------|-------|--------|
| Pod Pending | `kubectl describe pod <pod>` | Resource/Storage kontrol et |
| CrashLoop | `kubectl logs <pod> --previous` | Log'ları oku, env var kontrol et |
| No Endpoints | `kubectl get endpoints` | Service selector kontrol et |
| Network Error | `kubectl logs <pod>` | NetworkPolicy kontrol et |
| Disk Full | `kubectl exec <pod> -- df -h` | PVC boyutunu arttır |

---

## 🌐 Domain Endpoints

| Servis | Domain | URL |
|--------|--------|-----|
| Frontend | advancedktu.site | https://advancedktu.site |
| Frontend (www) | www.advancedktu.site | https://www.advancedktu.site |
| Auth API | api.advancedktu.site | https://api.advancedktu.site |
| Waste Service | waste.advancedktu.site | https://waste.advancedktu.site |
| AI Service | ai.advancedktu.site | https://ai.advancedktu.site |

---

## 🔐 Secrets

```bash
# Ekle: echo -n "password" | base64
# Kontrol: kubectl get secret mongodb-secret -o yaml
# Decode: echo "base64-value" | base64 -d
```

**Mevcut Secrets:**
- `mongodb-secret`: DB credentials
- `auth-service-secret`: JWT_SECRET
- `ai-service-secret`: GEMINI_API_KEY

---

## 📈 HPA (Auto-Scaler) Limits

| Deployment | Min | Max | CPU Target | Memory Target |
|------------|-----|-----|------------|---------------|
| auth-service | 2 | 5 | 70% | 80% |
| waste-service | 2 | 5 | 70% | 80% |
| ai-service | 2 | 5 | 70% | 80% |
| frontend | 2 | 5 | 70% | - |

---

## 💾 Backup

```bash
# Manual Backup
kubectl exec -it mongodb-0 -n advancedktu -- mongodump \
  --uri="mongodb://admin:KtuMongoDB@password2024@localhost:27017/?authSource=admin" \
  --gzip --out=/data/db/backup

# Automatic (CronJob)
kubectl get cronjob -n advancedktu  # mongodb-backup
```

---

## 🔄 Deployment Sayfası

**Manifest Dosyaları:**
- `00-namespace.yaml` - Namespace, quota, limits
- `01-mongodb.yaml` - Database
- `02-auth-service.yaml` - Auth microservice
- `03-waste-service.yaml` - Waste microservice
- `04-ai-service.yaml` - AI microservice
- `05-frontend.yaml` - React UI
- `06-ingress.yaml` - Routing
- `07-monitoring.yaml` - Metrics
- `08-backup-maintenance.yaml` - Backups
- `09-storage-security.yaml` - RBAC, Network policy
- `kustomization.yaml` - Build konfigürasyonu

---

## ⚡ Performance Tips

1. **Resource Limits Set** → CPU/Memory'de OOMKill yok
2. **HPA Enabled** → Traffic arttığında otomatik scale
3. **PDB Active** → Node bakımında service down kalmaz
4. **Network Policy** → Güvenlik + performans
5. **Health Checks** → Failed pod'lar otomatik restart

---

## 📞 Support

- **Logs**: `kubectl logs <pod> -n advancedktu`
- **Status**: `kubectl get all -n advancedktu`
- **Events**: `kubectl get events -n advancedktu -w`
- **Docs**: Bkz. `DEPLOYMENT_GUIDE.md`

---

**Son Güncelleme:** 2024
