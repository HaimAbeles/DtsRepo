using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;


namespace DtsProjectDec
{
    public class CustomerQueue
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        [BsonIgnoreIfDefault]
        public ObjectId? Id { get; set; }
        public string uniqueId { get; set; }
        public string name { get; set; }
        public string email { get; set; }
        public DateTime dateTimeQueue { get; set; }
        public DateTime timeCreated { get; set; }
    }
}
