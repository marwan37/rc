package handlers

import (
	"net/http"
	"server/wsclient"

	"github.com/gorilla/websocket"
	"gorm.io/gorm"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true // or implement a more specific check
	},
	// CheckOrigin: Add a check here to validate the origin if needed
}

func WebSocketHandler(db *gorm.DB, router *wsclient.Router) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			// Handle error
			return
		}

		// Create a new Client using the wsclient package
		client := wsclient.NewClient(conn, router.FindHandler)

		// Start the read loop in a new goroutine
		go client.Read()

	}
}
