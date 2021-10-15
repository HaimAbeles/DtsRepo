using DtsProjectDec;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;


namespace DtsProjectDL.RepositoryMongoDB
{
    public class RepositoryMongoDB : IRepositoryMongoDB
    {
        public IMongoCollection<UserLogin> ConnectionMongoDBUserLogin;
        public IMongoCollection<CustomerQueue> ConnectionMongoDBCustomerQueue;

        public RepositoryMongoDB()
        {

        }

        public IMongoCollection<UserLogin> ConnectToMongoDBUserLogin(IConfiguration _configuration)
        {
            string mongoUrl = _configuration["MongoDB"];
            MongoClient cluster = new MongoClient(mongoUrl);
            IMongoDatabase db = cluster.GetDatabase("DtsProject");
            ConnectionMongoDBUserLogin = db.GetCollection<UserLogin>("UsersLogin");
            return ConnectionMongoDBUserLogin;
        }

        public IMongoCollection<CustomerQueue> ConnectToMongoDBCustomerQueue(IConfiguration _configuration)
        {
            string mongoUrl = _configuration["MongoDB"];
            MongoClient cluster = new MongoClient(mongoUrl);
            IMongoDatabase db = cluster.GetDatabase("DtsProject");
            ConnectionMongoDBCustomerQueue = db.GetCollection<CustomerQueue>("BarbershopCustomers");
            return ConnectionMongoDBCustomerQueue;
        }
    }
}
