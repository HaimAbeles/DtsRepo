using DtsProjectDec;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;


namespace DtsProjectDL.RepositoryMongoDB
{
    public class RepositoryMongoDB : IRepositoryMongoDB
    {
        public IMongoCollection<UserLogin> ConnectionMongoDBUserLogin;

        public RepositoryMongoDB()
        {

        }

        public IMongoCollection<UserLogin> ConnectToMongoDBUserLogin(IConfiguration _configuration)
        {
            string mongoUrl = _configuration["MongoDB"];
            MongoClient cluster = new MongoClient(mongoUrl);
            IMongoDatabase db = cluster.GetDatabase("Login");
            ConnectionMongoDBUserLogin = db.GetCollection<UserLogin>("UsersData");
            return ConnectionMongoDBUserLogin;
        }
    }
}
