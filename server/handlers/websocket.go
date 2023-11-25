package handlers

import (
	"net/http"
	"server/wsclient"
	"strconv"

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
		// Extract ChannelID from request, for example, from a query parameter
		channelIDStr := r.URL.Query().Get("channel_id")
		if channelIDStr == "" {
			// Handle the error: channel ID must be provided
			return
		}

		channelID, err := strconv.ParseUint(channelIDStr, 10, 64)
		if err != nil {
			// Handle the error: invalid channel ID
			return
		}

		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			// Handle error
			return
		}

		// Create a new Client using the wsclient package with channelID
		client := wsclient.NewClient(conn, uint(channelID), router.FindHandler)

		// Start the read loop in a new goroutine
		go client.Read()
	}
}
