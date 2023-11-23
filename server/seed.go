// seed.go
package main

import (
	"log"
	"server/models"

	"gorm.io/gorm"
)

func seed(db *gorm.DB) {
	users := []models.User{
		{Name: "Alice", Email: "alice@example.com"},
		{Name: "Bob", Email: "bob@example.com"},
		{Name: "John", Email: "john@example.com"},
		{Name: "Sarah", Email: "sarah@example.com"},
		{Name: "Marwan", Email: "marwan@example.com", AvatarUrl: "https://lh3.googleusercontent.com/ogw/AKPQZvyaLhf7WPwKf8XjjG1wYRsxkZBHGqc4cKz0bW8mhA=s64-c-mo"},
	}

	for _, user := range users {
		result := db.Create(&user)
		if result.Error != nil {
			log.Fatalf("Failed to seed users: %v", result.Error)
		}
	}

	channels := []models.Channel{
		{Name: "General"},
		{Name: "Random"},
	}

	for _, channel := range channels {
		result := db.Create(&channel)
		if result.Error != nil {
			log.Fatalf("Failed to seed channels: %v", result.Error)
		}
	}

	var otherUsers []models.User
	if err := db.Not("email = ?", "marwan@example.com").Find(&otherUsers).Error; err != nil {
		log.Fatal("Failed to fetch users for DM channels:", err)
	}

	for _, user := range otherUsers {
		dmChannel := models.Channel{
			Name:        "DM with " + user.Name,
			Description: "Direct Message Channel between Marwan and " + user.Name,
		}
		if err := db.Create(&dmChannel).Error; err != nil {
			log.Printf("Failed to create DM channel for user %s: %v\n", user.Name, err)
		}
	}
}
