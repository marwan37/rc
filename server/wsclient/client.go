// server/wsclient/client.go
package wsclient

import (
	"log"
	"server/models"

	"github.com/gorilla/websocket"
)

// Message is a object used to pass data on sockets.

// FindHandler is a type that defines handler finding functions.
type FindHandler func(models.Event) (Handler, bool)

// Client is a type that reads and writes on sockets.
type Client struct {
	Send        models.WebSocketMessage
	ChannelID   uint
	Socket      *websocket.Conn
	FindHandler FindHandler
}

var clients = make(map[*Client]bool)

// NewClient accepts a socket and returns an initialized Client.
func NewClient(socket *websocket.Conn, channelID uint, findHandler FindHandler) *Client {
	return &Client{
		Socket:      socket,
		ChannelID:   channelID,
		FindHandler: findHandler,
	}
}

// Function to add a client to the list
func RegisterClient(client *Client) {
	clients[client] = true
}

// Function to remove a client from the list
func UnregisterClient(client *Client) {
	delete(clients, client)
}

// Write receives messages from the channel and writes to the socket.
func (c *Client) Write() {
	msg := c.Send
	err := c.Socket.WriteJSON(msg)
	if err != nil {
		log.Printf("socket write error: %v\n", err)
	}
}

// Read intercepts messages on the socket and assigns them to a handler function.
func (c *Client) Read() {
	RegisterClient(c)

	var msg models.WebSocketMessage
	for {
		// read incoming message from socket
		if err := c.Socket.ReadJSON(&msg); err != nil {
			log.Printf("socket read error: %v\n", err)
			break
		}

		event := models.DetermineEvent(msg)

		// assign message to a function handler
		if handler, found := c.FindHandler(event); found {
			handler(c, msg)
		} else {
			log.Printf("No handler found for event: %v\n", event)
		}
	}
	log.Println("exiting read loop")

	// close interrupted socket connection
	c.Socket.Close()

	// Unregister client when they disconnect
	UnregisterClient(c)
}

// Broadcast message to all clients in a specific channel
func BroadcastToChannel(channelID uint, message models.WebSocketMessage) {
	for client := range clients {
		if client.ChannelID == channelID {
			err := client.Socket.WriteJSON(message)
			if err != nil {
				log.Printf("Error broadcasting to client: %v", err)
				client.Socket.Close()
				delete(clients, client)
			}
		}
	}
}
