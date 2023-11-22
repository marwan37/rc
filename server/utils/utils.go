// utils/utils.go
package utils

import (
	"crypto/sha256"
	"encoding/hex"
	"sort"
	"strconv"
)

func GetUniqueChannelId(userId1, userId2 string) uint {
	// Convert user IDs to integers for comparison
	id1, _ := strconv.Atoi(userId1)
	id2, _ := strconv.Atoi(userId2)

	// Sort IDs to ensure consistency (user1-user2 and user2-user1 result in the same output)
	sortedIds := []int{id1, id2}
	sort.Ints(sortedIds)

	// Concatenate the sorted IDs as a string
	concatenated := strconv.Itoa(sortedIds[0]) + "-" + strconv.Itoa(sortedIds[1])

	// Hash the concatenated string
	hash := sha256.Sum256([]byte(concatenated))

	// Convert the hash to a hexadecimal string and use a part of it as the channel ID
	hexHash := hex.EncodeToString(hash[:])

	// Use a part of the hash to keep the ID shorter. Adjust the length as needed.
	shortHash := hexHash[0:16]

	// Convert the hexadecimal string to an unsigned integer
	channelId, _ := strconv.ParseUint(shortHash, 16, 64)

	return uint(channelId)
}
