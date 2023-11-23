// handlers/users.go
package handlers

import (
	"encoding/json"
	"net/http"
	"server/models"

	"gorm.io/gorm"
)

func UsersHandler(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case "GET":
			var users []models.User
			result := db.Find(&users)
			if result.Error != nil {
				http.Error(w, result.Error.Error(), http.StatusInternalServerError)
				return
			}
			json.NewEncoder(w).Encode(users)

		case "POST":
			var user models.User
			err := json.NewDecoder(r.Body).Decode(&user)
			if err != nil {
				http.Error(w, err.Error(), http.StatusBadRequest)
				return
			}
			result := db.Create(&user)
			if result.Error != nil {
				http.Error(w, result.Error.Error(), http.StatusInternalServerError)
				return
			}
			json.NewEncoder(w).Encode(user)

		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	}
}
