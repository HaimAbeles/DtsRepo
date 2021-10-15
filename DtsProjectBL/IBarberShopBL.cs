using DtsProjectDec;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DtsProjectBL
{
    public interface IBarberShopBL
    {
        List<CustomerQueue> GetQueueList();
        bool InsertQueue(CustomerQueue queue);
        bool DeleteQueue(string id);
    }
}
