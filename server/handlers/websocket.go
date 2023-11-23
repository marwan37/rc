package handlers

import (
	"encoding/json"
	"net/http"

	"server/database"

	"github.com/gorilla/websocket"
	"gorm.io/gorm"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	// CheckOrigin: Add a check here to validate the origin if needed
}

func WebSocketHandler(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			// Handle error
			return
		}
		defer conn.Close()

		for {
			_, message, err := conn.ReadMessage()
			if err != nil {
				// Handle error
				break
			}

			// Parse the message
			var wsMessage database.WebSocketMessage
			err = json.Unmarshal(message, &wsMessage)
			if err != nil {
				// Handle JSON parsing error
				continue
			}

			// Convert WebSocketMessage to Message
			dbMessage, err := wsMessage.ToMessage()
			if err != nil {
				// Handle conversion error
				continue
			}

			// Store the message in the database
			err = database.SaveMessage(db, dbMessage)
			if err != nil {
				// Handle database error
				continue
			}

			// Optionally, broadcast the message to other clients
			// ...

			// For now, let's just echo the message back
			response, _ := json.Marshal(dbMessage)
			err = conn.WriteMessage(websocket.TextMessage, response)
			if err != nil {
				// Handle error
				break
			}
		}
	}
}
