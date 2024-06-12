import User from './user';
import History from './history';

// ตั้งค่าความสัมพันธ์
User.hasMany(History, { onDelete: 'CASCADE' });
History.belongsTo(User);

export { User, History };
