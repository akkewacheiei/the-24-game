import User from "./user";
import History from "./history";

// ตั้งค่าความสัมพันธ์
User.hasMany(History, { onDelete: "CASCADE", foreignKey: "userId" });
History.belongsTo(User, { foreignKey: "userId" });

export { User, History };
