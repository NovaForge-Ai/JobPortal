db = db.getSiblingDB('admin');
db.auth('admin', 'password123');

db = db.getSiblingDB('job-portal');

db.createUser({
  user: 'admin',
  pwd: 'password123',
  roles: [
    { role: 'readWrite', db: 'job-portal' },
    { role: 'dbAdmin', db: 'job-portal' }
  ]
}); 