// server/wsclient/router.go
package wsclient

import (
	"log"
	"net/http"
	"server/models"
	"strconv"

	"github.com/gorilla/websocket"
)

// Handler is a type representing functions which resolve requests.
type Handler func(*Client, interface{})

// Event is a type representing request names.

// Router is a message routing object mapping events to function handlers.
type Router struct {
	rules map[models.Event]Handler // rules maps events to functions.
}

// NewRouter returns an initialized Router.
func NewRouter() *Router {
	return &Router{
		rules: make(map[models.Event]Handler),
	}
}

// ServeHTTP creates the socket connection and begins the read routine.
func (rt *Router) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// configure upgrader
	upgrader := websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		// accept all?
		CheckOrigin: func(r *http.Request) bool { return true },
	}

	// upgrade connection to socket
	socket, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("socket server configuration error: %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	channelIDStr := r.URL.Query().Get("channel_id")
	if channelIDStr == "" {
		log.Println("No channel ID provided")
		return
	}

	channelID, err := strconv.ParseUint(channelIDStr, 10, 64)
	if err != nil {
		log.Printf("Invalid channel ID: %v\n", err)
		return
	}

	client := NewClient(socket, uint(channelID), rt.FindHandler)

	// running method for reading from sockets, in main routine
	client.Read()
}

// FindHandler implements a handler finding function for router.
func (rt *Router) FindHandler(event models.Event) (Handler, bool) {
	handler, found := rt.rules[event]
	return handler, found
}

// Handle is a function to add handlers to the router.
func (rt *Router) Handle(event models.Event, handler Handler) {
	// store in to router rules
	rt.rules[event] = handler

}
