# MongoDB document structure for users
# Collection: users
# {
#   "_id": ObjectId,
#   "name": str,
#   "mobile_number": str (unique),
#   "last_verification_token": str,
#   "auth_provider": str,
#   "created_at": datetime,
#   "updated_at": datetime
# }