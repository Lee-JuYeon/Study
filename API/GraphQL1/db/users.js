const users = [
    {
      token: "a1b2c3",
      email: "user@email.com",
      username: "user",
      password: "123",
      roles: ["user"]
    },
    {
      token: "e4f5g6",
      email: "admin@email.com",
      username: "admin",
      password: "456",
      roles: ["user", "admin"]
    }
  ];

module.exports = {
    users: users
}