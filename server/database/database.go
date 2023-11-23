// database/database.go
package database

import (
	"strconv"

	"gorm.io/gorm"
)

func SaveMessage(db *gorm.DB, message *Message) error {
	return db.Create(message).Error
}

func (wsm *WebSocketMessage) ToMessage() (*Message, error) {
	// Convert string IDs to uint
	userId, err := strconv.ParseUint(wsm.UserID, 10, 32)
	if err != nil {
		return nil, err
	}

	channelId, err := strconv.ParseUint(wsm.ChannelID, 10, 32)
	if err != nil {
		return nil, err
	}

	return &Message{
		Content:   wsm.Content,
		UserID:    uint(userId),
		ChannelID: uint(channelId),
	}, nil
}
