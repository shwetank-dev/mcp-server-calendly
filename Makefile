# MCPB bundle configuration
BUNDLE_NAME = mcp-calendly
VERSION ?= 0.1.0

.PHONY: help install build format format-check lint typecheck test clean run check all bump bundle

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	npm install

build: ## Build TypeScript
	npm run build

format: ## Format code with prettier
	npm run format

format-check: ## Check code formatting
	npm run format:check

lint: ## Lint code with eslint
	npm run lint

typecheck: ## Type check with tsc
	npm run typecheck

test: ## Run tests with vitest
	npm run test

clean: ## Clean build artifacts
	rm -rf build node_modules *.mcpb

run: build ## Run the MCP server in stdio mode
	node build/index.js --stdio

check: format-check lint typecheck test ## Run all checks

all: clean install build check ## Clean, install, build, and check

bump: ## Bump version (usage: make bump VERSION=0.2.0)
ifndef VERSION
	$(error VERSION is required. Usage: make bump VERSION=0.2.0)
endif
	@echo "Bumping version to $(VERSION)..."
	@jq --arg v "$(VERSION)" '.version = $$v' manifest.json > manifest.tmp.json && mv manifest.tmp.json manifest.json
	@jq --arg v "$(VERSION)" '.version = $$v' package.json > package.tmp.json && mv package.tmp.json package.json
	@sed -i '' "s/export const VERSION = '.*'/export const VERSION = '$(VERSION)'/" src/constants.ts
	@echo "Version bumped to $(VERSION) in all files."

bundle: build ## Build MCPB bundle locally
	npm prune --omit=dev
	./scripts/build-bundle.sh
	npm install

# Shortcuts
fmt: format
t: test
l: lint
tc: typecheck
