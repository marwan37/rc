// handlers/messages.go
package handlers

import (
	"encoding/json"
	"net/http"
	"server/database"
	"server/utils"

	"github.com/gorilla/mux"

	"gorm.io/gorm"
)

func MessagesHandler(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case "GET":
			vars := mux.Vars(r)
			userID1, userID2 := vars["userId1"], vars["userId2"]
			if userID1 != "" && userID2 != "" {
				handleGetMessagesForUniqueChannel(w, r, db)
				return
			}
			handleGetAllMessages(w, r, db)

		case "POST":
			handlePostMessage(w, r, db)

		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	}
}

func handleGetAllMessages(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	var messages []database.Message
	result := db.Preload("User").Find(&messages)
	if result.Error != nil {
		http.Error(w, result.Error.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(messages)
}

func handlePostMessage(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	var message database.Message
	if err := json.NewDecoder(r.Body).Decode(&message); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	if result := db.Create(&message); result.Error != nil {
		http.Error(w, result.Error.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(message)
}

func handleGetMessagesForUniqueChannel(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	vars := mux.Vars(r)
	userId1 := vars["userId1"]
	userId2 := vars["userId2"]

	channelID := utils.GetUniqueChannelId(userId1, userId2)
	var messages []database.Message
	if result := db.Where("channel_id = ?", channelID).Find(&messages); result.Error != nil {
		http.Error(w, result.Error.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(messages)
}
