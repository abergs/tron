using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using System.Collections.Concurrent;
using System.Threading.Tasks;
using System.Diagnostics;

namespace WebApplication2
{
    public class GameHub : Hub
    {

        private static readonly ConcurrentDictionary<string, Player> AvailablePlayers
        = new ConcurrentDictionary<string, Player>();
        private static readonly ConcurrentDictionary<string, Player> Players
        = new ConcurrentDictionary<string, Player>();

        public override Task OnConnected()
        {
            Trace.WriteLine("Connect: ");
            AddAvailablePlayer();

            TryStartGame();

            return base.OnConnected();
        }

        public override Task OnDisconnected()
        {
            Trace.WriteLine("Disconnect: ");
            RemoveAvailablePlayer();
            return base.OnDisconnected();
        }

        public override Task OnReconnected()
        {
            Trace.WriteLine("Reconnect: ");
            AddAvailablePlayer();

            TryStartGame();
            return base.OnReconnected();
        }

        private Player RemoveAvailablePlayer(string playerID = null)
        {
            playerID = playerID ?? Context.ConnectionId;

            Trace.WriteLine("Removed player" + playerID, "playerConnection");

            Player p1 = null;
            AvailablePlayers.TryRemove(playerID, out p1);
            return p1;
        }

        private void AddAvailablePlayer()
        {
            var connectionId = Context.ConnectionId;
            Trace.WriteLine("Add player" + connectionId, "playerConnection");
            var user = AvailablePlayers.GetOrAdd(connectionId, _ => new Player
            {
                Id = connectionId
            });
        }

        private void TryStartGame()
        {
            if (AvailablePlayers.Count > 1)
            {
                Player p1 = RemoveAvailablePlayer();
                Player p2 = AvailablePlayers.Values.FirstOrDefault();
                p2 = RemoveAvailablePlayer(p2.Id);

                var groupname = p1.Id + p2.Id;

                Groups.Add(p1.Id, groupname);
                Groups.Add(p2.Id, groupname);

                p1 = Players.GetOrAdd(p1.Id, p1);
                p2 = Players.GetOrAdd(p2.Id, p2);

                p1.StartDirection = "left";
                p1.StartPosition = "right";
                p2.StartDirection = "right";
                p2.StartPosition = "left";

                var gameData = new GameData();
                gameData.GroupName = groupname;
                gameData.Players.Add(p1);
                gameData.Players.Add(p2);

                Clients.Group(groupname).Start(gameData);
            }
        }

        public class GameData
        {
            public GameData()
            {
                Players = new List<Player>();
            }

            public string GroupName { get; set; }
            public List<Player> Players { get; set; }
        }

        public void SetProfile(string name, string color)
        {
            Player p1 = new Player();
            p1.Id = Context.ConnectionId;
 
            p1 = Players.GetOrAdd(Context.ConnectionId, p1);
            if (p1 != null)
            {
                p1.Color = color;
                p1.Name = name;
            }
        }

        public void Available()
        {
            this.AddAvailablePlayer();
            TryStartGame();
        }

        public void Send(string group, string direction)
        {
            // Call the broadcastMessage method to update clients.

            Clients.OthersInGroup(group).receive(Context.ConnectionId, direction);
        }
    }
}