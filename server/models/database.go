// models/database.go
package models

import (
	"gorm.io/gorm"
)

func SaveMessage(db *gorm.DB, message *Message) error {
	return db.Create(message).Error
}

func (wsm *WebSocketMessage) ToMessage() *Message {
	return &Message{
		Content:   wsm.Content,
		UserID:    wsm.UserID,
		ChannelID: wsm.ChannelID,
	}
}
