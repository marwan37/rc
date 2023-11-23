// handlers/channels.go
package handlers

import (
	"encoding/json"
	"net/http"
	"server/models"
	"strconv"

	"github.com/gorilla/mux"

	"gorm.io/gorm"
)

func ChannelsHandler(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		channelID, channelIDErr := strconv.Atoi(vars["id"])

		switch {
		case r.Method == "GET" && channelIDErr == nil:
			// Handle GET request for /channels/{id}/messages
			handleGetChannelMessages(w, r, db, channelID)

		case r.Method == "POST" && channelIDErr == nil:
			// Handle POST request for /channels/{id}/messages
			handlePostChannelMessage(w, r, db, channelID)

		case r.Method == "GET":
			// Handle GET request for /channels and /channels?id={id}
			handleGetChannels(w, r, db)

		case r.Method == "POST":
			// Handle POST request for /channels
			handlePostChannel(w, r, db)

		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	}
}

func handleGetChannels(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	channelID, err := strconv.Atoi(r.URL.Query().Get("id"))
	if err == nil && channelID > 0 {
		// Get a specific channel
		var channel models.Channel
		if result := db.First(&channel, channelID); result.Error != nil {
			http.Error(w, result.Error.Error(), http.StatusNotFound)
			return
		}
		json.NewEncoder(w).Encode(channel)
	} else {
		// Get all channels
		var channels []models.Channel
		if result := db.Find(&channels); result.Error != nil {
			http.Error(w, result.Error.Error(), http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(channels)
	}
}

func handlePostChannel(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	var channel models.Channel
	if err := json.NewDecoder(r.Body).Decode(&channel); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	if result := db.Create(&channel); result.Error != nil {
		http.Error(w, result.Error.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(channel)
}

func handleGetChannelMessages(w http.ResponseWriter, r *http.Request, db *gorm.DB, channelID int) {
	var messages []models.Message
	if result := db.Preload("User").Where("channel_id = ?", channelID).Find(&messages); result.Error != nil {
		http.Error(w, result.Error.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(messages)
}

func handlePostChannelMessage(w http.ResponseWriter, r *http.Request, db *gorm.DB, channelID int) {
	var message models.Message
	if err := json.NewDecoder(r.Body).Decode(&message); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	message.ChannelID = uint(channelID)

	if result := db.Create(&message); result.Error != nil {
		http.Error(w, result.Error.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(message)
}
