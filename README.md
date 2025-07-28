# App start

```bash
docker-compose up -d
```

Application is running on: http://localhost:3000

Swagger documentation: http://localhost:3000/api

Test user
```
Email: demo@example.com
Password: password123
```

# Endpoints:

## Auth
```
POST /auth/register - Registration
POST /auth/login - Login
```
## Notes
```
GET /notes - notes list
POST /notes - create note
GET /notes/:id - get note
PUT /notes/:id - update note
DELETE /notes/:id - delete note
```
## Share Links
```
POST /notes/:id/share - create share link
GET /notes/:id/share - list of share links
DELETE /notes/:id/share/:tokenId - revocation of share link
GET /public/notes/:token - open note by link
```
# Testing
```bash
npm run test
```