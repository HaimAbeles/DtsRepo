using DtsProjectDec;
using DtsProjectDL.RepositoryMongoDB;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DtsProjectDL
{
    public class BarbershopDL : IBarbershopDL
    {
        private readonly ILogger<BarbershopDL> _logger;
        private readonly IRepositorySingleTon _repositorySingleTon;

        public BarbershopDL(ILogger<BarbershopDL> logger, IRepositorySingleTon repositorySingleTon)
        {
            _logger = logger;
            _repositorySingleTon = repositorySingleTon;
        }

        public List<CustomerQueue> GetQueueList()
        {
            IMongoCollection<CustomerQueue> collection = _repositorySingleTon.GetInstance().ConnectionMongoDBCustomerQueue;
            var builder = Builders<CustomerQueue>.Filter;
            var filt = builder.Eq("name", "Haim");
            List<CustomerQueue> customersList = collection.Find(filt).ToList();
            return customersList;
        }

        public bool InsertQueue(CustomerQueue queue)
        {
            IMongoCollection<CustomerQueue> collection = _repositorySingleTon.GetInstance().ConnectionMongoDBCustomerQueue;
            collection.InsertOne(queue);
            return true;
        }

        public bool DeleteQueue(string id)
        {
            IMongoCollection<CustomerQueue> collection = _repositorySingleTon.GetInstance().ConnectionMongoDBCustomerQueue;
            var builder = Builders<CustomerQueue>.Filter;
            var filt = builder.Eq("uniqueId", id);
            collection.DeleteOne(filt);
            return true;
        }
    }
}
