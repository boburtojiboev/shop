// simple way
// pm2 start servers.js --name=Shop
// pm2 start "npm run dev" --name=Shop
// pm2 logs
// pm2 logs 0     //number is index
// pm2 ls
// pm2 kill   //for killing
// pm2 stop 1
// pm2 delete 1 
// pm2 restart 1

// by config.js file
// pm2 start process.config.js --env development
// pm2 start process.config.js --env production