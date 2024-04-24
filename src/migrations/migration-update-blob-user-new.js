
// Them 1 cot
// module.exports = {
//     up: (queryInterface, Sequelize) => {
//       return Promise.all([
//         queryInterface.addColumn(
//           'tableName',
//           'columnName1',
//           {
//             type: Sequelize.STRING
//           }
//         ),
//         queryInterface.addColumn(
//           'tableName',
//           'columnName2',
//           {
//             type: Sequelize.STRING
//           }
//         ),
//       ]);
//     },
  
//     down: (queryInterface, Sequelize) => {
//       return Promise.all([
//         queryInterface.removeColumn('tableName', 'columnName1'),
//         queryInterface.removeColumn('tableName', 'columnName2')
//       ]);
//     }
//   };

//sua 1 cot
module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn('Users', 'image', {
                type: Sequelize.BLOB('long'),
                allowNull: true,
            })
        ])
    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn('Users', 'image', {
                type: Sequelize.STRING,
                allowNull: true,
            })
        ])
    }
};