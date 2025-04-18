module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn("orders", "quantity", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("orders", "quantity");
  }
};
