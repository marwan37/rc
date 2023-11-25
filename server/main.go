// main.go
package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/rs/cors"

	"server/handlers"
	"server/models"

	"server/wsclient"

	"github.com/gorilla/mux"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func handleWebSocketMessage(db *gorm.DB, c *wsclient.Client, data interface{}) {
	wsMsg, ok := data.(models.WebSocketMessage)
	if !ok {
		log.Println("Invalid message format")
		return
	}

	// Convert WebSocketMessage to Message
	message := wsMsg.ToMessage()

	// Save the message to the database
	err := models.SaveMessage(db, message)
	if err != nil {
		log.Printf("Error saving message: %v\n", err)
		return
	}

	log.Printf("Saved message: %v\n", message.Content)

	var user models.User
	result := db.First(&user, message.UserID)
	if result.Error != nil {
		log.Printf("Error fetching user: %v\n", result.Error)
		return
	}

	broadcastMsg := models.WebSocketMessage{
		Content:   message.Content,
		UserID:    message.UserID,
		ChannelID: message.ChannelID,
		User:      user,
	}

	wsclient.BroadcastToChannel(wsMsg.ChannelID, broadcastMsg)
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	dsn := os.Getenv("DATABASE_URL")
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	err = db.AutoMigrate(&models.User{}, &models.Channel{}, &models.Message{})
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	r := mux.NewRouter()
	wsRouter := wsclient.NewRouter()

	handleWebSocketMessageWithDb := func(c *wsclient.Client, data interface{}) {
		handleWebSocketMessage(db, c, data)
	}
	wsRouter.Handle("newMessage", handleWebSocketMessageWithDb)

	// set up routes with gorilla/mux
	r.HandleFunc("/users", handlers.UsersHandler(db)).Methods("GET", "POST")

	// this route will handle /channels, /channels/{id}, and /channels/{id}/messages
	r.HandleFunc("/channels/{id}/messages", handlers.ChannelsHandler(db)).Methods("GET", "POST")
	r.HandleFunc("/channels/{id}", handlers.ChannelsHandler(db)).Methods("GET", "POST")
	r.HandleFunc("/channels", handlers.ChannelsHandler(db)).Methods("GET", "POST")

	// messages routes
	r.HandleFunc("/messages/{userId1}/{userId2}", handlers.MessagesHandler(db)).Methods("GET")
	r.HandleFunc("/messages", handlers.MessagesHandler(db)).Methods("GET", "POST")

	// handler for websockets
	r.HandleFunc("/ws", handlers.WebSocketHandler(db, wsRouter)).Methods("GET")

	handler := cors.Default().Handler(r)

	// seed(db)

	fmt.Println("Server is running on port 3001")
	http.ListenAndServe(":3001", handler)
}
