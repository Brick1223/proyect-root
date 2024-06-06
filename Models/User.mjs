import { DataTypes } from 'sequelize';
import sequelize from '../Config/db.mjs';

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

try {
  await sequelize.sync();
  console.log('Users table has been synced');
} catch (error) {
  console.log('Error: ' + error);
}

export default User;

