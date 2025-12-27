#!/bin/bash

# ============================================================================
# AdvancedKTU Multi-Service Docker Build Script (Linux/macOS)
# ============================================================================
# 
# Kullanım:
#   ./build-docker.sh -a                              # Tüm servisleri build et
#   ./build-docker.sh -s authentication-service       # Tek servis build et
#   ./build-docker.sh -a -r docker.io/username -v 1.0.0  # Registry ile build et
#   ./build-docker.sh -a -p                           # Build ve push et

set -e

# Renkler
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Varsayılanlar
REGISTRY="advancedktu"
VERSION="latest"
DOCKERFILE="Dockerfile"
NO_CACHE=""
PUSH=false

# Servisler
declare -A SERVICES=(
    ["authentication-service"]="8080:Go"
    ["waste-service"]="8081:Go"
    ["ai_service"]="3000:Node.js"
    ["frontend"]="5174:React"
    ["admin"]="5173:React"
)

# Fonksiyonlar
print_info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_usage() {
    cat << EOF
AdvancedKTU Docker Build Script

KULLANIM:
    ./build-docker.sh [OPTIONS]

OPTIONS:
    -a, --all               Tüm servisleri build et
    -s, --service NAME      Belirli bir servis build et
    -r, --registry REGISTRY Docker registry (default: advancedktu)
    -v, --version VERSION   Image version (default: latest)
    -p, --push              Build sonrası push et
    --no-cache              Cache kullanmadan build et
    -h, --help              Bu yardım mesajını göster

ÖRNEKLER:
    # Tüm servisleri build et
    ./build-docker.sh -a

    # Belirli bir servis build et
    ./build-docker.sh -s authentication-service

    # Registry ile build et
    ./build-docker.sh -a -r docker.io/username -v 1.0.0

    # Build ve push et
    ./build-docker.sh -a -p

SERVİSLER:
EOF
    for service in "${!SERVICES[@]}"; do
        IFS=':' read -r port lang <<< "${SERVICES[$service]}"
        echo "    - $service (Port: $port, Language: $lang)"
    done
}

build_service() {
    local service=$1
    local image_name="${REGISTRY,,}-$service"
    local image_tag="$image_name:$VERSION"

    print_info "Building: $service"
    print_info "Image: $image_tag"

    # Build command
    local cmd="docker build $NO_CACHE -f \"$DOCKERFILE\" --target $service -t $image_tag ."

    print_info "Running: $cmd"
    if eval "$cmd"; then
        print_success "$service build başarılı"

        # Latest tag'ini ekle
        if [[ "$VERSION" != "latest" ]]; then
            docker tag "$image_tag" "$image_name:latest"
        fi

        return 0
    else
        print_error "$service build başarısız (Exit Code: $?)"
        return 1
    fi
}

push_service() {
    local service=$1
    local image_name="${REGISTRY,,}-$service"
    local image_tag="$image_name:$VERSION"

    print_info "Pushing: $image_tag"
    if docker push "$image_tag"; then
        print_success "$service push başarılı"
        return 0
    else
        print_error "$service push başarısız"
        return 1
    fi
}

# Argümanları parse et
BUILD_ALL=false
BUILD_SERVICE=""

while [[ $# -gt 0 ]]; do
    case $1 in
        -a|--all)
            BUILD_ALL=true
            shift
            ;;
        -s|--service)
            BUILD_SERVICE="$2"
            shift 2
            ;;
        -r|--registry)
            REGISTRY="$2"
            shift 2
            ;;
        -v|--version)
            VERSION="$2"
            shift 2
            ;;
        -p|--push)
            PUSH=true
            shift
            ;;
        --no-cache)
            NO_CACHE="--no-cache "
            shift
            ;;
        -h|--help)
            print_usage
            exit 0
            ;;
        *)
            print_error "Bilinmeyen option: $1"
            print_usage
            exit 1
            ;;
    esac
done

# Ana işlem
print_info "AdvancedKTU Docker Build Script Başlatılıyor"
print_info "Registry: $REGISTRY"
print_info "Version: $VERSION"

if [[ "$BUILD_ALL" == true ]]; then
    print_info "Mod: TÜM SERVİSLER"
    SERVICES_TO_BUILD=("${!SERVICES[@]}")
elif [[ -n "$BUILD_SERVICE" ]]; then
    if [[ -n "${SERVICES[$BUILD_SERVICE]}" ]]; then
        print_info "Mod: TEKIL SERVİS ($BUILD_SERVICE)"
        SERVICES_TO_BUILD=("$BUILD_SERVICE")
    else
        print_error "Bilinmeyen servis: $BUILD_SERVICE"
        print_info "Mevcut servisler: $(echo "${!SERVICES[@]}" | tr ' ' ',')"
        exit 1
    fi
else
    print_warning "Ne -a ne de -s parametresi sağlanmadı"
    print_info "Mevcut servisler:"
    for service in "${!SERVICES[@]}"; do
        IFS=':' read -r port lang <<< "${SERVICES[$service]}"
        print_info "  - $service ($lang, Port: $port)"
    done
    print_info "Kullanım: ./build-docker.sh -a"
    exit 0
fi

# Build işlemleri
declare -A results
start_time=$(date +%s)

for service in "${SERVICES_TO_BUILD[@]}"; do
    if build_service "$service"; then
        results["$service"]=1
    else
        results["$service"]=0
    fi
    echo ""
done

# Özet
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
print_info "BUILD ÖZETİ"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

success_count=0
total_count=${#results[@]}

for result in "${results[@]}"; do
    if [[ "$result" == 1 ]]; then
        ((success_count++))
    fi
done

end_time=$(date +%s)
duration=$((end_time - start_time))

if [[ $success_count -eq $total_count ]]; then
    echo -e "${GREEN}Başarılı: $success_count / $total_count${NC}"
else
    echo -e "${YELLOW}Başarılı: $success_count / $total_count${NC}"
fi
echo "Süre: ${duration} saniye"
echo ""

for service in "${SERVICES_TO_BUILD[@]}"; do
    if [[ "${results[$service]}" == 1 ]]; then
        echo -e "${GREEN}✅ $service${NC}"
    else
        echo -e "${RED}❌ $service${NC}"
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Push işlemi (eğer istenirse)
if [[ "$PUSH" == true ]] && [[ $success_count -eq $total_count ]]; then
    echo ""
    print_info "Docker Push işlemi başlatılıyor..."

    for service in "${SERVICES_TO_BUILD[@]}"; do
        push_service "$service"
    done
fi

# Sonlandır
if [[ $success_count -eq $total_count ]]; then
    print_success "Tüm build'ler başarılı!"

    # Sonraki adımları göster
    echo ""
    echo -e "${GREEN}Sonraki Adımlar:${NC}"
    echo "1. Network oluştur:"
    echo "   docker network create advancedktu-network"
    echo ""
    echo "2. Containerları çalıştır:"
    for service in "${SERVICES_TO_BUILD[@]}"; do
        IFS=':' read -r port lang <<< "${SERVICES[$service]}"
        port="${port%:*}"
        image_name="${REGISTRY,,}-${service}:${VERSION}"
        echo "   docker run -d -p $port:$port --network advancedktu-network --name $service $image_name"
    done
    echo ""
    echo "veya docker-compose kullan:"
    echo "   docker-compose up -d"

    exit 0
else
    print_error "Bazı build'ler başarısız oldu"
    exit 1
fi
