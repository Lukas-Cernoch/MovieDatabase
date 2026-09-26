export interface Director {
  id: string; // V C# je to Guid, do JSONu se serializuje jako string
  name: string;
  dateOfBirth: string; // DateOnly přichází jako ISO 8601 string
  nationality: string;
}