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

	"server/database"

	"github.com/gorilla/mux"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

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

	err = db.AutoMigrate(&database.User{}, &database.Channel{}, &database.Message{})
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	r := mux.NewRouter()

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
	r.HandleFunc("/ws", handlers.WebSocketHandler(db)).Methods("GET")

	handler := cors.Default().Handler(r)

	// seed(db)

	fmt.Println("Server is running on port 3001")
	http.ListenAndServe(":3001", handler)
}
