# 🎯 Makefile for Mindustry Schematics SvelteKit Docker Application
# ================================================================

# 🎨 Colors for beautiful output
RED := $(shell printf "\033[31m")
GREEN := $(shell printf "\033[32m")
YELLOW := $(shell printf "\033[33m")
BLUE := $(shell printf "\033[34m")
PURPLE := $(shell printf "\033[35m")
CYAN := $(shell printf "\033[36m")
WHITE := $(shell printf "\033[37m")
BOLD := $(shell printf "\033[1m")
NC := $(shell printf "\033[0m") # No Color

# 📋 Configuration Variables
IMAGE_NAME := mindustry-schematics
CONTAINER_NAME := mindustry-schematics-test
PORT := 3000
HOST_PORT := 3000
DOCKERFILE := Dockerfile
BUILD_CONTEXT := .
HEALTH_ENDPOINT := /

# � ECR Configuration
ECR_REGISTRY := public.ecr.aws/w7e9w7k3
ECR_REPOSITORY := mindustry-schematics
ECR_IMAGE := $(ECR_REGISTRY)/$(ECR_REPOSITORY)
VERSION_TAG := $(shell date +v%Y%m%d.%H%M%S)

# �🔧 Build Arguments
BUILD_ARGS := --build-arg NODE_ENV=production

# 🎯 Default target with beautiful help
.PHONY: help
help:
	@echo ""
	@echo "$(BOLD)$(CYAN)🎯 Mindustry Schematics Docker Manager$(NC)"
	@echo "$(CYAN)==========================================$(NC)"
	@echo ""
	@echo "$(BOLD)$(GREEN)🚀 Quick Commands:$(NC)"
	@echo "  $(YELLOW)make test$(NC)     - 🧪 Full test cycle (build + run + health check)"
	@echo "  $(YELLOW)make dev$(NC)      - 🔄 Development mode with auto-rebuild"
	@echo "  $(YELLOW)make clean$(NC)    - 🧹 Clean up everything"
	@echo ""
	@echo "$(BOLD)$(BLUE)🔨 Build & Run:$(NC)"
	@echo "  $(YELLOW)build$(NC)         - 🏗️  Build the Docker image"
	@echo "  $(YELLOW)run$(NC)           - 🏃 Run the container"
	@echo "  $(YELLOW)restart$(NC)       - 🔄 Full restart cycle"
	@echo ""
	@echo "$(BOLD)$(CYAN)🐳 ECR Registry:$(NC)"
	@echo "  $(YELLOW)build-ecr$(NC)     - 🏗️  Build and tag for ECR"
	@echo "  $(YELLOW)push$(NC)          - 🚀 Push to ECR registry"
	@echo "  $(YELLOW)deploy$(NC)        - 🚢 Build and push to ECR"
	@echo ""
	@echo "$(BOLD)$(PURPLE)🔍 Monitoring & Debug:$(NC)"
	@echo "  $(YELLOW)logs$(NC)          - 📋 Show container logs"
	@echo "  $(YELLOW)logs-follow$(NC)   - 📋 Follow container logs in real-time"
	@echo "  $(YELLOW)shell$(NC)         - 🐚 Open interactive shell in container"
	@echo "  $(YELLOW)health$(NC)        - 💚 Check container health"
	@echo "  $(YELLOW)stats$(NC)         - 📊 Show container resource usage"
	@echo ""
	@echo "$(BOLD)$(RED)🛑 Control:$(NC)"
	@echo "  $(YELLOW)stop$(NC)          - ⏹️  Stop the container"
	@echo "  $(YELLOW)clean$(NC)         - 🧹 Remove container and image"
	@echo "  $(YELLOW)prune$(NC)         - 🗑️  Clean up Docker system"
	@echo ""
	@echo "$(BOLD)$(WHITE)📊 Info:$(NC)"
	@echo "  $(YELLOW)info$(NC)          - ℹ️  Show configuration info"
	@echo "  $(YELLOW)size$(NC)          - 📏 Show image size"
	@echo ""

# 🏗️ Build the Docker image with progress and error handling
.PHONY: build
build:
	@echo "$(BOLD)$(BLUE)🏗️  Building Docker image...$(NC)"
	@echo "$(CYAN)Image: $(YELLOW)$(IMAGE_NAME)$(NC)"
	@echo "$(CYAN)Context: $(YELLOW)$(BUILD_CONTEXT)$(NC)"
	@echo ""
	@if docker build $(BUILD_ARGS) -t $(IMAGE_NAME) $(BUILD_CONTEXT); then \
		echo "$(BOLD)$(GREEN)✅ Build successful!$(NC)"; \
		docker images $(IMAGE_NAME) --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedSince}}"; \
	else \
		echo "$(BOLD)$(RED)❌ Build failed!$(NC)"; \
		exit 1; \
	fi

# 🐳 Build and tag for ECR
.PHONY: build-ecr
build-ecr:
	@echo "$(BOLD)$(CYAN)🐳 Building for ECR Registry...$(NC)"
	@echo "$(CYAN)Registry: $(YELLOW)$(ECR_REGISTRY)$(NC)"
	@echo "$(CYAN)Repository: $(YELLOW)$(ECR_REPOSITORY)$(NC)"
	@echo "$(CYAN)Version Tag: $(YELLOW)$(VERSION_TAG)$(NC)"
	@echo ""
	@if docker build $(BUILD_ARGS) -t $(ECR_IMAGE):$(VERSION_TAG) -t $(ECR_IMAGE):latest $(BUILD_CONTEXT); then \
		echo "$(BOLD)$(GREEN)✅ ECR build successful!$(NC)"; \
		echo "$(CYAN)Tagged as:$(NC)"; \
		echo "  $(YELLOW)$(ECR_IMAGE):$(VERSION_TAG)$(NC)"; \
		echo "  $(YELLOW)$(ECR_IMAGE):latest$(NC)"; \
		docker images $(ECR_IMAGE) --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedSince}}"; \
	else \
		echo "$(BOLD)$(RED)❌ ECR build failed!$(NC)"; \
		exit 1; \
	fi

# 🚀 Push to ECR registry
.PHONY: push
push: build-ecr
	@echo "$(BOLD)$(BLUE)🚀 Pushing to ECR Registry...$(NC)"
	@echo "$(CYAN)Authenticating with ECR...$(NC)"
	@if aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin $(ECR_REGISTRY); then \
		echo "$(GREEN)✅ ECR authentication successful$(NC)"; \
	else \
		echo "$(RED)❌ ECR authentication failed!$(NC)"; \
		echo "$(YELLOW)💡 Make sure AWS CLI is configured and you have ECR permissions$(NC)"; \
		exit 1; \
	fi
	@echo ""
	@echo "$(CYAN)Pushing images...$(NC)"
	@if docker push $(ECR_IMAGE):$(VERSION_TAG) && docker push $(ECR_IMAGE):latest; then \
		echo "$(BOLD)$(GREEN)✅ Push successful!$(NC)"; \
		echo "$(CYAN)Images pushed:$(NC)"; \
		echo "  $(YELLOW)$(ECR_IMAGE):$(VERSION_TAG)$(NC)"; \
		echo "  $(YELLOW)$(ECR_IMAGE):latest$(NC)"; \
	else \
		echo "$(BOLD)$(RED)❌ Push failed!$(NC)"; \
		exit 1; \
	fi

# 🚢 Build and deploy to ECR
.PHONY: deploy
deploy: 
	@echo "$(BOLD)$(PURPLE)🚢 Deploying to ECR...$(NC)"
	@echo "$(PURPLE)=====================$(NC)"
	@$(MAKE) clean
	@echo ""
	@$(MAKE) push
	@echo ""
	@echo "$(BOLD)$(GREEN)🎉 Deployment complete!$(NC)"
	@echo "$(CYAN)Your image is now available at:$(NC)"
	@echo "  $(YELLOW)$(ECR_IMAGE):$(VERSION_TAG)$(NC)"
	@echo "  $(YELLOW)$(ECR_IMAGE):latest$(NC)"

# 🏃 Run the container with enhanced output
.PHONY: run
run: stop
	@echo "$(BOLD)$(GREEN)🏃 Starting container...$(NC)"
	@if docker run -d \
		--name $(CONTAINER_NAME) \
		-p $(HOST_PORT):$(PORT) \
		--env-file .env \
		--restart unless-stopped \
		$(IMAGE_NAME); then \
		echo "$(BOLD)$(GREEN)✅ Container started successfully!$(NC)"; \
		echo "$(CYAN)🌐 Application URL: $(YELLOW)http://localhost:$(HOST_PORT)$(NC)"; \
		echo "$(CYAN)📦 Container Name: $(YELLOW)$(CONTAINER_NAME)$(NC)"; \
		echo "$(CYAN)📄 Environment: $(YELLOW)Loaded from .env file$(NC)"; \
		sleep 2; \
		$(MAKE) health; \
	else \
		echo "$(BOLD)$(RED)❌ Failed to start container!$(NC)"; \
		exit 1; \
	fi

# 🧪 Complete test cycle with beautiful progress indicators
.PHONY: test
test: 
	@echo "$(BOLD)$(CYAN)🧪 Starting full test cycle...$(NC)"
	@echo ""
	@$(MAKE) build
	@echo ""
	@$(MAKE) run
	@echo ""
	@echo "$(BOLD)$(YELLOW)⏳ Waiting for application to start...$(NC)"
	@for i in $$(seq 1 10); do \
		printf "$(CYAN).$(NC)"; \
		sleep 1; \
	done
	@echo ""
	@echo ""
	@$(MAKE) health
	@echo ""
	@echo "$(BOLD)$(GREEN)🎉 Test cycle completed successfully!$(NC)"

# ⏹️ Stop the container gracefully
.PHONY: stop
stop:
	@if docker ps -q --filter "name=$(CONTAINER_NAME)" | grep -q .; then \
		echo "$(BOLD)$(YELLOW)⏹️  Stopping container...$(NC)"; \
		docker stop $(CONTAINER_NAME) >/dev/null 2>&1 && \
		echo "$(GREEN)✅ Container stopped$(NC)" || \
		echo "$(RED)❌ Failed to stop container$(NC)"; \
	else \
		echo "$(CYAN)ℹ️  Container $(YELLOW)$(CONTAINER_NAME)$(CYAN) is not running$(NC)"; \
	fi

# 🧹 Clean up with confirmation
.PHONY: clean
clean: stop
	@echo "$(BOLD)$(RED)🧹 Cleaning up...$(NC)"
	@if docker ps -aq --filter "name=$(CONTAINER_NAME)" | grep -q .; then \
		echo "$(YELLOW)🗑️  Removing container...$(NC)"; \
		docker rm $(CONTAINER_NAME) >/dev/null 2>&1; \
	fi
	@if docker images -q $(IMAGE_NAME) | grep -q .; then \
		echo "$(YELLOW)🗑️  Removing image...$(NC)"; \
		docker rmi $(IMAGE_NAME) >/dev/null 2>&1; \
	fi
	@echo "$(BOLD)$(GREEN)✅ Cleanup complete$(NC)"

# 📋 Show container logs with formatting
.PHONY: logs
logs:
	@if docker ps -q --filter "name=$(CONTAINER_NAME)" | grep -q .; then \
		echo "$(BOLD)$(BLUE)📋 Container logs:$(NC)"; \
		echo "$(CYAN)==================$(NC)"; \
		docker logs --tail 50 $(CONTAINER_NAME); \
	else \
		echo "$(RED)❌ Container $(YELLOW)$(CONTAINER_NAME)$(RED) is not running$(NC)"; \
	fi

# 📋 Follow logs in real-time
.PHONY: logs-follow
logs-follow:
	@if docker ps -q --filter "name=$(CONTAINER_NAME)" | grep -q .; then \
		echo "$(BOLD)$(BLUE)📋 Following logs (Press Ctrl+C to stop):$(NC)"; \
		echo "$(CYAN)=======================================$(NC)"; \
		docker logs -f $(CONTAINER_NAME); \
	else \
		echo "$(RED)❌ Container $(YELLOW)$(CONTAINER_NAME)$(RED) is not running$(NC)"; \
	fi

# 🐚 Interactive shell access
.PHONY: shell
shell:
	@if docker ps -q --filter "name=$(CONTAINER_NAME)" | grep -q .; then \
		echo "$(BOLD)$(GREEN)🐚 Opening shell in container...$(NC)"; \
		docker exec -it $(CONTAINER_NAME) /bin/sh; \
	else \
		echo "$(RED)❌ Container $(YELLOW)$(CONTAINER_NAME)$(RED) is not running$(NC)"; \
	fi

# 💚 Comprehensive health check
.PHONY: health
health:
	@echo "$(BOLD)$(CYAN)💚 Health Check$(NC)"
	@echo "$(CYAN)===============$(NC)"
	@if docker ps -q --filter "name=$(CONTAINER_NAME)" | grep -q .; then \
		echo "$(GREEN)✅ Container Status:$(NC)"; \
		docker ps --filter "name=$(CONTAINER_NAME)" --format "  📦 {{.Names}} - {{.Status}} - {{.Ports}}"; \
		echo ""; \
		echo "$(BLUE)🔍 Docker Health Status:$(NC)"; \
		HEALTH_STATUS=$$(docker inspect --format='{{.State.Health.Status}}' $(CONTAINER_NAME) 2>/dev/null || echo "no-healthcheck"); \
		if [ "$$HEALTH_STATUS" = "healthy" ]; then \
			echo "$(GREEN)  ✅ Docker Health: healthy$(NC)"; \
		elif [ "$$HEALTH_STATUS" = "unhealthy" ]; then \
			echo "$(RED)  ❌ Docker Health: unhealthy$(NC)"; \
		elif [ "$$HEALTH_STATUS" = "starting" ]; then \
			echo "$(YELLOW)  🔄 Docker Health: starting$(NC)"; \
		else \
			echo "$(YELLOW)  ⚠️  No Docker health check configured$(NC)"; \
		fi; \
		echo ""; \
		echo "$(BLUE)🌐 HTTP Health Check:$(NC)"; \
		if timeout 10 curl -sf http://localhost:$(HOST_PORT)$(HEALTH_ENDPOINT) >/dev/null 2>&1; then \
			echo "$(GREEN)  ✅ HTTP OK - Application responding$(NC)"; \
			echo "$(CYAN)  🌐 URL: $(YELLOW)http://localhost:$(HOST_PORT)$(NC)"; \
		else \
			echo "$(RED)  ❌ HTTP Failed - Application not responding$(NC)"; \
			echo "$(YELLOW)  🔍 Checking logs for errors...$(NC)"; \
			docker logs --tail 10 $(CONTAINER_NAME) | head -5; \
		fi; \
	else \
		echo "$(RED)❌ Container $(YELLOW)$(CONTAINER_NAME)$(RED) is not running$(NC)"; \
	fi

# 📊 Container resource statistics
.PHONY: stats
stats:
	@if docker ps -q --filter "name=$(CONTAINER_NAME)" | grep -q .; then \
		echo "$(BOLD)$(PURPLE)📊 Container Resource Usage:$(NC)"; \
		echo "$(PURPLE)=============================$(NC)"; \
		docker stats $(CONTAINER_NAME) --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"; \
	else \
		echo "$(RED)❌ Container $(YELLOW)$(CONTAINER_NAME)$(RED) is not running$(NC)"; \
	fi

# 🔄 Full restart cycle
.PHONY: restart
restart: 
	@echo "$(BOLD)$(CYAN)🔄 Full restart cycle...$(NC)"
	@$(MAKE) clean
	@echo ""
	@$(MAKE) test
	@echo "$(BOLD)$(GREEN)🎉 Restart complete!$(NC)"

# 🔄 Development mode with file watching
.PHONY: dev
dev:
	@echo "$(BOLD)$(YELLOW)🔄 Development Mode$(NC)"
	@echo "$(YELLOW)==================$(NC)"
	@echo "$(CYAN)👀 Watching for file changes...$(NC)"
	@echo "$(CYAN)🔄 Will auto-rebuild on changes$(NC)"
	@echo "$(RED)⏹️  Press Ctrl+C to stop$(NC)"
	@echo ""
	@trap 'echo "\n$(YELLOW)🛑 Stopping development mode...$(NC)"; $(MAKE) clean; exit 0' INT; \
	while true; do \
		$(MAKE) test; \
		echo ""; \
		echo "$(CYAN)👀 Waiting for changes...$(NC)"; \
		if command -v inotifywait >/dev/null 2>&1; then \
			inotifywait -e modify,create,delete -r . \
				--exclude '\.(git|node_modules|\.next|build|dist)' 2>/dev/null || break; \
		else \
			echo "$(YELLOW)⚠️  inotifywait not found, sleeping for 30s...$(NC)"; \
			sleep 30; \
		fi; \
		echo "$(GREEN)🔄 Changes detected, rebuilding...$(NC)"; \
		$(MAKE) clean; \
	done

# ℹ️ Show configuration information
.PHONY: info
info:
	@echo "$(BOLD)$(BLUE)ℹ️  Configuration Information$(NC)"
	@echo "$(BLUE)==============================$(NC)"
	@echo "$(CYAN)📦 Image Name:$(NC)     $(YELLOW)$(IMAGE_NAME)$(NC)"
	@echo "$(CYAN)🏷️  Container Name:$(NC) $(YELLOW)$(CONTAINER_NAME)$(NC)"
	@echo "$(CYAN)🌐 Host Port:$(NC)      $(YELLOW)$(HOST_PORT)$(NC)"
	@echo "$(CYAN)🔌 Container Port:$(NC) $(YELLOW)$(PORT)$(NC)"
	@echo "$(CYAN)📄 Dockerfile:$(NC)     $(YELLOW)$(DOCKERFILE)$(NC)"
	@echo "$(CYAN)📁 Build Context:$(NC)  $(YELLOW)$(BUILD_CONTEXT)$(NC)"
	@echo "$(CYAN)🌐 Health Endpoint:$(NC) $(YELLOW)$(HEALTH_ENDPOINT)$(NC)"
	@echo ""
	@echo "$(BOLD)$(PURPLE)🐳 ECR Configuration:$(NC)"
	@echo "$(CYAN)🏭 Registry:$(NC)       $(YELLOW)$(ECR_REGISTRY)$(NC)"
	@echo "$(CYAN)📦 Repository:$(NC)     $(YELLOW)$(ECR_REPOSITORY)$(NC)"
	@echo "$(CYAN)🏷️  Current Tag:$(NC)    $(YELLOW)$(VERSION_TAG)$(NC)"
	@echo "$(CYAN)🌐 Full Image:$(NC)     $(YELLOW)$(ECR_IMAGE):$(VERSION_TAG)$(NC)"

# 📏 Show image size information
.PHONY: size
size:
	@echo "$(BOLD)$(PURPLE)📏 Image Size Information$(NC)"
	@echo "$(PURPLE)=========================$(NC)"
	@if docker images -q $(IMAGE_NAME) | grep -q .; then \
		docker images $(IMAGE_NAME) --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedSince}}"; \
		echo ""; \
		echo "$(CYAN)🔍 Layer breakdown:$(NC)"; \
		docker history $(IMAGE_NAME) --format "table {{.Size}}\t{{.CreatedBy}}" | head -10; \
	else \
		echo "$(RED)❌ Image $(YELLOW)$(IMAGE_NAME)$(RED) not found$(NC)"; \
		echo "$(CYAN)💡 Run $(YELLOW)make build$(CYAN) first$(NC)"; \
	fi

# 🗑️ Docker system cleanup
.PHONY: prune
prune:
	@echo "$(BOLD)$(RED)🗑️  Docker System Cleanup$(NC)"
	@echo "$(RED)========================$(NC)"
	@echo "$(YELLOW)⚠️  This will remove unused Docker objects$(NC)"
	@read -p "Continue? [y/N] " -n 1 -r; \
	echo ""; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		echo "$(CYAN)🧹 Cleaning up unused containers...$(NC)"; \
		docker container prune -f; \
		echo "$(CYAN)🧹 Cleaning up unused images...$(NC)"; \
		docker image prune -f; \
		echo "$(CYAN)🧹 Cleaning up unused networks...$(NC)"; \
		docker network prune -f; \
		echo "$(CYAN)🧹 Cleaning up unused volumes...$(NC)"; \
		docker volume prune -f; \
		echo "$(BOLD)$(GREEN)✅ Docker system cleanup complete$(NC)"; \
	else \
		echo "$(YELLOW)Cleanup cancelled$(NC)"; \
	fi

# 🎯 Aliases for convenience
.PHONY: up down ps
up: run
down: stop
ps: health
