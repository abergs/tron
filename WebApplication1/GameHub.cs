using System;
using System.Web;
using Microsoft.AspNet.SignalR;

namespace WebApplication1
{
    public class GameHub : Hub
    {
        public void Hello()
        {
            Clients.All.hello();
        }

        public void Send(string direction)
        {
            // Call the broadcastMessage method to update clients.
            Clients.Others.broadcastMessage(direction);
        }
    }
}