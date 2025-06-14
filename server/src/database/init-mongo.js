db = db.getSiblingDB('admin');
db.auth('admin', 'password123');

db = db.getSiblingDB('jobportal');

db.createUser({
  user: 'admin',
  pwd: 'password123',
  roles: [
    { role: 'readWrite', db: 'jobportal' },
    { role: 'dbAdmin', db: 'jobportal' }
  ]
}); 