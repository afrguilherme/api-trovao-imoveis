module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  // port: 5432, já utilizada como padrão.
  username: 'postgres',
  password: 'postgres',
  database: 'trovao-imoveis',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
}
