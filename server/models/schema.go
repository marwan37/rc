// models/schema.go
package models

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Name      string `validate:"required"`
	Email     string `gorm:"unique"`
	AvatarUrl string
	Channels  []Channel `gorm:"many2many:channel_members;"`
}

type Channel struct {
	gorm.Model
	Name        string
	Description string
	Messages    []Message `gorm:"foreignkey:ChannelID"`
	Members     []User    `gorm:"many2many:channel_members;"`
}

type Message struct {
	gorm.Model
	Content   string
	UserID    uint `gorm:"index"`
	ChannelID uint `gorm:"index"`
	Channel   *Channel
	User      *User
}

type WebSocketMessage struct {
	Content   string `json:"content"`
	UserID    uint   `json:"userId"`
	ChannelID uint   `json:"channelId"`
}
