# AdvancedKTU - Kubernetes Deployment Guide (20 Yıllık DevOps Standardı)

## 📋 İçindekiler
1. [Hızlı Başlangıç](#hızlı-başlangıç)
2. [Ortam Hazırlığı](#ortam-hazırlığı)
3. [Deploy Adımları](#deploy-adımları)
4. [Monitoring ve Logging](#monitoring-ve-logging)
5. [Troubleshooting](#troubleshooting)
6. [Backup ve Recovery](#backup-ve-recovery)

---

## 🚀 Hızlı Başlangıç

### Minimum Sistem Gereksinimleri
- **Kubernetes**: 1.22+
- **CPU**: 4 cores (production için 8+ önerilen)
- **Memory**: 8GB (production için 16GB+ önerilen)
- **Storage**: 30GB (MongoDB 10GB + uploads 5GB + backups 20GB)

### 1️⃣ Tüm Kaynakları Deploy Et (Tek Komut)
```bash
# Tüm manifestoları deploy et
kubectl apply -k k8s/

# Status kontrol et
kubectl get all -n advancedktu

# Rollout durumu kontrol et
kubectl rollout status deployment/auth-service -n advancedktu
kubectl rollout status deployment/waste-service -n advancedktu
kubectl rollout status deployment/ai-service -n advancedktu
kubectl rollout status deployment/frontend -n advancedktu
```

## 🌐 Domain Konfigürasyonu (advancedktu.site)

### DNS Records
```
advancedktu.site.       A     <LOAD_BALANCER_IP>
www.advancedktu.site.   A     <LOAD_BALANCER_IP>
api.advancedktu.site.   A     <LOAD_BALANCER_IP>
waste.advancedktu.site. A     <LOAD_BALANCER_IP>
ai.advancedktu.site.    A     <LOAD_BALANCER_IP>
```

### HTTPS Sertifikası (Let's Encrypt otomatik)
```bash
# cert-manager'ı kur
helm repo add jetstack https://charts.jetstack.io
helm repo update

helm install cert-manager jetstack/cert-manager \
  -n cert-manager --create-namespace \
  --set installCRDs=true \
  --set global.leaderElection.namespace=cert-manager

# Pod'ların başlamasını bekle
kubectl get pods -n cert-manager -w

# ClusterIssuer'lar otomatik oluşturulur:
kubectl get clusterissuer

# Sertifika durumunu kontrol et
kubectl get certificate -n advancedktu -w
kubectl describe certificate advancedktu-tls-cert -n advancedktu

# Sertifikaları kontrol et
kubectl get secret -n advancedktu | grep tls
kubectl get secret advancedktu-tls-cert -n advancedktu -o yaml
```

### LoadBalancer IP'sini Bul
```bash
# External IP'yi bul
kubectl get svc frontend-lb -n advancedktu

# Çıktı örneği:
# NAME           TYPE           CLUSTER-IP    EXTERNAL-IP    PORT(S)
# frontend-lb    LoadBalancer   10.0.0.100    203.0.113.42   80:30000/TCP,443:30001/TCP
```

### DNS Records Ayarla
Hosting sağlayıcında aşağıdaki DNS kayıtlarını ekle:
```
Type: A
Name: advancedktu.site
Value: <EXTERNAL-IP>  (örn: 203.0.113.42)

Type: A
Name: www.advancedktu.site
Value: <EXTERNAL-IP>

Type: A
Name: api.advancedktu.site
Value: <EXTERNAL-IP>

Type: A
Name: waste.advancedktu.site
Value: <EXTERNAL-IP>

Type: A
Name: ai.advancedktu.site
Value: <EXTERNAL-IP>
```

### Sertifika Kontrol Et
```bash
# Sertifikalar aktif mi?
kubectl get certificate -n advancedktu

# Status: True ise sertifika başarılı
kubectl describe certificate advancedktu-tls-cert -n advancedktu | grep -A 5 Status

# HTTPS'nin çalıştığını doğrula
curl -I https://advancedktu.site

# Sertifika detayları
openssl s_client -connect advancedktu.site:443 -showcerts
```

---

## 🔧 Ortam Hazırlığı

### Kubernetes Cluster'ı Oluştur

#### **Minikube** (Local Development)
```bash
# Minikube başlat
minikube start --cpus=4 --memory=8192 --disk-size=30g

# Dashboard aç
minikube dashboard

# Addon'ları aktif et
minikube addons enable ingress
minikube addons enable metrics-server
minikube addons enable storage-provisioner
```

#### **Kind** (Local Kubernetes)
```bash
# Kind cluster oluştur
kind create cluster --name advancedktu --config=- <<EOF
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
  extraPortMappings:
  - containerPort: 5174
    hostPort: 5174
    protocol: TCP
  - containerPort: 8080
    hostPort: 8080
    protocol: TCP
  - containerPort: 8081
    hostPort: 8081
    protocol: TCP
  - containerPort: 3000
    hostPort: 3000
    protocol: TCP
EOF

# Context'i değiştir
kubectl config use-context kind-advancedktu
```

#### **EKS** (AWS Production)
```bash
# eksctl ile cluster oluştur
eksctl create cluster --name advancedktu --region us-east-1 --nodes=3 --node-type=t3.medium

# Storage class oluştur
kubectl apply -f - <<EOF
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: ebs-sc
provisioner: ebs.csi.aws.com
parameters:
  type: gp3
  iops: '3000'
  throughput: '125'
EOF
```

### Namespace ve RBAC Kontrol Et
```bash
# Namespace var mı kontrol et
kubectl get namespace advancedktu

# Service account kontrol et
kubectl get sa -n advancedktu

# Role bindings kontrol et
kubectl get rolebindings -n advancedktu
```

---

## 📦 Deploy Adımları

### 1️⃣ Pre-Deployment Checks
```bash
# Manifest syntax kontrol et
kubectl apply -k k8s/ --dry-run=client

# Manifest validation
kubeval k8s/*.yaml

# Kustomize build kontrol et
kustomize build k8s/
```

### 2️⃣ Secrets Ayarla
```bash
# Base64 encode et
echo -n "KtuMongoDB@password2024" | base64

# Secret'i update et (09-storage-security.yaml'da)
# MONGO_PASSWORD: <NEW_BASE64_VALUE>

# Secret'i kontrol et
kubectl get secret mongodb-secret -n advancedktu -o yaml
```

### 3️⃣ Image Versiyonlarını Ayarla
```bash
# Docker image'ları build et ve push et
docker build -t advancedktu/auth-service:v1.0 ./authentication-service
docker build -t advancedktu/waste-service:v1.0 ./waste-service
docker build -t advancedktu/ai-service:v1.0 ./ai_service
docker build -t advancedktu/frontend:v1.0 ./frontend

# Push et
docker push advancedktu/auth-service:v1.0
docker push advancedktu/waste-service:v1.0
docker push advancedktu/ai-service:v1.0
docker push advancedktu/frontend:v1.0

# Kustomization'da image version güncelle
# images:
#   - name: advancedktu/auth-service
#     newTag: v1.0
```

### 4️⃣ Deploy Et
```bash
# Deploy et
kubectl apply -k k8s/

# Pod'ları gözle (another terminal)
kubectl get pods -n advancedktu -w

# Rollout durumu bekle
kubectl rollout status deployment/auth-service -n advancedktu --timeout=300s
kubectl rollout status deployment/waste-service -n advancedktu --timeout=300s
kubectl rollout status deployment/ai-service -n advancedktu --timeout=300s
kubectl rollout status deployment/frontend -n advancedktu --timeout=300s
```

### 5️⃣ Verification (Doğrulama)
```bash
# Pod'lar çalışıyor mu
kubectl get pods -n advancedktu
# Tüm pod'lar Running ve Ready olmalı

# Services erişilebilir mi
kubectl get svc -n advancedktu
# ClusterIP'ler atanmış mı?

# PVC'ler bound mi
kubectl get pvc -n advancedktu
# Status "Bound" olmalı

# Health check
kubectl get pods -n advancedktu -o wide | grep -E "Running|Ready"
```

---

## 📊 Monitoring ve Logging

### Pod Logs
```bash
# Son 100 satır logu gör
kubectl logs -n advancedktu -l app=auth-service --tail=100 -f

# Tüm pod'ların logunu gör
kubectl logs -n advancedktu -l app=waste-service --all-containers=true --timestamps=true

# Pod'a ait özel konteyner
kubectl logs -n advancedktu <pod-name> -c <container-name>
```

### Events İzleme
```bash
# Namespace'deki olayları gör
kubectl get events -n advancedktu --sort-by='.lastTimestamp'

# Real-time event watch
kubectl get events -n advancedktu -w
```

### Metrics
```bash
# Pod resource kullanımı
kubectl top pods -n advancedktu

# Node resource kullanımı
kubectl top nodes

# HPA durumu
kubectl get hpa -n advancedktu
kubectl describe hpa auth-service-hpa -n advancedktu
```

### Pod Describe
```bash
# Pod detaylarını gör
kubectl describe pod <pod-name> -n advancedktu

# Olaylar kısmına bak: Event sektion'da sorun detayları
```

---

## 🆘 Troubleshooting

### Pod Stuck in Pending
```bash
# Sebepleri kontrol et
kubectl describe pod <pod-name> -n advancedktu

# Olası sebeplerq
# 1. Insufficient CPU/Memory -> Node'a daha fazla resource ekle
# 2. Storage class bulunamadı -> Storage class oluştur
# 3. Image pull hatası -> Image erişilebilir mi kontrol et

# Çözüm: Deployment sil ve yeniden deploy et
kubectl delete deployment auth-service -n advancedktu
kubectl apply -f k8s/02-auth-service.yaml
```

### Pod CrashLoopBackOff
```bash
# Log'u kontrol et
kubectl logs <pod-name> -n advancedktu --previous

# Olası sebepler:
# 1. Hatalı env variables -> ConfigMap/Secret kontrol et
# 2. Database bağlantı hatası -> MongoDB çalışıyor mu? -> kubectl get pod mongodb -n advancedktu
# 3. Port çakışması -> Service port değiştir

# Database'e bağlanabilir mi kontrol et
kubectl exec -it mongodb-0 -n advancedktu -- mongosh admin -u admin -p KtuMongoDB@password2024
```

### Service'ler Erişilemiyor
```bash
# Service status
kubectl get svc -n advancedktu
kubectl describe svc auth-service -n advancedktu

# Endpoints kontrolü
kubectl get endpoints -n advancedktu

# DNS çalışıyor mu
kubectl run -it --rm debug --image=busybox --restart=Never -n advancedktu -- nslookup auth-service

# Firewallı kontrol et
kubectl exec -it <pod-name> -n advancedktu -- nc -zv auth-service 8080
```

### Network Policy Problemleri
```bash
# Network policy'leri kontrol et
kubectl get networkpolicy -n advancedktu

# İşlemez ise geçici olarak kapat
kubectl delete networkpolicy --all -n advancedktu

# Sonra düzeltip yeniden ekle
kubectl apply -f k8s/09-storage-security.yaml
```

### Disk Doluluğu Sorunu
```bash
# PVC kullanımını kontrol et
kubectl describe pvc -n advancedktu

# Pod içinden kontrol et
kubectl exec -it <pod-name> -n advancedktu -- df -h

# Eski backupları temizle
kubectl exec -it mongodb-0 -n advancedktu -- rm -rf /backup/dump_*
```

---

## 💾 Backup ve Recovery

### Manual Backup
```bash
# MongoDB backup al
kubectl exec -it mongodb-0 -n advancedktu -- mongodump \
  --uri="mongodb://admin:KtuMongoDB@password2024@localhost:27017/?authSource=admin" \
  --gzip \
  --out=/data/db/backup-$(date +%Y%m%d_%H%M%S)

# Backup'ı local'e indir
kubectl cp advancedktu/mongodb-0:/data/db/backup-20240101_120000 ./backup-$(date +%Y%m%d_%H%M%S)
```

### Backup Restore
```bash
# Backup'ı pod'a gönder
kubectl cp ./backup-20240101_120000 advancedktu/mongodb-0:/tmp/restore

# Restore et
kubectl exec -it mongodb-0 -n advancedktu -- mongorestore \
  --uri="mongodb://admin:KtuMongoDB@password2024@localhost:27017/?authSource=admin" \
  --gzip \
  /tmp/restore
```

### Automatic Backup Status
```bash
# Backup job'ların durumu
kubectl get cronjob -n advancedktu
kubectl get job -n advancedktu

# Son backup'ı kontrol et
kubectl logs -n advancedktu -l job-name=mongodb-backup-* --tail=50
```

---

## 🔄 Rolling Update / Rollback

### Rolling Update
```bash
# Yeni image ile update et
kubectl set image deployment/auth-service \
  auth-service=advancedktu/auth-service:v1.1 \
  -n advancedktu

# Rollout durumunu gözle
kubectl rollout status deployment/auth-service -n advancedktu

# Tarihçeyi gör
kubectl rollout history deployment/auth-service -n advancedktu
```

### Rollback
```bash
# Son versiyona geri dön
kubectl rollout undo deployment/auth-service -n advancedktu

# Spesifik revizyon'a dön
kubectl rollout undo deployment/auth-service --to-revision=1 -n advancedktu
```

---

## 📝 Production Checklist

- [ ] Database backups otomatik çalışıyor
- [ ] Monitoring ve alerting konfigüre edildi
- [ ] Secrets güvenli şekilde saklanıyor
- [ ] Resource limits ve requests ayarlanmış
- [ ] Network policies aktif
- [ ] RBAC roles tanımlanmış
- [ ] PVCs persistent storage'a bağlı
- [ ] Health checks pod'lardaki
- [ ] Logs centralized logging sistem'e gidiyor
- [ ] Disaster recovery planı test edildi

---

## 📚 Faydalı Komutlar

```bash
# Namespace içinde her şeyi sil
kubectl delete namespace advancedktu

# Tüm resources'ı sil (kustomization ile deploy ettiysen)
kubectl delete -k k8s/

# Manifest'i dry-run ile test et
kubectl apply -k k8s/ --dry-run=client --validate=true

# Port forward (3 servis aynı anda)
for svc in auth-service waste-service ai-service; do
  kubectl port-forward svc/$svc ${svc//[!0-9]/}:${svc//[!0-9]/} -n advancedktu &
done

# Tüm pod'ları restart et
kubectl rollout restart deployment --all -n advancedktu

# Scale deployment
kubectl scale deployment auth-service --replicas=3 -n advancedktu
```

---

**Son Güncelleme**: 2024
**Uyumlu K8s Versiyonu**: 1.22+
**Yazar**: DevOps Team
