const { ApolloServer, gql, ApolloError, AuthenticationError } = require('apollo-server');

// if (!user) throw new AuthenticationError("not authenticated");
// if (!user.roles.includes("admin"))
//   throw new ForbiddenError("not authorized");
const orm = require('./../postgraphile');

const resolvers = {
    Query : {
        test: async () => {
            await orm.query('select * from ')
        },
        readJobPortfolio: async (_, { userID }, { user }) => {
            if (!user) throw new AuthenticationError("not authenticated");
            if (!user.roles.includes("admin"))
              throw new ForbiddenError("not authorized");
      
            let conn;
            try {
              conn = await pool.getConnection();
              const rows = await conn.query(
                "SELECT * FROM job_portfolios WHERE userID = ?",
                [userID]
              );
              return rows.length > 0 ? rows[0] : null;
            } catch (err) {
              throw err;
            } finally {
              if (conn) conn.end();
            }
        },
        readJobPortfolios: async (_, args, { user }) => {
            if (!user) throw new AuthenticationError("not authenticated");
            if (!user.roles.includes("admin"))
              throw new ForbiddenError("not authorized");
      
            let conn;
            try {
              conn = await pool.getConnection();
              const rows = await conn.query("SELECT * FROM job_portfolios");
              return rows;
            } catch (err) {
              throw err;
            } finally {
              if (conn) conn.end();
            }
        },
        // allUsers: () => {
        //     throw new Error("allUsers query failed");
        //   },
        // user: (_, { id }) => {
        //     if (id < 0)
        //       throw new ApolloError("id must be non-negative", "INVALID_ID", {
        //         parameter: "id"
        //       });
        //     return {
        //       id,
        //       email: `test${id}@email.com`
        //     };
        // }
        ping: () => "pong",
        authenticate: (parent, { username, password }) => {
            const found = users.find(
                user => user.username === username && user.password === password
            );
            console.log(found);
            return found && found.token;
        },
        me: (parent, args, { user }) => {
            if (!user) throw new AuthenticationError("not authenticated");
            return user;
        },
        users: (parent, args, { user }) => {
            if (!user) throw new AuthenticationError("not authenticated");
            if (!user.roles.includes("admin"))
                throw new ForbiddenError("not authorized");
            return users;
        }
    }
}


module.exports = resolvers
