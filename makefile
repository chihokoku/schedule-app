build:
	docker compose build

up:
	docker compose up -d

build-up:
	@make build
	@make up

init:
	docker compose exec app composer install
	docker compose exec app php artisan migrate:fresh
	@make node-install

node-install:
	docker compose exec app sh -c "curl -fsSL https://deb.nodesource.com/setup_18.x | bash -" 
	docker compose exec app apt-get install -y nodejs

npm-install:
	docker compose exec app npm install

npm-dev:
	docker compose exec app npm run dev

app:
	docker compose exec app bash 
