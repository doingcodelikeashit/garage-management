# API Test Examples for Parts with Tax Amount and HSN Number

## Testing Parts Storage

### 1. Create Job Card with Parts (including tax and HSN)

```bash
curl -X POST http://localhost:8000/api/jobcards/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "garageId": "507f1f77bcf86cd799439011",
    "customerNumber": "CUST001",
    "customerName": "John Doe",
    "contactNumber": "+1234567890",
    "email": "john.doe@example.com",
    "carNumber": "ABC123",
    "model": "Toyota Camry 2020",
    "kilometer": 50000,
    "fuelType": "Petrol",
    "fuelLevel": "Half",
    "jobDetails": "Regular service with parts replacement",
    "partsUsed": [
      {
        "partName": "Engine Oil",
        "quantity": 2,
        "pricePerPiece": 50,
        "totalPrice": 100,
        "taxAmount": 18,
        "hsnNumber": "2710.19.00"
      },
      {
        "partName": "Oil Filter",
        "quantity": 1,
        "pricePerPiece": 200,
        "totalPrice": 200,
        "taxAmount": 36,
        "hsnNumber": "8421.23.00"
      }
    ]
  }'
```

### 2. Update Work Progress with Parts

```bash
curl -X PUT http://localhost:8000/api/jobcards/jobcard/JOB_CARD_ID/workprogress \
  -H "Content-Type: application/json" \
  -d '{
    "partsUsed": [
      {
        "partName": "Brake Pads",
        "quantity": 1,
        "pricePerPiece": 300,
        "totalPrice": 300,
        "taxAmount": 54,
        "hsnNumber": "8708.30.00"
      },
      {
        "partName": "Air Filter",
        "quantity": 1,
        "pricePerPiece": 150,
        "totalPrice": 150,
        "taxAmount": 27,
        "hsnNumber": "8421.31.00"
      }
    ],
    "laborHours": 3,
    "engineerRemarks": "All parts replaced successfully"
  }'
```

### 3. Add Parts to Existing Job Card

```bash
curl -X PUT http://localhost:8000/api/jobcards/jobcard/JOB_CARD_ID/parts \
  -H "Content-Type: application/json" \
  -d '{
    "parts": [
      {
        "partName": "Spark Plugs",
        "quantity": 4,
        "pricePerPiece": 75,
        "totalPrice": 300,
        "taxAmount": 54,
        "hsnNumber": "8511.10.00"
      }
    ]
  }'
```

## Expected Response Structure

### Successful Parts Creation
```json
{
  "message": "Work progress updated",
  "jobCard": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "partsUsed": [
      {
        "partName": "Engine Oil",
        "quantity": 2,
        "pricePerPiece": 50,
        "totalPrice": 100,
        "taxAmount": 18,
        "hsnNumber": "2710.19.00"
      }
    ]
  }
}
```

### Successful Parts Addition
```json
{
  "message": "Parts added successfully",
  "jobCard": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "partsUsed": [
      {
        "partName": "Engine Oil",
        "quantity": 2,
        "pricePerPiece": 50,
        "totalPrice": 100,
        "taxAmount": 18,
        "hsnNumber": "2710.19.00"
      },
      {
        "partName": "Spark Plugs",
        "quantity": 4,
        "pricePerPiece": 75,
        "totalPrice": 300,
        "taxAmount": 54,
        "hsnNumber": "8511.10.00"
      }
    ]
  },
  "addedParts": [
    {
      "partName": "Spark Plugs",
      "quantity": 4,
      "pricePerPiece": 75,
      "totalPrice": 300,
      "taxAmount": 54,
      "hsnNumber": "8511.10.00"
    }
  ]
}
```

## Validation Rules

### Required Fields
- `partName` (String)
- `quantity` (Number)
- `pricePerPiece` (Number)

### Optional Fields
- `totalPrice` (Number) - Auto-calculated if not provided
- `taxAmount` (Number) - Defaults to 0 if not provided
- `hsnNumber` (String) - Defaults to empty string if not provided

### Data Types
- All numeric fields are converted to Number type
- HSN Number is converted to String type
- Part Name is kept as String

## Common HSN Codes for Auto Parts

| Part Category | HSN Code | Description |
|---------------|----------|-------------|
| Engine Oil | 2710.19.00 | Petroleum oils and oils from bituminous minerals |
| Oil Filter | 8421.23.00 | Filtering or purifying machinery |
| Air Filter | 8421.31.00 | Filtering or purifying machinery |
| Brake Pads | 8708.30.00 | Brake linings and pads |
| Spark Plugs | 8511.10.00 | Electrical ignition equipment |
| Battery | 8507.10.00 | Lead-acid accumulators |
| Tyres | 4011.10.00 | New pneumatic tyres |

## Testing with Postman

### Environment Variables
Set these in your Postman environment:
- `baseUrl`: `http://localhost:8000`
- `garageId`: Your actual garage ID
- `jobCardId`: Job card ID for testing

### Collection Variables
```json
{
  "baseUrl": "http://localhost:8000",
  "garageId": "507f1f77bcf86cd799439011",
  "jobCardId": "64f1a2b3c4d5e6f7g8h9i0j1"
}
```

### Request URLs
- Create: `{{baseUrl}}/api/jobcards/add`
- Update: `{{baseUrl}}/api/jobcards/jobcard/{{jobCardId}}/workprogress`
- Add Parts: `{{baseUrl}}/api/jobcards/jobcard/{{jobCardId}}/parts`

## Error Handling Examples

### Missing Required Fields
```json
{
  "message": "Invalid parts data",
  "error": "Part must have partName, quantity, and pricePerPiece"
}
```

### Invalid Data Types
```json
{
  "message": "Invalid parts data",
  "error": "Part must have partName, quantity, and pricePerPiece"
}
```

## Tips for Testing

1. **Start Simple**: Test with basic parts first
2. **Validate Data**: Check that all fields are stored correctly
3. **Test Edge Cases**: Try with zero quantities, negative prices, etc.
4. **Check Database**: Verify data is actually stored in MongoDB
5. **Use Real HSN Codes**: Use actual HSN codes for better testing

## Troubleshooting

### Parts Not Saving
- Check if `partsUsed` is an array
- Ensure all required fields are present
- Verify the request body structure

### Tax Amount Not Stored
- Make sure `taxAmount` is a number
- Check if the field name matches exactly
- Verify the model schema

### HSN Number Not Stored
- Ensure `hsnNumber` is a string
- Check field name spelling
- Verify the model schema
