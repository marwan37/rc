package models

type Event string

const (
	EventNewMessage = "newMessage"
)

func DetermineEvent(msg WebSocketMessage) Event {
	// Example: Use ChannelID as the event
	return EventNewMessage
}
