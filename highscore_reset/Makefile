ENABLE_WASM_OPT ?= true

.PHONY: build
build:
	cargo build --target wasm32-wasi --release
ifeq ($(ENABLE_WASM_OPT),true)
	wasm-opt target/wasm32-wasi/release/highscore_reset.wasm -o ../components/highscore_reset.wasm -Os
endif

.PHONY: serve
serve: build
serve:
	spin up -f spin.toml