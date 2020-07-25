cd backend
npm i
npm run build
cd ..
docker-compose -f docker-compose-prod.yml down
docker-compose -f docker-compose-prod.yml up --build -d