.PHONY: clean
clean:
	rm -rf node_modules

.PHONY: install
install:
	pnpm i

.PHONY: reinstall
reinstall: clean install

.PHONY: doc
doc: reinstall
	pnpm run docs:generate && \
	cd docs && \
	rm -rf node_modules && \
	rm -rf .vitepress/cache && \
	pnpm i && \
	pnpm dev

.PHONY: doc-build
doc-build: reinstall
	pnpm run docs:generate && \
	cd docs && \
	rm -rf node_modules && \
	rm -rf .vitepress/cache && \
	pnpm i && \
	pnpm build

.PHONY: build
build: reinstall
	pnpm build

.PHONY: check
check: reinstall
	pnpm check