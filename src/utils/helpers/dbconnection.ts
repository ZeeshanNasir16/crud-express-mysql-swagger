import mysql2 from 'mysql2';

const options: {
  host: string | undefined;
  user: string | undefined;
  password: string | undefined;
  database: string | undefined;
} = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.MY_SQL_DATABASE,
};

class MySqlDatabase {
  static connection = function (): mysql2.Connection {
    const dbConnect = mysql2.createConnection(options);
    dbConnect.connect((er) => {
      if (er) {
        console.log('Error in connecting to db', er);
        process.exit(1);
      }
      console.log('Connected To DB');
    });
    return dbConnect;
  };

  static executeQuery(query: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      this.connection().execute(query, params, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }
}

export default MySqlDatabase;
